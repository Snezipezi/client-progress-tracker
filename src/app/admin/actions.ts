"use server";

import { redirect } from "next/navigation";
import crypto from "crypto";
import db from "../../lib/db";

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

export async function addClientAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const startWeight = Number(formData.get("start_weight"));
  const targetWeight = Number(formData.get("target_weight"));

  if (!name || !email) {
    redirect("/admin?error=missing");
  }
  if (phone && !/^[+()0-9\s-]{7,20}$/.test(phone)) {
    redirect("/admin?error=invalid_phone");
  }
  if (
    !Number.isFinite(startWeight) ||
    !Number.isFinite(targetWeight) ||
    startWeight <= 0 ||
    targetWeight <= 0
  ) {
    redirect("/admin?error=invalid_weights");
  }

  const token = generateToken();
  db.prepare(
    "INSERT INTO clients (name, email, phone, start_weight, target_weight, token, active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)"
  ).run(name, email, phone || null, startWeight, targetWeight, token, new Date().toISOString());

  redirect("/admin?added=1");
}

export async function toggleClientAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const active = Number(formData.get("active"));
  db.prepare("UPDATE clients SET active = ? WHERE id = ?").run(active, id);
  redirect("/admin");
}

export async function deleteClientAction(formData: FormData) {
  const id = Number(formData.get("id"));
  db.prepare("DELETE FROM checkins WHERE client_id = ?").run(id);
  db.prepare("DELETE FROM clients WHERE id = ?").run(id);
  redirect("/admin");
}

export async function logoutAction() {
  const { clearAdminSession } = await import("../../lib/auth");
  clearAdminSession();
  redirect("/admin/login");
}
