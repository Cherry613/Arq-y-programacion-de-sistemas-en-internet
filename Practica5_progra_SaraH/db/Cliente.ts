import mongoose from "npm:mongoose@8.0.0";
import { Cliente } from "../types.ts";

const Schema = mongoose.Schema;

/*const clienteSchema = new Schema (
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},   //formato email
        cards: [{type: {
            number: {type: Number, required: true}, //formato tarjeta
            cvv: {types: Number, required: true},   //3 caracteres
            expirity: {type: String, required: true}, //MM/YYYY
            money: {type: Number, required: false, default: 0}
        }, required: false}],
        travels: [{type: Schema.Types.ObjectId, required: false, ref: "Viaje"},]  //mejor array de strings con ids

    },
    {timestamps: true}
);*/

const clienteSchema = new Schema({
    name: {type: String, required: true, minlength: 3},
    email: {type: String, required: true, lowercase: true, unique: true},
    cards: [{type: {
        number: {type: String, required: true},
        cvv: {type: Number, required: true},
        expirity: {type: String, required: true},
        money: {type: Number, required: true}
    }, required: false}], 
    travels: [{type: mongoose.Types.ObjectId, ref: `Travels`,
        minLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`], 
        maxLength: [24, `La longitud de una id de mongo debe de ser de exactamente 24 caracteres hexadecimales`]}]
})

//Cuando se crea un cliente solamente se le puede pasar el name y el email
//Un cliente y un conductor solamente pueden tener un viaje activo
//Cuando se borra un cliente o un conductor, entonces si que se borran los viajes y sus referencias


//VALIDAR
//validar que el email sea formato email -> expresiones regulares
clienteSchema
    .path("email")
    .validate( function (email: string) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;   //no empieza por especiales ni despeus del @ tampoco
        return emailRegex.test(email);
    });

//validar que el numero de la tarjeta sea formato tarjeta
clienteSchema
    .path("cards.number")
    .validate(function(number: number){
        const numero_string = number.toString();
        if(numero_string.length != 16) return false;
        return true;
    });

//validar que el cvv sean 3 caracteres
clienteSchema
    .path("cards.cvv")
    .validate(function (cvv: number){
        const cvv_string = cvv.toString();
        if(cvv_string.length != 3) return false;
        return true;
    });

//comprobar que la fecha de caducidad de la tarjeta tenga formato MM/YYYY
clienteSchema
    .path("cards.expirity")
    .validate(function (expirity: string){
        const expirityRegex = /^(0[1-9]|1[0-2])\/([0-9]{4})$/;
        return expirityRegex.test(expirity);
    })

//Comprobar que la tarjeta no tenga dinero negativo


//cuando hagas el viaje ya estaria ongoing (solo 2 estados o haciendose o acabado) => solo habria q comproar
//el ultimo elemento del array para ver si esta activo o no 


export type ClienteModelType = mongoose.Document & Omit<Cliente, "id">;

export default mongoose.model<ClienteModelType>("Cliente", clienteSchema);