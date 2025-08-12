
"use client";

import { useAppContext } from "@/context/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, LogOut, Settings, ShoppingBag, Edit } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  avatarUrl: z.string().url("Please enter a valid URL.").or(z.literal("")),
});


export default function AccountPage() {
  const { user, logout, updateUser } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });
  
  const menuItems = [
    { icon: ShoppingBag, text: "My Orders", href: "/buyer/account/orders" },
    { icon: Settings, text: "Settings", href: "/buyer/account/settings" },
  ];

  if (!user) {
    return null; 
  }

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    updateUser({ ...user, name: values.name, avatarUrl: values.avatarUrl });
    setIsDialogOpen(false);
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 font-headline">My Account</h1>
      
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl || "https://placehold.co/100x100.png"} alt={user.name} data-ai-hint="person portrait" />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-lg">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
          </div>
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                 <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="avatarUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Picture URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <div className="divide-y">
            {menuItems.map((item) => (
              <Link href={item.href} key={item.text}>
                <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span>{item.text}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
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
