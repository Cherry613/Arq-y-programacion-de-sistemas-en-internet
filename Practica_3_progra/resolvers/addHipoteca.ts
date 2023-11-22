import { Request, Response } from "npm:express@4.18.2";
import HipotecaModel from "../db/hipoteca.ts";
import ClienteModel from "../db/cliente.ts";

const addHipoteca = async (req: Request, res: Response) => {
  try {
    const {importe_total, id_cliente} = req.body;
    if (!importe_total || !id_cliente) {
      res.status(400).send("Faltan datos");
      return;
    }

    //la hipoteca no puede superar el millon de euros ni ser negativa.
    if(importe_total > 1000000){
      res.status(400).send("La hipoteca no puede superar el millon de euros");
      return;
    }
    if(importe_total < 0){
      res.status(400).send("La hipoteca no puede ser negativa");
      return;
    }
    
    //no podremos crear una hipoteca si no existen el cliente ni el gestor antes.
    const clienteExists = await ClienteModel.findOne({ _id: id_cliente }).exec();
    if (!clienteExists) {
      res.status(404).send("Ese cliente no existe");
      return;
    }
    if(clienteExists.id_gestor === ""){
      res.status(400).send("El cliente no tiene gestor");
      return;
    }

    const newHipoteca = new HipotecaModel({importe_total, id_cliente, id_gestor: clienteExists.id_gestor});
    await newHipoteca.save();

    //darle la hipoteca al cliente
    clienteExists.hipotecas.push(newHipoteca._id);
    await ClienteModel.findOneAndUpdate(
      { _id: id_cliente},
      { hipotecas: clienteExists.hipotecas},
      { new: false}
    ).exec();

    res.status(200).send({
      importe: newHipoteca.importe_total,
      cuotas: newHipoteca.cuotas,
      cliente: newHipoteca.id_cliente,
      gestor: newHipoteca.id_gestor,
      id: newHipoteca._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addHipoteca;