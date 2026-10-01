import "server-only";

import { randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { pool } from "@/lib/db";
import {
  getAllowedRepairStatusTransitions,
  repairQuoteCurrencies,
  repairQuoteItemTypes,
  repairPaymentMethods,
  repairStatusLabels,
  type AdminRepairTicket,
  type AdminRepairPayment,
  type AdminRepairPaymentSummary,
  type AdminRepairPaymentSubmission,
  type AdminRepairTimelineEntry,
  type CreateRepairTicketInput,
  type CreatedRepairTicket,
  type RepairQuoteCurrency,
  type RepairQuoteItemType,
  type RepairPaymentMethod,
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

type AdminRepairPaymentPlanRow = {
  payment_plan_id: string;
  ticket_id: string;
  approved_amount: string;
  currency: string;
  amount_paid: string;
  outstanding_balance: string;
  collection_status: AdminRepairPaymentSummary["collectionStatus"];
};

type AdminRepairPaymentRow = {
  ticket_id: string;
  amount: string;
  payment_method: RepairPaymentMethod;
  reference_number: string | null;
  payment_date: Date;
  recorded_by_email: string | null;
};

type AdminRepairPaymentSubmissionRow = {
  submission_id: string;
  ticket_id: string;
  amount: string;
  payment_method: RepairPaymentMethod;
  reference_number: string | null;
  customer_message: string | null;
  submitted_at: Date;
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

  const paymentPlanResult = ticketIds.length
    ? await pool.query<AdminRepairPaymentPlanRow>(
        `SELECT DISTINCT ON (p.ticket_id)
                p.id AS payment_plan_id,
                p.ticket_id,
                q.total::text AS approved_amount,
                q.currency,
                b.amount_paid::text AS amount_paid,
                b.outstanding_balance::text AS outstanding_balance,
                p.collection_status
         FROM repair_payment_plans p
         JOIN repair_quotes q ON q.id = p.quote_id AND q.ticket_id = p.ticket_id
         JOIN repair_payment_balances b ON b.payment_plan_id = p.id
         WHERE p.ticket_id = ANY($1::uuid[])
           AND q.status = 'APPROVED'
         ORDER BY p.ticket_id, p.created_at DESC, q.version DESC`,
        [ticketIds],
      )
    : { rows: [] as AdminRepairPaymentPlanRow[] };
  const paymentPlanIds = paymentPlanResult.rows.map((row) => row.payment_plan_id);
  const paymentSummaries = new Map<string, AdminRepairPaymentSummary>();
  for (const row of paymentPlanResult.rows) {
    paymentSummaries.set(row.ticket_id, {
      approvedAmount: row.approved_amount,
      currency: row.currency,
      amountPaid: row.amount_paid,
      outstandingBalance: row.outstanding_balance,
      collectionStatus: row.collection_status,
    });
  }

  const paymentHistoryResult = paymentPlanIds.length
    ? await pool.query<AdminRepairPaymentRow>(
        `SELECT s.id AS submission_id,
          p.ticket_id,
                tx.amount::text AS amount,
                tx.payment_method,
                tx.reference_number,
                tx.payment_date,
                u.email AS recorded_by_email
         FROM repair_payment_transactions tx
         JOIN repair_payment_plans p ON p.id = tx.payment_plan_id
         LEFT JOIN admin_users u ON u.id = tx.recorded_by_admin_user_id
         WHERE tx.payment_plan_id = ANY($1::uuid[])
         ORDER BY tx.payment_date DESC, tx.created_at DESC`,
        [paymentPlanIds],
      )
    : { rows: [] as AdminRepairPaymentRow[] };
  const paymentsByTicket = new Map<string, AdminRepairPayment[]>();
  for (const row of paymentHistoryResult.rows) {
    const payment: AdminRepairPayment = {
      amount: row.amount,
      paymentMethod: row.payment_method,
      referenceNumber: row.reference_number,
      paymentDate: row.payment_date.toISOString(),
      recordedByEmail: row.recorded_by_email,
    };
    const payments = paymentsByTicket.get(row.ticket_id) ?? [];
    payments.push(payment);
    paymentsByTicket.set(row.ticket_id, payments);
  }

  const pendingSubmissionResult = paymentPlanIds.length
    ? await pool.query<AdminRepairPaymentSubmissionRow>(
        `SELECT p.ticket_id,
                s.amount::text AS amount,
                s.payment_method,
                s.reference_number,
                s.customer_message,
                s.submitted_at
         FROM repair_payment_submissions s
         JOIN repair_payment_plans p ON p.id = s.payment_plan_id
         WHERE s.payment_plan_id = ANY($1::uuid[])
           AND s.status = 'PENDING_ADMIN_CONFIRMATION'
         ORDER BY s.submitted_at DESC`,
        [paymentPlanIds],
      )
    : { rows: [] as AdminRepairPaymentSubmissionRow[] };
  const pendingSubmissionsByTicket = new Map<string, AdminRepairPaymentSubmission[]>();
  for (const row of pendingSubmissionResult.rows) {
    const submissions = pendingSubmissionsByTicket.get(row.ticket_id) ?? [];
    submissions.push({
      submissionId: row.submission_id,
      amount: row.amount,
      paymentMethod: row.payment_method,
      referenceNumber: row.reference_number,
      customerMessage: row.customer_message,
      submittedAt: row.submitted_at.toISOString(),
    });
    pendingSubmissionsByTicket.set(row.ticket_id, submissions);
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
        paymentSummary: paymentSummaries.get(row.id) ?? null,
        payments: paymentsByTicket.get(row.id) ?? [],
        pendingPaymentSubmissions: pendingSubmissionsByTicket.get(row.id) ?? [],
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

export class RepairPaymentError extends Error {
  constructor(message: string, readonly statusCode: 400 | 404 | 409) {
    super(message);
    this.name = "RepairPaymentError";
  }
}

export class RepairPaymentPersistenceError extends Error {
  constructor() {
    super("Payment could not be recorded.");
    this.name = "RepairPaymentPersistenceError";
  }
}

export type RepairPaymentInput = {
  amount: string;
  amountMinor: bigint;
  paymentMethod: RepairPaymentMethod;
  referenceNumber: string | null;
  notes: string | null;
};

export function validateRepairPaymentInput(payload: unknown): RepairPaymentInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new RepairPaymentError("Request body must be an object.", 400);
  }
  const data = payload as Record<string, unknown>;
  const allowedFields = new Set(["amount", "paymentMethod", "referenceNumber", "notes"]);
  if (Object.keys(data).some((key) => !allowedFields.has(key))) {
    throw new RepairPaymentError("Request contains unsupported fields.", 400);
  }

  if (typeof data.amount !== "number" && typeof data.amount !== "string") {
    throw new RepairPaymentError("Payment amount must be positive with at most two decimal places.", 400);
  }
  const match = String(data.amount).trim().match(/^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/);
  if (!match || match[1].length > 10) {
    throw new RepairPaymentError("Payment amount must be positive with at most two decimal places.", 400);
  }
  const fraction = (match[2] ?? "").padEnd(2, "0");
  const amountMinor = BigInt(match[1]) * BigInt(100) + BigInt(fraction);
  if (amountMinor <= BigInt(0)) {
    throw new RepairPaymentError("Payment amount must be greater than zero.", 400);
  }
  if (typeof data.paymentMethod !== "string" || !repairPaymentMethods.some((method) => method === data.paymentMethod)) {
    throw new RepairPaymentError("Payment method is invalid.", 400);
  }

  let referenceNumber: string | null = null;
  if (data.referenceNumber !== undefined && data.referenceNumber !== null) {
    if (typeof data.referenceNumber !== "string") {
      throw new RepairPaymentError("Payment reference must be text.", 400);
    }
    referenceNumber = data.referenceNumber.trim() || null;
    if (referenceNumber && (referenceNumber.length > 160 || referenceNumber.includes("\0"))) {
      throw new RepairPaymentError("Payment reference is invalid.", 400);
    }
  }

  let notes: string | null = null;
  if (data.notes !== undefined && data.notes !== null) {
    if (typeof data.notes !== "string") {
      throw new RepairPaymentError("Payment note must be text.", 400);
    }
    notes = data.notes.trim() || null;
    if (notes && (notes.length > 2000 || notes.includes("\0"))) {
      throw new RepairPaymentError("Payment note is invalid.", 400);
    }
  }

  return {
    amount: `${match[1]}.${fraction}`,
    amountMinor,
    paymentMethod: data.paymentMethod as RepairPaymentMethod,
    referenceNumber,
    notes,
  };
}

function databaseMoneyToMinorUnits(value: string): bigint {
  const match = value.match(/^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/);
  if (!match) {
    throw new RepairPaymentPersistenceError();
  }
  return BigInt(match[1]) * BigInt(100) + BigInt((match[2] ?? "").padEnd(2, "0"));
}

function formatPaymentTimelineMoney(currency: string, amountMinor: bigint): string {
  const whole = amountMinor / BigInt(100);
  const fraction = amountMinor % BigInt(100);
  const formattedWhole = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(whole);
  return `${currency} ${formattedWhole}${fraction === BigInt(0) ? "" : `.${String(fraction).padStart(2, "0")}`}`;
}

export async function recordRepairPayment(input: {
  ticketId: string;
  adminUserId: string;
  payload: unknown;
}): Promise<{
  amount: string;
  currency: string;
  amountPaid: string;
  outstandingBalance: string;
  paidInFull: boolean;
}> {
  const payment = validateRepairPaymentInput(input.payload);
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
      throw new RepairPaymentError("Repair ticket not found.", 404);
    }
    if (["COMPLETED", "CANCELLED"].includes(ticket.status)) {
      throw new RepairPaymentError("Payments cannot be recorded after the repair is completed or cancelled.", 409);
    }

    const planResult = await client.query<{ id: string; quote_id: string; collection_status: string }>(
      `SELECT p.id, p.quote_id, p.collection_status
       FROM repair_payment_plans p
       WHERE p.ticket_id = $1
       ORDER BY p.created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [input.ticketId],
    );
    const plan = planResult.rows[0];
    if (!plan) {
      throw new RepairPaymentError("No approved payment plan exists for this repair.", 409);
    }
    if (plan.collection_status === "COLLECTED") {
      throw new RepairPaymentError("Payments cannot be recorded after the repair has been collected.", 409);
    }

    const quoteResult = await client.query<{ status: string; currency: string }>(
      `SELECT status, currency
       FROM repair_quotes
       WHERE id = $1 AND ticket_id = $2`,
      [plan.quote_id, input.ticketId],
    );
    const quote = quoteResult.rows[0];
    if (!quote || quote.status !== "APPROVED") {
      throw new RepairPaymentError("Payments require an approved quote for this repair.", 409);
    }

    const balanceResult = await client.query<{ approved_amount: string; amount_paid: string; outstanding_balance: string }>(
      `SELECT approved_amount::text AS approved_amount,
              amount_paid::text AS amount_paid,
              outstanding_balance::text AS outstanding_balance
       FROM repair_payment_balances
       WHERE payment_plan_id = $1`,
      [plan.id],
    );
    const currentBalance = balanceResult.rows[0];
    if (!currentBalance) {
      throw new RepairPaymentError("Payment balance is unavailable for this repair.", 409);
    }

    const outstandingMinor = databaseMoneyToMinorUnits(currentBalance.outstanding_balance);
    if (payment.amountMinor > outstandingMinor) {
      throw new RepairPaymentError("Payment cannot exceed the current outstanding balance.", 409);
    }

    try {
      await client.query(
        `INSERT INTO repair_payment_transactions (
           ticket_id,
           payment_plan_id,
           amount,
           payment_method,
           reference_number,
           payment_date,
           recorded_by_admin_user_id,
           notes
         ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)`,
        [input.ticketId, plan.id, payment.amount, payment.paymentMethod, payment.referenceNumber, input.adminUserId, payment.notes],
      );
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "23505") {
        throw new RepairPaymentError("That payment reference has already been recorded.", 409);
      }
      throw error;
    }

    const updatedBalanceResult = await client.query<{ amount_paid: string; outstanding_balance: string }>(
      `SELECT amount_paid::text AS amount_paid,
              outstanding_balance::text AS outstanding_balance
       FROM repair_payment_balances
       WHERE payment_plan_id = $1`,
      [plan.id],
    );
    const updatedBalance = updatedBalanceResult.rows[0];
    if (!updatedBalance) {
      throw new RepairPaymentPersistenceError();
    }
    const updatedOutstandingMinor = databaseMoneyToMinorUnits(updatedBalance.outstanding_balance);
    const paidInFull = updatedOutstandingMinor === BigInt(0);
    const customerUpdate = paidInFull
      ? "Your repair payment has been received in full."
      : `A payment of ${formatPaymentTimelineMoney(quote.currency, payment.amountMinor)} has been received. Your outstanding balance is ${formatPaymentTimelineMoney(quote.currency, updatedOutstandingMinor)}.`;

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
       ) VALUES ($1, 'PAYMENT_RECEIVED', $2, $2, $3, NULL, 'ADMIN', $4, NOW())`,
      [input.ticketId, ticket.status, customerUpdate, input.adminUserId],
    );

    await client.query("COMMIT");
    transactionOpen = false;
    return {
      amount: payment.amount,
      currency: quote.currency,
      amountPaid: updatedBalance.amount_paid,
      outstandingBalance: updatedBalance.outstanding_balance,
      paidInFull,
    };
  } catch (error) {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original payment error.
      }
    }
    if (error instanceof RepairPaymentError || error instanceof RepairPaymentPersistenceError) {
      throw error;
    }
    throw new RepairPaymentPersistenceError();
  } finally {
    client?.release();
  }
}

export async function confirmRepairPaymentSubmission(input: {
  ticketId: string;
  submissionId: string;
  adminUserId: string;
}): Promise<{
  amount: string;
  currency: string;
  amountPaid: string;
  outstandingBalance: string;
  paidInFull: boolean;
}> {
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
    if (!ticket) throw new RepairPaymentError("Repair ticket not found.", 404);
    if (["COMPLETED", "CANCELLED"].includes(ticket.status)) {
      throw new RepairPaymentError("Payments cannot be confirmed after the repair is completed or cancelled.", 409);
    }

    const planResult = await client.query<{ id: string; quote_id: string; collection_status: string }>(
      `SELECT id, quote_id, collection_status
       FROM repair_payment_plans
       WHERE ticket_id = $1
       ORDER BY created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [input.ticketId],
    );
    const plan = planResult.rows[0];
    if (!plan) throw new RepairPaymentError("No approved payment plan exists for this repair.", 409);
    if (plan.collection_status === "COLLECTED") {
      throw new RepairPaymentError("Payments cannot be confirmed after the repair has been collected.", 409);
    }

    const submissionResult = await client.query<{
      amount: string;
      payment_method: RepairPaymentMethod;
      reference_number: string;
      customer_message: string | null;
    }>(
      `SELECT amount::text AS amount, payment_method, reference_number, customer_message
       FROM repair_payment_submissions
       WHERE id = $1 AND ticket_id = $2 AND payment_plan_id = $3
         AND status = 'PENDING_ADMIN_CONFIRMATION'
       FOR UPDATE`,
      [input.submissionId, input.ticketId, plan.id],
    );
    const submission = submissionResult.rows[0];
    if (!submission) {
      throw new RepairPaymentError("Payment submission was not found or has already been reviewed.", 409);
    }

    const quoteResult = await client.query<{ status: string; currency: string }>(
      "SELECT status, currency FROM repair_quotes WHERE id = $1 AND ticket_id = $2",
      [plan.quote_id, input.ticketId],
    );
    const quote = quoteResult.rows[0];
    if (!quote || quote.status !== "APPROVED") {
      throw new RepairPaymentError("Payments require an approved quote for this repair.", 409);
    }

    const payment = validateRepairPaymentInput({
      amount: submission.amount,
      paymentMethod: submission.payment_method,
      referenceNumber: submission.reference_number,
      notes: submission.customer_message,
    });
    const balanceResult = await client.query<{ outstanding_balance: string }>(
      `SELECT outstanding_balance::text AS outstanding_balance
       FROM repair_payment_balances
       WHERE payment_plan_id = $1`,
      [plan.id],
    );
    const outstanding = balanceResult.rows[0]?.outstanding_balance;
    if (outstanding === undefined || payment.amountMinor > databaseMoneyToMinorUnits(outstanding)) {
      throw new RepairPaymentError("Payment submission exceeds the current outstanding balance.", 409);
    }

    let transactionId: string;
    try {
      const transactionResult = await client.query<{ id: string }>(
        `INSERT INTO repair_payment_transactions (
           ticket_id, payment_plan_id, amount, payment_method,
           reference_number, payment_date, recorded_by_admin_user_id, notes
         ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
         RETURNING id`,
        [input.ticketId, plan.id, payment.amount, payment.paymentMethod, payment.referenceNumber, input.adminUserId, payment.notes],
      );
      transactionId = transactionResult.rows[0].id;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "23505") {
        throw new RepairPaymentError("That payment reference has already been recorded.", 409);
      }
      throw error;
    }

    const updatedBalanceResult = await client.query<{ amount_paid: string; outstanding_balance: string }>(
      `SELECT amount_paid::text AS amount_paid, outstanding_balance::text AS outstanding_balance
       FROM repair_payment_balances WHERE payment_plan_id = $1`,
      [plan.id],
    );
    const updatedBalance = updatedBalanceResult.rows[0];
    if (!updatedBalance) throw new RepairPaymentPersistenceError();
    const updatedOutstandingMinor = databaseMoneyToMinorUnits(updatedBalance.outstanding_balance);
    const paidInFull = updatedOutstandingMinor === BigInt(0);
    const customerUpdate = paidInFull
      ? "Your repair payment has been received in full."
      : `A payment of ${formatPaymentTimelineMoney(quote.currency, payment.amountMinor)} has been received. Your outstanding balance is ${formatPaymentTimelineMoney(quote.currency, updatedOutstandingMinor)}.`;

    await client.query(
      `UPDATE repair_payment_submissions
       SET status = 'CONFIRMED',
           reviewed_by_admin_user_id = $2,
           reviewed_at = NOW(),
           payment_transaction_id = $3
       WHERE id = $1 AND status = 'PENDING_ADMIN_CONFIRMATION'`,
      [input.submissionId, input.adminUserId, transactionId],
    );
    await client.query(
      `INSERT INTO repair_timeline_events (
         ticket_id, event_type, from_status, to_status, customer_update,
         internal_note, actor_type, actor_admin_user_id, created_at
       ) VALUES ($1, 'PAYMENT_RECEIVED', $2, $2, $3, NULL, 'ADMIN', $4, NOW())`,
      [input.ticketId, ticket.status, customerUpdate, input.adminUserId],
    );

    await client.query("COMMIT");
    transactionOpen = false;
    return {
      amount: payment.amount,
      currency: quote.currency,
      amountPaid: updatedBalance.amount_paid,
      outstandingBalance: updatedBalance.outstanding_balance,
      paidInFull,
    };
  } catch (error) {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original payment confirmation error.
      }
    }
    if (error instanceof RepairPaymentError || error instanceof RepairPaymentPersistenceError) {
      throw error;
    }
    throw new RepairPaymentPersistenceError();
  } finally {
    client?.release();
  }
}