
"use client";

import { Home, LayoutGrid, ShoppingCart, Heart, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { cart, wishlist } = useAppContext();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlist.length;

  const navItems = [
    { href: "/buyer/dashboard", icon: Home, label: "Home" },
    { href: "/buyer/categories", icon: LayoutGrid, label: "Categories" },
    { href: "/buyer/cart", icon: ShoppingCart, label: "Cart", badge: cartItemCount > 0 ? cartItemCount : undefined },
    { href: "/buyer/wishlist", icon: Heart, label: "Wishlist", badge: wishlistItemCount > 0 ? wishlistItemCount : undefined },
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
                {item.badge && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
