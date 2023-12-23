import mongoose from "npm:mongoose@8.0.0";
import { Conductor } from "../types.ts";
import { GraphQLError } from "graphql";
import { ViajeModel } from "./Viaje.ts";

const Schema = mongoose.Schema;

const conductorSchema = new Schema ( 
    {
        name: {type: String, required: true},
        email: {type: String,  required: true, lowercase: true ,unique: true}, //formato email
        username: {type: String, required: true, unique: true},
        travels: [{type: Schema.Types.ObjectId, required: false, ref: "Viaje"},]
    },
    {timestamps: true}
);

//VALIDAR
//validar que el nombre solo sean caracteres, que no haya numeros ni caracteres especiales utilizando expresiones regulares
conductorSchema
    .path("name")
    .validate( function (name: string){
        const nameRegex = /^([\w]+)$/;
        if(!nameRegex.test(name)) throw new GraphQLError (`El nombre no es correcto`);
        return true;
    });

//validar que el email sea formato email utilizando expresiones regulares
conductorSchema
    .path("email")
    .validate( function (email: string) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if(!emailRegex.test(email)) throw new GraphQLError (`El email no es correcto`);
        return true;
    });

//al borrar un conductor, borrar sus viajes y sus referencias
conductorSchema.pre("findOneAndDelete", async function () {
    //codigo cedido por Guillermo Infiesta
    const id_conductor = this.getQuery()["_id"]  //de la query que habia en el findOneAndDelete ( {_id: args.id} ), coge -> _id

    const conductor = await ConductorModel.findById(id_conductor).exec();   //buscar al conductor que coincida con ese _id
    await ViajeModel.deleteMany({_id: {$in: conductor?.travels}}).exec();   //se borran todos los viajes que tenga ese cliente antes de borrar al propio conductor (otro pre)
})

export type ConductorModelType = mongoose.Document & Omit<Conductor, "id">;

//export default mongoose.model<ConductorModelType>("Conductor", conductorSchema);
export const ConductorModel = mongoose.model<ConductorModelType>("Conductor", conductorSchema);