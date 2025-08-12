
"use client";

import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Truck, CheckCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

export default function FarmerOrdersPage() {
  const { orders, user, crops, updateOrderStatus } = useAppContext();
  
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

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'default';
      case 'Shipped':
        return 'secondary';
      case 'Pending':
        return 'outline';
      default:
        return 'outline';
    }
  }

  const getStatusBadgeClassName = (status: OrderStatus) => {
     switch (status) {
      case 'Delivered':
        return 'bg-green-700 text-white';
      case 'Shipped':
        return 'bg-blue-600 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-black';
      default:
        return '';
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Received Orders</h1>
        <p className="text-muted-foreground">Manage orders for your products.</p>
      </div>

       {farmerOrders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            You haven't received any orders yet.
          </CardContent>
        </Card>
      ) : (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farmerOrders.map((order) => order && (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.split('-')[1].substring(0,6)}</TableCell>
                  <TableCell>{format(new Date(order.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{order.buyer?.name || 'N/A'}</TableCell>
                  <TableCell>{order.buyer?.contact || 'N/A'}</TableCell>
                   <TableCell className="max-w-[200px] truncate">
                      {order.items.map(item => item.name).join(', ')}
                   </TableCell>
                   <TableCell>${order.total.toFixed(2)}</TableCell>
                   <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className={getStatusBadgeClassName(order.status)}>
                        {order.status}
                      </Badge>
                   </TableCell>
                   <TableCell className="text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Shipped')}>
                            <Truck className="mr-2 h-4 w-4" />
                            Mark as Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Delivered')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Delivered
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
