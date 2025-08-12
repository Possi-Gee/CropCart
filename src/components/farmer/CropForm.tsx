
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";
import type { Crop } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  price: z.coerce.number().min(0.01, "Price must be positive."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  category: z.string({required_error: "Please select a category."}),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative."),
  unit: z.string().min(1, "Unit is required."),
  image: z.string().url("Must be a valid image URL.").or(z.literal("")),
  location: z.string().optional(),
  contact: z.string().optional(),
});

interface CropFormProps {
  crop: Crop | null;
  onFinished: () => void;
}

const categories = ["Vegetable", "Fruit", "Grain", "Berries", "Herbs", "Fungi"];

export function CropForm({ crop, onFinished }: CropFormProps) {
  const { addCrop, updateCrop } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: crop?.name ?? "",
      price: crop?.price ?? 0,
      description: crop?.description ?? "",
      category: crop?.category ?? undefined,
      quantity: crop?.quantity ?? 0,
      unit: crop?.unit ?? "",
      image: crop?.image ?? "https://placehold.co/600x400.png",
      location: crop?.location ?? "",
      contact: crop?.contact ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalValues = {
        ...values,
        image: values.image || "https://placehold.co/600x400.png"
    }

    if (crop) {
      updateCrop({ ...crop, ...finalValues });
    } else {
      addCrop(finalValues);
    }
    onFinished();
  }

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Fill out the form below to list your produce.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl><Input placeholder="e.g. Organic Tomatoes" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Describe your product..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (GHC)</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Quantity</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl><Input placeholder="e.g. kg, bunch" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <Separator />

               <div className="grid md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input placeholder="e.g. Accra" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telephone Number</FormLabel>
                      <FormControl><Input placeholder="e.g. 024xxxxxxx" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               </div>
               
               <Separator />

                <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />


              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{crop ? "Save Changes" : "Create Listing"}</Button>
            </form>
          </Form>
        </CardContent>
    </Card>
  );
}
