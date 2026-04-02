import { NextResponse } from "next/server";
import { getFunnels, createFunnel } from "@/lib/store";

export async function GET() {
  const funnels = await getFunnels();
  return NextResponse.json(funnels);
}

export async function POST(req: Request) {
  const data = await req.json();
  const funnel = await createFunnel(data);
  return NextResponse.json(funnel, { status: 201 });
}
