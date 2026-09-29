import { NextResponse } from "next/server";
import { getRepairTicketForTracking, RepairTrackingError } from "@/lib/repairs/tracking";

export const runtime = "nodejs";

const verificationFailed = {
  success: false,
  error: "Ticket not found or verification failed.",
};

function trackingResponse(payload: unknown, status: number) {
  return NextResponse.json(payload, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  try {
    const ticket = await getRepairTicketForTracking(params.get("ticket"), params.get("phone"));
    if (!ticket) {
      return trackingResponse(verificationFailed, 404);
    }

    return trackingResponse({ success: true, ticket }, 200);
  } catch (error) {
    if (error instanceof RepairTrackingError) {
      return trackingResponse(
        { success: false, error: "Repair tracking is temporarily unavailable. Please try again later." },
        503,
      );
    }

    return trackingResponse(
      { success: false, error: "Repair tracking is temporarily unavailable. Please try again later." },
      503,
    );
  }
}