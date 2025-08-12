
"use client";

import { Header } from "@/components/Header";
import { MobileNav } from "@/components/buyer/MobileNav";
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
import { Home, LayoutGrid, ShoppingCart, Heart, User as UserIcon, Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useAppContext } from "@/context/AppContext";

function SidebarBrand() {
  const { open } = useSidebar();
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-lg p-2">
      <Leaf className="h-6 w-6 text-primary" />
      <span className={`font-headline ${!open && "hidden"}`}>CropCart</span>
    </Link>
  )
}


export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { cart, wishlist } = useAppContext();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlist.length;

   const navItems = [
    { href: "/buyer/dashboard", icon: Home, label: "Home", isActive: pathname === '/buyer/dashboard'},
    { href: "/buyer/categories", icon: LayoutGrid, label: "Categories", isActive: pathname.startsWith('/buyer/categories') },
    { href: "/buyer/cart", icon: ShoppingCart, label: "Cart", badge: cartItemCount > 0 ? cartItemCount : undefined, isActive: pathname === '/buyer/cart' },
    { href: "/buyer/wishlist", icon: Heart, label: "Wishlist", badge: wishlistItemCount > 0 ? wishlistItemCount : undefined, isActive: pathname === '/buyer/wishlist' },
    { href: "/buyer/account", icon: UserIcon, label: "Account", isActive: pathname === '/buyer/account' },
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
                     {item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
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
