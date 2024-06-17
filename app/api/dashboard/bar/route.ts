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
    const key = "bar-charts";
    if (myCache.has(key)) {
      charts = JSON.parse(myCache.get(key) as string);
    } else {
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(today.getMonth() - 6);

      const lastSixMonthsProductsPromise = Product.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");
      const lastSixMonthsUsersPromise = User.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");
      const lastTwelveMonthsOrdersPromise = Order.find({
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");

      const [
        lastSixMonthsProducts,
        lastSixMonthsUsers,
        lastTwelveMonthsOrders,
      ] = await Promise.all([
        lastSixMonthsProductsPromise,
        lastSixMonthsUsersPromise,
        lastTwelveMonthsOrdersPromise,
      ]);

      const productCounts = getChartsData({
        length: 6,
        today,
        docArr: lastSixMonthsProducts,
      });
      const userCounts = getChartsData({
        length: 6,
        today,
        docArr: lastSixMonthsUsers,
      });
      const orderCounts = getChartsData({
        length: 12,
        today,
        docArr: lastTwelveMonthsOrders,
      });
      charts = {
        users: userCounts,
        products: productCounts,
        orders: orderCounts,
      };
      myCache.set(key, JSON.stringify(charts));
    }
    return NextResponse.json({ success: true, charts }, { status: 200 });
  } catch (error) {}
}
