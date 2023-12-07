import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@8.0.0";

import getWorkers from "./resolvers/getWorkers.ts";
import getWorkerID from "./resolvers/getWorkerID.ts";
import deleteWorker from "./resolvers/deleteWorker.ts";
import addWorker from "./resolvers/addWorker.ts";

import getBusinessID from "./resolvers/getBusinessID.ts";
import getBusiness from "./resolvers/getBusiness.ts";
import deleteBusiness from "./resolvers/deleteBusiness.ts";
import addBusiness from "./resolvers/addbusiness.ts";
import fireWorker from "./resolvers/fireWorker.ts";
import hireWorker from "./resolvers/hireWorker.ts";

import getTareaID from "./resolvers/getTareaID.ts";
import getTareas from "./resolvers/getTareas.ts";
import deleteTask from "./resolvers/deleteTask.ts";
import addTask from "./resolvers/addTask.ts";
import updateStatus from "./resolvers/updateStatus.ts";

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
  .get ("/worker/:id", getWorkerID)
  .get("/business/:id", getBusinessID)
  .get("/task/:id", getTareaID)
  .delete("/worker/:id", deleteWorker)
  .delete("/business/:id", deleteBusiness)  
  .delete("/task/:id", deleteTask)  
  .get("/worker", getWorkers)
  .get("/business", getBusiness)  
  .get("/task", getTareas)  
  .post("/worker", addWorker)  
  .post("/business", addBusiness) 
  .post ("/task", addTask) 
  .put("/business/:id/fire/:workerID", fireWorker) 
  .put("/business/:id/hire/:workerID", hireWorker)  
  .put("/task/:id", updateStatus)  

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
