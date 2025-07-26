import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { FileTextIcon, HomeIcon, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const items = [
    {
      name: "Users",
      path: "/admin/users",
      icon: <User2Icon className="size-5" />,
    },
    {
      name: "Posts",
      path: "/admin/posts",
      icon: <FileTextIcon className="size-5" />,
    },
  ];
  const { pathname } = useLocation();
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <HomeIcon className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold">Dashboard</span>
          <span className="text-xs">Admin Panel</span>
        </div>
      </div>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{""}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.path}
                    >
                      <Link to={item.path}>
                        {item.icon}
                        {item.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}
