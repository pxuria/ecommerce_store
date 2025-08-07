import { Schema, model, models } from "mongoose";
import { ICategory } from "@/types";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [1, "Category name must be at least 1 characters long"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    enName: {
      type: String,
      required: [true, "Category en name is required"],
      unique: true,
      trim: true,
      minlength: [1, "Category en name must be at least 1 characters long"],
      maxlength: [50, "Category en name cannot exceed 50 characters"],
    },
  },
  { timestamps: true }
);

const Category =
  models.Category || model<ICategory>("Category", categorySchema);
export default Category;
