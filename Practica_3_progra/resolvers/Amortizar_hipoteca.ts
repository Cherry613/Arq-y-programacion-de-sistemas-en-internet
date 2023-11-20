import { Request, Response } from "npm:express@4.18.2";

import HipotecaModel from "../db/hipoteca.ts";
import ClienteModel from "../db/cliente.ts";

const amortizar = async (req: Request, res: Response) => {
    try {
      const {id_hipoteca } = req.params;
  
      //comprobar que exite y la hipoteca
      const hipoteca= await HipotecaModel.findOne({ _id : id_hipoteca }).exec();
      if(!hipoteca){
        res.status(404).send("No se ha encontrado la hipoteca");
        return;
      }

      const cliente= await ClienteModel.findOne({ _id : hipoteca.id_cliente }).exec();
      //al crear una hipoteca ya se comprueba que el cliente exista, aqui no haria falta aunque salga en rojo es solo un warning
      if(!cliente){
        res.status(404).send("No se ha encontrado el cliente");
        return;
      }

      //calculamos cuanto es la mensualidad, el dinero que le queda al cliente, lo que queda por pagar a la hipoteca y las cuotas restantes
      const mensualidad = hipoteca.importe_total / hipoteca.cuotas;

      //comprobar que el cliente puede pagar la hipoteca
      if(cliente.dinero < mensualidad){
        res.status(404).send("No tiene suficiente dinero para pagar la hipoteca");
        return;
      }

      const dinero_cliente = cliente.dinero - mensualidad;
      const total_hipoteca = hipoteca.importe_total - mensualidad;
      const cuotas_restantes = hipoteca.cuotas -1;

      //actualizamos el dinero que le queda al cliente despues de pagar la hipoteca
      const updated_1= await ClienteModel.findOneAndUpdate(
        { _id : cliente._id },
        { dinero: dinero_cliente },
        { new: true }
      ).exec();

      //si las cuotas restantes de la hipoteca son 0, habremos pagado la hipoteca
      if(cuotas_restantes === 0){
        const borrado = await HipotecaModel.deleteOne({ _id : id_hipoteca }).exec();    //borramos la hipoteca de la base de datos
        if (borrado.deletedCount === 0) {
          res.status(404).send("Hipoteca no borrada");
          return;
        }
        
        const indice_hip = cliente.hipotecas.indexOf(id_hipoteca);  //buscamos esa hipoteca en el array de hipotecas de nuestro cliente
        cliente.hipotecas.splice(indice_hip,1);                     //borramos la hipoteca
        const update_cliente = await ClienteModel.findOneAndUpdate( //actualizamos el cliente para que no tenga esa hipoteca en su array
            {_id : cliente._id},
            {hipotecas : cliente.hipotecas},
            {new: true},
        ).exec();

        if(!update_cliente){
            res.status(404).send("No se pudo borrar la hipoteca del cliente");
        }

        res.status(200).send("Bieeeeen has pagado la hipoteca ^^");
        return;
      }

      //actualizamos la hipoteca con el nuevo importe y las cuotas restantes
      const updated_2= await HipotecaModel.findOneAndUpdate(    
        { _id : id_hipoteca },
        { importe_total: total_hipoteca, cuotas: cuotas_restantes},
        { new: true }
      ).exec();
  
      if (!updated_1 || !updated_2) {   
        res.status(404).send("No se pudo pagar la hipoteca");
        return;
      }

    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  };
  
  export default amortizar;
