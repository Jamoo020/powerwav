import { NextResponse } from "next/server";
import { customerRepairPaymentCommitments } from "@/lib/repairs/types";
import {
  RepairPaymentChoiceError,
  RepairPaymentChoicePersistenceError,
  selectRepairPaymentRequirementForCustomer,
} from "@/lib/repairs/tracking";

function paymentChoiceResponse(payload: unknown, status: number) {
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
    return paymentChoiceResponse({ message: "Request body must be valid JSON." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return paymentChoiceResponse({ message: "Request body must be an object." }, 400);
  }

  const data = body as Record<string, unknown>;
  const allowedFields = ["ticketNumber", "phone", "paymentRequirement", "depositAmount"];
  if (Object.keys(data).some((key) => !allowedFields.includes(key))) {
    return paymentChoiceResponse({ message: "Request contains unsupported fields." }, 400);
  }
  if (typeof data.ticketNumber !== "string" || typeof data.phone !== "string") {
    return paymentChoiceResponse({ message: "Ticket number and phone are required." }, 400);
  }
  const paymentRequirement = typeof data.paymentRequirement === "string"
    ? customerRepairPaymentCommitments.find((requirement) => requirement === data.paymentRequirement)
    : undefined;
  if (paymentRequirement !== "FULL_PAYMENT" && paymentRequirement !== "DEPOSIT") {
    return paymentChoiceResponse({ message: "Choose FULL_PAYMENT or DEPOSIT." }, 400);
  }
  if (
    paymentRequirement !== "DEPOSIT" &&
    data.depositAmount !== undefined
  ) {
    return paymentChoiceResponse({ message: "Deposit amount is only accepted for a deposit choice." }, 400);
  }

  try {
    const result = await selectRepairPaymentRequirementForCustomer({
      ticketValue: data.ticketNumber,
      phoneValue: data.phone,
      requirement: paymentRequirement,
      depositAmount: data.depositAmount,
    });
    return paymentChoiceResponse({ success: true, ...result }, 200);
  } catch (error) {
    if (error instanceof RepairPaymentChoiceError) {
      return paymentChoiceResponse({ success: false, message: error.message }, error.statusCode);
    }
    if (error instanceof RepairPaymentChoicePersistenceError) {
      return paymentChoiceResponse({
        success: false,
        message: "The payment choice is temporarily unavailable. Please try again later.",
      }, 503);
    }
    return paymentChoiceResponse({
      success: false,
      message: "The payment choice is temporarily unavailable. Please try again later.",
    }, 503);
  }
}