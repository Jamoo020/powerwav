import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      expiresAt: session.expiresAt,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 503 });
  }
}
