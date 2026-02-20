"use server";

import { redirect } from "next/navigation";
import { getAdminPassword, setAdminSession } from "../../../lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password !== getAdminPassword()) {
    redirect("/admin/login?error=invalid");
  }

  setAdminSession();
  redirect("/admin");
}
