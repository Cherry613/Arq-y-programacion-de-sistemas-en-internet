import ClienteModel from "../db/cliente.ts";

setInterval(async () => {
    const clientes = await ClienteModel.find().exec();
    clientes.map(async (cliente) => {
        cliente.dinero = cliente.dinero + 10000;
        const mensaje = `Se han ingresado 10.000€ al cliente: ${String(cliente._id)}`;
        cliente.movimientos.push(mensaje);
        await ClienteModel.findOneAndUpdate(
            {_id: cliente._id},
            {dinero: cliente.dinero, movimientos: cliente.movimientos},
            {new: false}
        ).exec();
    })
}, 0.5*60*1000) //5 min seria cambiar el 0.5 por 5, de momento esta a 0.5 (30 sec) para poder probar mas rapido