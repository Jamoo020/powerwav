import "server-only";

import type { PoolClient } from "pg";
import { pool } from "@/lib/db";
import { normalizeRepairPhone, RepairInputError } from "./repository";
import {
  repairStatusLabels,
  repairPaymentMethods,
  type RepairCollectionStatus,
  type RepairPaymentArrangementStatus,
  type RepairPaymentRequirement,
  type RepairPaymentRequirementStatus,
  type RepairQuoteReview,
  type RepairStatus,
  type RepairTrackingPaymentPlan,
  type RepairTrackingPaymentHistoryEntry,
  type RepairTrackingTicket,
} from "./types";

export class RepairTrackingError extends Error {
  constructor() {
    super("Repair tracking is unavailable.");
    this.name = "RepairTrackingError";
  }
}

export class RepairQuoteDecisionError extends Error {
  constructor(message: string, readonly statusCode: 404 | 409) {
    super(message);
    this.name = "RepairQuoteDecisionError";
  }
}

export class RepairQuoteDecisionPersistenceError extends Error {
  constructor() {
    super("The quote decision could not be saved.");
    this.name = "RepairQuoteDecisionPersistenceError";
  }
}

export class RepairPaymentChoiceError extends Error {
  constructor(message: string, readonly statusCode: 400 | 404 | 409) {
    super(message);
    this.name = "RepairPaymentChoiceError";
  }
}

export class RepairPaymentChoicePersistenceError extends Error {
  constructor() {
    super("The payment choice could not be saved.");
    this.name = "RepairPaymentChoicePersistenceError";
  }
}

export class RepairPaymentSubmissionError extends Error {
  constructor(message: string, readonly statusCode: 400 | 404 | 409) {
    super(message);
    this.name = "RepairPaymentSubmissionError";
  }
}

export class RepairPaymentSubmissionPersistenceError extends Error {
  constructor() {
    super("The payment submission could not be saved.");
    this.name = "RepairPaymentSubmissionPersistenceError";
  }
}

type VerifiedTrackingInput = {
  ticketNumber: string;
  phoneDigits: string;
};

function normalizeTrackingInput(ticketValue: unknown, phoneValue: unknown): VerifiedTrackingInput | null {
  if (typeof ticketValue !== "string") {
    return null;
  }

  const ticketNumber = ticketValue.trim().toUpperCase();
  if (!/^PW-\d{4}-\d{4,}$/.test(ticketNumber)) {
    return null;
  }

  try {
    return { ticketNumber, phoneDigits: normalizeRepairPhone(phoneValue) };
  } catch (error) {
    if (error instanceof RepairInputError) {
      return null;
    }
    throw error;
  }
}

function normalizeProposedPaymentAmount(value: unknown): string {
  if (typeof value !== "number" && typeof value !== "string") {
    throw new RepairPaymentChoiceError("A proposed payment amount is required for an arrangement.", 400);
  }
  const match = String(value).trim().match(/^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/);
  if (!match || match[1].length > 10) {
    throw new RepairPaymentChoiceError("Proposed payment amount must be positive with at most two decimal places.", 400);
  }
  const amount = `${match[1]}.${(match[2] ?? "").padEnd(2, "0")}`;
  if (BigInt(match[1]) * BigInt(100) + BigInt(match[2] ?? "0") <= BigInt(0)) {
    throw new RepairPaymentChoiceError("Proposed payment amount must be positive.", 400);
  }
  return amount;
}

function normalizeCustomerPaymentReference(value: unknown): string {
  if (typeof value !== "string") {
    throw new RepairPaymentSubmissionError("Payment reference is required.", 400);
  }
  const reference = value.trim();
  if (!reference || reference.length > 160 || /[<>\u0000-\u001F\u007F]/.test(reference)) {
    throw new RepairPaymentSubmissionError("Payment reference is invalid.", 400);
  }
  return reference;
}

type RepairTicketRow = {
  id: string;
  ticket_number: string;
  status: RepairStatus;
  category: string;
  brand: string;
  model: string;
  issue_description: string;
  created_at: Date;
  status_updated_at: Date;
};

type RepairTimelineRow = {
  to_status: RepairStatus | null;
  customer_update: string;
  created_at: Date;
};

type RepairQuoteReviewRow = {
  id: string;
  findings: string;
  recommended_action: string;
  version: number;
  status: "ISSUED";
  currency: string;
  subtotal: string;
  additional_charges: string;
  total: string;
  issued_at: Date;
};

type RepairQuoteItemRow = {
  item_type: "PART" | "LABOUR" | "OTHER";
  description: string;
  quantity: string;
  unit_amount: string;
};

type RepairTrackingPaymentPlanRow = {
  payment_plan_id: string;
  approved_amount: string;
  currency: string;
  payment_requirement: RepairPaymentRequirement;
  payment_requirement_status: RepairPaymentRequirementStatus;
  required_deposit_amount: string;
  amount_required_for_current_payment: string;
  amount_paid: string;
  outstanding_balance: string;
  payment_arrangement_status: RepairPaymentArrangementStatus;
  proposed_payment_amount: string | null;
  proposed_payment_at: Date | null;
  collection_status: RepairCollectionStatus;
  collection_deadline: Date | null;
};

type RepairTrackingPaymentHistoryRow = {
  amount: string;
  payment_method: "CASH" | "MPESA" | "BANK_TRANSFER" | "CARD" | "OTHER";
  reference_number: string | null;
  status: RepairTrackingPaymentHistoryEntry["status"];
  payment_date: Date;
  customer_message: string | null;
};

export async function getRepairTicketForTracking(
  ticketValue: unknown,
  phoneValue: unknown,
): Promise<RepairTrackingTicket | null> {
  const trackingInput = normalizeTrackingInput(ticketValue, phoneValue);
  if (!trackingInput) return null;
  const { ticketNumber, phoneDigits } = trackingInput;

  try {
    const ticketResult = await pool.query<RepairTicketRow>(
      `SELECT t.id,
              t.ticket_number,
              t.status,
              t.issue_description,
              t.created_at,
              t.status_updated_at,
              e.category,
              e.brand,
              e.model
       FROM repair_tickets t
       JOIN repair_customers c ON c.id = t.customer_id
       JOIN repair_equipment e ON e.id = t.equipment_id
       WHERE t.ticket_number = $1
         AND regexp_replace(c.phone, '[^0-9]', '', 'g') = $2
       LIMIT 1`,
      [ticketNumber, phoneDigits],
    );

    const row = ticketResult.rows[0];
    if (!row) {
      return null;
    }

    const timelineResult = await pool.query<RepairTimelineRow>(
      `SELECT to_status, customer_update, created_at
       FROM repair_timeline_events
       WHERE ticket_id = $1
         AND customer_update IS NOT NULL
         AND btrim(customer_update) <> ''
       ORDER BY created_at ASC, id ASC`,
      [row.id],
    );

    let quoteReview: RepairQuoteReview | null = null;
    if (row.status === "AWAITING_CUSTOMER_APPROVAL") {
      const quoteResult = await pool.query<RepairQuoteReviewRow>(
        `SELECT q.id,
                d.findings,
                d.recommended_action,
                q.version,
                q.status,
                q.currency,
                q.subtotal::text AS subtotal,
                q.additional_charges::text AS additional_charges,
                q.total::text AS total,
                q.issued_at
         FROM repair_quotes q
         JOIN repair_diagnoses d ON d.id = q.diagnosis_id
         WHERE q.ticket_id = $1
           AND q.status = 'ISSUED'
         ORDER BY q.version DESC
         LIMIT 1`,
        [row.id],
      );
      const quote = quoteResult.rows[0];
      if (quote?.issued_at) {
        const itemsResult = await pool.query<RepairQuoteItemRow>(
          `SELECT item_type, description, quantity::text AS quantity, unit_amount::text AS unit_amount
           FROM repair_quote_items
           WHERE quote_id = $1
           ORDER BY line_number ASC`,
          [quote.id],
        );
        quoteReview = {
          diagnosis: {
            findings: quote.findings,
            recommendedAction: quote.recommended_action,
          },
          quote: {
            version: quote.version,
            status: quote.status,
            currency: quote.currency,
            subtotal: quote.subtotal,
            additionalCharges: quote.additional_charges,
            total: quote.total,
            issuedAt: quote.issued_at.toISOString(),
            items: itemsResult.rows.map((item) => ({
              itemType: item.item_type,
              description: item.description,
              quantity: item.quantity,
              unitAmount: item.unit_amount,
            })),
          },
        };
      }
    }

    const paymentPlanResult = await pool.query<RepairTrackingPaymentPlanRow>(
            `SELECT p.id AS payment_plan_id,
              q.total::text AS approved_amount,
              q.currency,
              p.payment_requirement,
              p.payment_requirement_status,
              p.required_deposit_amount::text AS required_deposit_amount,
              CASE
                WHEN p.payment_requirement = 'FULL_PAYMENT' THEN b.outstanding_balance::text
                ELSE GREATEST(LEAST(p.required_deposit_amount - b.amount_paid, b.outstanding_balance), 0)::text
              END AS amount_required_for_current_payment,
              b.amount_paid::text AS amount_paid,
              b.outstanding_balance::text AS outstanding_balance,
              p.payment_arrangement_status,
              p.proposed_payment_amount::text AS proposed_payment_amount,
              p.proposed_payment_at,
              p.collection_status,
              p.collection_deadline
       FROM repair_payment_plans p
       JOIN repair_quotes q ON q.id = p.quote_id AND q.ticket_id = p.ticket_id
       JOIN repair_payment_balances b ON b.payment_plan_id = p.id
       WHERE p.ticket_id = $1
       ORDER BY p.created_at DESC
       LIMIT 1`,
      [row.id],
    );
    const planRow = paymentPlanResult.rows[0];
    const paymentHistoryResult = planRow
      ? await pool.query<RepairTrackingPaymentHistoryRow>(
            `SELECT tx.amount::text AS amount,
              tx.payment_method,
              tx.reference_number,
                  'CONFIRMED'::text AS status,
              tx.payment_date,
                      s.customer_message
                    FROM repair_payment_transactions tx
                    LEFT JOIN repair_payment_submissions s ON s.payment_transaction_id = tx.id
                    WHERE tx.payment_plan_id = $1
           UNION ALL
           SELECT amount::text AS amount,
                  payment_method,
                  reference_number,
                  status,
                  submitted_at AS payment_date,
                  customer_message
           FROM repair_payment_submissions
           WHERE payment_plan_id = $1
             AND status IN ('PENDING_ADMIN_CONFIRMATION', 'REJECTED')
           ORDER BY payment_date DESC`,
          [planRow.payment_plan_id],
        )
      : { rows: [] as RepairTrackingPaymentHistoryRow[] };
    const paymentHistory: RepairTrackingPaymentHistoryEntry[] = paymentHistoryResult.rows.map((entry) => ({
      amount: entry.amount,
      paymentMethod: entry.payment_method,
      referenceNumber: entry.reference_number,
      status: entry.status,
      paymentDate: entry.payment_date.toISOString(),
      customerMessage: entry.customer_message,
    }));
    const paymentPlan: RepairTrackingPaymentPlan | null = planRow
      ? {
          approvedAmount: planRow.approved_amount,
          currency: planRow.currency,
          paymentRequirement: planRow.payment_requirement,
          paymentRequirementStatus: planRow.payment_requirement_status,
          requiredDepositAmount: planRow.required_deposit_amount,
          amountRequiredForCurrentPayment: planRow.amount_required_for_current_payment,
          amountPaid: planRow.amount_paid,
          outstandingBalance: planRow.outstanding_balance,
          arrangementStatus: planRow.payment_arrangement_status,
          proposedPaymentAmount: planRow.proposed_payment_amount,
          proposedPaymentAt: planRow.proposed_payment_at?.toISOString() ?? null,
          collectionStatus: planRow.collection_status,
          collectionDeadline: planRow.collection_deadline?.toISOString() ?? null,
          paymentHistory,
        }
      : null;

    return {
      ticketNumber: row.ticket_number,
      status: row.status,
      statusLabel: repairStatusLabels[row.status],
      equipment: {
        category: row.category,
        brand: row.brand,
        model: row.model,
      },
      issueDescription: row.issue_description,
      createdAt: row.created_at.toISOString(),
      statusUpdatedAt: row.status_updated_at.toISOString(),
      timeline: timelineResult.rows.map((event) => ({
        eventType: event.to_status ?? "CUSTOMER_UPDATE",
        status: event.to_status,
        statusLabel: event.to_status ? repairStatusLabels[event.to_status] : null,
        customerUpdate: event.customer_update,
        createdAt: event.created_at.toISOString(),
      })),
      quoteReview,
      paymentPlan,
    };
  } catch {
    throw new RepairTrackingError();
  }
}

export async function decideRepairQuoteForCustomer(input: {
  ticketValue: unknown;
  phoneValue: unknown;
  action: "APPROVE" | "REJECT";
}): Promise<{ status: RepairStatus; statusLabel: string }> {
  const trackingInput = normalizeTrackingInput(input.ticketValue, input.phoneValue);
  if (!trackingInput) {
    throw new RepairQuoteDecisionError("Ticket not found or verification failed.", 404);
  }

  let client: PoolClient | undefined;
  let transactionOpen = false;

  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionOpen = true;

    const ticketResult = await client.query<{ id: string; status: RepairStatus }>(
      `SELECT t.id, t.status
       FROM repair_tickets t
       JOIN repair_customers c ON c.id = t.customer_id
       WHERE t.ticket_number = $1
         AND regexp_replace(c.phone, '[^0-9]', '', 'g') = $2
       FOR UPDATE OF t`,
      [trackingInput.ticketNumber, trackingInput.phoneDigits],
    );
    const ticket = ticketResult.rows[0];
    if (!ticket) {
      throw new RepairQuoteDecisionError("Ticket not found or verification failed.", 404);
    }
    if (ticket.status !== "AWAITING_CUSTOMER_APPROVAL") {
      throw new RepairQuoteDecisionError("This quote is no longer awaiting a customer decision.", 409);
    }

    const quoteResult = await client.query<{ id: string }>(
      `SELECT id
       FROM repair_quotes
       WHERE ticket_id = $1 AND status = 'ISSUED'
       ORDER BY version DESC
       LIMIT 1
       FOR UPDATE`,
      [ticket.id],
    );
    const quote = quoteResult.rows[0];
    if (!quote) {
      throw new RepairQuoteDecisionError("There is no issued quote awaiting a decision.", 409);
    }

    const approved = input.action === "APPROVE";
    const quoteStatus = approved ? "APPROVED" : "REJECTED";
    const ticketStatus: RepairStatus = approved ? "AWAITING_PARTS" : "CANCELLED";
    const customerUpdate = approved
      ? "Your repair quote has been approved. We are now arranging the required parts."
      : "Your repair quote was declined and the repair request has been closed.";

    const updateQuoteResult = await client.query(
      `UPDATE repair_quotes
       SET status = $2,
           decided_at = NOW(),
           decision_channel = 'TRACKING',
           updated_at = NOW()
       WHERE id = $1 AND status = 'ISSUED'`,
      [quote.id, quoteStatus],
    );
    if (updateQuoteResult.rowCount !== 1) {
      throw new RepairQuoteDecisionError("This quote has already been decided.", 409);
    }

    if (approved) {
      await client.query(
        `INSERT INTO repair_payment_plans (
           ticket_id,
           quote_id,
           payment_requirement,
           payment_requirement_status,
           payment_arrangement_status,
           collection_status
         ) VALUES ($1, $2, 'FULL_PAYMENT', 'ACCEPTED', 'NOT_REQUESTED', 'NOT_READY')
         ON CONFLICT (ticket_id, quote_id) DO NOTHING`,
        [ticket.id, quote.id],
      );
    }

    await client.query(
      `UPDATE repair_tickets
       SET status = $2,
           updated_at = NOW(),
           status_updated_at = NOW()
       WHERE id = $1`,
      [ticket.id, ticketStatus],
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
         actor_admin_user_id,
         created_at
       ) VALUES ($1, $2, $3, $4, $5, NULL, 'CUSTOMER', NULL, NOW())`,
      [
        ticket.id,
        approved ? "CUSTOMER_APPROVED_QUOTE" : "CUSTOMER_REJECTED_QUOTE",
        ticket.status,
        ticketStatus,
        customerUpdate,
      ],
    );

    await client.query("COMMIT");
    transactionOpen = false;
    return { status: ticketStatus, statusLabel: repairStatusLabels[ticketStatus] };
  } catch (error) {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original decision error.
      }
    }
    if (error instanceof RepairQuoteDecisionError) {
      throw error;
    }
    throw new RepairQuoteDecisionPersistenceError();
  } finally {
    client?.release();
  }
}

export async function selectRepairPaymentRequirementForCustomer(input: {
  ticketValue: unknown;
  phoneValue: unknown;
  requirement: RepairPaymentRequirement;
  depositAmount?: unknown;
}): Promise<{
  paymentRequirement: RepairPaymentRequirement;
  paymentRequirementStatus: RepairPaymentRequirementStatus;
  arrangementStatus: RepairPaymentArrangementStatus;
}> {
  const trackingInput = normalizeTrackingInput(input.ticketValue, input.phoneValue);
  if (!trackingInput) {
    throw new RepairPaymentChoiceError("Ticket not found or verification failed.", 404);
  }

  if (input.requirement !== "FULL_PAYMENT" && input.requirement !== "DEPOSIT") {
    throw new RepairPaymentChoiceError("Choose full payment or a deposit.", 400);
  }

  const depositAmount = input.requirement === "DEPOSIT"
    ? normalizeProposedPaymentAmount(input.depositAmount)
    : null;
  if (input.requirement === "FULL_PAYMENT" && input.depositAmount !== undefined) {
    throw new RepairPaymentChoiceError("Deposit amount is only accepted when choosing a deposit.", 400);
  }

  let client: PoolClient | undefined;
  let transactionOpen = false;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionOpen = true;

    const ticketResult = await client.query<{ id: string; status: RepairStatus }>(
      `SELECT t.id, t.status
       FROM repair_tickets t
       JOIN repair_customers c ON c.id = t.customer_id
       WHERE t.ticket_number = $1
         AND regexp_replace(c.phone, '[^0-9]', '', 'g') = $2
       FOR UPDATE OF t`,
      [trackingInput.ticketNumber, trackingInput.phoneDigits],
    );
    const ticket = ticketResult.rows[0];
    if (!ticket) {
      throw new RepairPaymentChoiceError("Ticket not found or verification failed.", 404);
    }
    if (["CANCELLED", "COMPLETED", "REQUEST_RECEIVED", "APPOINTMENT_SCHEDULED", "DEVICE_RECEIVED", "DIAGNOSIS_AND_QUOTE", "AWAITING_CUSTOMER_APPROVAL"].includes(ticket.status)) {
      throw new RepairPaymentChoiceError("Payment choices are available after the quote has been approved.", 409);
    }

    const planResult = await client.query<{
      id: string;
      quote_id: string;
      required_deposit_amount: string;
      collection_status: RepairCollectionStatus;
      payment_requirement: RepairPaymentRequirement;
      payment_requirement_status: RepairPaymentRequirementStatus;
      payment_arrangement_status: RepairPaymentArrangementStatus;
      proposed_payment_amount: string | null;
      proposed_payment_at: Date | null;
    }>(
      `SELECT id,
              quote_id,
              required_deposit_amount::text AS required_deposit_amount,
              collection_status,
              payment_requirement,
              payment_requirement_status,
              payment_arrangement_status,
              proposed_payment_amount::text AS proposed_payment_amount,
              proposed_payment_at
       FROM repair_payment_plans
       WHERE ticket_id = $1
       ORDER BY created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [ticket.id],
    );
    const plan = planResult.rows[0];
    if (!plan) {
      throw new RepairPaymentChoiceError("No approved repair payment plan exists for this ticket.", 409);
    }
    if (plan.collection_status === "COLLECTED") {
      throw new RepairPaymentChoiceError("Payment choices cannot be changed after the repair has been collected.", 409);
    }

    const quoteResult = await client.query<{
      status: string;
      approved_amount: string;
      outstanding_balance: string;
    }>(
      `SELECT q.status,
              q.total::text AS approved_amount,
              b.outstanding_balance::text AS outstanding_balance
       FROM repair_quotes q
       JOIN repair_payment_balances b ON b.quote_id = q.id
       WHERE q.id = $1 AND q.ticket_id = $2`,
      [plan.quote_id, ticket.id],
    );
    const quote = quoteResult.rows[0];
    if (!quote || quote.status !== "APPROVED") {
      throw new RepairPaymentChoiceError("An approved quote is required to select a payment option.", 409);
    }

    if (input.requirement === "DEPOSIT") {
      const amountWithinBalance = await client.query<{ valid: boolean }>(
        "SELECT $1::numeric <= $2::numeric AS valid",
        [depositAmount, quote.outstanding_balance],
      );
      if (!amountWithinBalance.rows[0]?.valid) {
        throw new RepairPaymentChoiceError("Deposit cannot exceed the current outstanding balance.", 400);
      }
    }

    const paymentRequirementStatus: RepairPaymentRequirementStatus = "ACCEPTED";
    const arrangementStatus: RepairPaymentArrangementStatus = "NOT_REQUESTED";

    const sameSelection =
      plan.payment_requirement === input.requirement &&
      plan.payment_requirement_status === paymentRequirementStatus &&
      plan.payment_arrangement_status === arrangementStatus &&
      plan.required_deposit_amount === (depositAmount ?? "0.00") &&
      plan.proposed_payment_amount === null &&
      plan.proposed_payment_at === null;
    if (sameSelection) {
      await client.query("COMMIT");
      transactionOpen = false;
      return { paymentRequirement: input.requirement, paymentRequirementStatus, arrangementStatus };
    }

    await client.query(
      `UPDATE repair_payment_plans
       SET payment_requirement = $2,
           required_deposit_amount = $5,
           payment_requirement_status = $3,
           payment_arrangement_status = $4,
           proposed_payment_amount = NULL,
           proposed_payment_at = NULL,
           arrangement_reviewed_by_admin_user_id = NULL,
           arrangement_reviewed_at = NULL
       WHERE id = $1`,
        [plan.id, input.requirement, paymentRequirementStatus, arrangementStatus, depositAmount ?? "0.00"],
    );

    const customerUpdate = input.requirement === "DEPOSIT"
      ? `Your payment commitment is a deposit of ${depositAmount} toward the approved repair amount.`
      : "Your payment commitment is for the full outstanding approved repair amount.";
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
       ) VALUES ($1, 'CUSTOMER_PAYMENT_REQUIREMENT_SELECTED', $2, $2, $3, NULL, 'CUSTOMER', NULL, NOW())`,
      [ticket.id, ticket.status, customerUpdate],
    );

    await client.query("COMMIT");
    transactionOpen = false;
    return { paymentRequirement: input.requirement, paymentRequirementStatus, arrangementStatus };
  } catch (error) {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original payment-choice error.
      }
    }
    if (error instanceof RepairPaymentChoiceError) {
      throw error;
    }
    throw new RepairPaymentChoicePersistenceError();
  } finally {
    client?.release();
  }
}

export async function submitRepairPaymentForCustomer(input: {
  ticketValue: unknown;
  phoneValue: unknown;
  amount: unknown;
  paymentMethod: unknown;
  referenceNumber: unknown;
  customerMessage: unknown;
}): Promise<{ status: "PENDING_ADMIN_CONFIRMATION"; submittedAt: string }> {
  const trackingInput = normalizeTrackingInput(input.ticketValue, input.phoneValue);
  if (!trackingInput) {
    throw new RepairPaymentSubmissionError("Ticket not found or verification failed.", 404);
  }

  const amount = normalizeProposedPaymentAmount(input.amount);
  const referenceNumber = normalizeCustomerPaymentReference(input.referenceNumber);
  if (typeof input.paymentMethod !== "string" || !repairPaymentMethods.some((method) => method === input.paymentMethod)) {
    throw new RepairPaymentSubmissionError("A valid payment method is required.", 400);
  }
  let customerMessage: string | null = null;
  if (input.customerMessage !== undefined && input.customerMessage !== null) {
    if (typeof input.customerMessage !== "string") {
      throw new RepairPaymentSubmissionError("Payment message must be text.", 400);
    }
    customerMessage = input.customerMessage.trim() || null;
    if (customerMessage && (customerMessage.length > 2000 || /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(customerMessage))) {
      throw new RepairPaymentSubmissionError("Payment message is invalid.", 400);
    }
  }

  let client: PoolClient | undefined;
  let transactionOpen = false;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionOpen = true;

    const ticketResult = await client.query<{ id: string; status: RepairStatus }>(
      `SELECT t.id, t.status
       FROM repair_tickets t
       JOIN repair_customers c ON c.id = t.customer_id
       WHERE t.ticket_number = $1
         AND regexp_replace(c.phone, '[^0-9]', '', 'g') = $2
       FOR UPDATE OF t`,
      [trackingInput.ticketNumber, trackingInput.phoneDigits],
    );
    const ticket = ticketResult.rows[0];
    if (!ticket) {
      throw new RepairPaymentSubmissionError("Ticket not found or verification failed.", 404);
    }
    if (["COMPLETED", "CANCELLED", "REQUEST_RECEIVED", "APPOINTMENT_SCHEDULED", "DEVICE_RECEIVED", "DIAGNOSIS_AND_QUOTE", "AWAITING_CUSTOMER_APPROVAL"].includes(ticket.status)) {
      throw new RepairPaymentSubmissionError("Payment submissions are available after quote approval and before repair completion.", 409);
    }

    const planResult = await client.query<{
      id: string;
      quote_id: string;
      payment_requirement: RepairPaymentRequirement;
      payment_requirement_status: RepairPaymentRequirementStatus;
      collection_status: RepairCollectionStatus;
    }>(
      `SELECT id, quote_id, payment_requirement, payment_requirement_status, collection_status
       FROM repair_payment_plans
       WHERE ticket_id = $1
       ORDER BY created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [ticket.id],
    );
    const plan = planResult.rows[0];
    if (!plan || plan.payment_requirement_status !== "ACCEPTED" || !["FULL_PAYMENT", "DEPOSIT"].includes(plan.payment_requirement)) {
      throw new RepairPaymentSubmissionError("An accepted full-payment or deposit commitment is required.", 409);
    }
    if (plan.collection_status === "COLLECTED") {
      throw new RepairPaymentSubmissionError("Payment cannot be submitted after collection.", 409);
    }

    const quoteResult = await client.query<{ status: string }>(
      "SELECT status FROM repair_quotes WHERE id = $1 AND ticket_id = $2",
      [plan.quote_id, ticket.id],
    );
    if (quoteResult.rows[0]?.status !== "APPROVED") {
      throw new RepairPaymentSubmissionError("An approved quote is required for a payment submission.", 409);
    }

    const balanceResult = await client.query<{ outstanding_balance: string }>(
      `SELECT outstanding_balance::text AS outstanding_balance
       FROM repair_payment_balances
       WHERE payment_plan_id = $1`,
      [plan.id],
    );
    const balance = balanceResult.rows[0]?.outstanding_balance;
    if (balance === undefined) {
      throw new RepairPaymentSubmissionError("Payment balance is unavailable.", 409);
    }

    const pendingResult = await client.query<{ pending_amount: string }>(
      `SELECT COALESCE(SUM(amount), 0)::text AS pending_amount
       FROM repair_payment_submissions
       WHERE payment_plan_id = $1 AND status = 'PENDING_ADMIN_CONFIRMATION'`,
      [plan.id],
    );
    const fitsBalance = await client.query<{ fits: boolean }>(
      "SELECT $1::numeric + $2::numeric <= $3::numeric AS fits",
      [amount, pendingResult.rows[0].pending_amount, balance],
    );
    if (!fitsBalance.rows[0]?.fits) {
      throw new RepairPaymentSubmissionError("Submitted payments cannot exceed the outstanding balance.", 409);
    }

    const submissionResult = await client.query<{ submitted_at: Date }>(
      `INSERT INTO repair_payment_submissions (
         ticket_id, payment_plan_id, amount, payment_method, reference_number, customer_message
       ) VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING submitted_at`,
      [ticket.id, plan.id, amount, input.paymentMethod, referenceNumber, customerMessage],
    );
    await client.query("COMMIT");
    transactionOpen = false;
    return {
      status: "PENDING_ADMIN_CONFIRMATION",
      submittedAt: submissionResult.rows[0].submitted_at.toISOString(),
    };
  } catch (error) {
    if (transactionOpen && client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original submission error.
      }
    }
    if (error instanceof RepairPaymentSubmissionError) {
      throw error;
    }
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      throw new RepairPaymentSubmissionError("That payment reference has already been submitted.", 409);
    }
    throw new RepairPaymentSubmissionPersistenceError();
  } finally {
    client?.release();
  }
}
