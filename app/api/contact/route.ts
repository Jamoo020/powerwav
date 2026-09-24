import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Body = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
};

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  const transporter = createTransporter();

  const recipient = process.env.ENQUIRY_RECIPIENT || "info@powerwaveav.com";
  const from = body.email ? `${body.name || "Enquirer"} <${body.email}>` : `no-reply@powerwaveav.com`;
  const subject = `New enquiry from ${body.name || "website"}`;

  const html = `<p><strong>Name:</strong> ${body.name || "-"}</p>
  <p><strong>Company:</strong> ${body.company || "-"}</p>
  <p><strong>Phone:</strong> ${body.phone || "-"}</p>
  <p><strong>Email:</strong> ${body.email || "-"}</p>
  <p><strong>Service:</strong> ${body.service || "-"}</p>
  <p><strong>Message:</strong><br/>${(body.message || "-").replace(/\n/g, "<br/>")}</p>`;

  if (!transporter) {
    return NextResponse.json(
      { ok: false, message: "Contact service is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    await transporter.sendMail({
      from,
      to: recipient,
      subject,
      html,
    });

    return NextResponse.json({ ok: true, message: "Enquiry received. Our team will be in touch shortly." });
  } catch (err) {
    console.error("[contact] send error", err);
    return NextResponse.json({ ok: false, message: "Failed to deliver enquiry." }, { status: 500 });
  }
}
