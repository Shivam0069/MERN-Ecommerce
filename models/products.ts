import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter Product Name"] },
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    description: {
      type: String,
      required: [true, "Please enter Description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Product Category"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.products || mongoose.model("products", productSchema);

export default Product;
