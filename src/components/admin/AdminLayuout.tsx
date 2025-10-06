// src/pages/admin/AdminLayout.tsx
import Sidebar from "@/components/admin/AdminSidebar";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* 64px = Header height, adjust if needed */}
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 ">{children}</main>
    </div>
  );
}
