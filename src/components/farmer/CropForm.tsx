
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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  location: z.string().optional(),
  contact: z.string().optional(),
  imageUrl: z.string().url("If providing a URL, it must be a valid URL.").optional(),
});


interface CropFormProps {
  crop: Crop | null;
  onFinished: () => void;
  showHeader?: boolean;
}

const categories = ["Vegetable", "Fruit", "Grain", "Berries", "Herbs", "Fungi"];

export function CropForm({ crop, onFinished, showHeader = true }: CropFormProps) {
  const { addCrop, updateCrop, user } = useAppContext();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload');

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
      imageUrl: "",
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
        imageUrl: imageInputMethod === 'url' ? crop.image : '',
      });
      setFinalImageUrl(crop.image);
      setImagePreview(crop.image);
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
            imageUrl: "",
        });
        setFinalImageUrl(null);
        setImagePreview(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, form.reset]);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('imageUrl', url);
    if (z.string().url().safeParse(url).success) {
      setFinalImageUrl(url);
      setImagePreview(url);
    } else {
      setFinalImageUrl(null);
      setImagePreview(null);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    setUploadProgress(0);
    setFinalImageUrl(null);

    const storageRef = ref(storage, `crop-images/${user.id}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
        setImagePreview(crop?.image || null);
        setFinalImageUrl(crop?.image || null);
        toast({ title: "Image Upload Failed", description: "Please try uploading the image again.", variant: "destructive" });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFinalImageUrl(downloadURL);
          setIsUploading(false);
          toast({ title: "Image Uploaded", description: "You can now save your listing." });
        });
      }
    );
  };

  const removeImage = () => {
    setFinalImageUrl(null);
    setImagePreview(null);
    form.setValue('imageUrl', '');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    
    let imageUrlToSave = finalImageUrl;
    if (imageInputMethod === 'url') {
      const urlValidation = z.string().url().safeParse(values.imageUrl);
      if (!urlValidation.success) {
        toast({ title: "Invalid URL", description: "Please provide a valid image URL.", variant: "destructive" });
        return;
      }
      imageUrlToSave = values.imageUrl;
    }

    if (!imageUrlToSave) {
       toast({ title: "Missing Image", description: "Please upload an image or provide a valid URL.", variant: "destructive" });
       return;
    }

    setIsSubmitting(true);
    try {
      const { imageUrl, ...restOfValues } = values;
      const finalData: Omit<Crop, 'id'> = {
        ...restOfValues,
        image: imageUrlToSave,
        farmerId: user.id
      };

      if (crop) {
        await updateCrop({ ...finalData, id: crop.id });
        toast({ title: "Listing Updated!", description: "Your product has been successfully updated." });
      } else {
        await addCrop(finalData);
        toast({ title: "Listing Created!", description: "Your new product is now live." });
      }
      onFinished();

    } catch (error) {
      console.error("Failed to save listing:", error);
      toast({ title: "Save Failed", description: "There was a problem saving your listing. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
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
                  <FormLabel>Product Image</FormLabel>
                  <Tabs<string> defaultValue="upload" onValueChange={(value) => setImageInputMethod(value as 'upload' | 'url')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Image</TabsTrigger>
                        <TabsTrigger value="url">Image URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="pt-2">
                         {imagePreview && imageInputMethod === 'upload' ? (
                            <div className="relative group">
                              <Image src={imagePreview} alt="Product preview" width={500} height={500} className="rounded-lg object-cover w-full aspect-square" />
                              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removeImage} disabled={isUploading}>
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
                                        <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" disabled={isUploading} />
                                    </FormControl>
                                </label>
                            </div> 
                          )}
                          {isUploading && <Progress value={uploadProgress} className="w-full mt-2" />}
                    </TabsContent>
                    <TabsContent value="url" className="pt-2 space-y-2">
                         {imagePreview && imageInputMethod === 'url' && (
                            <div className="relative group">
                              <Image src={imagePreview} alt="Product preview" width={500} height={500} className="rounded-lg object-cover w-full aspect-square" />
                               <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removeImage}>
                                 <X className="h-4 w-4" />
                               </Button>
                            </div>
                         )}
                          <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/image.png" {...field} onChange={handleUrlChange} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

               <Separator className="my-6" />

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isUploading || isSubmitting}>
                {isUploading ? "Uploading Image..." : isSubmitting ? "Saving..." : crop ? "Save Changes" : "Create Listing"}
              </Button>
            </form>
          </Form>
        </CardContent>
    </Card>
  );
}

