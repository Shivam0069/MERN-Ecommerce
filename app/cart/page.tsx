"use client";
import CartItem from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Loader from "@/helper/loader";
import { applyCoupon, deleteCart } from "@/store/slice/cartSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
// const cartItems = [
//   {
//     productId: "abcdefgh",
//     photo:
//       "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60?a=b",
//     name: "Nike",
//     price: 3000,
//     quantity: 4,
//     stock: 10,
//   },
//   {
//     productId: "abcdfgh",
//     photo:
//       "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60?a=b",
//     name: "Nike",
//     price: 3000,
//     quantity: 4,
//     stock: 10,
//   },
//   {
//     productId: "abdefgh",
//     photo:
//       "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60?a=b",
//     name: "Nike",
//     price: 3000,
//     quantity: 4,
//     stock: 10,
//   },
//   {
//     productId: "acdefgh",
//     photo:
//       "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60?a=b",
//     name: "Nike",
//     price: 3000,
//     quantity: 4,
//     stock: 10,
//   },
//   {
//     productId: "adefgh",
//     photo:
//       "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60?a=b",
//     name: "Nike",
//     price: 3000,
//     quantity: 4,
//     stock: 10,
//   },
//   {
//     productId: "cdefgh",
//     photo:
//       "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60?a=b",
//     name: "Nike",
//     price: 3000,
//     quantity: 4,
//     stock: 10,
//   },
// ];
// const subtotal = 4000;
// const shippingCharges = 50;
// const tax = Math.round(subtotal * 0.18);
// const discount = 200;
// const total = subtotal + tax + shippingCharges - discount;
export default function Cart() {
  const { cartItems, subtotal, tax, total, discount, shippingCharges } =
    useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData);
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const deleteCartHandler = () => {
    dispatch(deleteCart(user?._id));
  };
  const applyCouponHandler = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/payments/discount?coupon=${couponCode}`
      );
      if (total > res.data.discount + 500) {
        dispatch(
          applyCoupon({ discount: Number(res.data.discount), user: user?._id })
        );
      } else {
        toast.error("Not Eligible (Low Total Amount)");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const checkoutHandler = () => {
    if (total === 0) return toast.error("Please add Items to cart");
    else {
      router.push("/shipping");
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:h-[calc(100vh-41px)] h-auto max-w-7xl mx-auto px-2 md:px-0 py-4">
      {loading && <Loader />}
      <div className="bg-gray-100 dark:bg-gray-950 overflow-y-auto scrollbar-hide p-6 md:p-8 lg:p-10 rounded-lg md:col-span-2  ">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <Button variant="outline" size="sm" onClick={deleteCartHandler}>
            <TrashIcon className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>
        <div className="grid gap-6">
          {cartItems.length > 0 ? (
            cartItems.map((item, idx) => <CartItem key={idx} cartItem={item} />)
          ) : (
            <h1 className="text-xl font-semibold">No Items Added</h1>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 lg:p-10">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-medium">&#8377;{subtotal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span className="font-medium">&#8377;{tax}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span className="font-medium">&#8377;{shippingCharges}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="font-medium text-green-500">
              -&#8377;{discount}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">&#8377;{total}</span>
          </div>
          <div className="relative">
            <Input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                dispatch(applyCoupon({ discount: 0, user: user?._id }));
              }}
              placeholder="Enter coupon code"
              className="pr-16"
            />
            <Button
              onClick={applyCouponHandler}
              variant="outline"
              size="sm"
              className="absolute top-1/2 right-1 -translate-y-1/2"
            >
              Apply
            </Button>
          </div>
          <Button onClick={checkoutHandler} size="lg">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
function TrashIcon(props: any) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
