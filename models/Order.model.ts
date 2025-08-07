import { Schema, model, models } from "mongoose";
import { IOrder } from "@/types";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        color: { type: String },
        size: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    tracking_code: {
      type: String,
      unique: true,
      required: true,
      default: () => generateTrackingCode(),
    },
    paymentAuthority: {
      type: String,
      unique: true,
      required: false,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

function generateTrackingCode(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

orderSchema.pre("save", async function (next) {
  if (!this.tracking_code) {
    let uniqueCode: string = "";
    let isUnique = false;

    while (!isUnique) {
      uniqueCode = generateTrackingCode();
      const existingOrder = await models.Order.findOne({
        tracking_code: uniqueCode,
      });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    this.tracking_code = uniqueCode;
  }

  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  next();
});

const Order = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
