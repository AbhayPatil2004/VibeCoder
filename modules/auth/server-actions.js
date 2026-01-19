"use server"; // MUST be the very first line
// export const runtime = "nodejs";

import { signIn } from "@/auth";

// MUST be exported exactly like this
export async function signInWithGoogle() {
  await signIn("google");
}

export async function signInWithGithub() {
  await signIn("github");
}
