import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      company,
      email,
      phone,
      vertical,
      projectType,
      roomSize,
      budget,
      timeline,
      details,
    } = body;

    // Validate required fields
    if (!name || !company || !email || !phone || !vertical) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format the quote request data
    const quoteData = {
      timestamp: new Date().toISOString(),
      contact: { name, company, email, phone },
      project: { vertical, type: projectType, roomSize, budget, timeline },
      details,
    };

    // Send email notification (integrate with your email service)
    // Example: sendEmail(email, quoteData) or log to a database
    console.log("Quote request received:", quoteData);

    // For now, return success
    // In production, integrate with email service or CRM
    return NextResponse.json(
      {
        ok: true,
        message:
          "Thank you! We've received your quote request. We'll contact you within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json(
      { ok: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
