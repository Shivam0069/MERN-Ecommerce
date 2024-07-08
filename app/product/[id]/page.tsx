"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useAllFilteredProductsQuery,
  useProductByIdQuery,
} from "@/store/api/productAPI";
import { addToCart } from "@/store/slice/cartSlice";
import { RootState } from "@/store/store";
import { CustomError } from "@/types/api-types";
import { CartItem } from "@/types/types";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const id = params.id;
  const { data, isLoading, isError, error } = useProductByIdQuery(id);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    data: searchedProducts,
    isLoading: productsLoading,
    isError: productsIsError,
    error: productsError,
  } = useAllFilteredProductsQuery({
    sort: "",
    price: 100000,
    page: 1,
    search: "",
    category: data?.product.category || "",
  });

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  console.log(data, "productData");
  const addToCartHandler = () => {
    const cartItem: CartItem = {
      productId: data?.product._id!,
      photo: data?.product.photo!,
      name: data?.product.name!,
      price: data?.product.price!,
      quantity: 1,
      stock: data?.product.stock!,
    };
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
  return isLoading ? (
    <SkeletonProductDetailLoader />
  ) : (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-4">
        {/* <Carousel className="rounded-lg overflow-hidden">
          <CarouselContent>
            <CarouselItem>
              <img
                src="/placeholder.svg"
                alt="Product Image"
                width={600}
                height={600}
                className="w-full h-[400px] object-cover"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src="/placeholder.svg"
                alt="Product Image"
                width={600}
                height={600}
                className="w-full h-[400px] object-cover"
              />
            </CarouselItem>
            <CarouselItem>
              <img
                src="/placeholder.svg"
                alt="Product Image"
                width={600}
                height={600}
                className="w-full h-[400px] object-cover"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 z-10 text-primary-foreground">
            <ChevronLeftIcon className="w-6 h-6" />
          </CarouselPrevious>
          <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 z-10 text-primary-foreground">
            <ChevronRightIcon className="w-6 h-6" />
          </CarouselNext>
        </Carousel> */}
        <img
          src={data?.product.photo}
          alt={data?.product.name}
          width={600}
          height={600}
          className="w-full h-[400px] object-contain"
        />
      </div>
      <div className="grid gap-4">
        <div>
          <h1 className="text-3xl font-bold">{data?.product.name}</h1>
          <p className="text-muted-foreground">
            60% combed ringspun cotton/40% polyester jersey tee.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">(12 reviews)</span>
        </div>
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-bold">
            &#8377;{data?.product.price}
          </span>

          <span className="text-sm text-muted-foreground line-through">
            &#8377;{data?.product.price! + 0.2 * data?.product.price!}
          </span>
        </div>
        <form className="grid gap-4">
          {/* <div className="grid gap-2">
            <Label htmlFor="color" className="text-base">
              Color
            </Label>
            <RadioGroup
              id="color"
              defaultValue="black"
              className="flex items-center gap-2"
            >
              <Label
                htmlFor="color-black"
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
              >
                <RadioGroupItem id="color-black" value="black" />
                Black
              </Label>
              <Label
                htmlFor="color-white"
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
              >
                <RadioGroupItem id="color-white" value="white" />
                White
              </Label>
              <Label
                htmlFor="color-blue"
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
              >
                <RadioGroupItem id="color-blue" value="blue" />
                Blue
              </Label>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="size" className="text-base">
              Size
            </Label>
            <RadioGroup
              id="size"
              defaultValue="m"
              className="flex items-center gap-2"
            >
              <Label
                htmlFor="size-xs"
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
              >
                <RadioGroupItem id="size-xs" value="xs" />
                XS
              </Label>
              <Label
                htmlFor="size-s"
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
              >
                <RadioGroupItem id="size-s" value="s" />S
              </Label>
              <Label
                htmlFor="size-m"
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
              >
                <RadioGroupItem id="size-m" value="m" />M
              </Label>
              <Label
                htmlFor="size-l"
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
              >
                <RadioGroupItem id="size-l" value="l" />L
              </Label>
              <Label
                htmlFor="size-xl"
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
              >
                <RadioGroupItem id="size-xl" value="xl" />
                XL
              </Label>
            </RadioGroup>
          </div> */}
          {/* <div className="grid gap-2">
            <Label htmlFor="quantity" className="text-base">
              Quantity
            </Label>
            <Select defaultValue="1">
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={addToCartHandler}
              size="lg"
              className="flex-1"
            >
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
            {/* <Button size="lg" variant="outline" className="flex-1">
              <HeartIcon className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button> */}
          </div>
        </form>
      </div>
      <div className="col-span-2 grid gap-8">
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">Product Description</h2>
          <div className="text-muted-foreground leading-relaxed">
            <div>
              {data?.product.description || (
                <p>
                  Introducing the Acme Prism T-Shirt, a perfect blend of style
                  and comfort for the modern individual. This tee is crafted
                  with a meticulous composition of 60% combed ringspun cotton
                  and 40% polyester jersey, ensuring a soft and breathable
                  fabric that feels gentle against the skin.
                </p>
              )}
            </div>
            <p>
              The design of the Acme Prism T-Shirt is as striking as it is
              comfortable. The shirt features a unique prism-inspired pattern
              that adds a modern and eye-catching touch to your ensemble.
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="grid gap-6">
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Sarah Johnson</h3>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                    <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  I&apos;ve been experimenting with my LuminaCook Multi-Function
                  Air Fryer for a few weeks now, and it&apos;s been a versatile
                  addition to my kitchen. It&apos;s great for making crispy
                  fries, chicken wings, and even some healthier options.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 border">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Alex Smith</h3>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-primary" />
                    <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                    <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  I recently purchased the SparkleShine Home Cleaning Robot, and
                  it has been a game-changer in my life. I used to spend hours
                  every weekend cleaning my house, but now I can simply turn on
                  this little robot and let it do the work. It&apos;s incredibly
                  efficient, navigating around obstacles with ease. The only
                  reason I didn&apos;t give it a perfect 5-star rating is that
                  it occasionally gets stuck under low furniture. Overall,
                  it&apos;s been a great addition to my home, saving me time and
                  effort.
                </p>
              </div>
            </div>
          </div>
        </div>
        {searchedProducts?.products.length! > 1 && (
          <div className="grid gap-4">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {searchedProducts?.products.map(
                (item, idx) =>
                  item?._id !== data?.product._id && (
                    <div
                      key={idx}
                      className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
                    >
                      <Link
                        href={item?._id}
                        className="absolute inset-0 z-10"
                        prefetch={false}
                      >
                        <span className="sr-only">View</span>
                      </Link>
                      <img
                        src={item?.photo}
                        alt={item.name}
                        width={500}
                        height={400}
                        className="object-cover w-full h-64"
                      />
                      <div className="p-4 bg-background">
                        <h3 className="text-xl font-bold">{item?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <h4 className="text-lg font-semibold">
                          &#8377;{item.price}
                        </h4>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronLeftIcon(props: any) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: any) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function HeartIcon(props: any) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function StarIcon(props: any) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function SkeletonProductDetailLoader() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-4">
        <div className="w-full h-[400px] bg-gray-300 animate-pulse rounded-lg"></div>
      </div>
      <div className="grid gap-4">
        <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse mb-4"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
          <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="flex items-baseline gap-4">
          <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="grid gap-2">
          <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-12 bg-gray-300 rounded w-1/2 animate-pulse"></div>
          <div className="h-12 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
      <div className="col-span-2 grid gap-8">
        <div className="grid gap-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-full animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="grid gap-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-full h-64 bg-gray-300 animate-pulse"></div>
                <div className="p-4 bg-background">
                  <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
