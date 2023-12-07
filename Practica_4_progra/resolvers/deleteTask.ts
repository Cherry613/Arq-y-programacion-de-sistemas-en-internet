import { Request, Response } from "npm:express@4.18.2";
import TareaModel from "../db/tarea.ts";


const deleteTask = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;

    const tarea = await TareaModel.findOneAndDelete({ _id: id }).exec();
    if (!tarea) {
      res.status(400).send("No se ha encontrado la trarea");
      return;
    }
    res.status(200).send("Tarea borrada");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteTask;