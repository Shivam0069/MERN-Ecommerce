import mongoose from "mongoose";

const newsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NewsLetter =
  mongoose.models.newsletters ||
  mongoose.model("newsletters", newsLetterSchema);

export default NewsLetter;
