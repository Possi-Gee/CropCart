"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import type { Crop } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface CropCardProps {
  crop: Crop;
}

export function CropCard({ crop }: CropCardProps) {
  const { addToCart } = useAppContext();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(crop);
    toast({
      title: "Added to cart",
      description: `${crop.name} has been added to your cart.`,
    });
  };

  const dataAiHint = crop.name.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={crop.image}
            alt={crop.name}
            fill
            className="object-cover"
            data-ai-hint={dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-2">
        <CardTitle className="text-lg font-headline">{crop.name}</CardTitle>
        <p className="text-2xl font-bold text-primary">${crop.price.toFixed(2)}</p>
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
  );
}
