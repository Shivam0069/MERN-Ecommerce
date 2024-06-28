"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { BiArrowBack } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import Loader from "@/helper/loader";
import { useNewOrderMutation } from "@/store/api/orderAPI";
import { addShippingAddress, deleteCart } from "@/store/slice/cartSlice";
import { RootState } from "@/store/store";
import { NewOrderRequest } from "@/types/api-types";
import { responseToast } from "@/utils/features";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
declare global {
  interface Window {
    Razorpay: any;
  }
}
export default function Shipping() {
  const [loading, setLoading] = useState<boolean>(false);
  const [newOrder, { isLoading: orderCreating }] = useNewOrderMutation();
  const [newOrderData, setNewOrderData] = useState<NewOrderRequest>({
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
    },
    orderItems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    user: "",
    userName: "",
  });
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const {
    cartItems,
    subtotal,
    tax,
    total,
    discount,
    shippingCharges,
    shippingInfo,
  } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  useEffect(() => {
    if (cartItems.length !== 0) {
      setNewOrderData((prevData) => {
        return {
          ...prevData,
          orderItems: cartItems,
          subtotal: subtotal,
          tax: tax,
          total: total,
          discount: discount,
          shippingCharges: shippingCharges,
          shippingInfo: shippingInfo,
        };
      });
    }
  }, [cartItems]);
  useEffect(() => {
    if (userData) {
      setNewOrderData((prevData) => {
        return {
          ...prevData,
          user: userData._id,
          userName: userData.name,
        };
      });
    }
  }, [userData]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setNewOrderData((prevData) => ({
      ...prevData,
      shippingInfo: {
        ...prevData.shippingInfo,
        [id]: value,
      },
    }));
  };

  const handleSelectChange = (value: any) => {
    setNewOrderData((prevData) => ({
      ...prevData,
      shippingInfo: {
        ...prevData.shippingInfo,
        country: value,
      },
    }));
  };

  const paymentHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (
      !newOrderData.shippingInfo.address ||
      !newOrderData.shippingInfo.city ||
      !newOrderData.shippingInfo.state ||
      !newOrderData.shippingInfo.country ||
      !newOrderData.shippingInfo.pinCode
    ) {
      return toast.error("Fill all the fields!");
    }
    dispatch(
      addShippingAddress({
        shipping: newOrderData.shippingInfo,
        user: userData?._id,
      })
    );

    const data = {
      options: {
        amount: total * 100,
        currency: "INR",
        receipt: "receipt#2",
      },
    };
    const response = await axios.post("/api/payments/razorpay/order", data);
    const id = response.data.order.id;

    var options = {
      key: "rzp_test_xFZLy65vGsM1fR", // Enter the Key ID generated from the Dashboard
      amount: total * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response: any) {
        const data = {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        };

        try {
          const res = await axios.post(
            "/api/payments/razorpay/order/validate",
            data
          );
          if (res.data.success) {
            const response = await newOrder(newOrderData);
            console.log(response, "orderResponse");

            dispatch(deleteCart(userData?._id));

            responseToast(response, router, "/");
          }
        } catch (error: any) {
          console.log(error, "error");
        }
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: userData?.name, //your customer's name
        email: userData?.email,
        contact: "9000090000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    setLoading(false);
  };
  return (
    <div className="flex justify-center items-center h-[calc(100vh-41px)] relative">
      {(loading || orderCreating) && <Loader />}

      <Link
        href="/cart"
        className="absolute top-4 left-10 rounded-full border p-2 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105"
      >
        <BiArrowBack />
      </Link>
      <Card className="max-w-md mx-4 md:mx-0">
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
          <CardDescription>
            Enter your shipping details to complete your order.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={newOrderData.shippingInfo.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={newOrderData.shippingInfo.city}
                onChange={handleChange}
                placeholder="Enter your city"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={newOrderData.shippingInfo.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pinCode">Pincode</Label>
              <Input
                id="pinCode"
                value={newOrderData.shippingInfo.pinCode}
                onChange={handleChange}
                placeholder="Enter your pincode"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={newOrderData.shippingInfo.country}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Usa">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Uk">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={paymentHandler} className="w-full">
            Pay Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
