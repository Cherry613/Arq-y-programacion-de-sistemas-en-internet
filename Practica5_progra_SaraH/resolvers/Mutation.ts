import mongoose from "npm:mongoose@8.0.0";
import { ClienteModel }  from "../db/Cliente.ts";
import { ConductorModel } from "../db/Conductor.ts";
import { ViajeModel } from "../db/Viaje.ts";
import { GraphQLError } from "graphql";
import { ESTADOS } from "../types.ts";



export const Mutation = {
   
    addCliente: async (_:unknown, args: {name: string, email: string}) => {
        try{
            await ClienteModel.create({name: args.name, email: args.email});
            /*const cliente = new ClienteModel({name: args.name, email: args.email});
            await cliente.save();*/

            return "Se ha creado el cliente";

        }catch(error){
            return error.message;
        }
        
    },

    addConductor: async (_: unknown, args: {name: string, email: string, username: string}) => {
        try{
            await ConductorModel.create({name: args.name, email: args.email, username: args.username});
            /*const conductor = new ConductorModel ({name: args.name, email: args.email, username: args.username});
            await conductor.save();*/

            return "Se ha creado el conductor"

        }catch(error){
            return error.message;
        }
        
    },

    addViaje: async (_: unknown, args: {client:  mongoose.Types.ObjectId, driver:  mongoose.Types.ObjectId, money: number, distance: number, date: string}) => {
        try{
            await ViajeModel.create({client: args.client, driver: args.driver, money: args.money, distance: args.distance, date: args.date});
            /*const viaje = new ViajeModel({client: args.client, driver: args.driver, money: args.money, distance: args.distance, date: args.date});
            await viaje.save();*/

            return  "Se ha creado el viaje"

        }catch(error){
            return error.message;
        }
    },

    deleteCliente: async (_: unknown, args: {id: mongoose.Types.ObjectId}) => {
        try{
            const cliente = await ClienteModel.findOneAndDelete({_id: args.id}).exec();
            if(!cliente) throw new GraphQLError(`No se ha encontrado ningun cliente con el id ${args.id}`);
            return "Se ha borrado al cliente";

        }catch(error){
            return error.message;
        }
        
        
    },

    deleteDriver: async (_: unknown, args: {id: mongoose.Types.ObjectId}) => {
        try{
            const conductor = await ConductorModel.findOneAndDelete({_id: args.id}).exec();
            if(!conductor) throw new GraphQLError(`No se ha encontrado ningun conductor con el id ${args.id}`);
            return "Se ha borrado al conductor";

        }catch(error){
            return error.message;
        }
        
    },

    deleteTarjeta: async (_: unknown, args: {num_tarjeta: string, id_cliente: mongoose.Types.ObjectId}) => {
        try{
            const eliminado = await ClienteModel.findOneAndUpdate({_id: args.id_cliente}, {$pull: {cards: {number: args.num_tarjeta}}}).exec();   //actualiza la tarjeta cuyo num coincida con el que le hemos pasado + del cliente q coincida con lo q hemos pasado
            if(!eliminado) throw new GraphQLError (`La tarjeta no se ha eliminado`);
            return "Se ha eliminado la tarjeta";

        }catch(error){
            return error.message;
        }
    },

    addTarjeta: async (_: unknown, args: {id_cliente: mongoose.Types.ObjectId, number: string, cvv: number, expirity: string, money: number}) => {
        try{
            const {number, cvv, expirity, money} = args;
            const tarjeta  = {number, cvv, expirity, money};

            const update = await ClienteModel.findOneAndUpdate({_id: args.id_cliente}, {$push: {cards: tarjeta }}, {runValidators: true}).exec();
            if(!update) throw new GraphQLError(`No existe el cliente`);
            return "Se ha añadido la tarjeta";

        }catch(error){
            return error.message;
        }
    },
    

    terminarViaje: async (_: unknown, args: {id: string}) => {
        try{
            const terminado = await ViajeModel.findOneAndUpdate({_id: args.id}, {status: ESTADOS.finish}).exec();
            if(!terminado) throw new GraphQLError (`No existe el viaje`);
            return "Ha terminado el viaje";

        }catch(error){
            return error.message;
        }
        
    }
}