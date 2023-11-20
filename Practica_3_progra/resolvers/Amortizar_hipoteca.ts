//update

import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";
import HipotecaModel from "../db/hipoteca.ts";

// buscar el id del cliente
// comprobar el total de la hipoteca
// calcular cuanto es la mensualidad (total/20)
// comprobar el dinero del cliente
// restar dienro al cliente
// restar dinero a la hipoteca
// actualizar historial cliente

//si la hipoteca esta pagada del todo -> borrarla del cliente

const amortizar = async (req: Request, res: Response) => {
    try {
      const { id_cliente, id_hipoteca } = req.params;
  
      //comprobar que exiten esos clientes
      const cliente= await ClienteModel.findOne({ _id : id_cliente }).exec();
      const hipoteca= await HipotecaModel.findOne({ _id : id_hipoteca }).exec();
      if (!cliente || !hipoteca) {
        res.status(404).send("El cliente, la hipoteca o ambos no existe(n)");
        return;
      }

      //calculamos cuanto es la mensualidad, el dinero que le queda al cliente, lo que queda por pagar a la hipoteca y las cuotas restantes
      const mensualidad = hipoteca.importe_total / hipoteca.cuotas;

      const dinero_cliente = cliente.dinero - mensualidad;
      const total_hipoteca = hipoteca.importe_total - dinero_cliente;
      const cuotas_restantes = hipoteca.cuotas -1;

      //actualizamos el dinero que le queda al cliente despues de pagar la hipoteca
      const updated_1= await ClienteModel.findOneAndUpdate(
        { _id : id_cliente },
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
            {_id : id_cliente},
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
