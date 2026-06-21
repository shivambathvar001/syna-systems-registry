import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      organization, 
      ehr, 
      contactName, 
      contactEmail, 
      denialRate, 
      annualBilling,
      estimatedLeakage,
      estimatedRecovery 
    } = body;

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      console.error("[ERR] Airtable configuration missing in environment variables.");
      return NextResponse.json(
        { error: "Server Configuration Error: Airtable API credentials not set." },
        { status: 500 }
      );
    }

    // Prepare fields mapping for Airtable
    const fields = {
      "Company Name": organization,
      "EHR System": ehr,
      "Contact Name": contactName,
      "Contact Email": contactEmail,
      "Denial Rate": Number(denialRate),
      "Annual Billing (Millions)": Number(annualBilling),
      "Estimated Leakage": Number(estimatedLeakage || 0),
      "Estimated Recovery": Number(estimatedRecovery || 0),
      "Status": "Pilot Intake Request",
      "Source": "Website Pilot Form"
    };

    console.log(`[INFO] Submitting intake for ${organization} to Airtable base ${baseId}...`);

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/Leads`;
    const response = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[ERR] Airtable response failed:", data);
      return NextResponse.json(
        { 
          error: data.error?.message || "Failed to save record to Airtable.", 
          airtableError: data.error 
        },
        { status: response.status }
      );
    }

    console.log(`[OK] Airtable record created successfully:`, data.id);
    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error("[ERR] Unexpected error in pilot API route:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
