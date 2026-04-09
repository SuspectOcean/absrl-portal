import { NextResponse } from "next/server";
import tracks from "@/data/tracks.json";

export async function GET() {
  return NextResponse.json(tracks);
}
