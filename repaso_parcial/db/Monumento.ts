import mongoose from "npm:mongoose@8.0.0";
import { Monumento } from "../types.ts";

const Schema = mongoose.Schema;

const MonumentoSchema = new Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    cod_postal: {type: String, required: true},
    cod_iso: {type: String, required: true},
    ciudad: {type: String, required: true},
    pais: {type: String, required: true},
    continente: {type: String, required: true},
    //hora_actual: {type: String, required: false},    //no porq va cambiando
    //cond_meteo: {type: String, required: false},     //no porq va cambiando --> en la bbdd dejar lo fijo
})

//validar que el codigo iso sean o 3 o 2 letras
MonumentoSchema
    .path("cod_iso")
    .validate( function (cod_iso: string){
        if(cod_iso.length === 2 || cod_iso.length === 3){
            return true;
        }else{
            return false;
        }
    })

export type MonumentoModeltype = mongoose.Document & Omit<Monumento, "id">;
export const MonumentoModel = mongoose.model<MonumentoModeltype>("Monumento", MonumentoSchema);
