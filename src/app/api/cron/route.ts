import { NextResponse } from "next/server";
import { runReminderSweep } from "../../../lib/reminders";

export async function POST() {
  const result = await runReminderSweep();
  return NextResponse.json(result);
}
