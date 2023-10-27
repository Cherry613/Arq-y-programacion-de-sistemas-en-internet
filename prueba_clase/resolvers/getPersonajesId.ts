import { Request, Response } from "npm:express@4.18.2";
import PersonajesModel from "../db/personajes.ts";

/*GET /api/tierramedia/personajes/:id: Obtiene información detallada de un personaje por su ID.
En caso de no existir el personaje con id indicado, devolverá un error 404*/

const getPersonajesId = async (req: Request, res: Response) => {
  try {
    const {id} = await req.params;
    const personajes = await PersonajesModel.findOne({ _id : id}).exec();

    if(!personajes){
      res.status(404).send("not found")
      return;
    }

    res.status(200).send({
      name : personajes.name,
      raza : personajes.raza,
      description: personajes.description,
      skills : personajes.skills,
      id : personajes._id.toString(),
    });
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getPersonajesId;