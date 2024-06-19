"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TableHOC from "@/components/admin/TableHOC";
import { CircleLoader } from "@/helper/loader";
import { useAllOrderQuery } from "@/store/api/orderAPI";
import { RootState } from "@/store/store";
import { CustomError } from "@/types/api-types";
import { Order } from "@/types/types";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Column } from "react-table";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Name",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const { userData } = useSelector((state: RootState) => state.user);
  const { data, isLoading, isError, error } = useAllOrderQuery(userData?._id!);
  const [rows, setRows] = useState<DataType[]>([]);
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i: Order) => ({
          user: i.userName,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={`${
                i.status === "Processing"
                  ? "text-red-500"
                  : i.status === "Shipped"
                  ? "text-green-500"
                  : "text-purple-500"
              }`}
            >
              {i.status}
            </span>
          ),
          action: <Link href={`/admin/transaction/${i._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />

      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[calc(100vh-41px)]">
          <CircleLoader />
        </div>
      ) : (
        <main>{Table}</main>
      )}
    </div>
  );
};

export default Transaction;
