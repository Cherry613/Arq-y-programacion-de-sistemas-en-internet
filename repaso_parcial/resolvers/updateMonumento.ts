import {Request, Response} from "npm:express@4.17.2";
import { MonumentoModel } from "../db/monumento.ts";

const updateMonumento =async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const {nombre, descripcion, cod_postal, cod_iso} = req. body;

        if(!id){
            res.status(400).send("Falta el id");
            return;
        }

        if( typeof id !== "string"){
            res.status(400).send("El id debe ser de tipo string");
            return;
        }

        //comprobar que minimo se da un valor a actualizar
        if(!nombre && !descripcion && !cod_postal && !cod_iso){
            res.status(400).send("Faltan datos");
            return;
        }

        const exists = await MonumentoModel.findById(id).exec();
        if(!exists){
            res.status(404).send(`No se ha encontrado ningun monumento con el id ${id}`);
            return;
        }

        const monumento = await MonumentoModel.findOneAndUpdate({_id: id}, {nombre, descripcion, cod_postal, cod_iso}, {new: true}).exec();
        if(!monumento){
            res.status(400).send("No se ha actualizado el monumento");
            return;
        }

        res.status(200).send({
            nombre: monumento.nombre,
            descripcion: monumento.descripcion,
            cod_postal: monumento.cod_postal,
            cod_iso: monumento.cod_iso,
            id: monumento._id.toString(),
        });
        

    }catch(error){
        res.status(500).send(error.message);
        return;
   }
    
}

export default updateMonumento;