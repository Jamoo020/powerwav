import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ ok: true, message: "Logout successful." });
  } catch {
    return NextResponse.json({ ok: false, message: "Authentication service unavailable." }, { status: 503 });
  }
}
