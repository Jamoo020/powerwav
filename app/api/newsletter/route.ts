import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    ok: true,
    message: "Thanks for subscribing. We will be in touch with relevant updates.",
    received: body,
  });
}
