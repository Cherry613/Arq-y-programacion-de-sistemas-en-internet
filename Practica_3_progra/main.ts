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
//import "./resolvers/ingresar_tiempo.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}
try {
  await mongoose.connect(MONGO_URL);
} catch (error) {
  console.log(error.message)
}

const app = express();
app.use(express.json());
app
  .post ("/cliente", addCliente)
  .delete("/cliente/:_id", deleteCliente)
  .put("/cliente/:id1/:id2", enviar_dinero)
  .put("/cliente/:id", ingresar_dinero)
  .post("/hipoteca", addHipoteca)
  .put("/hipoteca/:id_hipoteca", amortizar)
  .post("/gestor", addGestor)
  .put("/asignar/:_id", asignar_gestor)

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});  


/*
1. Permite crear clientes para un banco
2. Permite borrar clientes
3. Permite enviar dinero de un cliente a otro
4. Permite ingresar dinero a un cliente
5. Permite crear hipotecas
6. Permite amortizar una hipoteca a un cliente
7. Permite crear gestores
8. Permite asignar un gestor a un cliente
*/