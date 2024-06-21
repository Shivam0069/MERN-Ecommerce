"use client";
import banner from "@/assets/banner.jpg";
import banner2 from "@/assets/banner2.jpg";
import ProductCard from "@/components/productCard";
import Loader, { CircleLoader } from "@/helper/loader";
import { useLatestProductsQuery } from "@/store/api/productAPI";
import { addToCart, calculatePrice } from "@/store/slice/cartSlice";
import { RootState } from "@/store/store";
import { CartItem } from "@/types/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const { data, isLoading, isError } = useLatestProductsQuery("");
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
    dispatch(addToCart(cartItem));
    dispatch(calculatePrice());
    toast.success("Product added to cart");
    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isError) {
    toast.error("Cannot fetch the products");
  }

  return (
    <div className="max-w-7xl mx-auto pt-4 ">
      {loading && <Loader />}
      <section className="overflow-hidden flex items-center relative ">
        <div
          className="flex transition-transform ease-in-out duration-1000"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          <img src={banner.src} className="w-full flex-shrink-0" />
          <img src={banner2.src} className="w-full flex-shrink-0" />
        </div>
      </section>
      <div className="max-w-6xl mx-auto flex justify-between items-center pt-10">
        <div className="text-xl font-medium">Latest Products</div>
        <Link href="/search" className="text-sm">
          More
        </Link>
      </div>

      {isLoading ? (
        <div className="w-screen mx-auto">
          <CircleLoader />
        </div>
      ) : (
        <div className="py-10 max-w-6xl mx-auto grid justify-items-center  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
