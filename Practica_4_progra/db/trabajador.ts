import mongoose from "npm:mongoose@8.0.0";
import { Trabajador } from "../types.ts";
import EmpresaModel, { EmpresaModelType } from "./empresa.ts";
import TareaModel from "./tarea.ts";

const Schema = mongoose.Schema;

/*const trabajadorSchema = new Schema( {
    nombre: {types: String, required: [true, "Se debe tener un nombre"]},
    dni: {types: String, required: [true, "Se debe añadir un dni"], unique: true},
    empresa: {types: Schema.Types.ObjectId, required: false, ref:"Empresas", default: null},
    tareas: [{types: Schema.Types.ObjectId, required: false, ref:"Tareas", default: null}]   //max 10 tareas
    },
    {timestamps: true}
)*/
const trabajadorSchema = new Schema({
    nombre: { type: String, required: true },
    empresa: { type: Schema.Types.ObjectId, required: false, ref: "Business" },
    tareas: [{ type: Schema.Types.ObjectId, required: false, ref: "Task" },],
    },
    { timestamps: true },
  );

//VALIDACIONES

trabajadorSchema
    .path("tareas")
    .validate(async function (tareas: mongoose.Types.ObjectId[]) {
        if(tareas.length > 10) throw new Error("El trabajador tienen 10 tareas como maximo"); //comprobar que no hay mas de 10 tareas
    })

trabajadorSchema
    .path("empresa")
    .validate(async function (empresa: mongoose.Types.ObjectId) {   //comprobar que existe la empresa y que no tiene ya 10 trabajadores
        const business = await EmpresaModel.findById({_id: empresa}).exec();
        if(!business) throw new Error  ("Esa empresa no existe");
        
        if(business.trabajadores.length >= 10) throw new Error ("Las empresas solo pueden tener 10 trabajadores como maximo");
    })

//PREs Y POSTs

//comprobar que la empresa q nos han dado (en caso de que nos la den) exista y que no tenga mas de 10 empleados
trabajadorSchema.pre("save", async function(next){
    const empresa = await EmpresaModel.findById(this.empresa).exec();
    if(!empresa) throw new Error("No se ha encontrado esa empresa");
    if(empresa.trabajadores.length === 10) throw new Error ("La empresa no puede tener mas de 10 trabajadores")
})

//despues de crear un trabajador en caso de que nos den una empresa, querre actualizar el array de trabajadores de la empresa y añadirle el trabajador
trabajadorSchema.post("save", async function (doc: TrabajadorModelType) {
    await EmpresaModel.findOneAndUpdate({_id: doc.empresa}, {$push: {trabajadores: doc._id}});
})

trabajadorSchema.post("findOneAndDelete", async function (doc: TrabajadorModelType){ 
    /*
    //borrar el trabajador de la empresa usando una copia local:
    const empresa = await EmpresaModel.findById(doc.empresa).exec();    //cogemos la empresa del trabajador
    if(!empresa) throw new Error (`No se encuentra ninguna empresa con el id ${doc.empresa}`);
    empresa.trabajadores.splice(empresa.trabajadores.indexOf(doc._id)); //buscamos en el array de trabajadores de esa empresa para encontrar el trabajador q estamos borrando, cuando tengamos su indice hacemos splice ahi
    empresa.save();  ///porq estabamos haciendo cosas en local, ahora lo guardamos en la bd*/

    //buscar las tareas cuyos ids se encuentren en el array de tareas del trabajador que se esta borando y ponerles el trabajador a null
    await TareaModel.updateMany({_id: {$in: doc.tareas}}, {trabajador: null}).exec();   

    //borrar el trabajador de la empresa directamente en la bbdd
    //buscar la empresa cuyo id coincida con la empresa que tenia el trabajador que se esta borrando y despues del array de trabajadores de esa empresa quiero buscar y borrar al empleado
    await EmpresaModel.findOneAndUpdate({_id: doc.empresa},{$pull:{trabajadores: doc._id}}).exec();
})

export type TrabajadorModelType = mongoose.Document & Omit<Trabajador, "id">

export default mongoose.model<TrabajadorModelType>("Trabajadores", trabajadorSchema);
