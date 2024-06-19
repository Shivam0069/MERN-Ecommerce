"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { BarChart } from "@/components/admin/Charts";
import { CircleLoader } from "@/helper/loader";
import { useGetBarStatsQuery } from "@/store/api/dashboardAPI";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import {
  createLastSixMonthsArray,
  createMonthArray,
} from "@/helper/monthArray";

const Barcharts = () => {
  const sixMonths = createLastSixMonthsArray();
  const months = createMonthArray();
  const { userData } = useSelector((state: RootState) => state.user);
  const { data, isLoading, isError, error } = useGetBarStatsQuery(
    userData?._id!
  );
  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[60vh]">
          <CircleLoader />
        </div>
      ) : (
        <main className="chart-container scrollbar-hide">
          <h1>Bar Charts</h1>
          <section>
            <BarChart
              data_2={data?.charts.products || []}
              data_1={data?.charts.users || []}
              title_1="Products"
              title_2="Users"
              bgColor_1={`hsl(260, 50%, 30%)`}
              bgColor_2={`hsl(360, 90%, 90%)`}
              labels={sixMonths}
            />
            <h2>Top Products & Top Customers</h2>
          </section>

          <section>
            <BarChart
              horizontal={true}
              data_1={data?.charts.orders! || []}
              data_2={[]}
              title_1="Orders"
              title_2=""
              bgColor_1={`hsl(180, 40%, 50%)`}
              bgColor_2=""
              labels={months}
            />
            <h2>Orders throughout the year</h2>
          </section>
        </main>
      )}
    </div>
  );
};

export default Barcharts;
