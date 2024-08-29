import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server";
import { orderProduct } from "@/server/schema";
import { desc } from "drizzle-orm";
import Sales from "./sales";

export default async function Analytcs() {
  const totalOrders = await db.query.orderProduct.findMany({
    orderBy: [desc(orderProduct.id)],
    limit: 10,
    with: {
      order: {
        with: {
          user: true,
        },
      },
      product: true,
      productVariants: {
        with: {
          variantImages: true,
        },
      },
    },
  });
  if (totalOrders.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    );

  if (totalOrders)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Sales totalOrders={totalOrders} />
        </CardContent>
      </Card>
    );
}
