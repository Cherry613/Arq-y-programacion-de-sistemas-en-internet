import mongoose from "npm:mongoose@8.0.0";
import { Cliente } from "../types.ts";
import { GraphQLError } from "graphql";


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


//VALIDAR
//validar que el email sea formato email -> expresiones regulares
clienteSchema
    .path("email")
    .validate( function (email: string) {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;   //no empieza por especiales ni despeus del @ tampoco
        if(!emailRegex.test(email)) throw new GraphQLError (`El email no es correcto`);
        return true;
    });

//validar que el numero de la tarjeta sea formato tarjeta
clienteSchema
    .path("cards.number")
    .validate(function(number: string){ //se usa string porque con int no se llega a numeros de 16 cifras
        const numberRegex = /^([0-9]{16})$/;
        if(!numberRegex.test(number)) throw new GraphQLError (`El numero de la tarjeta no es correcto`);
        return true;
    });

//validar que el cvv sean 3 caracteres
clienteSchema
    .path("cards.cvv")
    .validate(function (cvv: number){
        const cvv_string = cvv.toString();
        if(cvv_string.length != 3) throw new GraphQLError (`El cvv de la tarjeta no es correcto`);
        return true;
    });

//comprobar que la fecha de caducidad de la tarjeta tenga formato MM/YYYY
clienteSchema
    .path("cards.expirity")
    .validate(function (expirity: string){
        const expirityRegex = /^(0[1-9]|1[0-2])\/([0-9]{4})$/;
        if(!expirityRegex.test(expirity)) throw new GraphQLError (`El fecha de expiracion no es correcta`);
        return true;
    })

//Comprobar que la tarjeta no tenga dinero negativo
clienteSchema
    .path("cards.money")
    .validate(function(money: number){
        if(money < 0 ) throw new GraphQLError (`La tarjeta no puede tener dinero negativo`);
    })


//al borrar un cliente, borrar sus viajes y sus referencias
clienteSchema.pre("findOneAndDelete", async function () {
    //codigo cedido por Guillermo Infiesta 
    const id_cliente = this.getQuery()["_id"]  //del {_id: args.id} q habia en el findOneAndDelete, coge el _id (el propio id de mongo, no tal cual un "_id")
    const cliente = await ClienteModel.findById(id_cliente).exec();
    this.deleteMany({_id: {$in: cliente?.travels}}).exec(); //se borran todos los viajes q tenga ese cliente  
})

export type ClienteModelType = mongoose.Document & Omit<Cliente, "id">;

//export default mongoose.model<ClienteModelType>("Cliente", clienteSchema);
export const ClienteModel = mongoose.model<ClienteModelType>("Cliente", clienteSchema);