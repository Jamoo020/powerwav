import { NextResponse } from "next/server";
import {
  decideRepairQuoteForCustomer,
  RepairQuoteDecisionError,
  RepairQuoteDecisionPersistenceError,
} from "@/lib/repairs/tracking";

function decisionResponse(payload: unknown, status: number) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return decisionResponse({ message: "Request body must be valid JSON." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return decisionResponse({ message: "Request body must be an object." }, 400);
  }

  const data = body as Record<string, unknown>;
  if (Object.keys(data).some((key) => !["ticketNumber", "phone", "action"].includes(key))) {
    return decisionResponse({ message: "Request contains unsupported fields." }, 400);
  }
  if (typeof data.ticketNumber !== "string" || typeof data.phone !== "string") {
    return decisionResponse({ message: "Ticket number and phone are required." }, 400);
  }
  if (data.action !== "APPROVE" && data.action !== "REJECT") {
    return decisionResponse({ message: "Action must be APPROVE or REJECT." }, 400);
  }

  try {
    const result = await decideRepairQuoteForCustomer({
      ticketValue: data.ticketNumber,
      phoneValue: data.phone,
      action: data.action,
    });
    return decisionResponse({ success: true, ...result }, 200);
  } catch (error) {
    if (error instanceof RepairQuoteDecisionError) {
      return decisionResponse({ success: false, message: error.message }, error.statusCode);
    }
    if (error instanceof RepairQuoteDecisionPersistenceError) {
      return decisionResponse({
        success: false,
        message: "The quote decision is temporarily unavailable. Please try again later.",
      }, 503);
    }
    return decisionResponse({
      success: false,
      message: "The quote decision is temporarily unavailable. Please try again later.",
    }, 503);
  }
}