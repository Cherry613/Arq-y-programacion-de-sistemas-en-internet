import mongoose from "npm:mongoose@7.6.3";
import { Invoice } from "../types.ts";

const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
  {
    client: { type: String, required: true },
    products: { type: Array, required: true },
    total: { type: Number, required: true},
  },
  { timestamps: true }
);

export type InvoiceModelType = mongoose.Document & Omit<Invoice, "id">;

export default mongoose.model<InvoiceModelType>("Invoice", invoiceSchema);