import db from "@/lib/db";
import { sendReminderEmail } from "@/lib/email";

export type ReminderResult = {
  attempted: number;
  sent: number;
  skipped: number;
  configMissing: boolean;
};

type ClientRow = {
  id: number;
  name: string;
  email: string;
  last_activity: string;
  last_reminded_at: string | null;
};

export async function runReminderSweep(): Promise<ReminderResult> {
  const rows = db
    .prepare(
      `
      SELECT
        c.id,
        c.name,
        c.email,
        COALESCE(MAX(ch.date), c.created_at) as last_activity,
        c.last_reminded_at as last_reminded_at
      FROM clients c
      LEFT JOIN checkins ch ON ch.client_id = c.id
      WHERE c.active = 1
      GROUP BY c.id
      HAVING (julianday('now') - julianday(last_activity)) >= 1
        AND (c.last_reminded_at IS NULL OR (julianday('now') - julianday(c.last_reminded_at)) >= 1)
      `
    )
    .all() as ClientRow[];

  let attempted = 0;
  let sent = 0;
  let skipped = 0;
  let configMissing = false;

  for (const client of rows) {
    attempted += 1;
    const result = await sendReminderEmail(client.email, client.name);
    if (!result.ok) {
      configMissing = true;
      skipped += 1;
      continue;
    }

    sent += 1;
    db.prepare("UPDATE clients SET last_reminded_at = ? WHERE id = ?").run(
      new Date().toISOString(),
      client.id
    );
  }

  return { attempted, sent, skipped, configMissing };
}
