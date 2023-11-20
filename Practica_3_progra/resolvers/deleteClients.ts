import { Request, Response } from "npm:express@4.18.2";
import ClienteModel from "../db/cliente.ts";
import GestorModel from "../db/gestor.ts";

const deleteCliente = async (req: Request, res: Response) => {
    
  try {
    const { _id } = req.params;

    const cliente = await ClienteModel.findById({_id}).exec();
    if(!cliente){
      res.status(404).send("No se ha encontrado el cliente")
      return;
    }
    if (cliente.hipotecas.length > 0){
      res.status(400).send("El cliente aun tiene hipotecas que pagar.");
      return;
    }

    const borrado = await ClienteModel.deleteOne({ _id }).exec();
    if (borrado.deletedCount === 0) {
      res.status(404).send("Cliente no borrado");
      return;
    }

    //despues de borrar al cliente, borrarlo del gestor
    //si no tiene gestor
    if(cliente.id_gestor === ""){ 
      res.status(200).send("Cliente borrado");
      return;
    }
    
    //si tiene gestor, borramos el cliente del array de clientes del gestor
    const gestor = await GestorModel.findOne({ _id: cliente.id_gestor }).exec();  //cogemos el gestor
    if(gestor){
      const posicionEliminar = gestor.clientes.indexOf(_id);  //buscamos al cliente en el array del gestor
      //const cliente_gestor = gestor.clientes.find(elem => elem === _id); //esto estaía bien(???? ese dni es del gestor o del cliente xd)
      if(posicionEliminar !== -1){  //en caso de no haber encontrado al cliente, indexOf devolverá -1
        gestor.clientes.splice(posicionEliminar, 1);
        await gestor.save();
      }
      else{
        res.status(404).send("El gestor no tiene ese cliente")
      }
    }
    else{
      res.status(200).send("Cliente borrado");
    }

  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteCliente;