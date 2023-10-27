import mongoose from "npm:mongoose@7.6.3";
import { Personaje } from "../types.ts";

const Schema = mongoose.Schema;

const personajeSchema = new Schema(
  {
    name: { type: String, required: true },
    raza: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: String, required: true}
  },
  { timestamps: true }
);

export type PersonajeModelType = mongoose.Document & Omit<Personaje, "id">;

export default mongoose.model<PersonajeModelType>("Personaje", personajeSchema);