
"use client";

import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2, Edit, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Crop } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CropForm } from "@/components/farmer/CropForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FarmerListingsPage() {
  const { crops, user, deleteCrop } = useAppContext();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const farmerCrops = user ? crops.filter(c => c.farmerId === user.id) : [];

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setIsDialogOpen(true);
  }
  
  const handleDialogClose = () => {
    // Timeout to allow dialog animation to finish
    setTimeout(() => {
      setEditingCrop(null);
    }, 200);
    setIsDialogOpen(false);
  }

  const handleView = (cropId: string) => {
    window.open(`/buyer/products/${cropId}`, '_blank');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">My Crop Listings</h1>
         <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/farmer/listings/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Crop
            </Link>
          </Button>
      </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
             <CropForm crop={editingCrop} onFinished={handleDialogClose} />
          </DialogContent>
        </Dialog>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden md:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farmerCrops.length > 0 ? farmerCrops.map(crop => (
                <TableRow key={crop.id}>
                  <TableCell className="hidden md:table-cell">
                    <Image src={crop.image} alt={crop.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={crop.name.toLowerCase().split(' ').slice(0, 2).join(' ')} />
                  </TableCell>
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell>¢{crop.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{crop.quantity} {crop.unit}</TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => handleView(crop.id)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(crop)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteCrop(crop.id)} className="text-destructive focus:text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No crops listed yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
