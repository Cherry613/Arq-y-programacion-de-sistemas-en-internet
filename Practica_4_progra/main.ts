import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@8.0.0";

import getWorkers from "./resolvers/getWorkers.ts";
import getWorkersID from "./resolvers/getWorkers.ts";
import getBusinessID from "./resolvers/getBusinessID.ts";
import getBusiness from "./resolvers/getBusiness.ts";
import getTareaID from "./resolvers/getTareaID.ts";
import getTareas from "./resolvers/getTareas.ts";
import deleteWorker from "./resolvers/deleteWorker.ts";
import deleteBusiness from "./resolvers/deleteBusiness.ts";
import deleteTask from "./resolvers/deleteTask.ts";
import addWorker from "./resolvers/addWorker.ts";
import addBusiness from "./resolvers/addbusiness.ts";
import addTask from "./resolvers/addTask.ts";

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
  .get ("/worker/:id", getWorkersID)  //DONE
  .get("/business/:id", getBusinessID)  //DONE
  .get("/task/:id", getTareaID)  //DONE
  .delete("/worker/:id", deleteWorker)  //DONE ->revisar
  .delete("/business/:id", deleteBusiness)  //DONE -> sí
  .delete("/task/:id", deleteTask)  //DONE -> revisar
  .get("/worker", getWorkers) //DONE
  .get("/business", getBusiness)  //DONE 
  .get("/task", getTareas)  //DONE
  .post("/worker", addWorker)  //DONE -> revisar
  .post("/business", addBusiness) //DONE -> si
  .post ("/task", addTask) //DONE -> revisar
  .put("/business/:id/fire/:workerID", )  //business/:id/fire/:workerId -> Deberá despedir de la empresa al trabajador que corresponde al id
  .put("/business/:id/hire/:workerID", )  //business/:id/hire/:workerId -> Deberá contratar de la empresa al trabajador que corresponde al id
  .put("/task/:id", )  ///task/:id?status=x -> Cambiara el estado de una tarea

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

/*
Cuando se elimina una tarea/trabajador/empresa, se deberá eliminar de sus dependencias (ids relacionados)
Cuando se devuelva una tarea/trabajador/empresa, se deberá devolver también los datos de sus dependencias (usando populate)
*/