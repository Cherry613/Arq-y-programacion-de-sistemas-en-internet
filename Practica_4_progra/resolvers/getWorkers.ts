import {Request, Resonse} from "npm:express@4.18.2";
import  TrabajadorModel from "../db/trabajador.ts";

const getWorkers = async ( req: Request, res: Resonse ) => {

    try{
        const trabajadores = await TrabajadorModel.find().populate(["empresa", "tareas"]).exec();
        
        res.status(200).send(trabajadores);

    }catch(error){
        res.status(404).send(error.message)
        return;
    }
}


export default getWorkers;