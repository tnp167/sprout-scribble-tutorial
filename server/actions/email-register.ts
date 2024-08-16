"use server";

import { createSafeActionClient } from "next-safe-action";
import { RegisterSchema } from "@/types/register-schema";
import bcrypt from "bcrypt";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";

const action = createSafeActionClient();

export const emailRegister = action(
  RegisterSchema,
  async ({ email, name, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const exisitingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (exisitingUser) {
      if (!exisitingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await setVerificationEmail();

        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    //When user is not registered
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);

    await sendVerficationEmail();

    return { success: "Email Confirmation sent" };
  }
);
