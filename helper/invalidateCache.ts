import Product from "@/models/products";
import { myCache } from "./myCache";
import Order from "@/models/order";

type invalidateCacheTypes = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: String;
  orderId?: String;
  productId?: String | String[];
};
export const invalidateCache = ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: invalidateCacheTypes) => {
  if (product) {
    const productKeys: string[] = ["categories", "admin-products"];
    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object") {
      for (let i = 0; i < productId.length; i++) {
        productKeys.push(`product-${productId[i]}`);
      }
    }

    myCache.del(productKeys);
  }
  if (order) {
    const OrderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    myCache.del(OrderKeys);
  }
  if (admin) {
    const adminKeys: string[] = [
      "admin-stats",
      "bar-charts",
      "pie-charts",
      "line-charts",
    ];
    myCache.del(adminKeys);
  }
};
