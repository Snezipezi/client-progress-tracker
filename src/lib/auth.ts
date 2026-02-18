import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "cpt_admin";

export function isAdminAuthenticated() {
  const cookie = cookies().get(ADMIN_COOKIE);
  return cookie?.value === "1";
}

export function requireAdmin() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login");
  }
}

export function setAdminSession() {
  cookies().set({
    name: ADMIN_COOKIE,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
}

export function clearAdminSession() {
  cookies().set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0)
  });
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}
