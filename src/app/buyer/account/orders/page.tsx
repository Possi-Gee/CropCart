
"use client";

import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";

function formatDate(date: any) {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) {
        return format(date.toDate(), "MMMM d, yyyy");
    }
    if (typeof date === 'string') {
        return format(new Date(date), "MMMM d, yyyy");
    }
     if (typeof date.seconds === 'number') {
        return format(new Date(date.seconds * 1000), "MMMM d, yyyy");
    }
    return 'Invalid Date';
}


export default function OrdersPage() {
  const { orders } = useAppContext();

  return (
    <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/buyer/dashboard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
               <BreadcrumbLink asChild>
                <Link href="/buyer/account">Account</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      <h1 className="text-3xl font-bold font-headline mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              You haven&apos;t placed any orders yet.
            </CardContent>
          </Card>
        )}
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Order #{order.id.substring(0,6)}</CardTitle>
                <CardDescription>
                  Date: {formatDate(order.date)}
                </CardDescription>
              </div>
              <div className="text-right">
                 <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} 
                    className={order.status === 'Delivered' ? 'bg-green-700' : ''}>
                    {order.status}
                </Badge>
                 <p className="font-bold text-lg mt-1">¢{order.total.toFixed(2)}</p>
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
                      <TableCell className="text-right">¢{item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
