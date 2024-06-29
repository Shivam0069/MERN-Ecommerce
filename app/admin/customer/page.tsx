"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TableHOC from "@/components/admin/TableHOC";
import Loader, { CircleLoader } from "@/helper/loader";
import { useDeleteProductMutation } from "@/store/api/productAPI";
import { useAllUsersQuery, useDeleteUserMutation } from "@/store/api/userAPI";
import { responseToast } from "@/utils/features";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import "../../globals.css";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { userData } = useSelector((state: any) => state.user);
  const { data, isLoading, isError } = useAllUsersQuery(userData?._id);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const onDeleteUser = async ({ id }: { id: string }) => {
    const res = await deleteUser({ adminUserId: userData?._id!, userId: id });
    responseToast(res);
  };

  const [rows, setRows] = useState<DataType[]>([]);
  useEffect(() => {
    if (data) {
      setRows(
        data?.users.map((i, idx) => ({
          key: idx,
          avatar: <img src={i.photo} />,
          name: i.name,
          email: `${i.email.split("@")[0]} @${i.email.split("@")[1]}`,
          gender: i.gender,
          role: i.role,
          action: (
            <button
              onClick={() => {
                if (i.role !== "admin") {
                  onDeleteUser({ id: i._id });
                } else {
                  toast.error("Can not delete a admin");
                }
              }}
            >
              <FaTrash />
            </button>
          ),
        }))
      );
    }
  }, [data]);
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isDeleting && <Loader />}
      <main>{isLoading ? <CircleLoader /> : Table}</main>
    </div>
  );
};

export default Customers;
