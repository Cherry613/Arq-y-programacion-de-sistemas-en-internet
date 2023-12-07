import mongoose from "npm:mongoose@8.0.0";
import { Empresa } from "../types.ts";
import TrabajadorModel from "./trabajador.ts";
import TareaModel from "./tarea.ts";

const Schema = mongoose.Schema;

const empresaSchema = new Schema({
    nombre: { type: String, required: true },
    trabajadores: [{ type: Schema.Types.ObjectId, required: false, ref: "Trabajadores" },],
    tareas: [{ type: Schema.Types.ObjectId, required: false, ref: "Tareas" },],
  },
  { timestamps: true },
);


//VALIDACIONES

//verificar q no estemos intentando añadir 10 trabajadores, que los trabajadores estan en la bd y que ninguno trabaja ya para otra emrpesa
empresaSchema
    .path("trabajadores")
    .validate(async function (trabajadores: mongoose.Types.ObjectId[]) {    //array de los ids de mongo

        if(trabajadores.length > 10) throw new Error("Las empresas tienen 10 trabajadores como maximo"); //comprobar que el array no tenga mas de 10 trabajadores

        await Promise.all(trabajadores.map( async (id) => {

            const trabajador = await TrabajadorModel.findById({_id: id}).exec(); //compruebo que esos trabajadores existen en la bbdd
            if(!trabajador) throw new Error(`No existe el trabajador con id: ${id}`);

            if(trabajador.empresa !== null) throw new Error ("Este trabajador ya trabaja en otra empresa") //comprobar q no trabajen ya para otra empresa
        }))
});

//PREs Y POSTs

//despues de crear la empresa, actualizar a todos los trabajadores q se hayan incluido para q todos tengan esta empresa 
empresaSchema.post("save", async function () {
    await TrabajadorModel.updateMany({_id: {$in: this.trabajadores}}, {empresa: this._id}).exec();
})

empresaSchema.post("findOneAndDelete", async function (doc: EmpresaModelType) {

    //va comprobando todos los trabajadores de la base de datos y si el id de ese trabajador esta en el array de ids de mi empresa, pondremos la empresa de ese trabajador a null
    await TrabajadorModel.updateMany({_id: {$in: doc.trabajadores}}, {empresa: null}).exec();   //cuando el id este en mi array de trabajadores (es un array de ids Schema.Types.ObjectID)
    await TareaModel.updateMany({_id: {$in: doc.tareas}}, {empresa: null}).exec();
})


export type EmpresaModelType = mongoose.Document & Omit<Empresa, "id">

export default mongoose.model<EmpresaModelType>("Empresas", empresaSchema);