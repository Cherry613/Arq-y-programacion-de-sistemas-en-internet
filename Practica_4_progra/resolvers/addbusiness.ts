import {Request, Resonse} from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";

const addBusiness = async (req: Request, res: Resonse) => {
    try{
        const {nombre, trabajadores, tareas} = req.body;

        const newEmpresa = new EmpresaModel({nombre, trabajadores, tareas});
        await newEmpresa.save();

        res.status(200).send({
            nombre: newEmpresa.nombre,
            trabajadores: newEmpresa.trabajadores,
            tareas: newEmpresa.tareas,
            id: newEmpresa._id.toString()
        });

    }catch(error){
        return error;
    }
}

export default addBusiness;