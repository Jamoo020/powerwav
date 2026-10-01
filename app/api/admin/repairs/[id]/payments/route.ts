import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import {
  confirmRepairPaymentSubmission,
  recordRepairPayment,
  RepairPaymentError,
  RepairPaymentPersistenceError,
} from "@/lib/repairs/repository";

const ticketIdPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!ticketIdPattern.test(id)) {
    return NextResponse.json({ message: "Invalid repair ticket ID." }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  try {
    let result;
    if (payload && typeof payload === "object" && !Array.isArray(payload) && "submissionId" in payload) {
      const data = payload as Record<string, unknown>;
      if (Object.keys(data).length !== 1 || typeof data.submissionId !== "string" || !ticketIdPattern.test(data.submissionId)) {
        return NextResponse.json({ message: "Invalid payment submission ID." }, { status: 400 });
      }
      result = await confirmRepairPaymentSubmission({
        ticketId: id,
        submissionId: data.submissionId,
        adminUserId: session.user.id,
      });
    } else {
      result = await recordRepairPayment({
        ticketId: id,
        adminUserId: session.user.id,
        payload,
      });
    }
    return NextResponse.json(result, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof RepairPaymentError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    if (error instanceof RepairPaymentPersistenceError) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Payment could not be recorded." }, { status: 500 });
  }
}