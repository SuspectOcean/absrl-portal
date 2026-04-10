import { NextResponse } from "next/server";
import { getTracks } from "@/lib/data-layer";

export async function GET() {
  try {
    const tracks = await getTracks();
    return NextResponse.json(tracks);
  } catch {
    const data = await import("@/data/tracks.json");
    return NextResponse.json(data.default || data);
  }
}
