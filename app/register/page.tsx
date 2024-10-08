"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/firebase";
import { uploadImage } from "@/helper/ImageUpload";
import Loader from "@/helper/loader";
import { useNewCartMutation } from "@/store/api/cartAPI";
import { updateUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineVerified } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
interface FormData {
  _id: string;
  name: string;
  email: string;
  photo: string;
  password: string;
  gender: string;
  dob: string;
  type: string;
}

export default function Register() {
  const [isEmailverified, setIsEmailVerified] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const dispatch = useDispatch();
  const {
    cartItems,
    subtotal,
    total,
    tax,
    discount,
    shippingCharges,
    shippingInfo,
  } = useSelector((state: RootState) => state.cart);
  const [newCart] = useNewCartMutation();
  const router = useRouter();
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    _id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    name: "",
    email: "",
    photo: "",
    password: "",
    gender: "",
    dob: "",
    type: "credential",
  });
  useEffect(() => {
    console.log(formData.photo, "photo");
  }, [formData.photo]);
  useEffect(() => {
    setIsEmailVerified(false);
  }, [formData.email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const googleSignupHandler = async () => {
    if (dob.length === 0 || gender.length === 0) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const googleAuthData = {
        _id: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        gender,
        dob,
        type: "google",
      };

      console.log(googleAuthData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/signup`,
        googleAuthData
      );

      dispatch(updateUser(response.data.user));

      const cartData = {
        user: response?.data?.user?._id!,
        cartItems,
        tax,
        total,
        subtotal,
        discount,
        shippingCharges,
        shippingInfo,
      };

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/cart/new`,
          cartData
        );
        console.log(res, "CartResponse");
        toast.success("Cart Created");
      } catch (cartError) {
        console.log(cartError);
        toast.error("Failed to create cart.");
      }

      router.push("/");
      toast.success("Sign Up Successful");
    } catch (authError) {
      console.log(authError);
      toast.error("Sign In Failed");
    }
  };

  const signupHandler = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.gender ||
      !formData.dob
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!(photo instanceof File)) {
      toast.error("Please select a valid image file");
      return;
    }
    if (!isEmailverified) {
      toast.error("Please verify your email");
      return;
    }

    try {
      const url = await uploadImage(photo, "images/users");
      if (!url) {
        toast.error("Error while uploading file");
        return;
      }

      const data = {
        _id: formData._id,
        name: formData.name,
        email: formData.email,
        photo: url,
        password: formData.password,
        gender: formData.gender,
        dob: formData.dob,
        type: "credential",
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/signup`,
        data
      );

      // Create cart for the user after successful signup
      try {
        const cartData = {
          user: response.data.user._id,
          cartItems,
          tax,
          total,
          subtotal,
          discount,
          shippingCharges,
          shippingInfo,
        };

        const cartResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/cart/new`,
          cartData
        );
        console.log(cartResponse, "CartResponse");
        toast.success("Cart Created");
      } catch (cartError) {
        console.log(cartError);
        toast.error("Failed to create cart.");
      }

      dispatch(updateUser(response.data.user));

      router.push("/");
      console.log(response.data);
      toast.success("Registration Successful");
    } catch (error) {
      console.error(error);
      toast.error("Sign Up Failed");
    }
  };
  function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  const verifyEmail = async () => {
    setIsLoading(true);
    try {
      if (!validateEmail(formData.email)) {
        toast.error("Please Enter Valid Email");
        setIsLoading(false);

        return;
      }
      const res = await axios.post("/api/verifyemail", {
        email: formData.email,
      });
      toast.success(res.data.message);
      setOtp(res.data.otp);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (otp.length > 0 && enteredOtp.length > 0 && otp === enteredOtp) {
      toast.success("OTP Verified");
      setIsEmailVerified(true);
    }
  }, [enteredOtp, otp]);

  return (
    <div className="mx-auto md:max-w-md  space-y-2 pt-4 pb-4 rounded-2xl px-4 border md:max-h-[calc(100vh-41px)]">
      {isLoading && <Loader />}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information to get started.
        </p>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="pr-10"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-1 right-1 h-7 w-7 z-10 "
              onClick={verifyEmail}
            >
              <MdOutlineVerified
                fill={isEmailverified ? "blue" : "gray"}
                className={`h-5 w-5  `}
              />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              required
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          {/* <div className="space-y-2 ">
            <Button
              disabled={isEmailverified}
              onClick={verifyEmail}
              type="button"
              className="w-full"
            >
              Verify Email
            </Button>
          </div> */}
          {otp.length > 0 && (
            <div className="space-y-2">
              <Input
                id="otp"
                type="text"
                required
                value={enteredOtp}
                placeholder="Enter Your Otp"
                onChange={(e) => setEnteredOtp(e.target.value)}
              />
            </div>
          )}
        </div>

        <Button
          onClick={signupHandler}
          type="submit"
          className="w-full disabled:cursor-not-allowed"
        >
          Sign Up
        </Button>
      </div>
      <Separator className="my-2" />
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(value) => setGender(value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={googleSignupHandler}
          variant="outline"
          className="w-full"
        >
          <ChromeIcon className="mr-2 h-4 w-4" />
          Sign up with Google
        </Button>
      </div>
      <p className="text-sm  font-light text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function ChromeIcon(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
