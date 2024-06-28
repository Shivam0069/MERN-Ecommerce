"use client";
import { useGetPieStatsQuery } from "@/store/api/dashboardAPI";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../../components/admin/Charts";

const PieCharts = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { data, isLoading, isError, error } = useGetPieStatsQuery(
    userData?._id!
  );
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const keys = data?.charts.productCategories.map(
        (category) => Object.keys(category)[0]
      );
      const values = data?.charts.productCategories.map(
        (category) => Object.values(category)[0]
      );
      const backgroundColor = values?.map((i) => `hsl(${i * 4}, ${i}%, 50%)`);
      setLabels(keys);
      setValues(values);
      setBackgroundColor(backgroundColor);
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container scrollbar-hide">
        <h1>Pie & Doughnut Charts</h1>

        <section>
          <div>
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[
                data?.charts.orderFullfillment.processing!,
                data?.charts.orderFullfillment.shipped!,
                data?.charts.orderFullfillment.delivered!,
              ]}
              backgroundColor={[
                `hsl(110,80%, 80%)`,
                `hsl(110,80%, 50%)`,
                `hsl(110,40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Order Fulfillment Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={labels}
              data={values}
              backgroundColor={backgroundColor}
              legends={false}
              offset={[0, 0, 0, 80]}
            />
          </div>
          <h2>Product Categories Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[
                data?.charts.stockAvailability.inStock!,
                data?.charts.stockAvailability.outOfStock!,
              ]}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />
          </div>
          <h2> Stock Availability</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={[
                "Marketing Cost",
                "Discount",
                "Burnt",
                "Production Cost",
                "Net Margin",
              ]}
              data={[
                data?.charts.revenueDistribution.marketingCost!,
                data?.charts.revenueDistribution.discount!,
                data?.charts.revenueDistribution.burnt!,
                data?.charts.revenueDistribution.productionCost!,
                data?.charts.revenueDistribution.netMargin!,
              ]}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
          </div>
          <h2>Revenue Distribution</h2>
        </section>

        <section>
          <div>
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[
                data?.charts.usersAgeGroup.teen!,
                data?.charts.usersAgeGroup.adult!,
                data?.charts.usersAgeGroup.old!,
              ]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Users Age Group</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["Admin", "Customers"]}
              data={[
                data?.charts.adminCustomer.admin!,
                data?.charts.adminCustomer.customer!,
              ]}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PieCharts;
