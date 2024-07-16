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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IoMdShareAlt } from "react-icons/io";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const id = params.id;
  const { data, isLoading, isError, error } = useProductByIdQuery(id);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  console.log(user?.orderedProduct, "productDetailUser");

  const submitReview = async () => {
    // Validate rating and comment if needed
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (comment === "") {
      toast.error("Please enter a comment");
      return;
    }
    const reviewData = {
      productId: id,
      rating: rating,
      comment: comment,
      userName: user?.name,
      userPhoto: user?.photo,
    };
    console.log(reviewData, "reviewData");

    const res = await axios.post(`/api/product/reviews`, reviewData);
    console.log(res, "reviewREs");

    setRating(0);
    setComment("");

    if (res.data.success) {
      toast.success(res.data.message);
      return;
    }
    toast.error("Something Went Wrong!");
  };

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
  const shareHandler = () => {
    const url = window.location.href;
    const title = "Flash Buy";
    const text = "Check out this awesome Product!";

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: text,
          url: url,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for devices that do not support the Web Share API
      const shareText = `${text}\n${url}`;
      const encodedShareText = encodeURIComponent(shareText);
      const encodedUrl = encodeURIComponent(url);

      const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedShareText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${title}&summary=${encodedShareText}`,
        whatsapp: `https://wa.me/?text=${encodedShareText}`,
        email: `mailto:?subject=${title}&body=${encodedShareText}`,
      };

      console.log("Web Share API not supported. Use these links to share:");
      console.log(shareLinks);
      alert(
        "Sharing is not supported in this browser. Copy the URL or use the provided links to share manually."
      );
    }
  };

  return isLoading ? (
    <SkeletonProductDetailLoader />
  ) : (
    <>
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          <img
            src={data?.product.photo}
            alt={data?.product.name}
            width={600}
            height={600}
            className="w-full md:h-[400px] object-contain"
          />
        </div>
        <div className="grid gap-4">
          <div>
            <h1 className="text-3xl font-bold">{data?.product.name}</h1>
            <p className="text-muted-foreground">
              60% combed ringspun cotton/40% polyester jersey tee.
            </p>
            <Button onClick={shareHandler} className="mt-2">
              <IoMdShareAlt className="h-6 w-6  mr-2" /> Share
            </Button>
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
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={addToCartHandler}
              size="lg"
              className="flex-1"
            >
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 grid gap-8">
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              {user?.orderedProduct?.includes(id) && (
                <Dialog>
                  <DialogTrigger>
                    <Button>Add Review</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
                    <DialogHeader>
                      <DialogTitle>Product Review</DialogTitle>
                      <DialogDescription>
                        Please share your thoughts on the product.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      {/* Rating */}
                      <Label htmlFor="rating" className="text-sm font-medium">
                        Rating
                      </Label>
                      <div className="flex gap-2">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`w-8 h-8 cursor-pointer ${
                              index < rating
                                ? "fill-primary"
                                : "fill-muted stroke-muted-foreground"
                            }`}
                            onClick={() => setRating(index + 1)}
                          />
                        ))}
                      </div>
                      {/* Comment */}
                      <Label htmlFor="comment" className="text-sm font-medium">
                        Comment
                      </Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none focus:ring-primary focus:border-primary"
                        placeholder="Write your review here..."
                      />
                    </div>
                    {/* Dialog actions */}
                    <DialogFooter className="flex justify-end gap-4">
                      <DialogClose asChild>
                        <Button onClick={submitReview}>Submit Review</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="grid gap-6">
              {data?.product?.reviews?.length! > 0 &&
                data?.product.reviews!.map((review, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Avatar className="w-10 h-10 border -z-10 ">
                      <AvatarImage src={review.userPhoto} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{review.userName}</h3>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, index) => (
                            <StarIcon
                              key={index}
                              className={`w-5 h-5 ${
                                index < review.rating
                                  ? "fill-primary"
                                  : "fill-muted stroke-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border -z-10 ">
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
                    I&apos;ve been experimenting with my LuminaCook
                    Multi-Function Air Fryer for a few weeks now, and it&apos;s
                    been a versatile addition to my kitchen. It&apos;s great for
                    making crispy fries, chicken wings, and even some healthier
                    options.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border -z-10 ">
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
                    I recently purchased the SparkleShine Home Cleaning Robot,
                    and it has been a game-changer in my life. I used to spend
                    hours every weekend cleaning my house, but now I can simply
                    turn on this little robot and let it do the work. It&apos;s
                    incredibly efficient, navigating around obstacles with ease.
                    The only reason I didn&apos;t give it a perfect 5-star
                    rating is that it occasionally gets stuck under low
                    furniture. Overall, it&apos;s been a great addition to my
                    home, saving me time and effort.
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
    </>
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

function XIcon(props: any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SkeletonProductDetailLoader() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-4">
        <div className="w-full h-[200px] md:h-[400px] bg-gray-300 animate-pulse rounded-lg"></div>
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
      <div className="md:col-span-2 grid gap-8">
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
