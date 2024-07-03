"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/helper/loader";
import { useMyOrdersQuery } from "@/store/api/orderAPI";
import { deleteCart } from "@/store/slice/cartSlice";
import { setUserNull } from "@/store/slice/userSlice";
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

  return isLoading || ordersLoading ? (
    <Loader />
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
          <Button onClick={triggerFileInput} variant="outline" size="sm">
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
          )}
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <h1 className="text-2xl font-bold">{userData?.name}</h1>

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

            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="grid gap-4">
              {orders?.orders.slice(0, 2).map((item, idx) => (
                <div
                  onClick={() => router.push(`/order/${item._id}`)}
                  key={idx}
                  className="flex items-center justify-between border rounded-lg p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground flex flex-col justify-center gap-2">
                      <div>Order #{item._id.slice(0, 5)}... </div>
                      <div>{item.createdAt?.split("T")[0]}</div>
                    </div>

                    {item.orderItems.map((product, idx) => (
                      <div key={idx} className="flex items-center gap-4">
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
                        <div className="w-0.5 h-14 border"></div>
                      </div>
                    ))}
                  </div>

                  <div className="text-right">
                    <div className="font-medium">
                      &#8377;{item.total.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={logoutHandler} variant="outline" size="sm">
          Logout
        </Button>
        <Button size="sm">Save Changes</Button>
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
