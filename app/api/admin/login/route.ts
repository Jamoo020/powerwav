import { NextResponse } from "next/server";
import { createSession, getAdminUserByEmail, verifyPassword } from "@/lib/auth";

const invalidCredentialsMessage = "Invalid email or password.";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const { email, password } = body as { email?: unknown; password?: unknown };
  if (typeof email !== "string" || email.trim() === "" || typeof password !== "string" || password === "") {
    return NextResponse.json({ ok: false, message: "Email and password are required." }, { status: 400 });
  }

  try {
    const user = await getAdminUserByEmail(email);
    const validPassword = user ? await verifyPassword(password, user.passwordHash) : false;

    if (!user || !validPassword) {
      return NextResponse.json({ ok: false, message: invalidCredentialsMessage }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ ok: true, message: "Login successful." });
  } catch {
    return NextResponse.json({ ok: false, message: "Authentication service unavailable." }, { status: 503 });
  }
}
