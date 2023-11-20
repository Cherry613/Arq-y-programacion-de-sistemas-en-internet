import { Request, Response } from "npm:express@4.18.2";

import ClienteModel from "../db/cliente.ts";

const ingresar_dinero = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { dinero } = req.body;
  
      //comprobar que ese cliente existe
      const clienteExists = await ClienteModel.findOne({ _id: id }).exec();
      if (!clienteExists) {
        res.status(404).send("Ese cliente no existe");
        return;
      }

      //comprobar que la cantidad de dinero que quiero ingresarle no es negativa o igual a 0
      if(dinero <= 0){
        res.status(400).send("No puedes ingresar una cantidad de dinero negativa o igual a 0");
        return;
      }
      const dinero_actualizado = clienteExists.dinero + dinero;

      const updated = await ClienteModel.findOneAndUpdate(
        { _id : id },
        { dinero: dinero_actualizado },
        { new: true }
      ).exec();
  
      if (!updated) {   
        res.status(404).send("No se ha actualizado el cliente");
        return;
      }
  
      res.status(200).send({
        dni: updated.dni,
        nombre: updated.nombre,
        dinero: updated.dinero,
        id_gestor: updated.id_gestor,
        hipotecas: updated.hipotecas,
        movimientos: updated.movimientos,
        id: updated._id.toString(),
      });
    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  };
  
  export default ingresar_dinero;