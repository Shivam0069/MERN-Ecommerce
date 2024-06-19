"use client";
import toast from "react-hot-toast";
import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "@/components/admin/Charts";
import Table from "@/components/admin/DashboardTable";
// import data from "@/assets/data.json";
import { useGetDashboardStatsQuery } from "@/store/api/dashboardAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CircleLoader } from "@/helper/loader";
import { createLastSixMonthsArray } from "@/helper/monthArray";
const userImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const Dashboard = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { data, isLoading, isError, error } = useGetDashboardStatsQuery(
    userData?._id!
  );
  const sixMonths = createLastSixMonthsArray();

  return (
    <div className="admin-container ">
      <AdminSidebar />
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[60vh]">
          <CircleLoader />
        </div>
      ) : (
        <main className="dashboard ">
          <div className="bar">
            <BsSearch />
            <input type="text" placeholder="Search for data, users, docs" />
            <FaRegBell />
            <img src={userImg} alt="User" />
          </div>

          <section className="widget-container">
            <WidgetItem
              percent={data?.stats.changePercent.revenue! | 0}
              amount={true}
              value={data?.stats.count.revenue! | 0}
              heading="Revenue"
              color="rgb(0, 115, 255)"
            />
            <WidgetItem
              percent={data?.stats.changePercent.user! | 0}
              value={data?.stats.count.user! | 0}
              color="rgb(0 198 202)"
              heading="Users"
            />
            <WidgetItem
              percent={data?.stats.changePercent.order! | 0}
              value={data?.stats.count.order! | 0}
              color="rgb(255 196 0)"
              heading="Transactions"
            />

            <WidgetItem
              percent={data?.stats.changePercent.product! | 0}
              value={data?.stats.count.product! | 0}
              color="rgb(76 0 255)"
              heading="Products"
            />
          </section>

          <section className="graph-container">
            <div className="revenue-chart">
              <h2>Revenue</h2>
              <BarChart
                data_1={data?.stats.chart.revenue || []}
                data_2={[]}
                title_1="Revenue"
                title_2=""
                bgColor_1="rgb(0, 115, 255)"
                bgColor_2=""
                labels={sixMonths}
              />
              <h2>Transaction</h2>
              <BarChart
                data_1={data?.stats.chart.order || []}
                data_2={[]}
                title_1="Transaction"
                title_2=""
                bgColor_1="rgba(53, 162, 235, 0.8)"
                bgColor_2=""
                labels={sixMonths}
              />
            </div>

            <div className="dashboard-categories">
              <h2>Inventory</h2>

              <div>
                {data?.stats.categoryCount.map((item) => {
                  const [key, value] = Object.entries(item)[0];
                  return (
                    <CategoryItem
                      key={key}
                      value={value}
                      heading={key}
                      color={`hsl(${value * 4}, ${value}%, 50%)`}
                    />
                  );
                })}
              </div>
            </div>
          </section>

          <section className="transaction-container mt-2">
            <div className="gender-chart">
              <h2>Gender Ratio</h2>
              <DoughnutChart
                labels={["Female", "Male"]}
                data={[
                  data?.stats.userRatio.female!,
                  data?.stats.userRatio.male!,
                ]}
                backgroundColor={[
                  "hsl(340, 82%, 56%)",
                  "rgba(53, 162, 235, 0.8)",
                ]}
                cutout={90}
              />
              <p>
                <BiMaleFemale />
              </p>
            </div>
            <Table
              data={
                data?.stats.latestTransaction.map((i) => {
                  return {
                    _id: i._id.slice(0, 5) + "...",
                    amount: i.amount,
                    discount: i.discount,
                    quantity: i.quantity,
                    status: i.status,
                  };
                }) || []
              }
            />
          </section>
        </main>
      )}
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent}%
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
