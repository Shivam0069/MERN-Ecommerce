"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader, { CircleLoader } from "@/helper/loader";
import {
  useDeleteProductMutation,
  useProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/api/productAPI";
import { CustomError } from "@/types/api-types";
import { responseToast } from "@/utils/features";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "../../../globals.css";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const submitHandler = async () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 md:p-8 max-h-[calc(100vh-41px)] overflow-auto scrollbar-hide">
          <div className="relative grid gap-4">
            <Button
              className="absolute top-0 left-0"
              onClick={() => window.history.back()}
            >
              <UploadIcon className="md:hidden w-5 h-5 -rotate-90" />
              <p className="hidden md:flex">Back</p>
            </Button>
            <img
              src={data?.product.photo}
              alt={data?.product.name}
              width={600}
              height={600}
              className="w-full aspect-square object-cover rounded-full"
            />
            <div className="grid gap-1">
              <p className="text-sm text-muted-foreground">Product ID</p>
              <p className="font-medium">{data?.product._id}</p>
            </div>
            <div className="grid gap-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{data?.product.name}</p>
            </div>
            <div className="grid gap-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">&#8377;{data?.product.price}</p>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                defaultValue="Gamer Gear Pro Controller"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                defaultValue={99.99}
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                defaultValue={100}
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                placeholder="Game"
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="photo">Photo</Label>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    onChange={changeImageHandler}
                  />
                  <Button
                    onClick={triggerFileInput}
                    variant="ghost"
                    size="icon"
                  >
                    <UploadIcon className="w-5 h-5" />
                  </Button>
                </div>
                {photoUpdate && (
                  <div className="grid grid-cols-1">
                    <img
                      src={photoUpdate}
                      alt="Product Image"
                      className="w-44 mx-auto aspect-square object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={deleteHandler} variant="outline">
                Delete
              </Button>
              <Button onClick={submitHandler}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productmanagement;

function UploadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
