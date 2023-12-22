import mongoose from "npm:mongoose@8.0.0";
import { Conductor } from "../types.ts";

const Schema = mongoose.Schema;

const conductorSchema = new Schema ( 
    {
        name: {type: String, required: true},
        email: {type: String,  required: true, unique: true}, //formato email
        username: {type: String, required: true, unique: true},
        travels: [{type: Schema.Types.ObjectId, required: false, ref: "Viaje"},]
    },
    {timestamps: true}
);

//Un cliente y un conductor solamente pueden tener un viaje activo
//Cuando se borra un cliente o un conductor, entonces si que se borran los viajes y sus referencias

//VALIDAR
//validar que el email sea formato email -> expresiones regulares
conductorSchema
    .path("email")
    .validate( function (email: string) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
    });

export type ConductorModelType = mongoose.Document & Omit<Conductor, "id">;

export default mongoose.model<ConductorModelType>("Conductor", conductorSchema);