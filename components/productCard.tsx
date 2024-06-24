"use client";
import { CartItem } from "@/types/types";
import Link from "next/link";
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
    <div className="group my-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <Link
        className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
        href="#"
      >
        <img
          className="peer absolute top-0 right-0 h-full w-full object-cover "
          src={photo}
          alt="product image"
        />
      </Link>
      <div className="mt-4 px-5 pb-5">
        <a href="#">
          <h5 className="text-xl tracking-tight text-slate-900">{name}</h5>
        </a>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">
              &#8377;{price - Math.round(price * 0.05)}
            </span>
            <span className="text-sm text-slate-900 line-through">
              &#8377;{price}
            </span>
          </p>
        </div>
        <div
          onClick={addToCartHandler}
          className="flex items-center cursor-pointer justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
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
          Add to cart
        </div>
      </div>
    </div>
    // <div className="group hover:opacity-100 relative w-[18.75rem] h-[25rem] p-[1rem] flex flex-col justify-start items-center gap-1  rounded-lg shadow-2xl">
    //   <img
    //     className="w-[calc(18.75rem - 3rem)] h-[calc(18.75rem - 3rem)] object-cover m-[1rem]"
    //     src={photo}
    //     alt={name}
    //   />
    //   <p>{name}</p>
    //   <span className="font-bold text-[1.1rem]">₹{price}</span>
    //   <div className="opacity-0 group-hover:opacity-100 absolute h-[100%] w-[100%] top-0 left-0 bg-[#0000006b] flex justify-center items-center rounded-lg">
    //     <button
    //       className="flex justify-center items-center h-[3rem] w-[3rem] rounded-full border-none cursor-pointer text-[1.1rem] group-hover:rotate-[20deg] transition-all duration-300 bg-blue-200"
    //       onClick={handler}
    //     >
    //       <FaPlus />
    //     </button>
    //   </div>
    // </div>
  );
}
