import { Request, Response } from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";
import TrabajadorModel from "../db/trabajador.ts";

const fireWorker = async (req: Request, res: Response) => {
    try{
        const { id, workerID } = req.params;

        const empresa = await EmpresaModel.findById(id).exec();
        if(!empresa) throw new Error(`No se ha encontrado una empresa con el id ${id}`);

        await EmpresaModel.findOneAndUpdate({_id: id},{$pull: {trabajadores: workerID}}).exec();
        await TrabajadorModel.findOneAndUpdate({_id: workerID}, {empresa: null}).exec();

        res.status(200).send(`Se ha despedido al trabajador ${workerID}`);

    }catch(error){
        res.status(400).send(error)
        return error;
    }
}

export default fireWorker;