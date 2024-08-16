"use server";

import { eq } from "drizzle-orm";
import { emailTokens } from "../schema";
import { db } from "..";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const exisitingToken = await getVerificationTokenByEmail(email);

  if (exisitingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, exisitingToken.id));
  }

  const verificationToken = await db.insert(emailTokens).values({
    email,
    token,
    expires,
  });

  return verificationToken;
};
