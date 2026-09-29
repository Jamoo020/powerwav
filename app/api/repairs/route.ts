import { NextResponse } from "next/server";
import {
  createRepairTicket,
  RepairInputError,
  RepairPersistenceError,
} from "@/lib/repairs/repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  try {
    const ticket = await createRepairTicket(payload);
    return NextResponse.json(
      { success: true, ticket: { ticketNumber: ticket.ticketNumber } },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof RepairInputError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }

    if (error instanceof RepairPersistenceError) {
      return NextResponse.json(
        { success: false, error: "Repair request could not be saved. Please try again later." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}