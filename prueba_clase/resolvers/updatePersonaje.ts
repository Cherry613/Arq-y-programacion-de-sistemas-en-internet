import { Request, Response } from "npm:express@4.18.2";
import PersonajeModel from "../db/personajes.ts";

/*PUT /api/tierramedia/personajes/:id: Actualiza la información de un personaje existente por su ID.
En caso de no existir el personaje con id indicado, devolverá un error 404
Si la raza no se encuentra entre las existentes devolverá un error 500.*/

const updatePersonaje = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, raza, description, skills } = req.body;
    if (!name || !raza || !description|| !skills) {
      res.status(500).send("Name, raza, description and skills are required");
      return;
    }

    if (raza !== "Hobbits" && raza !== "Humanos" && raza !== "Elfos" && raza !== "Enanos" && raza !== "Ents") {
      res.status(500).send("raza tiene que ser o hobbits, humanos, elfos, enanos o ents ");
      return;
    }

    const updatedPersonaje = await PersonajeModel.findOneAndUpdate(
      { _id : id },
      { name, raza, description, skills },
      { new: true }
    ).exec();

    if (!updatedPersonaje) {
      res.status(404).send("Personaje not found");
      return;
    }

    res.status(200).send({
      name: updatedPersonaje.name,
      raza: updatedPersonaje.raza,
      description: updatedPersonaje.description,
      skills : updatedPersonaje.description,
      id: updatedPersonaje._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updatePersonaje;