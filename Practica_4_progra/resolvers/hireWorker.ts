import { Request, Response } from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";


const hireWorker = async (req: Request, res: Response) => {

    try{
        const {id, workerID} = req.params;

        const empresa = await EmpresaModel.findById({_id: id}).exec();
        if(!empresa) throw new Error (`No se ha encontrado la empresa con id ${id}`);

        await EmpresaModel.findOneAndUpdate({_id: id}, {$push: {trabajadores: workerID}}, {new: true}).exec();
        res.status(200).send(`Se ha contratado al trabajador ${workerID}`);

    }catch(error){
        res.send(400).send(error)
        return error;
    }
    
}

export default hireWorker;