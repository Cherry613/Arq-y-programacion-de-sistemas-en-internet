import ClienteModel from "../db/cliente.ts";

setInterval(async () => {
    const clientes = await ClienteModel.find().exec();
    clientes.map(async (cliente) => {

        //calculamos como quedará la variable dinero del cliente
        cliente.dinero = cliente.dinero + 10000;
        const mensaje = `Se han ingresado 10.000€ al cliente: ${String(cliente._id)}`;
        cliente.movimientos.push(mensaje);

        //actualizamos el cliente
        await ClienteModel.findOneAndUpdate(
            {_id: cliente._id},
            {dinero: cliente.dinero, movimientos: cliente.movimientos},
            {new: false}
        ).exec();

    })

}, 5*60*1000)