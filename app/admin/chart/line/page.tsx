"use client";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { LineChart } from "../../../../components/admin/Charts";
import { useGetLineStatsQuery } from "@/store/api/dashboardAPI";
import { RootState } from "@/store/store";
import { CircleLoader } from "@/helper/loader";
import { createMonthArray } from "@/helper/monthArray";

const Linecharts = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { data, isLoading, isError, error } = useGetLineStatsQuery(
    userData?._id!
  );
  const months = createMonthArray();
  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[60vh]">
          <CircleLoader />
        </div>
      ) : (
        <main className="chart-container scrollbar-hide">
          <h1>Line Charts</h1>
          <section>
            <LineChart
              data={data?.charts.users || []}
              label="Users"
              borderColor="rgb(53, 162, 255)"
              labels={months}
              backgroundColor="rgba(53, 162, 255, 0.5)"
            />
            <h2>Active Users</h2>
          </section>

          <section>
            <LineChart
              data={data?.charts.products || []}
              backgroundColor={"hsla(269,80%,40%,0.4)"}
              borderColor={"hsl(269,80%,40%)"}
              labels={months}
              label="Products"
            />
            <h2>Total Products (SKU)</h2>
          </section>

          <section>
            <LineChart
              data={data?.charts.revenue || []}
              backgroundColor={"hsla(129,80%,40%,0.4)"}
              borderColor={"hsl(129,80%,40%)"}
              label="Revenue"
              labels={months}
            />
            <h2>Total Revenue </h2>
          </section>

          <section>
            <LineChart
              data={data?.charts.discount || []}
              backgroundColor={"hsla(29,80%,40%,0.4)"}
              borderColor={"hsl(29,80%,40%)"}
              label="Discount"
              labels={months}
            />
            <h2>Discount Allotted </h2>
          </section>
        </main>
      )}
    </div>
  );
};

export default Linecharts;
