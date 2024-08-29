"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TotalOrders } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { weeklyChart } from "./weekly-chart";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { monthlyChart } from "./monthly-chart";

export default function Earnings({
  totalOrders,
}: {
  totalOrders: TotalOrders[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "week";

  const chartItems = totalOrders.map((order) => ({
    date: order.order.created!,
    revenue: order.order.total / 100,
  }));

  const activeChart = useMemo(() => {
    const weekly = weeklyChart(chartItems);
    const monthly = monthlyChart(chartItems);
    if (filter === "week") return weekly;
    if (filter === "month") return monthly;
  }, [filter]);

  const activeTotal = useMemo(() => {
    if (filter === "month") {
      return monthlyChart(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    }
    return weeklyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0);
  }, [filter]);

  return (
    <Card className="flex-1 shrink-0">
      <CardHeader>
        <CardTitle>Your Revenue: £{activeTotal}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "week" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() => {
              router.push("/dashboard/analytics/?filter=week", {
                scroll: false,
              });
            }}
          >
            This week
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "month" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() => {
              router.push("/dashboard/analytics/?filter=month", {
                scroll: false,
              });
            }}
          >
            This month
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <BarChart data={activeChart}>
            <Tooltip
              content={(props) => (
                <div>
                  {props.payload?.map((item) => (
                    <div
                      key={item.payload.date}
                      className="bg-primary py-2 px-4 rounded-md shadow-lg"
                    >
                      <p>Revenue: £{item.value}</p>
                      <p>Date: {item.payload.date}</p>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar dataKey="revenue" className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
