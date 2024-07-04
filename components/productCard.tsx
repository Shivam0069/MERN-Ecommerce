"use client";
import { CartItem } from "@/types/types";
import Link from "next/link";
import { Button } from "./ui/button";
type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};
export default function ProductCard({
  productId,
  photo,
  name,
  price,
  stock,
  handler,
}: ProductsProps) {
  const addToCartHandler = () => {
    const cartItem: CartItem = {
      productId,
      photo,
      stock,
      name,
      price,
      quantity: 1,
    };
    handler(cartItem);
  };
  return (
    <div className="bg-card rounded-lg border-t shadow-lg overflow-hidden">
      <img
        src={photo}
        alt="Product Image"
        width={300}
        height={300}
        className="w-full h-60 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground">{name}</h3>
        <p className="text-muted-foreground">&#8377;{price}</p>
        <Button onClick={addToCartHandler} size="sm" className="mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
