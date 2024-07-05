"use client";

import ProductCard from "@/components/productCard";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleLoader } from "@/helper/loader";
import SkeletonProductLoader from "@/helper/skeletonProductLoader";
import {
  useAllFilteredProductsQuery,
  useCategoriesQuery,
} from "@/store/api/productAPI";
import { addToCart } from "@/store/slice/cartSlice";
import { RootState } from "@/store/store";
import { CustomError } from "@/types/api-types";
import { CartItem } from "@/types/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Search() {
  const { data, isLoading, isError, error } = useCategoriesQuery("");
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.userData);
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState(100000);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: searchedProducts,
    isLoading: productsLoading,
    isError: productsIsError,
    error: productsError,
  } = useAllFilteredProductsQuery({
    sort: sortOption,
    price: priceRange,
    category: selectedCategory,
    page: currentPage,
    search: searchTerm,
  });
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if (productsIsError) {
    const err = productsError as CustomError;
    toast.error(err.data.message);
  }
  console.log(searchedProducts);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 px-4  md:px-8  md:max-h-[calc(100vh-41px)] ">
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6 pt-10 md:max-h-[calc(100vh-85px)] overflow-auto scrollbar-hide">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="mb-6">
          <label htmlFor="sort" className="block text-sm font-medium mb-2">
            Sort
          </label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger id="sort" className="w-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="dsc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="price-range"
            className="block text-sm font-medium mb-2"
          >
            Price Range
          </label>
          <div className="border w-fit px-4 py-1 rounded-xl text-sm font-light">
            &#8377;{priceRange}
          </div>
          <input
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            type="range"
            min={100}
            max={100000}
          />
          <div className="w-full" />
        </div>
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>

              {data?.categories.map((i) => (
                <SelectItem key={i} value={i} className="capitalize">
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6 pt-10  md:max-h-[calc(100vh-41px)] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-950 dark:text-gray-50"
            />
          </div>
        </div>
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
            <SkeletonProductLoader n={3} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
              {searchedProducts?.products.map((i: any) => (
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
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {currentPage > 1 ? (
                      <PaginationPrevious
                        href=""
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      >
                        Previous
                      </PaginationPrevious>
                    ) : (
                      <PaginationPrevious
                        className="disabled"
                        aria-disabled="true"
                      >
                        Previous
                      </PaginationPrevious>
                    )}
                  </PaginationItem>
                  {Array.from(
                    { length: searchedProducts?.totalPage! },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href=""
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    {currentPage < searchedProducts?.totalPage! ? (
                      <PaginationNext
                        href=""
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        Next
                      </PaginationNext>
                    ) : (
                      <PaginationNext className="disabled" aria-disabled="true">
                        Next
                      </PaginationNext>
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
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
