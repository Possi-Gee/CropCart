"use client";

import { useAppContext } from "@/context/AppContext";
import { CropCard } from "@/components/CropCard";
import { notFound, useParams } from "next/navigation";
import { useMemo } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function CategoryPage() {
  const { crops } = useAppContext();
  const params = useParams();
  const categoryName = Array.isArray(params.categoryName) ? params.categoryName[0] : params.categoryName;

  const categoryCrops = useMemo(() => {
    return crops.filter(crop => crop.category.toLowerCase() === categoryName.toLowerCase());
  }, [crops, categoryName]);
  
  if (categoryCrops.length === 0) {
    // This is a simple check. In a real app, you might want a more robust way
    // to know if a category is valid but just has no products.
    const allCategories = Array.from(new Set(crops.map(c => c.category.toLowerCase())));
    if (!allCategories.includes(categoryName.toLowerCase())) {
        notFound();
    }
  }
  
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div>
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
                <Link href="/buyer/categories">Categories</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{formattedCategoryName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">{formattedCategoryName}</h1>
      
      {categoryCrops.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No crops found in this category.</p>
        </div>
      )}
    </div>
  );
}
