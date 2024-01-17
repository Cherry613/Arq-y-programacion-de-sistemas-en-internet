import mongoose from "npm:mongoose@8.0.0";
import express from "npm:express@4.18.2";

import addMonumento from "./resolvers/addMonumento.ts";
import deleteMonumento from "./resolvers/deleteMonumento.ts";
import updateMonumento from "./resolvers/updateMonumento.ts";
import getMonumentoID from "./resolvers/getMonumentoID.ts";
import getMonumentos from "./resolvers/getMonumentos.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL") || "";
const PORT = 3000;

if(!MONGO_URL){
    console.log("No Mongo URL found");
    //Deno.exit(1);
}

//conectar con mongo
try{
    await mongoose.connect(MONGO_URL);
    console.log("conectado a mongo");
}catch(error){
    console.log(error.message)
}

const app = express();
app.use(express.json());

//endpoints
app
    .get("GET/api/monumentos", getMonumentos)
    .get("GET/api/monimentos/:id", getMonumentoID)
    .post("POST/api/monumentos", addMonumento)  
    .put("PUT/api/monumentos/:id", updateMonumento)
    .delete("DELETE/api/monumentos/:id", deleteMonumento) 
    
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});