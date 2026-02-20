"use server";

import db from "../../../lib/db";
import { redirect } from "next/navigation";

export async function submitCheckinAction(formData: FormData) {
  const token = String(formData.get("token") || "");
  const weight = Number(formData.get("weight"));
  const water = Number(formData.get("water"));
  const protein = Number(formData.get("protein"));

  const client = db
    .prepare("SELECT id, active FROM clients WHERE token = ?")
    .get(token) as { id: number; active: number } | undefined;

  if (!client || !client.active) {
    redirect(`/c/${token}?error=inactive`);
  }

  const date = new Date().toISOString().slice(0, 10);

  const existing = db
    .prepare("SELECT id FROM checkins WHERE client_id = ? AND date = ?")
    .get(client.id, date) as { id: number } | undefined;

  if (existing) {
    db.prepare(
      "UPDATE checkins SET weight = ?, water = ?, protein = ?, created_at = ? WHERE id = ?"
    ).run(weight, water, protein, new Date().toISOString(), existing.id);
  } else {
    db.prepare(
      "INSERT INTO checkins (client_id, date, weight, water, protein, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(client.id, date, weight, water, protein, new Date().toISOString());
  }

  redirect(`/c/${token}?submitted=1`);
}
