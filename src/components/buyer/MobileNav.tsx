
"use client";

import { Home, LayoutGrid, BarChart, Heart, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/buyer/dashboard", icon: Home, label: "Home" },
    { href: "#", icon: LayoutGrid, label: "Categories" },
    { href: "#", icon: BarChart, label: "Charts" },
    { href: "#", icon: Heart, label: "Wishlist" },
    { href: "#", icon: UserIcon, label: "Account" },
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
