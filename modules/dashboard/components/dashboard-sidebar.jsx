"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Compass,
  FolderPlus,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  Plus,
  Settings,
  Star,
  Terminal,
  Zap,
  Database,
  FlameIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Icon map
const lucideIconMap = {
  Zap,
  Lightbulb,
  Database,
  Compass,
  FlameIcon,
  Terminal,
  Code2,
};

export function DashboardSidebar({ initialPlaygroundData }) {
  const pathname = usePathname();

  const [playgrounds, setPlaygrounds] = useState(
    initialPlaygroundData || []
  );

  /** ✅ derived starred list */
  const starredPlaygrounds = useMemo(
    () => playgrounds.filter((p) => p.starred),
    [playgrounds]
  );

  /** ⭐ toggle star locally */
  const handleStarToggle = (id) => {
    setPlaygrounds((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, starred: !p.starred } : p
      )
    );
  };

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-center px-4 py-3">
          <Image src="/logo.svg" alt="logo" height={60} width={60} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* MAIN */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* ⭐ STARRED */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Star className="h-4 w-4 mr-2" />
            Starred
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 ? (
                <div className="text-sm text-muted-foreground px-4 py-3">
                  No starred playgrounds
                </div>
              ) : (
                starredPlaygrounds.map((p) => {
                  const Icon = lucideIconMap[p.icon] || Code2;

                  return (
                    <SidebarMenuItem key={p.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${p.id}`}
                      >
                        <Link href={`/playground/${p.id}`}>
                          <Icon className="h-4 w-4" />
                          <span>{p.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 🕒 RECENT */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <History className="h-4 w-4 mr-2" />
            Recent
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {playgrounds.map((p) => {
                const Icon = lucideIconMap[p.icon] || Code2;

                return (
                  <SidebarMenuItem key={p.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/playground/${p.id}`}
                    >
                      <Link href={`/playground/${p.id}`}>
                        <Icon className="h-4 w-4" />
                        <span>{p.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
