import {Request, Resonse} from "npm:express@4.18.2";
import TrabajadorModel from "../db/trabajador.ts";

const addWorker = async (req: Request, res: Resonse) => {
    try{
        const {nombre, empresa} = req.body;

        const newTrabajador = new TrabajadorModel({nombre, empresa});
        await newTrabajador.save();

        res.status(200).send({
            nombre: newTrabajador.nombre,
            empresa: newTrabajador.empresa,
            id: newTrabajador._id.toString()
        })

    }catch(error){
        res.status(400).send(error)
        return error;
    }

}

export default addWorker;