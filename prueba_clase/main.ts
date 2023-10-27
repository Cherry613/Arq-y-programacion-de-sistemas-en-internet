import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";

import getPersonajes from "./resolvers/getPersonajes.ts";
import addPersonaje from "./resolvers/addPersonaje.ts";
import deletePersonaje from "./resolvers/deletePersonaje.ts";
import getPersonajesId from "./resolvers/getPersonajesId.ts";
import updatePersonaje from "./resolvers/updatePersonaje.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

//const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");
const MONGO_URL = "mongodb+srv://shernandezj1:123@cluster0.jgjnh41.mongodb.net/bd_tierramedia?retryWrites=true&w=majority";

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
  
  .get("/api/tierramedia/personajes", getPersonajes)
  .get("/api/tierramedia/personajes/:id", getPersonajesId)
  .post("/api/tierramedia/personajes", addPersonaje)
  .put("/api/tierramedia/personajes/:id", updatePersonaje)
  .delete("/api/tierramedia/personajes/:id", deletePersonaje)  

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});