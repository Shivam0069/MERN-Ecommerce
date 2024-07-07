"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/helper/loader";
import { Order, OrderItem } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetail({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const [order, setOrder] = useState<Order>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const getOrderDetail = async () => {
      setIsLoading(true);
      try {
        const res = await axios(`/api/order/${id}`);
        console.log(res.data, "order");

        setOrder(res.data.order);
      } catch (error) {
        console.log(error, "orderDetailError");
      } finally {
        setIsLoading(false);
      }
    };
    getOrderDetail();
  }, []);
  useEffect(() => {
    console.log(order, "orderDetail");
  }, [order]);
  return isLoading ? (
    <Loader />
  ) : (
    <div className="container mx-auto py-8 px-4 md:px-6 max-h-[calc(100vh-41px)] overflow-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-background rounded-lg border-t shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-muted-foreground">Total Order Amount:</div>
            <div className="font-medium">&#8377;{order?.total}</div>
            <div className="text-muted-foreground">Discount:</div>
            <div className="font-medium">-&#8377;{order?.discount}</div>
            <div className="text-muted-foreground">Subtotal:</div>
            <div className="font-medium">&#8377;{order?.subtotal}</div>
            <div className="text-muted-foreground">Shipping Charge:</div>
            <div className="font-medium">&#8377;{order?.shippingCharges}</div>
            <div className="text-muted-foreground">Status:</div>
            <div className="font-medium text-green-500 capitalize">
              {order?.status}
            </div>
            <div className="text-muted-foreground">Tax:</div>
            <div className="font-medium">&#8377;{order?.tax}</div>
            <div className="text-muted-foreground">Order Created At:</div>
            <div className="font-medium">{order?.createdAt?.split("T")[0]}</div>
          </div>
        </div>
        <div className="bg-background rounded-lg border-t shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-muted-foreground">Name:</div>
            <div className="font-medium capitalize">{order?.userName}</div>
            <div className="text-muted-foreground">Address:</div>
            <div className="font-medium capitalize">
              {order?.shippingInfo.address}
            </div>
            <div className="text-muted-foreground">City:</div>
            <div className="font-medium capitalize">
              {order?.shippingInfo.city}
            </div>
            <div className="text-muted-foreground">State:</div>
            <div className="font-medium capitalize">
              {order?.shippingInfo.state}
            </div>
            <div className="text-muted-foreground">Pincode:</div>
            <div className="font-medium">{order?.shippingInfo.pinCode}</div>
            <div className="text-muted-foreground">Country:</div>
            <div className="font-medium capitalize">
              {order?.shippingInfo.country}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background rounded-lg border-t  shadow-md p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Order Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {order?.orderItems.map((item: OrderItem, idx: number) => (
            <div key={idx} className="flex items-center gap-4">
              <img
                src={item.photo}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div>
                <h3 className="font-medium capitalize">{item.name}</h3>
                <p className="text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
                <p className="font-medium">&#8377;{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={() => router.push("/orders")} size="sm">
          My Orders
        </Button>
      </div>
    </div>
  );
}
