
"use client";

import { LayoutGrid, List, Package, Sprout, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/farmer/dashboard", icon: LayoutGrid, label: "Overview" },
    { href: "/farmer/listings", icon: List, label: "Listings" },
    { href: "/farmer/listings/add", icon: PlusCircle, label: "Add" },
    { href: "/farmer/orders", icon: Package, label: "Orders" },
    { href: "/farmer/ai-tips", icon: Sprout, label: "AI Tips" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = (pathname === item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
