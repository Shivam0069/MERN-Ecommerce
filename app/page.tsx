"use client";
import banner from "@/assets/banner.jpg";
import banner2 from "@/assets/banner2.jpg";
import banner3 from "@/assets/banner3.jpg";
import ProductCard from "@/components/productCard";
import Loader, { CircleLoader } from "@/helper/loader";
import { useLatestProductsQuery } from "@/store/api/productAPI";
import { addToCart } from "@/store/slice/cartSlice";
import { UserState } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { CartItem } from "@/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const user = useSelector((state: RootState) => state.user.userData);
  const [loading, setLoading] = useState<boolean>(false);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addToCartHandler = (cartItem: CartItem) => {
    setLoading(true);
    const index = cartItems.findIndex(
      (i: CartItem) => i.productId === cartItem.productId
    );
    if (index !== -1) {
      setLoading(false);
      return toast.success("Product already exists in cart");
    }
    if (cartItem.stock <= cartItem.quantity) {
      setLoading(false);
      return toast.error("Out of stock!");
    }

    dispatch(addToCart({ cartItem, user: user?._id }));

    toast.success("Product added to cart");
    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isError) {
    toast.error("Cannot fetch the products");
  }

  return (
    <div className="max-w-7xl mx-auto pt-4">
      {loading && <Loader />}
      <section className="overflow-hidden mx-1 sm:mx-2 md:mx-3 flex items-center relative">
        <div
          className="flex transition-transform ease-in-out duration-1000 "
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          <img src={banner.src} className="w-full flex-shrink-0 h-96" />
          <img
            src={banner2.src}
            className="w-full flex-shrink-0 h-96 object-cover"
          />
          <img
            src={banner3.src}
            className="w-full flex-shrink-0 h-96 object-cover"
          />
        </div>
      </section>
      <div className="max-w-6xl mx-1 sm:mx-2 md:mx-3 0 lg:mx-auto flex justify-between items-center pt-10 px-4 md:px-0">
        <div className="text-xl font-medium">Latest Products</div>
        <Link href="/search" className="text-sm">
          More
        </Link>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center items-center py-10">
          <CircleLoader />
        </div>
      ) : (
        <div className="py-10 max-w-6xl mx-1 sm:mx-2 md:mx-3 lg:mx-auto grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-0">
          {data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              photo={i.photo}
              name={i.name}
              stock={i.stock}
              price={i.price}
              handler={addToCartHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}
