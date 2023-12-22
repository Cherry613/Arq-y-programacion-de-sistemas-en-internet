import mongoose from "npm:mongoose@8.0.0";
import ClienteModel from "../db/Cliente.ts";
import ConductorModel from "../db/Conductor.ts";
import ViajeModel from "../db/Viaje.ts";

//aqui van todos los mutaciones TODAS JUNTAS*9+

export const Mutation = {
    /*
    addCliente( name: String!, email: String!): Cliente!
    addConductor( name: String!, email: String!, username: String!): Driver!
    addViaje(client: ID!, driver: ID!, money: Int!, distance: Int!, date: String!) : 
    
    deleteCliente(id: ID!): String! #string que dice q hemos borrado
    deleteDriver(id: ID!): String!  #string que dice q hemos borrado
    deleteTarjetaFromCliente(id_tarjeta: ID!, id_cliente: ID!): String!  #string que dice q hemos borrado

    tarjetaCliente(id: ID!, name: String!): Pet!    #update de añadir una tarjeta al cliente
    terminarViaje(id: ID!) #update del estado del viaje y borrar el viaje
    */
   
    addCliente: async (_:unknown, args: {name: string, email: string}) => {
        try{
            const cliente = new ClienteModel({name: args.name, email: args.email});
            await cliente.save();

            return{
                name: cliente.name,
                email: cliente.email
            };

        }catch(error){
            return error.message;
        }
        
    },

    addConductor: async (_: unknown, args: {name: string, email: string, username: string}) => {
        try{
            const conductor = new ConductorModel ({name: args.name, email: args.email, username: args.username});
            await conductor.save();

            return {
                name: conductor.name,
                email: conductor.email,
                username: conductor.username
            };

        }catch(error){
            return error.message;
        }
        
    },

    addViaje: async (_: unknown, args: {client:  mongoose.Types.ObjectId, driver:  mongoose.Types.ObjectId, money: number, distance: number, date: string}) => {
        try{
            const viaje = new ViajeModel({client: args.client, driver: args.driver, money: args.money, distance: args.distance, date: args.date});
            await viaje.save();

            return{
                client: viaje.client,
                driver: viaje.driver,
                money: viaje.money,
                distance: viaje.distance,
                date: viaje.date
            };

        }catch(error){
            return error.message;
        }
    }
    
}