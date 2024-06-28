"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/firebase";
import { updateUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
type FormData = {
  email: string;
  password: string;
  type: string;
};
export default function Login() {
  const dispatch = useDispatch();
  const [visibility, setVisibility] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    type: "credential",
  });
  const {
    cartItems,
    subtotal,
    total,
    tax,
    discount,
    shippingCharges,
    shippingInfo,
  } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  // const [login] = useLoginMutation();
  const loginHandler = async () => {
    try {
      const response = await axios.post("/api/user/login", formData);
      dispatch(updateUser(response.data.user));

      toast.success("Sign Up Successful");
      router.push("/");
    } catch (error) {
      console.log(error);

      toast.error("Error while logging in");
    }
  };
  const googleLoginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const loginData = {
        email: user.email,
        type: "google",
      };
      const response = await axios.post("/api/user/login", loginData);
      console.log(response.data);
      dispatch(updateUser(response.data.user));

      toast.success("Sign Up Successful");
      router.push("/");
    } catch (error) {
      toast.error("Error while logging in");
    }
  };
  return (
    <div className="flex h-[calc(100vh-41px)] items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
        </div>
        <form className="space-y-6">
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                autoComplete="email"
                required
                placeholder="you@example.com"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-1 flex items-center">
              <Input
                id="password"
                name="password"
                type={visibility ? "text" : "password"}
                value={formData.password}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setVisibility((prev) => !prev)}
              >
                <EyeIcon className="h-5 w-5" />
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
          </div>

          <div>
            <Button onClick={loginHandler} type="button" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        <div>
          <Button
            onClick={googleLoginHandler}
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <ChromeIcon className="h-5 w-5" />
            Sign in with Google
          </Button>
        </div>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
    // <div className="flex justify-center items-center h-[calc(100vh-41px)]">
    //   <div className="mx-auto max-w-md space-y-6">
    //     <div className="space-y-2 text-center">
    //       <h1 className="text-3xl font-bold">Login</h1>
    //       <p className="text-gray-500 dark:text-gray-400">
    //         Enter your details to access your account.
    //       </p>
    //     </div>
    //     <Card>
    //       <CardContent className="space-y-4">
    //         <div className="grid grid-cols-2 gap-4">
    //           <div className="space-y-2">
    //             <Label htmlFor="gender">Gender</Label>
    //             <Select
    //               value={gender}
    //               onValueChange={(value) => setGender(value)}
    //             >
    //               <SelectTrigger
    //                 id="gender"
    //                 className="text-gray-500 dark:text-gray-400"
    //               >
    //                 <SelectValue placeholder="Select gender" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="male">Male</SelectItem>
    //                 <SelectItem value="female">Female</SelectItem>
    //                 <SelectItem value="other">Other</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="dob">Date of Birth</Label>
    //             {/* <Popover>
    //               <PopoverTrigger asChild>
    //                 <Button
    //                   variant="outline"
    //                   className="pl-3 text-left font-normal text-gray-500 dark:text-gray-400"
    //                 >
    //                   {date ? date.toLocaleDateString() : "Pick a date"}
    //                   <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
    //                 </Button>
    //               </PopoverTrigger>
    //               <PopoverContent className="w-auto p-0" align="start">
    //                 <Calendar
    //                   mode="single"
    //                   selected={date}
    //                   onSelect={setDate}
    //                 />
    //               </PopoverContent>
    //             </Popover> */}
    //             <input
    //               type="date"
    //               value={date}
    //               onChange={(e) => setDate(e.target.value)}
    //               className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-primary-500 dark:focus:border-primary-500"
    //             />
    //           </div>
    //         </div>
    //         <Button type="submit" className="w-full">
    //           Login
    //         </Button>
    //       </CardContent>
    //     </Card>
    //     <div className="text-center text-sm text-gray-500 dark:text-gray-400">
    //       Already Signed in?{" "}
    //       <Button
    //         onClick={loginHandler}
    //         variant="link"
    //         className="font-medium underline underline-offset-4"
    //       >
    //         Sign in with Google
    //       </Button>
    //     </div>
    //   </div>
    // </div>
  );
}

function CalendarDaysIcon(props: any) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
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
