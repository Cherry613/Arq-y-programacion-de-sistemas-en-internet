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

//Un cliente y un conductor solamente pueden tener un viaje activo
//Cuando se borra un cliente o un conductor, entonces si que se borran los viajes y sus referencias

//VALIDAR
//validar que el nombre solo sean caracteres y no haya numeros ni caracteres especiales
conductorSchema
    .path("name")
    .validate( function (name: string){
        const nameRegex = /^([\w]+)$/;
        if(!nameRegex.test(name)) throw new GraphQLError (`El nombre no es correcto`);
        return true;
    });

//validar que el email sea formato email -> expresiones regulares
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
    const id_conductor = this.getQuery()["_id"]  //del {_id: args.id} q habia en el findOneAndDelete, coge el _id (el propio id de mongo, no tal cual un "_id")

    const conductor = await ConductorModel.findById(id_conductor).exec();
    await ViajeModel.deleteMany({_id: {$in: conductor?.travels}}).exec(); //se borran todos los viajes q tenga ese conductor  
})

export type ConductorModelType = mongoose.Document & Omit<Conductor, "id">;

//export default mongoose.model<ConductorModelType>("Conductor", conductorSchema);
export const ConductorModel = mongoose.model<ConductorModelType>("Conductor", conductorSchema);