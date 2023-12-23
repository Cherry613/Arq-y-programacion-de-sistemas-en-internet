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

            return "Se ha creado el cliente";

        }catch(error){
            return error.message;
        }
        
    },

    addConductor: async (_: unknown, args: {name: string, email: string, username: string}) => {
        try{
            await ConductorModel.create({name: args.name, email: args.email, username: args.username});

            return "Se ha creado el conductor"

        }catch(error){
            return error.message;
        }
        
    },

    addViaje: async (_: unknown, args: {client:  mongoose.Types.ObjectId, driver:  mongoose.Types.ObjectId, money: number, distance: number, date: string}) => {
        try{
            await ViajeModel.create({client: args.client, driver: args.driver, money: args.money, distance: args.distance, date: args.date});

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
            //si encontramos el cliente que hemos introducido como argumento actualizaremos la tarjeta con el numero que hemos pasado tambien como argumento, si esta no se encuentra habra error
            const eliminado = await ClienteModel.findOneAndUpdate({_id: args.id_cliente}, {$pull: {cards: {number: args.num_tarjeta}}}).exec();
            if(!eliminado) throw new GraphQLError (`La tarjeta no se ha eliminado`);
            return "Se ha eliminado la tarjeta";

        }catch(error){
            return error.message;
        }
    },

    addTarjeta: async (_: unknown, args: {id_cliente: mongoose.Types.ObjectId, number: string, cvv: number, expirity: string, money: number}) => {
        try{
            const {number, cvv, expirity, money} = args;
            const tarjeta  = {number, cvv, expirity, money};    //crea la tarjeta

            //añadimos la tarjeta y le decimos que haga las validaciones que creamos en Cliente.ts
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