"use client";
import Loader from "@/helper/loader";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CiMail } from "react-icons/ci";
import { IoPhonePortraitOutline } from "react-icons/io5";
export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  function validatePhoneNumber(phoneNumber: string) {
    const phoneRegex =
      /^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{1,4}?\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phoneRegex.test(phoneNumber);
  }

  const subscriptionsHandler = async () => {
    setIsLoading(true);
    if (!validateEmail(email)) {
      setIsLoading(false);

      toast.error("Please Enter Valid Email");
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setIsLoading(false);

      toast.error("Please Enter Valid Phone Number");
      return;
    }

    try {
      const data = {
        email,
        phoneNumber,
      };

      const response = await axios.post("/api/newsletter/new", data);
      console.log(response);
      toast.success(response.data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
      setEmail("");
      setPhoneNumber("");
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto my-8 px-2 ">
      {isLoading && <Loader />}
      <div className="btn-4 w-full py-4 md:py-10 md:px-10 bg-[#853047]/90 z-10 mx-auto rounded-xl  ">
        <div className="flex w-full justify-center gap-3 sm:justify-between items-center flex-col sm:flex-row text-center sm:text-left">
          <div>
            <p className="text-white text-xl sm:text-2xl">
              Stay up-to-date with our
            </p>
            <p className="text-white font-medium text-xl sm:text-2xl">
              <span className="font-bold text-2xl sm:text-4xl capitalize">
                Newsletter
              </span>
            </p>
          </div>
          <div className=" flex flex-col gap-2  ">
            <div className="relative flex mx-auto   ">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" px-4 py-2 md:py-3 md:w-[500px] rounded-lg focus:outline-none"
                placeholder="Enter Email Address"
              />
            </div>
            <div className="relative flex mx-auto   ">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className=" px-4 py-2 md:py-3 md:w-[500px] rounded-lg focus:outline-none"
                placeholder="Enter Phone Number"
              />
            </div>
            <button
              disabled={isLoading}
              onClick={subscriptionsHandler}
              className="w-fit ml-auto px-2 sm:px-6 py-1 sm:py-3 space-x-2 rounded-lg flex justify-center items-center bg-[#F00402] text-lg sm:text-xl text-white"
            >
              <CiMail />
              <span className=" cursor-pointer">Subscribe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
