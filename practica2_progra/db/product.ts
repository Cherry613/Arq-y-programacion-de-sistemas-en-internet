import mongoose from "npm:mongoose@7.6.3";
import { Product } from "../types.ts";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    stock: { type: Number, required: false, default: 0 },
    description: { type: String, required: false },
    price: { type: Number, required: true}
  },
  { timestamps: true }
);

export type ProductModelType = mongoose.Document & Omit<Product, "id">;

export default mongoose.model<ProductModelType>("Product", productSchema);