"use server";
import { createSafeActionClient } from "next-safe-action";
import * as z from "zod";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "..";

const action = createSafeActionClient();

export const deleteVariant = action(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath("/dashboard/products");
      return { success: `Delete ${deletedVariant[0].productType}` };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  }
);
