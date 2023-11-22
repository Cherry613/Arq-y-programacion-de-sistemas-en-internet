import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";
import GestorModel from "../db/gestor.ts";

const addCliente = async (req: Request, res: Response) => {
  try {
    const {dni, nombre, dinero, id_gestor /*hipotecas, movimientos*/} = req.body;
    
    //comprobar que no falten parámetros.
    if (!nombre || !dni) {
      res.status(400).send("El cliente necesita un nombre y dni");
      return;
    }

    //comprobamos que no estemos intentando añadir un cliente que ya esté.
    const alreadyExists = await ClienteModel.findOne({ dni }).exec();
    if (alreadyExists) {
      res.status(400).send("Ese cliente ya existe");
      return;
    }

    //comprobamos que el cliente tenga dinero y que no sea una cantidad negativa.
    if(dinero && dinero < 0){
      res.status(404).send("No puedes crear una cuenta con dinero negativo");
      return;
    }

    //comprobar que el gestor que le estamos intentando asignar existe.
    if(id_gestor){
      const gestorExists = await GestorModel.findOne({_id: id_gestor}).exec();
      if(!gestorExists){
        res.status(404).send("Ese gestor no existe");
        return;
      }
    }

    const newCliente = new ClienteModel({ dni, nombre, dinero, id_gestor /*hipotecas, movimientos*/});
    await newCliente.save();

    res.status(200).send({
      dni: newCliente.dni,
      nombre: newCliente.nombre,
      dinero: newCliente.dinero,
      id_gestor: newCliente.id_gestor,
      hipotecas: newCliente.hipotecas,
      movimientos: newCliente.movimientos,
      id: newCliente._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addCliente;