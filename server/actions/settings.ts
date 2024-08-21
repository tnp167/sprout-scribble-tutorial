"use server";

import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { revalidatePath } from "next/cache";
const bcrypt = require("bcrypt");

const action = createSafeActionClient();

export const settings = action(SettingsSchema, async (values) => {
  const user = await auth();
  if (!user) {
    return { error: "User not found" };
  }
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.user.id),
  });

  if (!dbUser) {
    return { error: "User not found" };
  }
  if (user.user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordOAuth = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordOAuth) return { error: "Password does not match" };

    const samePassword = await bcrypt.compare(
      values.newPassword,
      dbUser.password
    );
    if (samePassword)
      return { error: "New password is the same as the old password" };

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }
  const updateUser = await db
    .update(users)
    .set({
      twoFactorEnabled: values.isTwoFactorEnabled,
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.image,
    })
    .where(eq(users.id, dbUser.id));
  revalidatePath("/dahboard/settings");
  return { success: "Setting updated" };
});
