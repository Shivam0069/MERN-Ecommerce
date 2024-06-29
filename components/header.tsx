"use client";
import profile from "@/assets/images/profile.webp";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCart, fetchCartDbData } from "@/store/slice/cartSlice";
import { setUserNull } from "@/store/slice/userSlice";
import { RootState, store } from "@/store/store";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    cartItems,
    subtotal,
    total,
    tax,
    discount,
    shippingCharges,
    shippingInfo,
  } = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.userData);

  useEffect(() => {
    store.dispatch(fetchCartDbData());
  }, [user]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/logout`
      );
      if (res.data.success) {
        console.log("logged Out", res.data);
        dispatch(deleteCart());
        dispatch(setUserNull());
        toast.success("Logout successfully");
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleImageError = (event: any) => {
    event.target.src = profile.src;
  };
  return (
    <header className="flex h-[41px] w-full max-w-7xl mx-auto items-center justify-between bg-white px-4  dark:bg-gray-950">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-semibold" prefetch={false}>
          Home
        </Link>
        <Link href="/search" className="text-lg font-semibold" prefetch={false}>
          Search
        </Link>
        {/* <div className="relative">
          <Input
            type="text"
            placeholder="Search products..."
            className="h-8 w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 text-sm focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
          />
          <SearchIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div> */}
      </div>
      <div className="flex items-center gap-4">
        <Link href="/cart" className="relative" prefetch={false}>
          <ShoppingCartIcon className="h-6 w-6" />
          <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
            {cartItems?.length}
          </Badge>
        </Link>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <img
                  src={user?.photo}
                  alt="Avatar"
                  onError={handleImageError}
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/orders")}>
                Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutHandler}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" onClick={() => router.push("/login")}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
}

function SearchIcon(props: any) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShoppingCartIcon(props: any) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
