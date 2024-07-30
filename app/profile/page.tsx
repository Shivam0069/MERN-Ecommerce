"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/helper/loader";
import { useMyOrdersQuery } from "@/store/api/orderAPI";
import { deleteCart } from "@/store/slice/cartSlice";
import { setUserNull, updateUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [password, setPassword] = useState<{
    newPassword: string;
    confirmPassword: string;
  }>({
    newPassword: "",
    confirmPassword: "",
  });
  const [newPasswordVisibility, setNewPasswordVisibility] =
    useState<boolean>(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState<boolean>(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { userData, isLoading } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: orders, isLoading: ordersLoading } = useMyOrdersQuery(
    userData?._id!
  );

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const logoutHandler = async () => {
    setLoading(true);
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
        toast.error("Logout failed!!");
      }
    } catch (error) {
      console.log(error);

      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const subscriptionHandler = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const data = {
      options: {
        amount: 29900,
        currency: "INR",
        receipt: userData?.name || "user",
      },
    };
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/payments/razorpay/order`,
      data
    );
    const id = response.data.order.id;

    var options = {
      key: "rzp_test_xFZLy65vGsM1fR", // Enter the Key ID generated from the Dashboard
      amount: 29900, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Flash_Buy", //your business name
      description: "Plus Subscription Payment",
      image: "https://example.com/your_logo",
      order_id: id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response: any) {
        const data = {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        };

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/payments/razorpay/order/validate`,
            data
          );
          if (res.data.success) {
            const res = await axios.post("/api/user/plus-member", {
              id: userData?._id,
            });
            dispatch(updateUser(res.data.user));
            toast.success(res.data.message);
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          console.log(error, "error");
        }
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: userData?.name, //your customer's name
        email: userData?.email,
        contact: "***********", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Jabalpur",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    setLoading(false);
  };

  const saveChangeHandler = async () => {
    if (password.newPassword.length === 0) {
      toast.error("Please enter a new password");
      return;
    } else if (password.confirmPassword.length === 0) {
      toast.error("Please confirm your password");
      return;
    } else if (password.newPassword !== password.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/user/update-password", {
        id: userData?._id,
        password: password.newPassword,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setPassword((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      setLoading(false);
    }
  };

  return isLoading || ordersLoading ? (
    <ProfileSkeleton />
  ) : (
    <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12 max-h-[calc(100vh-41px)] overflow-auto scrollbar-hide">
      {loading && <Loader />}
      <div className="grid gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[300px_1fr] items-start">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24 border">
            <AvatarImage src={photoPreview || userData?.photo} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          {/* <Button onClick={triggerFileInput} variant="outline" size="sm">
            Change Photo
          </Button>
          {photo && (
            <Button
              onClick={() => {
                setPhoto(null);
                setPhotoPreview(null);
              }}
              variant="outline"
              size="sm"
            >
              Remove
            </Button>
          )} */}
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{userData?.name}</h1>
              <Button
                disabled={userData?.role === "plus"}
                className={`${userData?.role === "admin" && "hidden"}`}
                onClick={subscriptionHandler}
              >
                {userData?.role === "plus"
                  ? "Plus Member"
                  : "Upgrade to Plus Member"}
              </Button>
            </div>

            <div className="text-muted-foreground">{userData?.email}</div>
            <div className="text-muted-foreground capitalize">
              {userData?.gender}
            </div>
            {userData?.type === "credential" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Change Password
                  </h2>
                  <div className="grid gap-2">
                    <div className="relative">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        value={password.newPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            newPassword: e.target.value,
                          })
                        }
                        type={`${newPasswordVisibility ? "text" : "password"}`}
                        placeholder="Enter new password"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-1 right-1 h-7 w-7"
                        onClick={() =>
                          setNewPasswordVisibility((prev) => !prev)
                        }
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </Button>
                    </div>
                    <div className="relative">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        value={password.confirmPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            confirmPassword: e.target.value,
                          })
                        }
                        type={`${
                          confirmPasswordVisibility ? "text" : "password"
                        }`}
                        placeholder="Confirm new password"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-1 right-1 h-7 w-7"
                        onClick={() =>
                          setConfirmPasswordVisibility((prev) => !prev)
                        }
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {orders?.orders?.length! > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                <div className="grid gap-4">
                  {orders?.orders.slice(0, 2).map((order, orderIdx): any =>
                    order.orderItems.map((product, productIdx) => (
                      <div
                        key={`${orderIdx}-${productIdx}`}
                        onClick={() => router.push(`/order/${order._id}`)}
                        className="flex items-center justify-between border rounded-lg p-4 cursor-pointer"
                      >
                        <div className="flex flex-1 items-center gap-4">
                          <div className="text-sm text-muted-foreground flex flex-col justify-center gap-2">
                            <div>Order #{order._id.slice(-5)} </div>
                            <div>{order.createdAt?.split("T")[0]}</div>
                          </div>

                          <div className="flex items-center gap-4 overflow-x-auto max-w-full scrollbar-hide">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.photo}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="rounded-md"
                              />
                              <div>
                                <div className="font-medium">
                                  {product.name} x {product.quantity}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            &#8377;{order.total.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={logoutHandler} variant="outline" size="sm">
          Logout
        </Button>
        <Button onClick={saveChangeHandler} size="sm">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function EyeIcon(props: any) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12 max-h-[calc(100vh-41px)] overflow-auto">
      <div className="grid gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[300px_1fr] items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-300 animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-300 animate-pulse"></div>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="w-48 h-8 bg-gray-300 animate-pulse"></div>
            <div className="w-36 h-5 bg-gray-300 animate-pulse"></div>
            <div className="w-24 h-5 bg-gray-300 animate-pulse"></div>
            <div className="space-y-4">
              <div>
                <div className="w-44 h-7 bg-gray-300 animate-pulse mb-2"></div>
                <div className="grid gap-2">
                  <div className="w-full h-10 bg-gray-300 animate-pulse"></div>
                  <div className="w-full h-10 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="w-44 h-7 bg-gray-300 animate-pulse mb-4"></div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-md"></div>
                  <div>
                    <div className="w-24 h-5 bg-gray-300 animate-pulse"></div>
                    <div className="w-16 h-5 bg-gray-300 animate-pulse"></div>
                  </div>
                  <div className="w-0.5 h-16 bg-gray-300 animate-pulse"></div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-5 bg-gray-300 animate-pulse"></div>
                  <div className="w-16 h-5 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-md"></div>
                  <div>
                    <div className="w-24 h-5 bg-gray-300 animate-pulse"></div>
                    <div className="w-16 h-5 bg-gray-300 animate-pulse"></div>
                  </div>
                  <div className="w-0.5 h-16 bg-gray-300 animate-pulse"></div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-5 bg-gray-300 animate-pulse"></div>
                  <div className="w-16 h-5 bg-gray-300 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <div className="w-20 h-8 bg-gray-300 animate-pulse"></div>
        <div className="w-24 h-8 bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  );
};
