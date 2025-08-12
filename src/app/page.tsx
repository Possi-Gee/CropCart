import { Button } from "@/components/ui/button";
import { Leaf, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 text-center">
        <div className="flex items-center gap-4">
            <Leaf className="h-16 w-16 text-primary" />
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl font-headline">
            CropConnect
            </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          The freshest link between local farmers and your table. Discover, purchase, and support sustainable agriculture.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/login?role=farmer">
              <Leaf className="mr-2 h-5 w-5" />
              I'm a Farmer
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/login?role=buyer">
              <ShoppingCart className="mr-2 h-5 w-5" />
              I'm a Buyer
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
