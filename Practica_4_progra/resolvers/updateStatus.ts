import {Request, Resonse} from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";

const updateStatus =async (req: Request, res:Resonse) => {
    try{

        const {id} = req.params;
        const status = req.query.status;
        
        const tarea = await TareaModel.findOneAndUpdate({_id: id}, {estado: status}).exec();
        if(!tarea) throw new Error ("No se ha encontrado la tarea");

        res.status(200).send("El estado de la tarea ha sido actualizado");
        return;
        
    }catch(error){
        res.status(400).send(error);
        return error;
    }
}

export default updateStatus;