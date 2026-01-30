"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect, RedirectType } from "next/navigation";

// Redirects the user to relevant portal like /user /admin /customRole ect
export const redirectToRoleHome = async () => {
  const currentSession = await auth.api.getSession({
    headers: await headers(),
  });
  if (!currentSession) return redirect("/", RedirectType.replace);
  if (!currentSession.user?.role) return redirect("/", RedirectType.replace);

  return redirect(`/${currentSession.user.role}`, RedirectType.replace);
};
