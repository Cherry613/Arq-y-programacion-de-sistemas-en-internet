import { Request, Response } from "npm:express@4.18.2";
import EmpresaModel from "../db/empresa.ts";


const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const empresa = await EmpresaModel.findOneAndDelete({ _id: id }).exec();
    if (!empresa) {
      res.status(400).send("No se ha encontrado la empresa");
      return;
    }
    res.status(200).send("Empresa borrada");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteBusiness;