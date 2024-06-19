"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Loader, { CircleLoader } from "@/helper/loader";
import {
  useDeleteProductMutation,
  useProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/api/productAPI";
import { CustomError } from "@/types/api-types";
import { responseToast } from "@/utils/features";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const Productmanagement = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const userData = useSelector((state: any) => state.user.userData);

  const { data, isLoading, isError, error } = useProductByIdQuery(id);

  const router = useRouter();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [priceUpdate, setPriceUpdate] = useState<number>(0);
  const [stockUpdate, setStockUpdate] = useState<number>(0);
  const [nameUpdate, setNameUpdate] = useState<string>("");
  const [categoryUpdate, setCategoryUpdate] = useState<string>("");
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (data) {
      setPhoto(data.product.photo || "");
      setName(data.product.name || "");
      setCategory(data.product.category || "");
      setPrice(data.product.price ?? 0);
      setStock(data.product.stock ?? 0);

      setPhotoUpdate(data.product.photo || "");
      setNameUpdate(data.product.name || "");
      setCategoryUpdate(data.product.category || "");
      setPriceUpdate(data.product.price ?? 0);
      setStockUpdate(data.product.stock ?? 0);
    }
  }, [data]);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    let hasChanges = false;

    if (name !== nameUpdate) {
      formData.set("name", nameUpdate);
      hasChanges = true;
    }
    if (price !== priceUpdate) {
      formData.set("price", priceUpdate.toString());
      hasChanges = true;
    }
    if (stock !== stockUpdate) {
      formData.set("stock", stockUpdate.toString());
      hasChanges = true;
    }
    if (category !== categoryUpdate) {
      formData.set("category", categoryUpdate);
      hasChanges = true;
    }
    if (photoFile) {
      formData.set("photo", photoFile);
      hasChanges = true;
    }

    if (hasChanges) {
      const res = await updateProduct({
        userId: userData?._id!,
        productId: id,
        formData,
      });
      responseToast(res, router, "/admin/product");
    } else {
      toast.error("No changes detected.");
    }
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const deleteHandler = async () => {
    const res = await deleteProduct({ productId: id, userId: userData?._id! });
    responseToast(res, router, "/admin/product");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isUpdating || (isDeleting && <Loader />)}
      {isLoading ? (
        <div className=" h-[calc(100vh-85px)] flex justify-center items-center">
          <CircleLoader />
        </div>
      ) : (
        <main className="product-management !py-0 !gap-2 ">
          <section className="!max-h-[calc(100vh-85px)]  ">
            <strong className="text-sm">ID - {id}</strong>
            <img src={data?.product.photo} alt="Product" />
            <p>{name}</p>
            {data?.product.stock! > 0 ? (
              <span className="green">{data?.product.stock} Available</span>
            ) : (
              <span className="red"> Not Available</span>
            )}
            <h3>₹{data?.product.price}</h3>
          </section>
          <article className="!py-4 !max-h-[calc(100vh-85px)] overflow-x-hidden !overflow-y-auto scrollbar-hide">
            <button onClick={deleteHandler} className="product-delete-btn">
              <FaTrash />
            </button>
            <form onSubmit={submitHandler} className=" ">
              <h2>Manage</h2>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={nameUpdate}
                  onChange={(e) => setNameUpdate(e.target.value)}
                />
              </div>
              <div>
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={priceUpdate}
                  onChange={(e) => setPriceUpdate(Number(e.target.value))}
                />
              </div>
              <div>
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={stockUpdate}
                  onChange={(e) => setStockUpdate(Number(e.target.value))}
                />
              </div>

              <div>
                <label>Category</label>
                <input
                  type="text"
                  placeholder="eg. laptop, camera etc"
                  value={categoryUpdate}
                  onChange={(e) => setCategoryUpdate(e.target.value)}
                />
              </div>

              <div className="">
                <label>Photo</label>
                <input type="file" onChange={changeImageHandler} />
              </div>

              {photoUpdate && <img src={photoUpdate} alt="New Image" />}
              <button type="submit">
                {" "}
                {isUpdating ? "Updating..." : "Update"}{" "}
              </button>
            </form>
          </article>
        </main>
      )}
    </div>
  );
};

export default Productmanagement;
