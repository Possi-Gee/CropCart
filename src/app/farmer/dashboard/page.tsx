
"use client";

import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Eye, PlusCircle } from "lucide-react";
import Link from "next/link";

const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: React.ElementType, description: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);


export default function FarmerDashboard() {
  const { orders, crops, user } = useAppContext();
  const farmerCrops = user ? crops.filter(c => c.farmerId === user.id) : [];

  const totalRevenue = orders.reduce((acc, order) => {
    const farmerItems = order.items.filter(item => farmerCrops.some(crop => crop.id === item.id));
    const orderRevenue = farmerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return acc + orderRevenue;
  }, 0);

  const totalOrders = orders.filter(order => order.items.some(item => farmerCrops.some(crop => crop.id === item.id))).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
         <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/farmer/listings">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Listing
            </Link>
          </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard 
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description="From all completed sales."
        />
        <StatCard 
          title="Total Orders"
          value={totalOrders}
          icon={Package}
          description="Number of orders received."
        />
        <StatCard 
          title="Total Views"
          value="7"
          icon={Eye}
          description="Views across all your listings."
        />
      </div>

       <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No recent activity to show.
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
