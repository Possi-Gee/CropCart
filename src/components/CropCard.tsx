
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import type { Crop } from "@/lib/types";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CropCardProps {
  crop: Crop;
}

export function CropCard({ crop }: CropCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isItemInWishlist } = useAppContext();
  const { toast } = useToast();
  
  const inWishlist = isItemInWishlist(crop.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(crop);
    toast({
      title: "Added to cart",
      description: `${crop.name} has been added to your cart.`,
    });
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(crop.id);
       toast({
        title: "Removed from wishlist",
        description: `${crop.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(crop);
      toast({
        title: "Added to wishlist",
        description: `${crop.name} has been added to your wishlist.`,
      });
    }
  }

  const dataAiHint = crop.name.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <Link href={`/products/${crop.id}`} className="flex">
        <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20 w-full">
        <CardHeader className="p-0 relative">
            <div className="aspect-video relative">
            <Image
                src={crop.image}
                alt={crop.name}
                fill
                className="object-cover"
                data-ai-hint={dataAiHint}
            />
            </div>
            <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 rounded-full h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/75"
            onClick={handleWishlistToggle}
            >
            <Heart className={cn("h-5 w-5", inWishlist ? "text-red-500 fill-current" : "text-white")} />
            <span className="sr-only">Add to wishlist</span>
            </Button>
        </CardHeader>
        <CardContent className="flex-grow p-4 space-y-2">
            <CardTitle className="text-lg font-headline">{crop.name}</CardTitle>
            <p className="text-2xl font-bold text-primary">¢{crop.price.toFixed(2)}</p>
            <CardDescription className="mt-2 text-muted-foreground line-clamp-3">
            {crop.description}
            </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
        </CardFooter>
        </Card>
    </Link>
  );
}
