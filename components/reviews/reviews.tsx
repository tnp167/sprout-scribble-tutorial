import { db } from "@/server";
import Review from "./review";
import ReviewsForm from "./reviews-form";
import { reviews } from "@/server/schema";
import { desc, eq } from "drizzle-orm";
import ReviewChart from "./review-chart";

export default async function Reviews({ productID }: { productID: number }) {
  const data = await db.query.reviews.findMany({
    with: { user: true },
    where: eq(reviews.productID, productID),
    orderBy: [desc(reviews.created)],
  });
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
      <div className="flex gap-2 lg:gap-12 justify-stretch lg:fle-row flex-col">
        <div className="flex-1">
          <Review reviews={data} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <ReviewsForm />
          <ReviewChart reviews={data} />
        </div>
      </div>
    </section>
  );
}
