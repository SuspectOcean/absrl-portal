import { NextResponse } from "next/server";
import { isSheetsModeActive } from "@/lib/data-layer";

export async function GET() {
  const sheetsActive = await isSheetsModeActive();
  return NextResponse.json({
    mode: sheetsActive ? "google-sheets" : "json-fallback",
    sheetsConfigured: !!(
      process.env.GOOGLE_SHEETS_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
    ),
    sheetsConnected: sheetsActive,
  });
}
