import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, responses, score } = body;

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Determine recommendation level based on score
    let recommendationLevel = "standard";
    if (score > 12) recommendationLevel = "comprehensive";
    else if (score > 6) recommendationLevel = "targeted";

    const assessmentData = {
      timestamp: new Date().toISOString(),
      email,
      score,
      recommendationLevel,
      responses,
    };

    // Log assessment (integrate with your data store or email service)
    console.log("Room assessment received:", assessmentData);

    // Send confirmation email with results
    // In production, integrate with email service to send personalized PDF report
    return NextResponse.json(
      {
        ok: true,
        message:
          "Assessment complete! We'll send you a detailed report and recommendation within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Assessment API error:", error);
    return NextResponse.json(
      { ok: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
