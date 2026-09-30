import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import {
  createRepairDiagnosis,
  RepairWorkflowError,
  RepairWorkflowPersistenceError,
  validateRepairDiagnosisInput,
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  try {
    const diagnosis = validateRepairDiagnosisInput(body);
    await createRepairDiagnosis({
      ticketId: id,
      ...diagnosis,
      actorAdminUserId: session.user.id,
    });
    return NextResponse.json({ message: "Diagnosis recorded." }, { status: 201 });
  } catch (error) {
    if (error instanceof RepairWorkflowError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    if (error instanceof RepairWorkflowPersistenceError) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Diagnosis could not be recorded." }, { status: 500 });
  }
}