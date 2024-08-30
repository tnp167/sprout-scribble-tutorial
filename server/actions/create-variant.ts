"use server";

import { createSafeActionClient } from "next-safe-action";
import { VariantSchema } from "@/types/variant-schema";
import { db } from "..";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import algoliasearch from "algoliasearch";
const action = createSafeActionClient();

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

const algoliaIndex = client.initIndex("products");

export const createVariant = action(
  VariantSchema,
  async ({
    color,
    editMode,
    id,
    productID,
    productType,
    tags,
    variantImages: newImages,
  }) => {
    try {
      if (editMode && id) {
        const editVariant = await db
          .update(productVariants)
          .set({
            color,
            productType,
            updated: new Date(),
          })
          .where(eq(productVariants.id, id))
          .returning();
        await db
          .delete(variantTags)
          .where(eq(variantTags.variantID, editVariant[0].id));

        await db.insert(variantTags).values(
          tags.map((tag: string) => ({
            tag,
            variantID: editVariant[0].id,
          }))
        );
        await db
          .delete(variantImages)
          .where(eq(variantImages.variantID, editVariant[0].id));
        await db.insert(variantImages).values(
          newImages.map((img: any, index: number) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: editVariant[0].id,
            order: index,
          }))
        );

        algoliaIndex.partialUpdateObject({
          objectID: editVariant[0].id.toString(),
          id: editVariant[0].productID,
          productType: editVariant[0].productType,
          variantImages: newImages[0].url,
        });

        revalidatePath("/dashboard/products");
        return { success: `Edited ${productType}` };
      }
      if (!editMode) {
        const newVariant = await db
          .insert(productVariants)
          .values({
            color,
            productType,
            productID,
          })
          .returning();

        await db.insert(variantTags).values(
          tags.map((tag: string) => ({
            tag,
            variantID: newVariant[0].id,
          }))
        );
        await db.insert(variantImages).values(
          newImages.map((img: any, index: number) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: newVariant[0].id,
            order: index,
          }))
        );

        const product = await db.query.products.findFirst({
          where: eq(products.id, productID),
        });

        if (product) {
          algoliaIndex.saveObject({
            objectID: newVariant[0].id.toString(),
            id: newVariant[0].productID,
            title: product.title,
            price: product.price,
            productType: newVariant[0].productType,
            variantImages: newImages[0].url,
          });
        }

        revalidatePath("/dashboard/products");
        return { success: `Added ${productType}` };
      }
    } catch (error) {
      return { error: "Failed to create variant" };
    }
  }
);
