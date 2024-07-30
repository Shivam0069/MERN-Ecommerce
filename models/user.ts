import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

// Define the TypeScript interface that matches the schema
interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  password?: string;
  type: "credential" | "google";
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  age: number; // Virtual property
  createdAt: Date;
  updatedAt: Date;
  orderedProduct: string[];
}

// Create the schema with the fields and types defined
const userSchema: Schema<IUser> = new Schema(
  {
    _id: {
      type: String,
      required: [true, "Please enter ID"],
    },
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter Email"],
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: function () {
        return this.type === "credential";
      },
    },
    photo: {
      type: String,
      required: [true, "Please add Photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "plus"],
      default: "user",
    },
    type: {
      type: String,
      enum: ["credential", "google"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please enter Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please enter Date of birth"],
    },
    orderedProduct: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt timestamps
  }
);

// Create a virtual property 'age' to calculate the age based on 'dob'
userSchema.virtual("age").get(function (this: IUser) {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

// Create and export the model
const User =
  mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;
