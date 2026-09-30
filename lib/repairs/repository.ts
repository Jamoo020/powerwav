import "server-only";

import { randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { pool } from "@/lib/db";
import {
  getAllowedRepairStatusTransitions,
  repairQuoteCurrencies,
  repairQuoteItemTypes,
  repairStatusLabels,
  type AdminRepairTicket,
  type AdminRepairTimelineEntry,
  type CreateRepairTicketInput,
  type CreatedRepairTicket,
  type RepairQuoteCurrency,
  type RepairQuoteItemType,
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
  diagnosis_findings: string | null;
  diagnosis_recommended_action: string | null;
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
              t.updated_at,
              d.findings AS diagnosis_findings,
              d.recommended_action AS diagnosis_recommended_action
       FROM repair_tickets t
       JOIN repair_customers c ON c.id = t.customer_id
       JOIN repair_equipment e ON e.id = t.equipment_id
            LEFT JOIN LATERAL (
              SELECT findings, recommended_action
              FROM repair_diagnoses
              WHERE ticket_id = t.id
              ORDER BY created_at DESC, id DESC
              LIMIT 1
            ) d ON TRUE
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
      diagnosis: row.diagnosis_findings
        ? {
            findings: row.diagnosis_findings,
            recommendedAction: row.diagnosis_recommended_action,
          }
        : null,
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

    if (ticket.status === "DIAGNOSIS_AND_QUOTE" && input.status === "AWAITING_CUSTOMER_APPROVAL") {
      const readinessResult = await client.query<{ ready: boolean }>(
        `SELECT EXISTS (
           SELECT 1
           FROM repair_diagnoses d
           JOIN repair_quotes q ON q.diagnosis_id = d.id
           WHERE d.ticket_id = $1
             AND btrim(d.findings) <> ''
             AND btrim(COALESCE(d.recommended_action, '')) <> ''
             AND q.ticket_id = $1
             AND q.status = 'ISSUED'
             AND EXISTS (
               SELECT 1 FROM repair_quote_items qi WHERE qi.quote_id = q.id
             )
         ) AS ready`,
        [input.ticketId],
      );
      if (!readinessResult.rows[0]?.ready) {
        throw new RepairStatusTransitionError(
          "A complete diagnosis and an issued quote with at least one line item are required before customer approval.",
          409,
        );
      }
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

export class RepairWorkflowError extends Error {
  constructor(message: string, readonly statusCode: 400 | 404 | 409) {
    super(message);
    this.name = "RepairWorkflowError";
  }
}

export class RepairWorkflowPersistenceError extends Error {
  constructor() {
    super("Repair diagnosis or quote could not be saved.");
    this.name = "RepairWorkflowPersistenceError";
  }
}

export type RepairDiagnosisInput = {
  findings: string;
  recommendedAction: string;
};

export type RepairQuoteItemInput = {
  itemType: RepairQuoteItemType;
  description: string;
  quantity: string;
  unitAmount: string;
  quantityMinor: bigint;
  unitAmountMinor: bigint;
};

export type RepairQuoteInput = RepairDiagnosisInput & {
  currency: RepairQuoteCurrency;
  additionalCharges: string;
  additionalChargesMinor: bigint;
  items: RepairQuoteItemInput[];
  subtotal: string;
  total: string;
};

const unsafeTextCharacters = /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const zeroMinor = BigInt(0);
const oneMinorUnit = BigInt(100);
const halfMinorUnit = BigInt(50);
const maximumQuoteTotalMinor = BigInt("999999999999");

function requiredPlainText(value: unknown, field: string, maximumLength: number): string {
  if (typeof value !== "string") {
    throw new RepairWorkflowError(`${field} is required.`, 400);
  }
  const text = value.trim();
  if (!text || text.length > maximumLength || unsafeTextCharacters.test(text)) {
    throw new RepairWorkflowError(`${field} must be plain text between 1 and ${maximumLength} characters.`, 400);
  }
  return text;
}

export function validateRepairDiagnosisInput(payload: unknown): RepairDiagnosisInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new RepairWorkflowError("Request body must be an object.", 400);
  }
  const data = payload as Record<string, unknown>;
  if (Object.keys(data).some((key) => key !== "findings" && key !== "recommendedAction")) {
    throw new RepairWorkflowError("Request contains unsupported fields.", 400);
  }
  return {
    findings: requiredPlainText(data.findings, "Findings", 5000),
    recommendedAction: requiredPlainText(data.recommendedAction, "Recommended action", 3000),
  };
}

function parseQuoteDecimal(value: unknown, field: string, maximumIntegerDigits: number): {
  decimal: string;
  minor: bigint;
} {
  if (typeof value !== "number" && typeof value !== "string") {
    throw new RepairWorkflowError(`${field} must be a non-negative amount with at most two decimal places.`, 400);
  }
  const raw = String(value).trim();
  const match = raw.match(/^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/);
  if (!match || match[1].length > maximumIntegerDigits) {
    throw new RepairWorkflowError(`${field} must be a non-negative amount with at most two decimal places.`, 400);
  }
  const whole = match[1];
  const fraction = (match[2] ?? "").padEnd(2, "0");
  return {
    decimal: `${whole}.${fraction}`,
    minor: BigInt(whole) * oneMinorUnit + BigInt(fraction),
  };
}

function formatMinorUnits(value: bigint): string {
  return `${value / oneMinorUnit}.${String(value % oneMinorUnit).padStart(2, "0")}`;
}

export function validateRepairQuoteInput(payload: unknown): RepairQuoteInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new RepairWorkflowError("Request body must be an object.", 400);
  }
  const data = payload as Record<string, unknown>;
  const allowedFields = new Set(["findings", "recommendedAction", "currency", "additionalCharges", "items"]);
  if (Object.keys(data).some((key) => !allowedFields.has(key))) {
    throw new RepairWorkflowError("Request contains unsupported fields.", 400);
  }

  const diagnosis = validateRepairDiagnosisInput({
    findings: data.findings,
    recommendedAction: data.recommendedAction,
  });
  const currency = typeof data.currency === "string" ? data.currency.trim().toUpperCase() : "";
  if (!repairQuoteCurrencies.some((supported) => supported === currency)) {
    throw new RepairWorkflowError("Currency must be one of the supported codes: KES, GBP, USD, EUR.", 400);
  }

  const additional = parseQuoteDecimal(data.additionalCharges, "Additional charges", 10);
  if (!Array.isArray(data.items) || data.items.length < 1 || data.items.length > 50) {
    throw new RepairWorkflowError("A quote must contain between 1 and 50 line items.", 400);
  }

  let subtotalMinor = zeroMinor;
  const items = data.items.map((item, index): RepairQuoteItemInput => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new RepairWorkflowError(`Quote item ${index + 1} must be an object.`, 400);
    }
    const row = item as Record<string, unknown>;
    if (Object.keys(row).some((key) => !["itemType", "description", "quantity", "unitAmount"].includes(key))) {
      throw new RepairWorkflowError(`Quote item ${index + 1} contains unsupported fields.`, 400);
    }
    if (typeof row.itemType !== "string" || !repairQuoteItemTypes.some((type) => type === row.itemType)) {
      throw new RepairWorkflowError(`Quote item ${index + 1} has an invalid item type.`, 400);
    }

    const quantity = parseQuoteDecimal(row.quantity, `Quote item ${index + 1} quantity`, 8);
    if (quantity.minor <= zeroMinor) {
      throw new RepairWorkflowError(`Quote item ${index + 1} quantity must be positive.`, 400);
    }
    const unitAmount = parseQuoteDecimal(row.unitAmount, `Quote item ${index + 1} unit amount`, 10);
    const lineTotalMinor = (quantity.minor * unitAmount.minor + halfMinorUnit) / oneMinorUnit;
    subtotalMinor += lineTotalMinor;

    return {
      itemType: row.itemType as RepairQuoteItemType,
      description: requiredPlainText(row.description, `Quote item ${index + 1} description`, 300),
      quantity: quantity.decimal,
      unitAmount: unitAmount.decimal,
      quantityMinor: quantity.minor,
      unitAmountMinor: unitAmount.minor,
    };
  });

  const totalMinor = subtotalMinor + additional.minor;
  if (subtotalMinor > maximumQuoteTotalMinor || totalMinor > maximumQuoteTotalMinor) {
    throw new RepairWorkflowError("Quote total exceeds the supported monetary limit.", 400);
  }

  return {
    ...diagnosis,
    currency: currency as RepairQuoteCurrency,
    additionalCharges: additional.decimal,
    additionalChargesMinor: additional.minor,
    items,
    subtotal: formatMinorUnits(subtotalMinor),
    total: formatMinorUnits(totalMinor),
  };
}

async function insertCustomerTimelineEvent(
  client: PoolClient,
  input: {
    ticketId: string;
    eventType: string;
    fromStatus: RepairStatus | null;
    toStatus: RepairStatus | null;
    customerUpdate: string;
    actorAdminUserId: string;
    createdAtOffsetMilliseconds?: number;
  },
): Promise<void> {
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
    VALUES ($1, $2, $3, $4, $5, NULL, 'ADMIN', $6, NOW() + ($7::int * INTERVAL '1 millisecond'))`,
    [
      input.ticketId,
      input.eventType,
      input.fromStatus,
      input.toStatus,
      input.customerUpdate,
      input.actorAdminUserId,
      input.createdAtOffsetMilliseconds ?? 0,
    ],
  );
}

export async function createRepairDiagnosis(input: {
  ticketId: string;
  findings: unknown;
  recommendedAction: unknown;
  actorAdminUserId: string;
}): Promise<void> {
  const diagnosis = validateRepairDiagnosisInput({
    findings: input.findings,
    recommendedAction: input.recommendedAction,
  });
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
      throw new RepairWorkflowError("Repair ticket not found.", 404);
    }
    if (ticket.status !== "DIAGNOSIS_AND_QUOTE") {
      throw new RepairWorkflowError("Diagnosis can only be recorded while the ticket is in Diagnosis + Quote.", 409);
    }

    const existingDiagnosis = await client.query<{ id: string }>(
      "SELECT id FROM repair_diagnoses WHERE ticket_id = $1 LIMIT 1",
      [input.ticketId],
    );
    if (existingDiagnosis.rows.length > 0) {
      throw new RepairWorkflowError("A diagnosis already exists for this ticket and cannot be overwritten.", 409);
    }

    await client.query(
      `INSERT INTO repair_diagnoses (
         ticket_id, findings, recommended_action, diagnosed_by_admin_user_id
       ) VALUES ($1, $2, $3, $4)`,
      [input.ticketId, diagnosis.findings, diagnosis.recommendedAction, input.actorAdminUserId],
    );
    await insertCustomerTimelineEvent(client, {
      ticketId: input.ticketId,
      eventType: "DIAGNOSIS_RECORDED",
      fromStatus: "DIAGNOSIS_AND_QUOTE",
      toStatus: "DIAGNOSIS_AND_QUOTE",
      customerUpdate: "Our technician has completed an initial assessment of your equipment.",
      actorAdminUserId: input.actorAdminUserId,
    });

    await client.query("COMMIT");
    transactionOpen = false;
  } catch (error) {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original workflow error.
      }
    }
    if (error instanceof RepairWorkflowError) {
      throw error;
    }
    throw new RepairWorkflowPersistenceError();
  } finally {
    client?.release();
  }
}

export async function issueRepairQuote(input: {
  ticketId: string;
  quote: unknown;
  actorAdminUserId: string;
}): Promise<{
  version: number;
  currency: RepairQuoteCurrency;
  subtotal: string;
  additionalCharges: string;
  total: string;
  status: "ISSUED";
}> {
  const quote = validateRepairQuoteInput(input.quote);
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
      throw new RepairWorkflowError("Repair ticket not found.", 404);
    }
    if (ticket.status !== "DIAGNOSIS_AND_QUOTE") {
      throw new RepairWorkflowError("A quote can only be issued while the ticket is in Diagnosis + Quote.", 409);
    }

    const diagnoses = await client.query<{
      id: string;
      findings: string;
      recommended_action: string | null;
    }>(
      `SELECT id, findings, recommended_action
       FROM repair_diagnoses
       WHERE ticket_id = $1
       ORDER BY created_at ASC
       LIMIT 2`,
      [input.ticketId],
    );
    if (diagnoses.rows.length > 1) {
      throw new RepairWorkflowError("Multiple diagnoses exist for this ticket; resolve the diagnosis history before issuing a quote.", 409);
    }

    let diagnosisId = diagnoses.rows[0]?.id;
    const existingDiagnosis = diagnoses.rows[0];
    if (existingDiagnosis) {
      if (
        existingDiagnosis.findings !== quote.findings ||
        existingDiagnosis.recommended_action !== quote.recommendedAction
      ) {
        throw new RepairWorkflowError("A diagnosis already exists and cannot be overwritten. Use the recorded findings and recommended action.", 409);
      }
      if (!existingDiagnosis.findings.trim() || !existingDiagnosis.recommended_action?.trim()) {
        throw new RepairWorkflowError("A complete diagnosis with findings and recommended action is required.", 409);
      }
    } else {
      const diagnosisResult = await client.query<{ id: string }>(
        `INSERT INTO repair_diagnoses (
           ticket_id, findings, recommended_action, diagnosed_by_admin_user_id
         ) VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [input.ticketId, quote.findings, quote.recommendedAction, input.actorAdminUserId],
      );
      diagnosisId = diagnosisResult.rows[0].id;
    }

    const versionResult = await client.query<{ next_version: number }>(
      `SELECT COALESCE(MAX(version), 0) + 1 AS next_version
       FROM repair_quotes
       WHERE ticket_id = $1`,
      [input.ticketId],
    );
    const version = Number(versionResult.rows[0].next_version);
    if (!Number.isSafeInteger(version) || version < 1) {
      throw new RepairWorkflowError("A new quote version could not be allocated.", 409);
    }

    await client.query(
      `UPDATE repair_quotes
       SET status = 'SUPERSEDED', updated_at = NOW()
      WHERE ticket_id = $1 AND status IN ('DRAFT', 'ISSUED')`,
      [input.ticketId],
    );

    const quoteResult = await client.query<{ id: string }>(
      `INSERT INTO repair_quotes (
         ticket_id,
         diagnosis_id,
         version,
         status,
         currency,
         subtotal,
         additional_charges,
         total,
         issued_by_admin_user_id,
         issued_at,
         created_at,
         updated_at
       ) VALUES ($1, $2, $3, 'DRAFT', $4, $5, $6, $7, NULL, NULL, NOW(), NOW())
       RETURNING id`,
      [
        input.ticketId,
        diagnosisId,
        version,
        quote.currency,
        quote.subtotal,
        quote.additionalCharges,
        quote.total,
      ],
    );
    const quoteId = quoteResult.rows[0].id;

    for (const [index, item] of quote.items.entries()) {
      await client.query(
        `INSERT INTO repair_quote_items (
           quote_id, line_number, item_type, description, quantity, unit_amount
         ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [quoteId, index + 1, item.itemType, item.description, item.quantity, item.unitAmount],
      );
    }

    await client.query(
      `UPDATE repair_quotes
       SET status = 'ISSUED',
           issued_by_admin_user_id = $2,
           issued_at = NOW(),
           updated_at = NOW()
       WHERE id = $1`,
      [quoteId, input.actorAdminUserId],
    );
    await insertCustomerTimelineEvent(client, {
      ticketId: input.ticketId,
      eventType: "DIAGNOSIS_AND_QUOTE_PREPARED",
      fromStatus: "DIAGNOSIS_AND_QUOTE",
      toStatus: "DIAGNOSIS_AND_QUOTE",
      customerUpdate: "Your equipment has been diagnosed and a repair quote has been prepared.",
      actorAdminUserId: input.actorAdminUserId,
    });

    await client.query(
      `UPDATE repair_tickets
       SET status = 'AWAITING_CUSTOMER_APPROVAL',
           updated_at = NOW(),
           status_updated_at = NOW()
       WHERE id = $1`,
      [input.ticketId],
    );
    await insertCustomerTimelineEvent(client, {
      ticketId: input.ticketId,
      eventType: "STATUS_CHANGED",
      fromStatus: "DIAGNOSIS_AND_QUOTE",
      toStatus: "AWAITING_CUSTOMER_APPROVAL",
      customerUpdate: "A repair quote has been issued. Please review the quote and provide approval before repair work continues.",
      actorAdminUserId: input.actorAdminUserId,
      createdAtOffsetMilliseconds: 1,
    });

    await client.query("COMMIT");
    transactionOpen = false;

    return {
      version,
      currency: quote.currency,
      subtotal: quote.subtotal,
      additionalCharges: quote.additionalCharges,
      total: quote.total,
      status: "ISSUED",
    };
  } catch (error) {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original workflow error.
      }
    }
    if (error instanceof RepairWorkflowError) {
      throw error;
    }
    throw new RepairWorkflowPersistenceError();
  } finally {
    client?.release();
  }
}