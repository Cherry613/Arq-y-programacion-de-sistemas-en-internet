import {Request, Resonse} from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";

const getTareas = async ( req: Request, res: Resonse ) => {
    try{
        const tarea = await TareaModel.find().populate(["trabajador", "empresa"]).exec();
        
        res.status(200).send(tarea);

    }catch(error){
        res.status(404).send(error.message)
        return;
    }
}

//Cuando se devuelva una tarea/trabajador/empresa, se deberá devolver también los datos de sus dependencias (usando populate)

export default getTareas;