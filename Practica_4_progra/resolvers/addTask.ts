import {Request, Resonse} from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";

const addTask = async (req: Request, res: Resonse) => {
    try{
        const {nombre, estado, trabajador, empresa} = req.body;

        const newTarea = new TareaModel({nombre, estado, trabajador, empresa});
        await newTarea.save();

        res.status(200).send({
            nombre: newTarea.nombre,
            estado: newTarea.estado,
            trabajador: newTarea.trabajador,
            empresa: newTarea.empresa,
            id: newTarea._id.toString()
        })

    }catch(error){
        return error;
    }

}

export default addTask;