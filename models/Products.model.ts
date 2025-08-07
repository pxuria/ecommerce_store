import { Schema, model, models } from "mongoose";
import { IProduct } from "@/types";

const sizeSchema = new Schema({
  name: {
    type: String,
    required: [true, "product size is required"],
  },
  stockCount: {
    type: Number,
    min: 0,
    required: [true, "stock count for size is required"],
  },
  price: {
    type: Number,
    min: 0,
    required: [true, "price for size is required"],
  },
});

const colorSchema = new Schema({
  name: {
    type: String,
    required: [true, "product color is required"],
  },
  sizes: [sizeSchema],
});

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
    basePrice: {
      type: Number,
      min: 0,
      required: [true, "base product price is required"],
    },
    stock: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    colors: [colorSchema],
    image: [
      {
        type: String,
        required: [true, "at least one image is required"],
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.stock = this.colors.some((color) =>
    color.sizes.some((size) => size.stockCount > 0)
  );
  next();
});

const Product = models.Product || model<IProduct>("Product", productSchema);
export default Product;
