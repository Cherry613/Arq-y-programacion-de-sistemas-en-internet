import {Request, Resonse} from "npm:express@4.18.2";
import  TrabajadorModel from "../db/trabajador.ts";

const getWorkerID = async ( req: Request, res: Resonse ) => {
    try{
        const {id} = req.params;

        const trabajadores = await TrabajadorModel.findOne({_id: id}).populate(["empresa", "tareas"]).exec();
        
        if(!trabajadores){
            res.status(400).send("No se ha encontrado el trabajador");
            return;
        }

        res.status(200).send({
            nombre: trabajadores.nombre,
            empresa: trabajadores.empresa,
            tareas: trabajadores.tareas,
            id: trabajadores._id.toString(),
        });

    }catch(error){
        res.status(404).send(error.message)
        return;
    }
}


export default getWorkerID;