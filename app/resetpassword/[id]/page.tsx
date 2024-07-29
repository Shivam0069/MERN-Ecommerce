"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/helper/loader";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword({ params }: { params: { id: string } }) {
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const id = params.id;
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async () => {
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
    setIsLoading(true);

    try {
      const res = await axios.post("/api/user/resetPassword", {
        password: password.newPassword,
        id,
        token,
      });

      if (res.data.success) {
        toast.success("Password reset successfully");
      } else {
        toast.error(res.data.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
      router.push("/login");
    }
  };

  return (
    <div className="w-screen h-[calc(100vh-41px)] flex justify-center items-center">
      {isLoading && <Loader />}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={passwordVisibility.newPassword ? "text" : "password"}
                placeholder="Enter a new password"
                onChange={(e) =>
                  setPassword((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="pr-16"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1 right-1 h-7 w-7"
                onClick={() =>
                  setPasswordVisibility((prev) => ({
                    ...prev,
                    newPassword: !prev.newPassword,
                  }))
                }
              >
                <EyeIcon className="h-4 w-4" />
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                onChange={(e) =>
                  setPassword((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="pr-16"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1 right-1 h-7 w-7"
                onClick={() =>
                  setPasswordVisibility((prev) => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
              >
                <EyeIcon className="h-4 w-4" />
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={handleSubmit} className="w-full">
            Reset Password
          </Button>
        </CardFooter>
      </Card>
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
