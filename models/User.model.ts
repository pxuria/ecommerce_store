import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types";

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, "email already exists"],
      required: [true, "email is required"],
    },
    first_name: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
      default: "",
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, "last name is required"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
      default: "",
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      required: [true, "password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    postal_code: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
      maxlength: [75, "Last name cannot exceed 75 characters"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    console.error("Error comparing passwords:", error);
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

const User = models.User || model<IUser>("User", userSchema);
export default User;
