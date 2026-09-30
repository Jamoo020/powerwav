import "server-only";

import { randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { pool } from "@/lib/db";
import {
  getAllowedRepairStatusTransitions,
  repairStatusLabels,
  type AdminRepairTicket,
  type AdminRepairTimelineEntry,
  type CreateRepairTicketInput,
  type CreatedRepairTicket,
  type RepairStatus,
} from "./types";

const allowedInputFields = new Set([
  "full_name",
  "phone",
  "email",
  "category",
  "brand",
  "model",
  "serial_number",
  "issue_description",
  "additional_information",
  "preferred_service_option",
  "preferred_at",
]);

export class RepairInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepairInputError";
  }
}

export class RepairPersistenceError extends Error {
  constructor() {
    super("Repair request could not be saved.");
    this.name = "RepairPersistenceError";
  }
}

export class RepairStatusTransitionError extends Error {
  constructor(
    message: string,
    readonly statusCode: 404 | 409,
  ) {
    super(message);
    this.name = "RepairStatusTransitionError";
  }
}

export class RepairStatusTransitionPersistenceError extends Error {
  constructor() {
    super("Repair status could not be updated.");
    this.name = "RepairStatusTransitionPersistenceError";
  }
}

export function normalizeRepairPhone(value: unknown): string {
  if (typeof value !== "string") {
    throw new RepairInputError("phone is required.");
  }

  const phone = value.trim();
  const digits = phone.replace(/\D/g, "");
  if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
    throw new RepairInputError("phone must be a valid phone number.");
  }

  return digits;
}

function requiredText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new RepairInputError(`${field} is required.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength || trimmed.includes("\0")) {
    throw new RepairInputError(`${field} is invalid.`);
  }

  return trimmed;
}

function optionalText(value: unknown, field: string, maxLength: number): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new RepairInputError(`${field} must be text.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength || trimmed.includes("\0")) {
    throw new RepairInputError(`${field} is invalid.`);
  }

  return trimmed || null;
}

function optionalDate(value: unknown): Date | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  ) {
    throw new RepairInputError("preferred_at must be an ISO date-time with a timezone.");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new RepairInputError("preferred_at is invalid.");
  }

  return date;
}

export function validateCreateRepairTicketInput(payload: unknown): CreateRepairTicketInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new RepairInputError("Request body must be a JSON object.");
  }

  const data = payload as Record<string, unknown>;
  if (Object.keys(data).some((key) => !allowedInputFields.has(key))) {
    throw new RepairInputError("Request contains unsupported fields.");
  }

  const fullName = requiredText(data.full_name, "full_name", 150);
  const phone = requiredText(data.phone, "phone", 40);
  normalizeRepairPhone(phone);

  const email = requiredText(data.email, "email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new RepairInputError("email must be a valid email address.");
  }

  return {
    full_name: fullName,
    phone,
    email,
    category: requiredText(data.category, "category", 120),
    brand: requiredText(data.brand, "brand", 120),
    model: requiredText(data.model, "model", 160),
    serial_number: optionalText(data.serial_number, "serial_number", 160),
    issue_description: requiredText(data.issue_description, "issue_description", 5000),
    additional_information: optionalText(data.additional_information, "additional_information", 5000),
    preferred_service_option: requiredText(data.preferred_service_option, "preferred_service_option", 160),
    preferred_at: optionalDate(data.preferred_at),
  };
}

export async function createRepairTicket(payload: unknown): Promise<CreatedRepairTicket> {
  const input = validateCreateRepairTicketInput(payload);
  let client: PoolClient | undefined;
  let transactionOpen = false;

  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionOpen = true;

    const phoneDigits = input.phone.replace(/\D/g, "");
    const customerMatchKey = JSON.stringify([input.email, phoneDigits]);

    // Serialize matching contact pairs so simultaneous submissions do not create duplicate customer rows.
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
      [customerMatchKey],
    );

    const existingCustomer = await client.query<{ id: string }>(
      `SELECT id
       FROM repair_customers
       WHERE lower(email) = $1
         AND regexp_replace(phone, '[^0-9]', '', 'g') = $2
       ORDER BY created_at ASC
       LIMIT 1`,
      [input.email, phoneDigits],
    );

    let customerId = existingCustomer.rows[0]?.id;
    if (!customerId) {
      const customer = await client.query<{ id: string }>(
        `INSERT INTO repair_customers (full_name, phone, email)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [input.full_name, input.phone, input.email],
      );
      customerId = customer.rows[0].id;
    }

    const equipment = await client.query<{ id: string }>(
      `INSERT INTO repair_equipment (category, brand, model, serial_number)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [input.category, input.brand, input.model, input.serial_number],
    );

    const ticketNumberParts = await client.query<{
      ticket_year: string;
      sequence_value: string;
    }>(
      `SELECT
         to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYY') AS ticket_year,
         nextval('repair_ticket_number_seq') AS sequence_value`,
    );
    const ticketNumberPart = ticketNumberParts.rows[0];
    const ticketNumber = `PW-${ticketNumberPart.ticket_year}-${ticketNumberPart.sequence_value.padStart(4, "0")}`;
    const trackingToken = randomBytes(32).toString("base64url");

    const ticket = await client.query<{ id: string; ticket_number: string }>(
      `INSERT INTO repair_tickets (
         ticket_number,
         tracking_token,
         customer_id,
         equipment_id,
         status,
         issue_description,
         additional_information,
         preferred_service_option,
         preferred_at
       )
       VALUES ($1, $2, $3, $4, 'REQUEST_RECEIVED', $5, $6, $7, $8)
       RETURNING id, ticket_number`,
      [
        ticketNumber,
        trackingToken,
        customerId,
        equipment.rows[0].id,
        input.issue_description,
        input.additional_information,
        input.preferred_service_option,
        input.preferred_at,
      ],
    );

    await client.query(
      `INSERT INTO repair_timeline_events (
         ticket_id,
         event_type,
         from_status,
         to_status,
         customer_update,
         internal_note,
         actor_type,
         actor_admin_user_id
       )
       VALUES ($1, 'REQUEST_RECEIVED', NULL, 'REQUEST_RECEIVED', $2, NULL, 'CUSTOMER', NULL)`,
      [ticket.rows[0].id, "Repair request received. We will review the request and arrange the next step."],
    );

    await client.query("COMMIT");
    transactionOpen = false;

    return { ticketNumber: ticket.rows[0].ticket_number };
  } catch {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the safe public persistence error if rollback also fails.
      }
    }

    throw new RepairPersistenceError();
  } finally {
    client?.release();
  }
}

type AdminRepairTicketRow = {
  id: string;
  ticket_number: string;
  status: RepairStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  equipment_category: string;
  equipment_brand: string;
  equipment_model: string;
  serial_number: string | null;
  issue_description: string;
  preferred_service_option: string | null;
  preferred_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type AdminRepairTimelineRow = {
  ticket_id: string;
  from_status: RepairStatus | null;
  to_status: RepairStatus | null;
  customer_update: string;
  created_at: Date;
};

export type AdminRepairStatusCounts = Partial<Record<RepairStatus, number>>;

export async function listAdminRepairTickets(filters: {
  status?: RepairStatus;
  search?: string;
}): Promise<{ tickets: AdminRepairTicket[]; statusCounts: AdminRepairStatusCounts }> {
  const conditions: string[] = [];
  const values: string[] = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`t.status = $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    const searchParameter = `$${values.length}`;
    conditions.push(`(
      t.ticket_number ILIKE ${searchParameter}
      OR c.full_name ILIKE ${searchParameter}
      OR c.phone ILIKE ${searchParameter}
      OR e.brand ILIKE ${searchParameter}
      OR e.model ILIKE ${searchParameter}
    )`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [ticketsResult, countsResult] = await Promise.all([
    pool.query<AdminRepairTicketRow>(
      `SELECT t.id,
              t.ticket_number,
              t.status,
              c.full_name AS customer_name,
              c.phone AS customer_phone,
              c.email AS customer_email,
              e.category AS equipment_category,
              e.brand AS equipment_brand,
              e.model AS equipment_model,
              e.serial_number,
              t.issue_description,
              t.preferred_service_option,
              t.preferred_at,
              t.created_at,
              t.updated_at
       FROM repair_tickets t
       JOIN repair_customers c ON c.id = t.customer_id
       JOIN repair_equipment e ON e.id = t.equipment_id
       ${whereClause}
       ORDER BY t.updated_at DESC, t.created_at DESC`,
      values,
    ),
    pool.query<{ status: RepairStatus; count: string }>(
      `SELECT status, COUNT(*) AS count
       FROM repair_tickets
       GROUP BY status`,
    ),
  ]);

  const statusCounts: AdminRepairStatusCounts = {};
  for (const row of countsResult.rows) {
    statusCounts[row.status] = Number(row.count);
  }

  const ticketIds = ticketsResult.rows.map((row) => row.id);
  const timelineResult = ticketIds.length
    ? await pool.query<AdminRepairTimelineRow>(
        `SELECT ticket_id, from_status, to_status, customer_update, created_at
         FROM repair_timeline_events
         WHERE ticket_id = ANY($1::uuid[])
           AND customer_update IS NOT NULL
           AND btrim(customer_update) <> ''
         ORDER BY created_at ASC, id ASC`,
        [ticketIds],
      )
    : { rows: [] as AdminRepairTimelineRow[] };
  const timelines = new Map<string, AdminRepairTimelineEntry[]>();
  for (const row of timelineResult.rows) {
    const entries = timelines.get(row.ticket_id) ?? [];
    entries.push({
      fromStatus: row.from_status,
      status: row.to_status,
      statusLabel: row.to_status ? repairStatusLabels[row.to_status] : null,
      customerUpdate: row.customer_update,
      createdAt: row.created_at.toISOString(),
    });
    timelines.set(row.ticket_id, entries);
  }

  return {
    tickets: ticketsResult.rows.map((row) => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      status: row.status,
      statusLabel: repairStatusLabels[row.status],
      customer: {
        name: row.customer_name,
        phone: row.customer_phone,
        email: row.customer_email,
      },
      equipment: {
        category: row.equipment_category,
        brand: row.equipment_brand,
        model: row.equipment_model,
        serialNumber: row.serial_number,
      },
      issueDescription: row.issue_description,
      preferredServiceOption: row.preferred_service_option,
      preferredAt: row.preferred_at?.toISOString() ?? null,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      timeline: timelines.get(row.id) ?? [],
    })),
    statusCounts,
  };
}

export async function transitionRepairStatus(input: {
  ticketId: string;
  status: RepairStatus;
  customerUpdate: string;
  actorAdminUserId: string;
}): Promise<{ status: RepairStatus; statusLabel: string; updatedAt: string }> {
  let client: PoolClient | undefined;
  let transactionOpen = false;

  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionOpen = true;

    const ticketResult = await client.query<{ status: RepairStatus }>(
      "SELECT status FROM repair_tickets WHERE id = $1 FOR UPDATE",
      [input.ticketId],
    );
    const ticket = ticketResult.rows[0];
    if (!ticket) {
      throw new RepairStatusTransitionError("Repair ticket not found.", 404);
    }

    if (!getAllowedRepairStatusTransitions(ticket.status).includes(input.status)) {
      throw new RepairStatusTransitionError(
        `Cannot change status from ${repairStatusLabels[ticket.status]} to ${repairStatusLabels[input.status]}.`,
        409,
      );
    }

    const updateResult = await client.query<{ status: RepairStatus; updated_at: Date }>(
      `UPDATE repair_tickets
       SET status = $2,
           updated_at = NOW(),
           status_updated_at = NOW()
       WHERE id = $1
       RETURNING status, updated_at`,
      [input.ticketId, input.status],
    );
    const updatedTicket = updateResult.rows[0];

    await client.query(
      `INSERT INTO repair_timeline_events (
         ticket_id,
         event_type,
         from_status,
         to_status,
         customer_update,
         internal_note,
         actor_type,
         actor_admin_user_id,
         created_at
       )
       VALUES ($1, 'STATUS_CHANGED', $2, $3, $4, NULL, 'ADMIN', $5, NOW())`,
      [input.ticketId, ticket.status, input.status, input.customerUpdate, input.actorAdminUserId],
    );

    await client.query("COMMIT");
    transactionOpen = false;

    return {
      status: updatedTicket.status,
      statusLabel: repairStatusLabels[updatedTicket.status],
      updatedAt: updatedTicket.updated_at.toISOString(),
    };
  } catch (error) {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original transition error.
      }
    }

    if (error instanceof RepairStatusTransitionError) {
      throw error;
    }
    throw new RepairStatusTransitionPersistenceError();
  } finally {
    client?.release();
  }
}