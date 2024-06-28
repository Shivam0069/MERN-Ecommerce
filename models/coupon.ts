import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please enter a valid coupon code"],
    unique: true,
  },
  amount: {
    type: Number,
    required: [true, "Please enter the Discount Amount"],
  },
});

const Coupon =
  mongoose.models.coupons || mongoose.model("coupons", couponSchema);

export default Coupon;
