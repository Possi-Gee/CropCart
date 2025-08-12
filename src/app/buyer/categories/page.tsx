
"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Leaf, Apple, Wheat, Carrot, Grape, Bot, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const { crops } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Array.from(new Set(crops.map(crop => crop.category)))
    .filter(Boolean) 
    .map(category => ({
      name: category,
      count: crops.filter(c => c.category === category).length
    }));

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'vegetable':
        return <Carrot className="h-10 w-10 text-primary" />;
      case 'fruit':
        return <Apple className="h-10 w-10 text-primary" />;
      case 'grain':
        return <Wheat className="h-10 w-10 text-primary" />;
      case 'berries':
        return <Grape className="h-10 w-10 text-primary" />;
      case 'herbs':
        return <Leaf className="h-10 w-10 text-primary" />;
      case 'fungi':
        return <Bot className="h-10 w-10 text-primary" />;
      default:
        return <MoreVertical className="h-10 w-10 text-primary" />;
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Shop by Category</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for categories..." 
            className="pl-10 max-w-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCategories.map((category) => (
            <Link key={category.name} href={`/buyer/categories/${category.name.toLowerCase()}`}>
              <Card className="flex flex-col items-center justify-center p-6 text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20 aspect-square">
                {getCategoryIcon(category.name)}
                <CardHeader>
                  <CardTitle className="text-lg font-headline">{category.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}
    </div>
  );
}
