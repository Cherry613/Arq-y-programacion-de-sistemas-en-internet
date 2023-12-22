import mongoose from "npm:mongoose@8.0.0";
import { Viaje } from "../types.ts";
import { ESTADOS } from "../types.ts";
import ClienteModel from "./Cliente.ts";
import ConductorModel from "./Conductor.ts";
import { GraphQLError } from "graphql";

const Schema = mongoose.Schema;

const viajeSchema = new Schema ( 
    {
        client: {type: Schema.Types.ObjectId, required: true}, //id
        driver: {type: Schema.Types.ObjectId, required: true}, //id
        money: {type: Number, required: true, min: 5},
        distance: {type: Number, required: true, min: 0.01}, //en km 
        date: {type: String, required: true},
        status: {type: String, required: false, enum: ESTADOS, default: ESTADOS.ongoing}
    },
    {timestamps: true}
);


//VALIDAR
//comprobar al hacer un viaje que el cliente y el conductor no tengan ya viajes ongoing
viajeSchema
    .path("client")
    .validate(async function (client: mongoose.Types.ObjectId) {
        const cliente = await ClienteModel.findById({_id: client}).exec();  //comprobar que el cliente existe
        //ese throw para un try catch q este al hacer un viaje
        if(!cliente) throw new GraphQLError (`No se ha encontrado ningun cliente con el id ${client}`);

        const ultimo_viaje = cliente.travels[cliente.travels.length -1];    //comprobar que no tenga un viaje activo
        if(ultimo_viaje.status == "ongoing") throw new GraphQLError (`No se puede añadir otro viaje mientras haya uno activo`);
    

       // filtrar por las q tengan dinero +  coger la primera y restarle el viaje a esa
        const tarjetasConDinero = cliente.cards.filter((elem) => elem.money > this.money);
        if(tarjetasConDinero.length === 0) throw new GraphQLError (`No se pudo pagar el viaje`);

        cliente.cards[cliente.cards.indexOf(tarjetasConDinero[0])].money -= this.money;     //si no va lo del this.money, ponerlo en un post 
        cliente.save();

    });

viajeSchema
    .path("driver")
    .validate(async function (driver: mongoose.Types.ObjectId) {
        const conductor = await ConductorModel.findById({_id: driver}).exec();
        //ese throw para un try catch q este al hacer un viaje
        if(!conductor) throw new GraphQLError (`No se ha encontrado ningun cliente con el id ${driver}`);

        const ultimo_viaje = conductor.travels[conductor.travels.length -1];  //me esta cogiendo ultimo viaje como string
        if(ultimo_viaje.status == "ongoing") throw new GraphQLError (`No se puede añadir otro viaje mientras haya uno activo`);
    });


//post para actualizar el viaje en cliente y conductor

//Un viaje solamente se puede crear, si ambos están disponibles, y el cliente tiene dinero
//Cuando se termina un viaje, este NUNCA se borra del historial de viajes, solamente se cambia su estado

export type ViajeModelType = mongoose.Document & Omit<Viaje, "id">;

export default mongoose.model<ViajeModelType>("Viaje", viajeSchema);