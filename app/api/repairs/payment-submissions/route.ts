import { NextResponse } from "next/server";
import { repairPaymentMethods } from "@/lib/repairs/types";
import {
  RepairPaymentSubmissionError,
  RepairPaymentSubmissionPersistenceError,
  submitRepairPaymentForCustomer,
} from "@/lib/repairs/tracking";

function submissionResponse(payload: unknown, status: number) {
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
    return submissionResponse({ message: "Request body must be valid JSON." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return submissionResponse({ message: "Request body must be an object." }, 400);
  }
  const data = body as Record<string, unknown>;
  const allowedFields = ["ticketNumber", "phone", "amount", "paymentMethod", "referenceNumber", "customerMessage"];
  if (Object.keys(data).some((key) => !allowedFields.includes(key))) {
    return submissionResponse({ message: "Request contains unsupported fields." }, 400);
  }
  if (typeof data.ticketNumber !== "string" || typeof data.phone !== "string") {
    return submissionResponse({ message: "Ticket number and phone are required." }, 400);
  }
  if (typeof data.paymentMethod !== "string" || !repairPaymentMethods.some((method) => method === data.paymentMethod)) {
    return submissionResponse({ message: "A valid payment method is required." }, 400);
  }

  try {
    const result = await submitRepairPaymentForCustomer({
      ticketValue: data.ticketNumber,
      phoneValue: data.phone,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      customerMessage: data.customerMessage,
    });
    return submissionResponse({ success: true, ...result }, 201);
  } catch (error) {
    if (error instanceof RepairPaymentSubmissionError) {
      return submissionResponse({ success: false, message: error.message }, error.statusCode);
    }
    if (error instanceof RepairPaymentSubmissionPersistenceError) {
      return submissionResponse({ success: false, message: "Payment submission is temporarily unavailable." }, 503);
    }
    return submissionResponse({ success: false, message: "Payment submission is temporarily unavailable." }, 503);
  }
}