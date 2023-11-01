import { Request, Response } from "npm:express@4.18.2";
import ClientsModel from "../db/clients.ts";

const getClients = async (req: Request, res: Response) => {
  try {
    const product = await ClientsModel.find().exec();

    res.status(200).send(product);
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getClients;