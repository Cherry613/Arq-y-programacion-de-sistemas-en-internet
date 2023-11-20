import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";
import GestorModel from "../db/gestor.ts";

//comrpobar q existe ese id del cliente y ek gestor
// comprobar cuantos clientes tiene el gestor
// añadir el cliente al gestor

const asignar_gestor = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { id_gestor } = req.body;


    //comprobamos que el gestor existe y que no tenga 10 clientes ya
    const gestor = await GestorModel.findOne({ _id : id_gestor }).exec();
    if (!gestor) {
      res.status(404).send("El gestor no se ha encontrado");
      return;
    }
    if(gestor.clientes.length === 10){
      res.status(400).send("El gestor ya tiene 10 clientes, no puede tener mas")
      return;
    }

    //comprobamos que el cliente existe y si ya tiene un gestor
    const cliente = await ClienteModel.findOne({ _id}).exec();
    if (!cliente) {
      res.status(404).send("Ese cliente no existe");
      return;
    }
    if(cliente.id_gestor !== ""){
      res.status(400).send("El cliente ya tiene un gestor");
      return;
    }

    // añadimos el cliente al array de clientes del gestor
    gestor.clientes.push(cliente._id);

    const updated_cliente = await ClienteModel.findOneAndUpdate(
      { _id : _id },
      { id_gestor: gestor._id },
      { new: true }
    ).exec();

    if (!updated_cliente) {
      res.status(404).send("No se pudo actualizar el cliente");
      return;
    }

    const updated_gestor = await GestorModel.findOneAndUpdate(
      { _id: id_gestor },
      { clientes: gestor.clientes },
      { new: true }
    ).exec();

    if (!updated_gestor) {
      res.status(404).send("No se pudo actualizar el gestor");
      return;
    }

  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default asignar_gestor;