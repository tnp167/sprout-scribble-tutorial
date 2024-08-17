"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";
const action = createSafeActionClient();

export const emailSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "User not found" };
      }

      if (!existingUser!.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser!.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Confirmation Email sent" };
      }

      //2FA

      await signIn("credentials", {
        email,
        password,
        redirect: false,
        // Fix redirect bug
        //redirectTo: "/",
      });

      return { success: "User Signed In!" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "AccessDenied":
            return { error: "Email or password Incorrect" };
          case "OAuthSignInError":
            return { error: error.message };
          case "CredentialsSignin":
            return { error: error.message };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }
  }
);
