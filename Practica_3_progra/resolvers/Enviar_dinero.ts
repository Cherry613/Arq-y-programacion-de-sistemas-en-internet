import { Request, Response } from "npm:express@4.18.2";

import ClienteModel from "../db/cliente.ts";

const enviar_dinero = async (req: Request, res: Response) => {
    try {
      const { id1, id2 } = req.params;
      const { dinero } = req.body;
  
      //comprobar que exiten esos clientes
      const emisor= await ClienteModel.findOne({ _id : id1 }).exec();
      const receptor= await ClienteModel.findOne({ _id : id2 }).exec();
      if (!emisor || !receptor) {
        res.status(404).send("Algun cliente o ambos no existe(n)");
        return;
      }

      //comprobar que la cantidad de dinero que quiero mandar no es negativa y no es 0
      if(dinero <= 0){
        res.status(400).send("No puedes mandar una cantidad de dinero negativa o igual a 0");
        return;
      }

      const dinero_emisor = emisor.dinero - dinero;
      const dinero_receptor = receptor.dinero + dinero;
      const mensaje = `Envio de dinero de ${emisor} a ${receptor}, cantidad: ${dinero}`;
      emisor.movimientos.push(mensaje);
      receptor.movimientos.push(mensaje);


      const updated_1= await ClienteModel.findOneAndUpdate(
        { _id : id1 },
        { dinero: dinero_emisor, movimientos: emisor.movimientos },
        { new: true }
      ).exec();

      const updated_2= await ClienteModel.findOneAndUpdate(
        { _id : id2 },
        { dinero: dinero_receptor, movimientos: receptor.movimientos },
        { new: true }
      ).exec();
  
      if (!updated_1 || !updated_2) {   
        res.status(404).send("No se ha enviado el dinero");
        return;
      }

      res.status(200).send("Dinero enviado");

    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  };
  
  export default enviar_dinero;

