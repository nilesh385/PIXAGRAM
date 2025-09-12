import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Users, ImageIcon } from "lucide-react";
import { FaUserAltSlash } from "react-icons/fa";

interface AdminSidebarProps {
  currentPage: string;
  onChangePage: (page: string) => void;
}

export function AdminSidebar({ currentPage, onChangePage }: AdminSidebarProps) {
  const menuItems = [
    { key: "home", label: "Home", icon: Home },
    { key: "users", label: "Users", icon: Users },
    { key: "posts", label: "Posts", icon: ImageIcon },
    { key: "blockedUsers", label: "Blocked Users", icon: FaUserAltSlash },
  ];

  return (
    <Sidebar className="border-r border-gray-200 h-[calc(100vh-5rem)] top-20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onChangePage(item.key)}
                    isActive={currentPage === item.key}
                    className="gap-2"
                  >
                    <item.icon size={18} />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
