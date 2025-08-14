
"use client";

import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CreditCard, Bot, Smartphone, Truck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder, user, loading } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    if (!loading && cart.length === 0) {
      router.replace("/buyer/cart");
    }
  }, [cart, loading, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      await placeOrder();
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. You can view your order in your account.",
      });
      router.push("/buyer/account/orders");
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <p className="text-muted-foreground mt-2">Redirecting you to the cart page...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 font-headline">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Accra" required />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>All transactions are secure and encrypted.</CardDescription>
            </CardHeader>
            <CardContent>
               <Tabs defaultValue="card" className="w-full" onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4" />Card</TabsTrigger>
                  <TabsTrigger value="mobile"><Smartphone className="mr-2 h-4 w-4" />Mobile</TabsTrigger>
                  <TabsTrigger value="delivery"><Truck className="mr-2 h-4 w-4" />On Delivery</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="pt-4">
                   <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="**** **** **** 1234" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry-date">Expiry Date</Label>
                          <Input id="expiry-date" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                   </div>
                </TabsContent>
                <TabsContent value="mobile" className="pt-4">
                   <div className="space-y-4">
                      <RadioGroup defaultValue="mtn">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mtn" id="mtn" />
                          <Label htmlFor="mtn">MTN Mobile Money</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vodafone" id="vodafone" />
                          <Label htmlFor="vodafone">Vodafone Cash</Label>
                        </div>
                      </RadioGroup>
                      <div className="space-y-2">
                        <Label htmlFor="mobile-number">Phone Number</Label>
                        <Input id="mobile-number" placeholder="024 123 4567" />
                      </div>
                   </div>
                </TabsContent>
                 <TabsContent value="delivery" className="pt-4">
                   <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
                     You will pay the courier in cash or with mobile money when your order arrives.
                   </div>
                </TabsContent>
              </Tabs>
               <div className="flex items-start space-x-3 rounded-md border border-dashed p-4 mt-6">
                  <Bot className="h-6 w-6 text-primary mt-1"/>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">This is a simulated payment.</p>
                    <p>No real transaction will occur. For Card/Mobile methods, you can use any dummy data to complete the checkout.</p>
                  </div>
                 </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:sticky lg:top-20">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md" data-ai-hint={item.name.toLowerCase().split(' ').slice(0, 2).join(' ')}/>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">¢{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-4">
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>¢{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>¢{cartTotal.toFixed(2)}</span>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Processing..." : `Place Order (¢${cartTotal.toFixed(2)})`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
