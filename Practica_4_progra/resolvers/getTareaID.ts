import {Request, Resonse} from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";

const getTareaID = async ( req: Request, res: Resonse ) => {
    try{
        const {id} = req.params;
        const tarea = await TareaModel.findOne({_id: id}).populate(["trabajador", "empresa"]).exec();
        
        if(!tarea){
            res.status(400).send("No se ha encontrado la tarea");
            return;
        }

        res.status(200).send(tarea);

    }catch(error){
        res.status(404).send(error.message)
        return;
    }
}

//Cuando se devuelva una tarea/trabajador/empresa, se deberá devolver también los datos de sus dependencias (usando populate)

export default getTareaID;