"use client";
import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "./loader";
import NewsLetter from "@/components/NewsLetter";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loading = useSelector((state: any) => state.user.isLoading);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (loading) setIsLoading(true);
    else setIsLoading(false);
  }, [loading]);
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Header /> {children}
    </>
  );
}
