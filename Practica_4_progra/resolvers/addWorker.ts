import {Request, Resonse} from "npm:express@4.18.2";
import TrabajadorModel from "../db/trabajador.ts";

const addWorker = async (req: Request, res: Resonse) => {
    try{
        const {nombre, dni, empresa} = req.body;

        const newTrabajador = new TrabajadorModel({nombre, dni, empresa});
        await newTrabajador.save();

        res.status(200).send({
            nombre: newTrabajador.nombre,
            dni: newTrabajador.dni,
            empresa: newTrabajador.empresa,
            id: newTrabajador._id.toString()
        })

    }catch(error){
        return error;
    }

}

export default addWorker;