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

        //comprobar q no se repiten ids de trabajadores
        //guillermo set-> y como set borra los repetidos si despues de hacer set con el array tenemos menos cosas => teniamos cosos repetidos

        //el promise esperará que termine cada elemento antes de seguir
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

    //va comprobando todos los trabajadores de la base de datos y si el id de ese trabajador este en el arrays de id de mi empresa, pondremos la empresa de ese trabajador a null
    await TrabajadorModel.updateMany({_id: {$in: doc.trabajadores}}, {empresa: null}).exec();   //cuando el id este en mi array de trabajadores (es un array de ids Schema.Types.ObjectID)
    await TareaModel.updateMany({_id: {$in: doc.tareas}}, {empresa: null}).exec(); //borrar tarea si no tiene empresa o trabajador -.-? -> si la borro ps delete y yap
})

 /* empresaSchema.pre("findOneAndUpdate", async function (next ){
    //comprobar que la empresa y el trabajador existan, que la empresa no tenga ya 10 empleados y que el trabajador no tenga ya una empresa

    
      
  const update = this.getUpdate();
    if(!update) throw new Error (`No hay actualzaciones`);

    const empresa = await EmpresaModelType.findById(this.getQuery()["_id"]).exec();
    if(!empresa) throw new Error ("No existe la empresa");

    if(update["$push"] !== undefined) { //si la actualizacion es un push y ademas es un push al array trabajadores de la empresa... 
        if(update["$push"]["trabajadores"] !== undefined) {

            //comprobar que la empresa no tenga ya 10 trabajadores
            if(empresa.trabajadores.length >= 10) throw new Error ("La empresa solo puede tener 10 empleados");

            //comprobar que el trabajador que intentamos contratar no trabaje ya para otra empresa
            const trabajador = await TrabajadorModel.findById(update["$push"]["trabajadores"]).exec();
            if(!trabajador) throw new Error ("Ese trabajador no existe");
            if(trabajador.empresa != null) throw new Error ("Este trabajador ya trabaja en otra empresa");
        }
    }
})*/

/*empresaSchema.post("findOneAndUpdate", async function (doc: EmpresaModelType) {
    //despues de actualizar la empresa y añadir el trabajador a su array debemos modificiar el trabajador y añadirle la empresa 
    const update = this.getUpdate();
    if(!update) throw new Error ("No hay actualizaciones")

    if(update["$push"] !== undefined){
        if(update["$push"]["trabajadores"] !== undefined){
            const trabajadorID = update["$push"]["trabajadores"];
            await 
        }
    }
    await TrabajadorModel.updateOne({_id: doc.trabajadores})

     /*
    const update = this.getUpdate();
    if(!update) throw new Error(`Update is empty`);

    if(update["$push"] !== undefined){
        if(update["$push"]["workers"] !== undefined){
            const workerId = update["$push"]["workers"];
            await WorkerModel.findOneAndUpdate({_id: workerId},{business: this.getQuery()["_id"]}).exec();
        }
    }else if(update["$pull"] !== undefined){
        if(update["$pull"]["workers"] !== undefined){
            const workerId = update["$pull"]["workers"];
            await WorkerModel.findOneAndUpdate({_id: workerId},{business: null}).exec();
        }
    }
    
})*/

export type EmpresaModelType = mongoose.Document & Omit<Empresa, "id">

export default mongoose.model<EmpresaModelType>("Empresas", empresaSchema);