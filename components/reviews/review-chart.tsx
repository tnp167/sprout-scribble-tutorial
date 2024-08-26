"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReviewWithUser } from "@/lib/infer-type";
import { getReviewAverage } from "@/server/actions/reviews-average";
import Stars from "./stars";
import { useMemo } from "react";
import { Progress } from "../ui/progress";

export default function ReviewChart({
  reviews,
}: {
  reviews: ReviewWithUser[];
}) {
  const getRatingByStars = useMemo(() => {
    const ratingValues = new Array(5).fill(0);
    const totalReviews = reviews.length;

    reviews.forEach((review) => {
      const starIndex = review.rating - 1;
      if (starIndex >= 0 && starIndex < 5) {
        ratingValues[starIndex]++;
      }
    });
    return ratingValues.map((rating) => (rating / totalReviews) * 100);
  }, [reviews]);

  const totalRating = getReviewAverage(reviews.map((r) => r.rating));
  return (
    <Card className="flex flex-col p-8 rounded-md gap-5">
      <div className="flex flex-col gap-2">
        <CardTitle>Product Rating</CardTitle>
        <Stars size={18} totalReviews={reviews.length} rating={totalRating} />
        <CardDescription className="text-lg font-medium">
          {totalRating.toFixed(1)} stars
        </CardDescription>
      </div>
      {getRatingByStars.map((rating, index) => (
        <div key={index} className="flex gap-2 justify-between items-center">
          <p className="textxs font-medium flex gap-1">
            {index + 1}
            <span>stars</span>
          </p>
          <Progress value={rating} />
        </div>
      ))}
    </Card>
  );
}
