import { NextResponse } from "next/server";
import { generateIntentPlan } from "@deconcierge/services";

const MAX_INTENT_LENGTH = 512;

const sanitizeIntent = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_INTENT_LENGTH);
};

export async function GET() {
  const plan = generateIntentPlan();
  return NextResponse.json(plan);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const intent = sanitizeIntent((payload as { intent?: unknown })?.intent);
  const plan = generateIntentPlan(intent);
  return NextResponse.json(plan);
}

