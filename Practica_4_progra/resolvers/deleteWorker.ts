import { Request, Response } from "npm:express@4.18.2";
import TrabajadorModel from "../db/trabajador.ts";


const deleteWorker = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;
    
    const trabajador = await TrabajadorModel.findOneAndDelete({ _id: id }).exec();
    if (!trabajador) {
      res.status(400).send("No se ha encontrado el trabajador");
      return;
    }
    res.status(200).send("Trabajador borrado");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteWorker;