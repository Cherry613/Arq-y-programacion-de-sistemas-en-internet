import {Request, Resonse} from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";

const getBusiness = async ( req: Request, res: Resonse ) => {
    try{
        const empresa = await EmpresaModel.find()/*.populate(["trabajadores", "tareas"])*/.exec();
        
        res.status(200).send(empresa);

    }catch(error){
        res.status(404).send(error.message)
        return;
    }
}

export default getBusiness;