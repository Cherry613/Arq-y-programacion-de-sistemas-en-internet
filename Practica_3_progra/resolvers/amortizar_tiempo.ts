import HipotecaModel from "../db/hipoteca.ts";
import ClienteModel from "../db/cliente.ts";

setInterval(async ()=> {
    const hipotecas = await HipotecaModel.find().exec();
    hipotecas.map(async (hipoteca) =>{

        const mensualidad = hipoteca.importe_total / hipoteca.cuotas;

        const cliente = await ClienteModel.findById(hipoteca.id_cliente);
        if(!cliente){
            return;
        }
        if(cliente.dinero < mensualidad){
            return;
        }
        const dinero_cliente = cliente.dinero - mensualidad;
        const total_hipoteca = hipoteca.importe_total - mensualidad;
        const cuotas_restantes = hipoteca.cuotas -1;

        const mensaje = `Pago de ${mensualidad} para la hipoteca ${String(hipoteca._id)}`;
        cliente.movimientos.push(mensaje);

        //actualizamos el dinero que le queda al cliente despues de pagar la hipoteca
        const updated_1= await ClienteModel.findOneAndUpdate(
            { _id : cliente._id },
            { dinero: dinero_cliente, movimientos: cliente.movimientos },
            { new: true }
        ).exec();

        //si las cuotas restantes de la hipoteca son 0, habremos pagado la hipoteca
        if(cuotas_restantes === 0){
            const borrado = await HipotecaModel.deleteOne({ _id : hipoteca._id}).exec();    //borramos la hipoteca de la base de datos
        if (borrado.deletedCount === 0) {
          return;
        }
        
        const indice_hip = cliente.hipotecas.indexOf(hipoteca._id);  //buscamos esa hipoteca en el array de hipotecas de nuestro cliente
        cliente.hipotecas.splice(indice_hip, 1);                     //borramos la hipoteca
        const update_cliente = await ClienteModel.findOneAndUpdate( //actualizamos el cliente para que no tenga esa hipoteca en su array
            {_id : cliente._id},
            {hipotecas : cliente.hipotecas},
            {new: true},
        ).exec();
        
        if(!update_cliente){
            return;
        }

        //actualizamos la hipoteca con el nuevo importe y las cuotas restantes
        const updated_2= await HipotecaModel.findOneAndUpdate(    
            { _id : hipoteca._id },
            { importe_total: total_hipoteca, cuotas: cuotas_restantes},
            { new: true }
        ).exec();
  
        if (!updated_1 || !updated_2) {   
            return;
        }
    }

  })
}, 0.5*60*1000)
