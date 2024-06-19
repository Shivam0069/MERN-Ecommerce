"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Loader, { CircleLoader } from "@/helper/loader";
import {
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "@/store/api/orderAPI";
import { CustomError } from "@/types/api-types";
import { Order, OrderItem } from "@/types/types";
import { responseToast } from "@/utils/features";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const TransactionManagement = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [order, setOrder] = useState<Order>();
  const userData = useSelector((state: any) => state.user.userData);
  const router = useRouter();

  const { data, isLoading, isError, error } = useGetOrderByIdQuery(id);
  useEffect(() => {
    if (data) {
      setOrder(data.order);
    }
  }, [data]);
  if (!isLoading && !data) {
    router.push("/not-found");
  }
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const deleteHandler = async () => {
    const res = await deleteOrder({ orderId: id, userId: userData?._id! });
    responseToast(res, router, "/admin/transaction");
  };
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const updateHandler = async () => {
    const res = await updateOrder({ orderId: id, userId: userData?._id! });
    responseToast(res, router, "/admin/transaction");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      {(isDeleting || isUpdating) && <Loader />}
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <CircleLoader />
        </div>
      ) : (
        data && (
          <main className="product-management !py-0">
            <section
              className="!max-h-[calc(100vh-41px)] overflow-auto scrollbar-hide"
              style={{
                padding: "2rem",
              }}
            >
              <h2>Order Items</h2>

              {order?.orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card !max-h-[calc(100vh-41px)]  overflow-auto scrollbar-hide">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {order?.userName}</p>
              <p>
                Address:{" "}
                {`${order?.shippingInfo.address}, ${order?.shippingInfo.city}, ${order?.shippingInfo.state}, ${order?.shippingInfo.country} ${order?.shippingInfo.pinCode}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {order?.subtotal}</p>
              <p>Shipping Charges: {order?.shippingCharges}</p>
              <p>Tax: {order?.tax}</p>
              <p>Discount: {order?.discount}</p>
              <p>Total: {order?.total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    order?.status === "Delivered"
                      ? "purple"
                      : order?.status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {order?.status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </main>
        )
      )}
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className=" flex text-lg items-center gap-4 ">
    <img src={photo} alt={name} className="!h-28 !w-28 " />
    <div className="!flex flex-col">
      <Link href={`/product/${productId}`}>{name}</Link>
      <div>
        ₹{price} X {quantity} = ₹{price * quantity}
      </div>
    </div>
  </div>
);

export default TransactionManagement;
