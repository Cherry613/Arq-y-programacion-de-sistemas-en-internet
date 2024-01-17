import {Request, Response} from "npm:express@4.17.2";
import { MonumentoModel } from "../db/Monumento.ts";

const deleteMonumento = async (req: Request, res: Response) => {

    try{
        const {id} = req.params;

        //-------------------------------------------------------- profe
        if(!id){
            res.status(400).send("Debe proporcionarse un id");
            return;
        }

        if(typeof id !=="string"){
            res.status(400).send("El id debe ser un string");
            return;
        }
        //----------------------------------------------------------

        const monumento = await MonumentoModel.findByIdAndDelete(id).exec();
        if(!monumento){
            res.status(404).send(`No se ha encontrado ningun monumento con el id ${id}`);
            return;
        }

        res.status(200).send("Monumento borrado");

    }catch(error){
        res.status(500).send(error.message);
        return;
    }
};

export default deleteMonumento;