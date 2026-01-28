import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function PlaygroundLayout({
  children,
}) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}
