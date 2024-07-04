"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader, { CircleLoader } from "@/helper/loader";
import {
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "@/store/api/orderAPI";
import { CustomError } from "@/types/api-types";
import { Order } from "@/types/types";
import { responseToast } from "@/utils/features";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "../../../globals.css";
const TransactionManagement = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [order, setOrder] = useState<Order>();
  const userData = useSelector((state: any) => state.user.userData);
  const router = useRouter();

  const { data, isLoading, isError, error } = useGetOrderByIdQuery(id);
  useEffect(() => {
    if (data) {
      setOrder(data.order);
    }
  }, [data]);
  if (!isLoading && !data) {
    router.push("/not-found");
  }
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const deleteHandler = async () => {
    const res = await deleteOrder({ orderId: id, userId: userData?._id! });
    responseToast(res, router, "/admin/transaction");
  };
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const updateHandler = async () => {
    const res = await updateOrder({ orderId: id, userId: userData?._id! });
    responseToast(res, router, "/admin/transaction");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      {(isDeleting || isUpdating) && <Loader />}
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <CircleLoader />
        </div>
      ) : (
        data && (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6 max-h-[calc(100vh-41px)] overflow-auto scrollbar-hide">
            <div className="grid gap-4 md:gap-10 items-start">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="font-bold text-3xl">
                    Order #{order?._id.slice(0, 5)}...
                  </h1>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1 text-sm">
                      {order?.status}
                    </Badge>
                    <Button onClick={updateHandler}>Update</Button>
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <DotIcon className="h-4 w-4" />
                          <span className="sr-only">Update order status</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <TruckIcon className="h-4 w-4 mr-2" />
                          Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <PackageIcon className="h-4 w-4 mr-2" />
                          Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XIcon className="h-4 w-4 mr-2" />
                          Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </div>
                <div className="grid gap-4 text-sm leading-loose">
                  <p>
                    Order placed on{" "}
                    <time dateTime="2023-06-23">
                      {order?.createdAt?.split("T")[0]}
                    </time>
                  </p>
                  <p>
                    Order ID: <span className="font-medium">#{order?._id}</span>
                  </p>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] hidden md:table-cell">
                          Image
                        </TableHead>
                        <TableHead className="max-w-[150px]">Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order?.orderItems.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="hidden md:table-cell">
                            <img
                              src={item.photo}
                              width="64"
                              height="64"
                              alt={item.name}
                              className="aspect-square rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>&#8377;{item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Button onClick={deleteHandler}>Delete</Button>
            </div>
            <div className="grid gap-6 md:gap-3 items-start">
              <Card>
                <CardHeader>
                  <CardTitle>Customer</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{order?.userName}</div>
                  </div>
                  <address className="not-italic text-muted-foreground">
                    <div>{order?.shippingInfo.address}</div>
                    <div>
                      {order?.shippingInfo.city}, {order?.shippingInfo.state}{" "}
                      {order?.shippingInfo.pinCode}
                    </div>
                  </address>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>Subtotal</div>
                    <div>&#8377;{order?.subtotal}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Discount</div>
                    <div>-&#8377;{order?.discount}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Shipping</div>
                    <div>&#8377;{order?.shippingCharges}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Tax</div>
                    <div>&#8377;{order?.tax}</div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-medium">
                    <div>Total</div>
                    <div>&#8377;{order?.total}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TransactionManagement;

function DotIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12.1" cy="12.1" r="1" />
    </svg>
  );
}

function PackageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function TruckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
