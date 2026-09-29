import "server-only";

import { randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { pool } from "@/lib/db";
import type { CreateRepairTicketInput, CreatedRepairTicket } from "./types";

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