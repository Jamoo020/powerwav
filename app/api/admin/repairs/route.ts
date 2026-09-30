import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { listAdminRepairTickets } from "@/lib/repairs/repository";
import { repairStatusOrder, type RepairStatus } from "@/lib/repairs/types";

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const statusValue = url.searchParams.get("status")?.trim();
  if (statusValue && !repairStatusOrder.some((status) => status === statusValue)) {
    return NextResponse.json({ message: "Invalid repair status." }, { status: 400 });
  }

  const search = url.searchParams.get("search")?.trim().slice(0, 200) ?? "";

  try {
    const result = await listAdminRepairTickets({
      status: statusValue as RepairStatus | undefined,
      search,
    });
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Repair data is currently unavailable." }, { status: 500 });
  }
}