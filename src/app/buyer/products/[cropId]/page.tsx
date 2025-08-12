
"use client";

import { useAppContext } from "@/context/AppContext";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, User, MapPin, Phone, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Crop, User as Farmer } from "@/lib/types";

export default function ProductDetailPage() {
  const { crops, addToCart, farmers } = useAppContext();
  const params = useParams();
  const { toast } = useToast();
  const cropId = Array.isArray(params.cropId) ? params.cropId[0] : params.cropId;
  
  const crop: Crop | undefined = crops.find(c => c.id === cropId);
  const farmer: Farmer | undefined = crop ? farmers.find(f => f.id === crop.farmerId) : undefined;

  if (!crop) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(crop);
    toast({
      title: "Added to cart",
      description: `${crop.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/buyer/dashboard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href={`/buyer/categories/${crop.category.toLowerCase()}`}>{crop.category}</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{crop.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="md:sticky md:top-20 self-start">
                 <Image
                    src={crop.image}
                    alt={crop.name}
                    width={800}
                    height={800}
                    className="rounded-lg object-cover w-full aspect-square"
                    data-ai-hint={crop.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
                />
            </div>
            <div className="space-y-6">
                <div>
                    <Badge variant="secondary">{crop.category}</Badge>
                    <h1 className="text-4xl font-bold font-headline mt-2">{crop.name}</h1>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                    {farmer && (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" /> <span>{farmer.name}</span>
                        </div>
                    )}
                    {crop.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> <span>{crop.location}</span>
                        </div>
                    )}
                     {crop.contact && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" /> <span>{crop.contact}</span>
                        </div>
                    )}
                </div>

                <p className="text-lg">{crop.description}</p>
                
                <Card className="bg-muted/30">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-3xl font-bold text-primary">¢{crop.price.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">/ {crop.unit}</span></p>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                <Package className="h-5 w-5" /> <span>{crop.quantity} available</span>
                            </div>
                        </div>
                        <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
