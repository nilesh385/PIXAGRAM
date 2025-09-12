"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export function HomePage() {
  const [stats, setStats] = useState({ users: 0, posts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: userCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "user");
      const { count: postCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      setStats({ users: userCount || 0, posts: postCount || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.users}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.posts}</p>
        </CardContent>
      </Card>
    </div>
  );
}
