import { connect } from "@/dbConfig/dbConfig";
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
    let charts;
    const key = "pie-charts";
    if (myCache.has(key)) {
      charts = JSON.parse(myCache.get(key) as string);
    } else {
      const allOrderPromise = Order.find({}).select([
        "total",
        "discount",
        "shippingCharges",
        "subtotal",
        "tax",
      ]);
      const [
        processingOrder,
        shippedOrder,
        deliveredOrder,
        ProductsCount,
        categories,
        productOutOfStock,
        allOrders,
        allUsers,
        adminUsers,
        customerUsers,
      ] = await Promise.all([
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Product.countDocuments(),
        Product.distinct("category"),
        Product.countDocuments({ stock: 0 }),
        allOrderPromise,
        User.find().select("dob"),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "user" }),
      ]);

      const orderFullfillment = {
        processing: processingOrder,
        shipped: shippedOrder,
        delivered: deliveredOrder,
      };

      const categoryCount = await categoryCounts({ categories, ProductsCount });
      const stockAvailability = {
        inStock: ProductsCount - productOutOfStock,
        outOfStock: productOutOfStock,
      };

      const grossIncome = allOrders.reduce(
        (prev, order) => prev + (order.total || 0),
        0
      );
      const discount = allOrders.reduce(
        (prev, order) => prev + (order.discount || 0),
        0
      );
      const productionCost = allOrders.reduce(
        (prev, order) => prev + (order.shippingCharges || 0),
        0
      );
      const burnt = allOrders.reduce(
        (prev, order) => prev + (order.tax || 0),
        0
      );
      const marketingCost = Math.round(grossIncome * (30 / 100));

      const netMargin =
        grossIncome - discount - productionCost - burnt - marketingCost;

      const revenueDistribution = {
        netMargin,
        discount,
        productionCost,
        burnt,
        marketingCost,
      };

      const usersAgeGroup = {
        teen: allUsers.filter((i) => i.age < 20).length,
        adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
        old: allUsers.filter((i) => i.age >= 40).length,
      };

      const adminCustomer = {
        admin: adminUsers,
        customer: customerUsers,
      };

      charts = {
        orderFullfillment,
        productCategories: categoryCount,
        stockAvailability,
        revenueDistribution,
        usersAgeGroup,
        adminCustomer,
      };
      myCache.set(key, JSON.stringify(charts));
    }
    return NextResponse.json({ success: true, charts }, { status: 200 });
  } catch (error) {}
}
