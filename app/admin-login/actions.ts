
"use server";

import { redirect } from "next/navigation";
import {
  verifyAdminPassword,
  createAdminSession,
} from "@/lib/admin-auth";

export async function loginAdmin(
  formData: FormData,
): Promise<void> {
  const password = formData.get("password");

  if (
    typeof password !== "string" ||
    !verifyAdminPassword(password)
  ) {
    redirect("/admin-login?error=invalid");
  }

  await createAdminSession();
  redirect("/meetings");
}
