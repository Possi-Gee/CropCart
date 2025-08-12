"use client";

import { useAppContext } from "@/context/AppContext";
import { CropCard } from "@/components/CropCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function BuyerDashboard() {
  const { crops } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Explore Fresh Produce</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for crops..." 
            className="pl-10 max-w-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredCrops.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No crops found matching your search.</p>
        </div>
      )}
    </div>
  );
}
