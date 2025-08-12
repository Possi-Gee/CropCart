
"use client";

import { useAppContext } from "@/context/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, LogOut, Settings, ShoppingBag, User } from "lucide-react";

export default function AccountPage() {
  const { user, logout } = useAppContext();

  if (!user) {
    return null; 
  }

  const menuItems = [
    { icon: User, text: "Profile", href: "#" },
    { icon: ShoppingBag, text: "My Orders", href: "#" },
    { icon: Settings, text: "Settings", href: "#" },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 font-headline">My Account</h1>
      
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://placehold.co/100x100.png" alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <div className="divide-y">
            {menuItems.map((item) => (
                <div key={item.text} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span>{item.text}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
            ))}
        </div>
      </Card>

      <Button onClick={logout} variant="outline" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
