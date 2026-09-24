import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const smtpConfigured = Boolean(host && port && user && pass);

  if (!smtpConfigured) {
    return NextResponse.json({ ok: true, smtp: { configured: false } });
  }

  try {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    // nodemailer.verify may throw if connection fails
    await transporter.verify();
    return NextResponse.json({ ok: true, smtp: { configured: true, reachable: true } });
  } catch (err) {
    console.warn("SMTP verify failed", err);
    return NextResponse.json({ ok: true, smtp: { configured: true, reachable: false } });
  }
}
