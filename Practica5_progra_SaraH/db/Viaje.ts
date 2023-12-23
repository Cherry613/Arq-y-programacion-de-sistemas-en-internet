import mongoose from "npm:mongoose@8.0.0";
import { Viaje } from "../types.ts";
import { ESTADOS } from "../types.ts";
import { ClienteModel } from "./Cliente.ts";
import { ConductorModel } from "./Conductor.ts";
import { GraphQLError } from "graphql";

const Schema = mongoose.Schema;

const viajeSchema = new Schema ( 
    {
        client: {type: Schema.Types.ObjectId, required: true}, //id
        driver: {type: Schema.Types.ObjectId, required: true}, //id
        money: {type: Number, required: true, min: [5, "el precio miínimo de un viaje son 5€"]},
        distance: {type: Number, required: true, min: [0.01, "el viaje debe ser de mínimo 0.01 km"]}, //en km 
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
        const cliente = await ClienteModel.findById(client).exec();  //comprobar que el cliente existe
        //ese throw para un try catch q este al hacer un viaje
        if(!cliente) throw new GraphQLError (`No se ha encontrado ningun cliente con el id ${client}`);

        if(cliente.travels.length === 0){   //si no hay viajes en el array
            // filtrar por las q tengan dinero +  coger la primera y restarle el viaje a esa
            const tarjetasConDinero = cliente.cards.filter((elem) => elem.money > this.money);
            if(tarjetasConDinero.length === 0) throw new GraphQLError (`No se pudo pagar el viaje`);
            return true;
        }

        const ultimo_viaje_id = cliente.travels[cliente.travels.length -1];    //comprobar que no tenga un viaje activo
        const ultimo_viaje = await ViajeModel.findById(ultimo_viaje_id).exec();
        if(ultimo_viaje?.status == "ongoing") throw new GraphQLError (`No se puede añadir otro viaje mientras haya uno activo`);
    

       // filtrar por las q tengan dinero +  coger la primera y restarle el viaje a esa
        const tarjetasConDinero = cliente.cards.filter((elem) => elem.money > this.money);
        if(tarjetasConDinero.length === 0) throw new GraphQLError (`No se pudo pagar el viaje`);
        return true;

    });

viajeSchema
    .path("driver")
    .validate(async function (driver: mongoose.Types.ObjectId) {
        const conductor = await ConductorModel.findById(driver).exec();
        //ese throw para un try catch q este al hacer un viaje
        if(!conductor) throw new GraphQLError (`No se ha encontrado ningun cliente con el id ${driver}`);

        if(conductor.travels.length === 0 ) return true;
        
        const ultimo_viaje_id = conductor.travels[conductor.travels.length -1];  //me esta cogiendo ultimo viaje como string
        const ultimo_viaje = await ViajeModel.findById(ultimo_viaje_id).exec();
        if(ultimo_viaje?.status == "ongoing") throw new GraphQLError (`No se puede añadir otro viaje mientras haya uno activo`);
    });


//post para añadir el viaje a cliente y conductor + cobrarle el viaje al cliente.
viajeSchema.post("save", async function (){  
    const cliente = await ClienteModel.findOneAndUpdate({_id: this.client}, {$push: {travels: this._id}}).exec();  //añadimos el viaje al cliente
    await ConductorModel.findOneAndUpdate({_id: this.driver}, {$push: {travels: this._id}}).exec();  //añadimos el viaje al conductor

    const tarjetasConDinero = cliente?.cards.filter((elem) => elem.money > this.money); //comprobamos que el cliente tenga una tarjeta con dinero suficiente para el viaje

    cliente.cards[cliente.cards.indexOf(tarjetasConDinero[0])].money -= this.money;     //cobramos el viaje en la primera tarjeta que tenga dinero suficiente
    cliente?.save();
})

//al borrarse un viaje, ese viaje se debe borrar tambien del cliente y el conductor
viajeSchema.pre("deleteMany", async function () {
    //codigo cedido por Guillermo Infiesta 
    const id_viajes = this.getQuery()["_id"]["$in"];
    const viajes = await ViajeModel.find({_id: {$in: id_viajes}}).exec();

    await Promise.all(await viajes.map( async (elem) => {
        await ClienteModel.findOneAndUpdate({_id: elem.client}, {$pull: {travels: elem._id}}).exec();
        await ConductorModel.findOneAndUpdate({_id: elem.driver}, {$pull: {travels: elem._id}}).exec();
    }))

}) 

export type ViajeModelType = mongoose.Document & Omit<Viaje, "id">;

//export default mongoose.model<ViajeModelType>("Viaje", viajeSchema);
export const ViajeModel = mongoose.model<ViajeModelType>("Viaje", viajeSchema);