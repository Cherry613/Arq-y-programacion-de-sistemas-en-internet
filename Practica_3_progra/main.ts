import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";

import addCliente from "./resolvers/addCliente.ts";
import deleteCliente from "./resolvers/deleteClients.ts";
import enviar_dinero from "./resolvers/enviar_dinero.ts";
import ingresar_dinero from "./resolvers/Ingresar_dinero.ts";
import addHipoteca from "./resolvers/addHipoteca.ts";
import amortizar from "./resolvers/Amortizar_hipoteca.ts";
import addGestor from "./resolvers/addGestor.ts";
import asignar_gestor from "./resolvers/asignar_gestor.ts";

import "./resolvers/ingresar_tiempo.ts";
import "./resolvers/amortizar_tiempo.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}
try {
  await mongoose.connect(MONGO_URL);
  console.log("Conectado a mongo.");
} catch (error) {
  console.log(error.message)
}

const app = express();
app.use(express.json());
app
  .post ("/cliente", addCliente)                  //1. Permite crear clientes para un banco
  .delete("/cliente/:_id", deleteCliente)         //2. Permite borrar clientes
  .put("/cliente/:id1/:id2", enviar_dinero)       //3. Permite enviar dinero de un cliente a otro
  .put("/cliente/:id", ingresar_dinero)           //4. Permite ingresar dinero a un cliente
  .post("/hipoteca", addHipoteca)                 //5. Permite crear hipotecas
  .put("/hipoteca/:id_hipoteca", amortizar)       //6. Permite amortizar una hipoteca a un cliente
  .post("/gestor", addGestor)                     //7. Permite crear gestores
  .put("/asignar/:_id", asignar_gestor)           //8. Permite asignar un gestor a un cliente

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});  
