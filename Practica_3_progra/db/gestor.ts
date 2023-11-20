import mongoose from "npm:mongoose@7.6.3";
import { Gestor } from "../types.ts";

const Schema = mongoose.Schema;

const gestorSchema = new Schema(
  {
    nombre: { type: String, required: true},
    dni: { type: String, required: true},
    clientes: { type: [String], required: false, default: []},

  },
  { timestamps: true }
);

export type GestorModelType = mongoose.Document & Omit<Gestor, "id">;

export default mongoose.model<GestorModelType>("Gestor", gestorSchema);

/*
  name: string;
  dni: string;
  clientes: string[]; //max 10 
*/