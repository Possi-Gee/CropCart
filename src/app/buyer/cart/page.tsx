
"use client";

import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, placeOrder } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      await placeOrder();
      toast({
        title: "Order Placed!",
        description: "Thank you for your purchase. Your order is being processed.",
      });
    } catch (error) {
       toast({
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 font-headline">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/buyer/dashboard">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-2/5 md:w-auto">Product</TableHead>
                      <TableHead className="hidden md:table-cell">Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="rounded-md object-cover hidden sm:block"
                              data-ai-hint={item.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{item.name}</span>
                              <Button variant="link" size="sm" className="text-destructive h-auto p-0 justify-start" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">¢{item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value, 10))}
                            className="w-20"
                            aria-label={`Quantity for ${item.name}`}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">¢{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="lg:sticky lg:top-20">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <Button onClick={handlePlaceOrder} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
