"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TableHOC from "@/components/admin/TableHOC";
import { CircleLoader } from "@/helper/loader";
import { useAdminProductsQuery } from "@/store/api/productAPI";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const { userData } = useSelector((state: any) => state.user);
  const { data, isLoading, isError } = useAdminProductsQuery(userData?._id);
  const [rows, setRows] = useState<DataType[]>([]);
  useEffect(() => {
    if (data) {
      setRows(
        data.products.map((i) => ({
          photo: <img src={i.photo} />,
          name: i.name,
          price: i.price,
          stock: i.stock,
          action: <Link href={`/admin/product/${i._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container  ">
      <AdminSidebar />
      <main>{isLoading ? <CircleLoader /> : Table}</main>
      <Link href="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
