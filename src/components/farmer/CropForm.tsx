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
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Progress } from "../ui/progress";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ required_error: "Price is required." }).min(0, "Price must be non-negative.")
  ),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  category: z.string({ required_error: "Please select a category." }),
  quantity: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ required_error: "Quantity is required." }).min(0, "Quantity cannot be negative.")
  ),
  unit: z.string().min(1, "Unit is required."),
  image: z.any().optional(),
  location: z.string().optional(),
  contact: z.string().optional(),
});


interface CropFormProps {
  crop: Crop | null;
  onFinished: () => void;
  showHeader?: boolean;
}

const categories = ["Vegetable", "Fruit", "Grain", "Berries", "Herbs", "Fungi"];

export function CropForm({ crop, onFinished, showHeader = true }: CropFormProps) {
  const { addCrop, updateCrop, user } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: '' as any,
      description: "",
      category: undefined,
      quantity: '' as any,
      unit: "kg",
      location: "",
      contact: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (crop) {
      form.reset({
        name: crop.name,
        price: crop.price,
        description: crop.description,
        category: crop.category,
        quantity: crop.quantity,
        unit: crop.unit,
        location: crop.location,
        contact: crop.contact,
        image: undefined,
      });
      setImagePreview(crop.image);
      setImageFile(null);
    } else {
        form.reset({
            name: "",
            price: '' as any,
            description: "",
            category: undefined,
            quantity: '' as any,
            unit: "kg",
            location: "",
            contact: "",
            image: undefined,
        });
        setImagePreview(null);
        setImageFile(null);
    }
  }, [crop, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    setIsUploading(true);

    try {
      let imageUrl = crop?.image || '';

      if (imageFile) {
        const storageRef = ref(storage, `crop-images/${user.id}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      } else if (!imageUrl && !crop) {
         imageUrl = "https://placehold.co/600x400.png";
      }
      
      const finalData: Omit<Crop, 'id'> = {
        name: values.name,
        price: values.price,
        description: values.description,
        category: values.category,
        quantity: values.quantity,
        unit: values.unit,
        location: values.location || "",
        contact: values.contact || "",
        image: imageUrl,
        farmerId: user.id
      };

      if (crop) {
        await updateCrop({ ...finalData, id: crop.id });
      } else {
        await addCrop(finalData);
      }
    } catch (error) {
      console.error("Failed to save listing:", error);
    } finally {
      setIsUploading(false);
      onFinished();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue("image", undefined);
  };

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm">
        {showHeader && (
            <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Fill out the form below to list your produce.</CardDescription>
            </CardHeader>
        )}
        <CardContent className={!showHeader ? "pt-6" : ""}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
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
                        <FormControl><Textarea placeholder="Describe your product..." {...field} rows={5} /></FormControl>
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
                        <FormItem className="flex-1">
                          <FormLabel>Price (¢)</FormLabel>
                          <FormControl><Input type="number" step="0.01" placeholder="15.00" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Available</FormLabel>
                          <FormControl><Input type="number" placeholder="50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Unit</FormLabel>
                          <FormControl><Input placeholder="kg" {...field} /></FormControl>
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
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input placeholder="e.g. 024xxxxxxx" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   </div>
                </div>

                <div className="space-y-2">
                   <FormLabel htmlFor="image-upload">Product Image</FormLabel>
                  {imagePreview ? (
                    <div className="relative group">
                       <Image src={imagePreview} alt="Product preview" width={500} height={500} className="rounded-lg object-cover w-full aspect-square" />
                       <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removeImage}>
                         <X className="h-4 w-4" />
                         <span className="sr-only">Remove Image</span>
                       </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                            </div>
                            <FormControl>
                                <Input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" />
                            </FormControl>
                        </label>
                    </div> 
                  )}
                   <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {isUploading && <Progress value={50} className="w-full mt-2" />}
                </div>
              </div>

               <Separator className="my-6" />

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isUploading}>
                {isUploading ? "Saving..." : crop ? "Save Changes" : "Create Listing"}
              </Button>
            </form>
          </Form>
        </CardContent>
    </Card>
  );
}
