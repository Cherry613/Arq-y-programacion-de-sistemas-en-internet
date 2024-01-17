import {Request, Response} from "npm:express@4.17.2";
import { MonumentoModel } from "../db/Monumento.ts";

const addMonumento = async( req: Request, res: Response) => {
    try{
        const {nombre, descripcion, cod_postal, cod_iso} = req.body;

        //----------------------------------------------------------------------profe
        //comprobar que estan todos los datos necesarios
        if(!nombre || !descripcion || !cod_postal || !cod_iso){
            res.status(500).send("Deben proporcionarse un nombre, una descipción, un codigo postal y un codigo iso");
            return;
        }

        //comprobar que los datos son del tipo correcto 
        if(typeof nombre !== "string"|| typeof descripcion !== "string" || typeof cod_postal !== "string" || typeof cod_iso !== "string"){
            res.status(500).send("Tipo de datos incorrecto");
            return;
        }
        //-------------------------------------------------------------------------

        //comprobar que no existan ya un monumento con este nombre
        const exists = await MonumentoModel.exists({nombre, cod_postal}).exec();
        if(exists){
            res.status(400).send("Ese monumento ya existe en la base de datos");
            return;
        }
        
        //buscar ciudad, pais, continente, hora local y tiempo --> hora local y tiempo se rellenaran cuando haga el get 
        const url_rest = `"https://restcountries.com/v3.1/alpha/${cod_iso}`; //de aqui puedo sacar el pais y el contiente
        const response_rest = await fetch(url_rest);

        const datos_rest = await response_rest.json();

        const url_zip = `https://zip-api.eu/api/v1/info/${cod_iso}-${cod_postal}`;  //de aqui sacamos la ciudad
        const response_zip = await fetch(url_zip);

        const data_zip = await response_zip.json();
        
        await MonumentoModel.create({nombre, descripcion, cod_postal, cod_iso, ciudad: data_zip.place_name, pais: datos_rest[0].name.official, continente: datos_rest[0].continents})
        res.status(200).send("Se ha creado el monumento")

    }catch(error){
        res.status(500).send(error.message);
        return;
    }
};

export default addMonumento;
