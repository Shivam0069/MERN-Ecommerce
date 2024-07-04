"use client";
import banner from "@/assets/banner3.jpg";
import ProductCard from "@/components/productCard";
import Loader, { CircleLoader } from "@/helper/loader";
import { useLatestProductsQuery } from "@/store/api/productAPI";
import { addToCart } from "@/store/slice/cartSlice";
import { RootState } from "@/store/store";
import { CartItem } from "@/types/types";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const user = useSelector((state: RootState) => state.user.userData);
  const [loading, setLoading] = useState<boolean>(false);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

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

  if (isError) {
    toast.error("Cannot fetch the products");
  }

  return (
    <div className="bg-background max-h-[calc(100vh-41px)] overflow-auto scrollbar-hide">
      {loading && <Loader />}
      <section className="bg-gradient-to-r from-primary to-secondary py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
                Discover the Latest Trends
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground">
                Explore our curated collection of the hottest fashion items.
              </p>
              <button className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1">
                Shop Now
              </button>
            </div>

            <div className="hidden md:block">
              <img
                src={banner.src}
                alt="Banner Image"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      {isLoading ? (
        <CircleLoader />
      ) : (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                Latest Products
              </h2>
              <Link
                href="/search"
                className="text-primary hover:underline transition-colors"
                prefetch={false}
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          </div>
        </section>
      )}
    </div>
  );
}
