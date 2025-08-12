
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/buyer/MobileNav";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pb-24 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
