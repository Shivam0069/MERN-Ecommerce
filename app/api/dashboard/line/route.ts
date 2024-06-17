import { connect } from "@/dbConfig/dbConfig";
import { getChartsData } from "@/helper/getChartsData";
import { myCache } from "@/helper/myCache";
import { AdminOnly } from "@/helper/adminOnly";
import Order from "@/models/order";
import Product from "@/models/products";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function GET(request: NextRequest) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }
  try {
    let charts;
    const key = "line-charts";
    if (myCache.has(key)) {
      charts = JSON.parse(myCache.get(key) as string);
    } else {
      const today = new Date();

      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(today.getMonth() - 6);

      const baseQuery = {
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      };
      const lastTwelveMonthsUsersPromise =
        User.find(baseQuery).select("createdAt");
      const lastTwelveMonthsProductsPromise =
        Product.find(baseQuery).select("createdAt");
      const lastTwelveMonthsOrdersPromise = Order.find(baseQuery).select([
        "createdAt",
        "discount",
        "total",
      ]);

      const [
        lastTwelveMonthsProducts,
        lastTwelveMonthsUsers,
        lastTwelveMonthsOrders,
      ] = await Promise.all([
        lastTwelveMonthsProductsPromise,
        lastTwelveMonthsUsersPromise,
        lastTwelveMonthsOrdersPromise,
      ]);

      const productCounts = getChartsData({
        length: 12,
        today,
        docArr: lastTwelveMonthsProducts,
      });
      const userCounts = getChartsData({
        length: 12,
        today,
        docArr: lastTwelveMonthsUsers,
      });
      const discount = getChartsData({
        length: 12,
        today,
        docArr: lastTwelveMonthsOrders,
        property: "discount",
      });
      const revenue = getChartsData({
        length: 12,
        today,
        docArr: lastTwelveMonthsOrders,
        property: "total",
      });
      charts = {
        users: userCounts,
        products: productCounts,
        discount,
        revenue,
      };
      myCache.set(key, JSON.stringify(charts));
    }
    return NextResponse.json({ success: true, charts }, { status: 200 });
  } catch (error) {}
}
