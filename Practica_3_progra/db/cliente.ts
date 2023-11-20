import mongoose from "npm:mongoose@7.6.3";
import { Cliente } from "../types.ts";

const Schema = mongoose.Schema;

const clienteSchema = new Schema(
  {
    dni: {type: String, required: true},
    nombre: { type: String, required: true},
    dinero: { type: Number, required: true, default: 0},
    id_gestor: {type: String, requited: false, default: ""},
    hipotecas: { type: [String], required: false},
    movimientos: { type: [String], required: false} 
  },
  { timestamps: true }
);

export type ClienteModelType = mongoose.Document & Omit<Cliente, "id">;

export default mongoose.model<ClienteModelType>("Cliente", clienteSchema);

/*
  dni: string;
  name: string;
  dinero: number;
  id_gestor: string;
  hipotecas: string[];
  movimientos: string[];
   
*/