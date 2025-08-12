
"use client";

import { Header } from "@/components/Header";
import { MobileNav } from "@/components/farmer/MobileNav";
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  useSidebar
} from "@/components/ui/sidebar";
import { Blocks, Sprout, Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

function SidebarBrand() {
  const { open } = useSidebar();
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-lg p-2">
      <Leaf className="h-6 w-6 text-primary" />
      <span className={`font-headline ${!open && "hidden"}`}>CropCart</span>
    </Link>
  )
}

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/farmer/dashboard", icon: Blocks, label: "Dashboard", isActive: pathname === '/farmer/dashboard' },
    { href: "/farmer/ai-tips", icon: Sprout, label: "AI Farming Tips", isActive: pathname === '/farmer/ai-tips' },
  ];

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarBrand />
          </SidebarHeader>
          <SidebarMenu>
            {navItems.map((item) => (
               <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pb-24 md:pb-8">
            {children}
          </main>
          <MobileNav />
        </SidebarInset>
    </SidebarProvider>
  );
}
