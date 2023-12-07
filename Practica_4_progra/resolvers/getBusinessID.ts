import {Request, Resonse} from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";

const getBusinessID = async ( req: Request, res: Resonse ) => {
    try{
        const {id} = req.params;

        const empresa = await EmpresaModel.findOne({_id: id}).populate(["trabajadores", "tareas"]).exec();
        
        if(!empresa){
            res.status(400).send("No se ha encontrado la empresa");
            return;
        }

        res.status(200).send({
            nombre: empresa.nombre,
            trabajadores: empresa.trabajadores,
            tareas: empresa.tareas,
            id: empresa._id.toString(),
        });

    }catch(error){
        res.status(404).send(error.message)
        return;
    }
}


export default getBusinessID;