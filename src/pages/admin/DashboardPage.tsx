"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useAdminStats } from "@/hooks/useAdminStats";
import AdminLayout from "@/components/admin/AdminLayuout";

export default function AdminHome() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const { data, isLoading } = useAdminStats(period);

  if (isLoading) return <p>Loading stats...</p>;
  if (!data) return <p>No stats available.</p>;

  // Prepare chart data
  const chartData = [
    { name: "Users", count: data.users.length },
    { name: "Posts", count: data.posts.length },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Admin Dashboard</CardTitle>
            <div className="space-x-2">
              <Button
                onClick={() => setPeriod("week")}
                variant={period === "week" ? "default" : "outline"}
              >
                Week
              </Button>
              <Button
                onClick={() => setPeriod("month")}
                variant={period === "month" ? "default" : "outline"}
              >
                Month
              </Button>
              <Button
                onClick={() => setPeriod("year")}
                variant={period === "year" ? "default" : "outline"}
              >
                Year
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={chartData}>
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
