
"use client";

import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useAppContext();
  const { toast } = useToast();

  const handleAddToCart = (crop: any) => {
    addToCart(crop);
    toast({
      title: "Added to cart",
      description: `${crop.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 font-headline">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground mt-4 mb-4">Your wishlist is empty.</p>
          <p className="text-sm text-muted-foreground mb-4">Add items by clicking the heart icon on a product.</p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/buyer/dashboard">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5 md:w-auto">Product</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlist.map((item) => (
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
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-medium text-primary">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => handleAddToCart(item)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <ShoppingCart className="h-4 w-4 mr-2"/> Add to Cart
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => removeFromWishlist(item.id)} className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove from wishlist</span>
                            </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
