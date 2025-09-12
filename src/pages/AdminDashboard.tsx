"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-components/AdminSidebar";
import { HomePage } from "@/pages/admin/HomePage";
import { UsersPage } from "@/pages/admin/UserPage";
import { PostsPage } from "@/pages/admin/PostsPage";
import BlockedUsers from "./admin/BlockedUsers";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "users":
        return <UsersPage />;
      case "posts":
        return <PostsPage />;
      case "blockedUsers":
        return <BlockedUsers />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPage={currentPage} onChangePage={setCurrentPage} />
      <main className="flex-1 p-6">{renderPage()}</main>
    </div>
  );
}
