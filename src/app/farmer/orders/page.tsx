
"use client";

import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import Image from "next/image";

export default function FarmerOrdersPage() {
  const { orders, user, crops } = useAppContext();
  
  const farmerCrops = user ? crops.filter(c => c.farmerId === user.id) : [];
  
  const farmerOrders = orders.map(order => {
    const itemsForFarmer = order.items.filter(item => farmerCrops.some(crop => crop.id === item.id));
    if (itemsForFarmer.length === 0) return null;
    
    const orderTotalForFarmer = itemsForFarmer.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      ...order,
      items: itemsForFarmer,
      total: orderTotalForFarmer
    };
  }).filter(Boolean);


  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Your Orders</h1>
       {farmerOrders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            You haven't received any orders yet.
          </CardContent>
        </Card>
      ) : (
      <div className="space-y-6">
        {farmerOrders.map((order) => order && (
          <Card key={order.id}>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Order #{order.id.split('-')[1]}</CardTitle>
                <CardDescription>
                  Date: {format(new Date(order.date), "MMMM d, yyyy")}
                </CardDescription>
              </div>
              <div className="text-right">
                 <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} 
                    className={order.status === 'Delivered' ? 'bg-green-700' : ''}>
                    {order.status}
                </Badge>
                 <p className="font-bold text-lg mt-1">${order.total.toFixed(2)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                             <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint={item.name.toLowerCase().split(' ').slice(0, 2).join(' ')}/>
                             {item.name}
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
