"use client";
import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Coupon = () => {
  const [coupon, setCoupon] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const user = useSelector((state: RootState) => state.user.userData);
  const createCoupon = async () => {
    try {
      if (coupon.length === 0) {
        toast.error("Enter Coupon Code");
        return;
      }
      if (!amount || amount === 0) {
        toast.error("Enter Amount");
        return;
      }
      const res = await axios.post(`/api/payments/coupon/new?id=${user?._id}`, {
        coupon: coupon.toUpperCase(),
        amount,
      });
      toast.success("Coupon Generated");
      setCoupon("");
      setAmount(null);
    } catch (error) {
      console.log(error, "errorCreatingCoupon");
      toast.error("Error while creating coupon");
      setCoupon("");
      setAmount(null);
    }
  };
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <Card className="w-full max-w-md mx-auto p-6 bg-background shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Coupon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coupon" className="text-sm font-medium">
                Coupon Code
              </Label>
              <Input
                id="coupon"
                value={coupon}
                type="text"
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <Input
                id="amount"
                value={Number(amount)}
                onChange={(e) => setAmount(Number(e.target.value))}
                type="text"
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={createCoupon}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Create Coupon
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Coupon;
