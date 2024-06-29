"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Loader from "@/helper/loader";
import { useNewProductMutation } from "@/store/api/productAPI";
import { responseToast } from "@/utils/features";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "../../../globals.css";

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();
  const userData = useSelector((state: any) => state.user.userData);
  const [newProduct, { isLoading: isAdding }] = useNewProductMutation();
  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };
  const router = useRouter();
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !stock || !price || !photo || !category) {
      toast.error("Fill all the fields");
      return;
    }
    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("photo", photo);
    formData.set("category", category);

    const res = await newProduct({ id: userData?._id!, formData: formData });
    responseToast(res, router, "/admin/product");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isAdding && <Loader />}
      <main className="product-management !py-0  ">
        <article className="!py-2 !max-h-[calc(100vh-41px)] overflow-y-auto scrollbar-hide">
          <form className="" onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                className="!py-1"
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                className="!py-1"
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                className="!py-1"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                required
                className="!py-1"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>

              <input
                required
                type="file"
                onChange={changeImageHandler}
                className="!py-1"
              />
            </div>

            {photoPrev && <img src={photoPrev} alt="New Image" />}
            <button className="!py-1" type="submit">
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
