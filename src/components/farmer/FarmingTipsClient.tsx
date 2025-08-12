"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sprout } from 'lucide-react';
import type { FarmingTipsInput, FarmingTipsOutput } from '@/ai/flows/farming-tips';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  cropType: z.string().min(2, { message: 'Crop type is required.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
});

interface FarmingTipsClientProps {
  getFarmingTips: (input: FarmingTipsInput) => Promise<FarmingTipsOutput>;
}

export function FarmingTipsClient({ getFarmingTips }: FarmingTipsClientProps) {
  const [tips, setTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { cropType: '', location: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setTips(null);
    try {
      const result = await getFarmingTips(values);
      setTips(result.tips);
    } catch (err) {
      setError('Failed to get farming tips. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">AI Farming Tips</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Get Advice</CardTitle>
            <CardDescription>Enter a crop and location to receive tailored farming tips from our AI advisor.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type</FormLabel>
                      <FormControl><Input placeholder="e.g., Wheat" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input placeholder="e.g., Central Valley, California" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {isLoading ? 'Getting Tips...' : 'Get Farming Tips'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col min-h-[360px]">
          <CardHeader>
            <CardTitle>Your AI-Generated Tips</CardTitle>
            <CardDescription>Advice will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {tips && <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">{tips}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
