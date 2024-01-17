import {Request, Response} from "npm:express@4.17.2";
import { MonumentoModel } from "../db/Monumento.ts";

const getMonumentos = async (req: Request, res: Response) => {
    try{
        const monumentos = await MonumentoModel.find().exec();

        res.status(200).send(monumentos.map((elem) => ({
            id: elem._id.toString(),
            nombre: elem.nombre,
            descripcion: elem.descripcion,
            cod_postal: elem.cod_postal,
            cod_iso: elem.cod_iso
        })));

    }catch(error){
        res.status(500).send(error.message);
        return;
    }
};

export default getMonumentos;