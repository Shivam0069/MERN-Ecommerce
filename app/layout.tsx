import Header from "@/components/header";
import { StoreProvider } from "@/store/StoreProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Layout from "@/helper/LayoutProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flash Buy - Your One-Stop Shop for Everything",
  description:
    "Flash Buy offers a wide range of products at unbeatable prices. Shop electronics, fashion, home goods, and more with fast shipping and excellent customer service.",
  keywords:
    "Flash Buy, online shopping, e-commerce, electronics, fashion, home goods, fast shipping, best prices",
  authors: [{ name: "Flash Buy Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" className="scrollbar-hide">
        <body className={inter.className}>
          <Toaster position="bottom-center" />
          <Layout>{children}</Layout>
          <script
            src="https://checkout.razorpay.com/v1/checkout.js"
            async
          ></script>
        </body>
      </html>
    </StoreProvider>
  );
}
