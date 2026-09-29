import "server-only";

import { pool } from "@/lib/db";
import { normalizeRepairPhone, RepairInputError } from "./repository";
import {
  repairStatusLabels,
  type RepairStatus,
  type RepairTrackingTicket,
} from "./types";

export class RepairTrackingError extends Error {
  constructor() {
    super("Repair tracking is unavailable.");
    this.name = "RepairTrackingError";
  }
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

export async function getRepairTicketForTracking(
  ticketValue: unknown,
  phoneValue: unknown,
): Promise<RepairTrackingTicket | null> {
  if (typeof ticketValue !== "string") {
    return null;
  }

  const ticketNumber = ticketValue.trim().toUpperCase();
  if (!/^PW-\d{4}-\d{4,}$/.test(ticketNumber)) {
    return null;
  }

  let phoneDigits: string;
  try {
    phoneDigits = normalizeRepairPhone(phoneValue);
  } catch (error) {
    if (error instanceof RepairInputError) {
      return null;
    }
    throw error;
  }

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
    };
  } catch {
    throw new RepairTrackingError();
  }
}
