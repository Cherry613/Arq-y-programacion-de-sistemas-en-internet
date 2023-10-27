import { Request, Response } from "npm:express@4.18.2";
import PersonajesModel from "../db/personajes.ts";

//GET /api/tierramedia/personajes: Obtiene una lista de todos los personajes épicos de “Tierra Media”.

const getPersonajes = async (req: Request, res: Response) => {
  try {
    const Personajes = await PersonajesModel.find().exec();

    res.status(200).send(Personajes);
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getPersonajes;