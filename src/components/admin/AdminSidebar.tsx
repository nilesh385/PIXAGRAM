// src/components/admin/Sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Home, Users, FileText } from "lucide-react";

export default function AdminSidebar() {
  return (
    <Sidebar className="w-64 border-r h-[calc(100vh-64px)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    {" "}
                    <Home className="h-4 w-4" /> Dashboard{" "}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/users">
                    {" "}
                    <Users className="h-4 w-4" /> Users{" "}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/posts">
                    {" "}
                    <FileText className="h-4 w-4" /> Posts{" "}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
