
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'farmer' ? 'farmer' : 'buyer';
  const { login } = useAppContext();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
             <Link href="/" aria-label="Home">
              <Leaf className="h-10 w-10 text-primary" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-headline">Register as a {role === 'farmer' ? 'Farmer' : 'Buyer'}</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href={`/login?role=${role}`} className="underline text-primary/90 hover:text-primary">
              Login
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
             <Link href={`/register?role=${role === 'farmer' ? 'buyer' : 'farmer'}`} className="underline text-muted-foreground hover:text-primary">
              {role === 'farmer' ? 'Register as a Buyer instead' : 'Register as a Farmer instead'}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    )
}
