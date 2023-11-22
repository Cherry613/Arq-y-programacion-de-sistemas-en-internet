import mongoose from "npm:mongoose@8.0.0";
import { Hipoteca } from "../types.ts";

const Schema = mongoose.Schema;

const hipotecaSchema = new Schema(
  {
    importe_total: {type: Number, required: true},
    cuotas: {type: Number, required: false, default: 20},
    id_cliente: { type: String, required: true },
    id_gestor: { type: String, required: true },

  },
  { timestamps: true }
);

export type hipotecaModelType = mongoose.Document & Omit<Hipoteca, "id">;

export default mongoose.model<hipotecaModelType>("Hipoteca", hipotecaSchema);