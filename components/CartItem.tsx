import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import {
  addToCart,
  calculatePrice,
  deleteCartItem,
  removeCartItem,
} from "@/store/slice/cartSlice";
import toast from "react-hot-toast";
import { RootState } from "@/store/store";
type CartItemProps = {
  cartItem: any;
};
export default function CartItem({ cartItem }: CartItemProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData);
  const addToCartHandler = () => {
    if (cartItem.stock <= cartItem.quantity)
      return toast.error("Out of stock!");
    dispatch(
      addToCart({
        ...cartItem,
        quantity: cartItem.quantity + 1,
      })
    );
    dispatch(calculatePrice({ user: user?._id! }));
    toast.success("Product added to cart");
  };

  return (
    <div className="grid grid-cols-[80px_1fr_auto] items-center gap-4">
      <img
        src={cartItem.photo}
        alt="Product Image"
        width={80}
        height={80}
        className="rounded-md"
      />
      <div>
        <h3 className="font-medium">{cartItem.name}</h3>
        <p className="text-gray-500 dark:text-gray-400">Black, Medium</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            dispatch(removeCartItem(cartItem.productId));
            dispatch(calculatePrice({ user: user?._id! }));
          }}
        >
          <MinusIcon className="w-4 h-4" />
        </Button>
        <span>{cartItem.quantity}</span>
        <Button variant="outline" size="icon" onClick={addToCartHandler}>
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center justify-end">
        <span className="font-medium">&#8377;{cartItem.price}</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-4"
          onClick={() => {
            dispatch(deleteCartItem(cartItem.productId));
            dispatch(calculatePrice({ user: user?._id! }));
          }}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function MinusIcon(props: any) {
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
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
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
