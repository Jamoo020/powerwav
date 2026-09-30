import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import {
  RepairStatusTransitionError,
  RepairStatusTransitionPersistenceError,
  transitionRepairStatus,
} from "@/lib/repairs/repository";
import { isRepairStatus } from "@/lib/repairs/types";

const ticketIdPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const disallowedCustomerUpdateCharacters = /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const maximumCustomerUpdateLength = 2000;

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400, headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { id } = await context.params;
  if (!ticketIdPattern.test(id)) {
    return badRequest("Invalid repair ticket ID.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return badRequest("Request body must be an object.");
  }

  const data = body as Record<string, unknown>;
  if (Object.keys(data).some((key) => key !== "status" && key !== "customerUpdate")) {
    return badRequest("Request contains unsupported fields.");
  }
  if (!isRepairStatus(data.status)) {
    return badRequest("A valid repair status is required.");
  }
  if (typeof data.customerUpdate !== "string") {
    return badRequest("A customer-facing update is required.");
  }

  const customerUpdate = data.customerUpdate.trim();
  if (!customerUpdate) {
    return badRequest("A customer-facing update is required.");
  }
  if (customerUpdate.length > maximumCustomerUpdateLength) {
    return badRequest(`Customer update must be ${maximumCustomerUpdateLength} characters or fewer.`);
  }
  if (disallowedCustomerUpdateCharacters.test(customerUpdate)) {
    return badRequest("Customer update must be plain text without markup or control characters.");
  }

  try {
    const result = await transitionRepairStatus({
      ticketId: id,
      status: data.status,
      customerUpdate,
      actorAdminUserId: session.user.id,
    });
    return NextResponse.json(result, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof RepairStatusTransitionError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (error instanceof RepairStatusTransitionPersistenceError) {
      return NextResponse.json(
        { message: error.message },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { message: "Repair status could not be updated." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}