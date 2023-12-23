import { ClienteModel } from "../db/Cliente.ts";
import { Cliente } from "../types.ts";
import { ConductorModel } from "../db/Conductor.ts";
import { Conductor } from "../types.ts";
import { ViajeModel } from "../db/Viaje.ts";
import { Viaje } from "../types.ts";


export const Query = {
    clientes: async(): Promise<Cliente[]> => {
        const clienteModel = await ClienteModel.find().exec();
        const clientes: Cliente[] = clienteModel.map((client) => {
            return {
                id: client._id.toString(),
                name: client.name,
                email: client.email,
                cards: client.cards,
                travels: client.travels
            };
        });
        return clientes;
    },

    conductores: async(): Promise<Conductor[]> => {
      const conductorModel = await ConductorModel.find().exec();
      const conductores: Conductor[] = conductorModel.map((elem) => {
        return{
          id: elem._id.toString(),
          name: elem.name,
          email: elem.email,
          username: elem.username,
          travels: elem.travels
        }
      });
      return conductores;
    },

    viajes: async(): Promise<Viaje[]> => {
      const viajesModel = await ViajeModel.find().exec();
      const viajes: Viaje[] = viajesModel.map((elem) => {
        return{
          id: elem._id.toString(),
          client: elem.client,
          driver: elem.driver,
          money: elem.money,
          distance: elem.distance,
          date: elem.date,
          status: elem.status,
        }
      });
      return viajes;
    }
}
