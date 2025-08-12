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

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  price: z.coerce.number().min(0.01, "Price must be positive."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  image: z.string().url("Must be a valid image URL.").or(z.literal("")),
});

interface CropFormProps {
  crop: Crop | null;
  onFinished: () => void;
}

export function CropForm({ crop, onFinished }: CropFormProps) {
  const { addCrop, updateCrop } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: crop?.name ?? "",
      price: crop?.price ?? 0,
      description: crop?.description ?? "",
      image: crop?.image ?? "https://placehold.co/600x400.png",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop Name</FormLabel>
              <FormControl><Input placeholder="e.g. Organic Tomatoes" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
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
              <FormControl><Textarea placeholder="Describe your crop..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">{crop ? "Save Changes" : "Add Crop"}</Button>
      </form>
    </Form>
  );
}
