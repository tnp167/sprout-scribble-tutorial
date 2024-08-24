import getPosts from "@/server/actions/get-posts";
import Image from "next/image";
import { db } from "@/server";
import Products from "@/components/products/products";

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  return (
    <main>
      <Products variants={data} />
    </main>
  );
}
