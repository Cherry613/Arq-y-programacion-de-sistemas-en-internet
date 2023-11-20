import { Request, Response } from "npm:express@4.18.2"; 
import GestorModel from "../db/gestor.ts";

const addGestor = async (req: Request, res: Response) => {
  try {
  const { nombre, dni} = req.body;

  //comprobar que no falten parámetros
    if (!nombre || !dni) {
      res.status(400).send("Se necesita un nombre y un dni");
      return;
    }

    //no añadiremos un gestor que ya exista en la base de datos
    const alreadyExists = await GestorModel.findOne({ dni }).exec();
    if (alreadyExists) {
      res.status(400).send("Ese gestor ya existe");
      return;
    }
    
    const newGestor = new GestorModel({ nombre, dni });
    await newGestor.save();

    res.status(200).send({
      nombre: newGestor.nombre,
      dni: newGestor.dni,
      clientes: newGestor.clientes,
      id: newGestor._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addGestor;

/*
  nombre: { type: String, required: true},
  dni: { type: Number, required: true},
  clientes: { type: [String], required: false},
*/  