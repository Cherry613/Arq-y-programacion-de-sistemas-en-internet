import mongoose from "npm:mongoose@8.0.0";
import { ESTADO, Tarea } from "../types.ts";
import  EmpresaModel from "./empresa.ts";
import  TrabajadorModel from "./trabajador.ts";

const Schema = mongoose.Schema;

const tareaSchema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: String, required: false, enum: ESTADO, default: ESTADO.TO_DO },
    trabajador: { type: Schema.Types.ObjectId, required: true, ref: "Trabajadores" },
    empresa: { type: Schema.Types.ObjectId, required: true, ref: "Empresas" },
    },
    { timestamps: true },
);

//VALIDACIONES
tareaSchema
    .path("nombre")
    .validate(async function (nombre: string) {
        if(!nombre) throw new Error("Se debe incluir un nombre"); 
    })

tareaSchema
    .path("estado")
    .validate(async function (estado: string) {     //comprobar q la tarea no empiece como cerrada
        if(estado === "CLOSED") throw new Error ("No puedes añadir una tarea con estado Closed");  
    })

tareaSchema
    .path("empresa")    
    .validate(async function (empresa: mongoose.Types.ObjectId) {   //comprobar que la empresa existe
        if(!empresa) throw new Error ("Debe incluirse una empresa");
        const business = await EmpresaModel.findById({_id : empresa}).exec();   //no hace falta poner empresa._id porq empresa ya es un id (objectId)
        if(!business) throw new Error ( "Esa empresa no existe");
    });

tareaSchema
    .path("trabajador")
    .validate(async function (trabajador: mongoose.Types.ObjectId) {    //comprobar que los trabajadores existen y que no tienen mas de 10 empresas
        if(!trabajador) throw new Error ("Debe incluirse un trabajador");
        const worker = await TrabajadorModel.findById({_id: trabajador}).exec();
        if(!worker) throw new Error ("Ese trabajador no existe");
        if(worker.tareas.length === 10) throw new Error ("El trabajador tiene max 10 tareas");
    })


//PREs Y POSTs

//antes de crear la tarea, comprobar que el trabajor trabaja en la empresa que se ha dado y que tiene menos de 10 tareas.
tareaSchema.pre("save", async function(){
    const empresa = await EmpresaModel.findById({_id: this.empresa}).exec();
    const trabajador = await TrabajadorModel.findOne({_id: {$in: empresa?.trabajadores}}).exec();
    if(trabajador?.tareas.length === 10) throw new Error("El trabajador solo puede tener 10 tareas");
});

//despues de crear la tarea, la añadimos a los arrays de tareas del trabajador y de la empresa
tareaSchema.post("save", async function (doc: TareaModelType) {
    await TrabajadorModel.updateOne({_id: doc.trabajador}, {$push: {tareas: doc._id}});
    await EmpresaModel.updateOne({_id: doc.empresa},{$push: {tareas: doc._id}});
})

tareaSchema.post("findOneAndDelete", async function (doc: TareaModelType) {

    await TrabajadorModel.findOneAndUpdate({_id: doc.trabajador}, {$pull: {tareas: doc._id}}).exec();
    await EmpresaModel.findOneAndUpdate({_id: doc.empresa}, {$pull: {tareas: doc._id }}).exec();

})

tareaSchema.post("findOneAndUpdate", async function (doc: TareaModelType) {
    try{//si el estado es closed -> borrar la tarea, borrar la tarea q tenga el mismo id q esta en el trabajador y en la empresa
        if(doc.estado === "CLOSED"){
            await doc.deleteOne();
            await TrabajadorModel.updateOne({_id: doc.trabajador},{$pull: {tareas: doc._id}});
            await EmpresaModel.updateOne({_id: doc.empresa}, {$pull: {tareas: doc._id}});
        }
    }catch(error){
        return error;
    }
})

export type TareaModelType = mongoose.Document & Omit<Tarea, "id">

export default mongoose.model<TareaModelType>("Tareas", tareaSchema);