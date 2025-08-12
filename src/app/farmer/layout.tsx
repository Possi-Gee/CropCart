"use client";

import { Header } from "@/components/Header";
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Blocks, Sprout, Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
             <Link href="/" className="flex items-center gap-2 font-bold text-lg p-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-headline">CropCart</span>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/farmer/dashboard'} tooltip="Dashboard">
                <Link href="/farmer/dashboard">
                  <Blocks />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/farmer/ai-tips'} tooltip="AI Farming Tips">
                <Link href="/farmer/ai-tips">
                  <Sprout />
                  <span>AI Farming Tips</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
