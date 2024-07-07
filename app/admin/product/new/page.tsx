"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/helper/loader";
import { useNewProductMutation } from "@/store/api/productAPI";
import { responseToast } from "@/utils/features";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "../../../globals.css";
const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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
  const submitHandler = async () => {
    if (!name || !stock || !price || !photo || !category) {
      toast.error("Fill all the fields");
      return;
    }
    console.log(description, "description");

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("photo", photo);
    formData.set("category", category);
    formData.set("description", description);

    const res = await newProduct({ id: userData?._id!, formData: formData });
    responseToast(res, router, "/admin/product");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isAdding && <Loader />}

      <div className="max-h-[calc(100vh-41px)] overflow-auto scrollbar-hide w-full">
        <div className="flex flex-col items-center justify-center  bg-muted/40">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Product</CardTitle>
              <CardDescription>
                Fill out the form to add a new product.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  placeholder="Product Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  id="price"
                  type="number"
                  placeholder="Price"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  id="stock"
                  type="number"
                  placeholder="Stock"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  id="category"
                  type="text"
                  placeholder="Category"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  type="text"
                  placeholder="Description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo">Photo</Label>
                <Input onChange={changeImageHandler} id="photo" type="file" />
              </div>
              {photoPrev && (
                <img
                  src={photoPrev}
                  className="w-40 h-40 rounded-full mx-auto"
                  alt="New Image"
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
              <Button onClick={submitHandler}>Create</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
