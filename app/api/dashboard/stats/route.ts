import { connect } from "@/dbConfig/dbConfig";
import { calculatePercentage } from "@/helper/calculatePercentage";
import { categoryCounts } from "@/helper/categoryCount";
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
    let stats = {};
    const key = "admin-stats";
    if (myCache.has(key)) {
      stats = JSON.parse(myCache.get(key) as string);
    } else {
      const today = new Date();

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      };

      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 1),
      };

      const thisMonthProductsPromise = Product.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });
      const lastMonthProductsPromise = Product.find({
        createdAt: {
          $gte: lastMonth.start,
          $lt: lastMonth.end,
        },
      });
      const thisMonthUsersPromise = User.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });
      const lastMonthUsersPromise = User.find({
        createdAt: {
          $gte: lastMonth.start,
          $lt: lastMonth.end,
        },
      });
      const thisMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });
      const lastMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: lastMonth.start,
          $lt: lastMonth.end,
        },
      });
      const lastsixMonthsOrdersPromise = Order.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      });

      const latestTransactionsPromise = Order.find({})
        .select(["orderItems", "discount", "total", "status"])
        .limit(4);

      const [
        thisMonthOrders,
        thisMonthProducts,
        thisMonthUsers,
        lastMonthOrders,
        lastMonthProducts,
        lastMonthUsers,
        ProductsCount,
        UsersCount,
        OrdersCount,
        allOrders,
        lastsixMonthsOrders,
        categories,
        femaleUsersCount,
        latestTransactions,
      ] = await Promise.all([
        thisMonthOrdersPromise,
        thisMonthProductsPromise,
        thisMonthUsersPromise,
        lastMonthOrdersPromise,
        lastMonthProductsPromise,
        lastMonthUsersPromise,
        Product.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
        Order.find({}).select("total"),
        lastsixMonthsOrdersPromise,
        Product.distinct("category"),
        User.countDocuments({ gender: "female" }),
        latestTransactionsPromise,
      ]);

      let thisMonthRevenue: number = 0;
      if (thisMonthOrders.length > 0) {
        thisMonthOrders.forEach((order) => {
          thisMonthRevenue += order.total;
        });
      }

      let lastMonthRevenue: number = 0;
      if (lastMonthOrders.length > 0) {
        lastMonthOrders.forEach((order) => {
          thisMonthRevenue += order.total;
        });
      }

      const totalRevenue = allOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );

      const counts = {
        revenue: totalRevenue,
        product: ProductsCount,
        user: UsersCount,
        order: OrdersCount,
      };

      const changedPercent = {
        revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),

        product: calculatePercentage(
          thisMonthProducts.length,
          lastMonthProducts.length
        ),
        user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
        order: calculatePercentage(
          thisMonthOrders.length,
          lastMonthOrders.length
        ),
      };

      const orderMonthlyCounts = new Array(6).fill(0);
      const orderMonthlyRevenue = new Array(6).fill(0);

      lastsixMonthsOrders.forEach((order) => {
        const creationDate = new Date(order.createdAt);
        const monthDiff =
          (today.getFullYear() - creationDate.getFullYear()) * 12 +
          today.getMonth() -
          creationDate.getMonth();
        if (monthDiff >= 0 && monthDiff < 6) {
          orderMonthlyCounts[5 - monthDiff] += 1;
          orderMonthlyRevenue[5 - monthDiff] += order.total;
        }
      });

      const categoryCount = await categoryCounts({ categories, ProductsCount });

      const userRatio = {
        male: UsersCount - femaleUsersCount,
        female: femaleUsersCount,
      };
      const modifiedTransaction = latestTransactions.map((i) => ({
        _id: i._id,
        amount: i.total,
        discount: i.discount,
        quantity: i.orderItems.length,
        status: i.status,
      }));

      stats = {
        categoryCount,
        changePercent: changedPercent,
        count: counts,
        chart: {
          revenue: orderMonthlyRevenue,
          order: orderMonthlyCounts,
        },
        userRatio,
        latestTransaction: modifiedTransaction,
      };
      myCache.set(key, JSON.stringify(stats));
    }
    return NextResponse.json({ success: true, stats });
  } catch (error) {}
}
