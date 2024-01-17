import {Request, Response} from "npm:express@4.17.2";
import { MonumentoModel } from "../db/Monumento.ts";

const getMonumentoID = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;

        if(!id){
            res.status(400).send("No se ha proporcionado un id");
            return;
        }

        if(typeof id !== "string"){
            res.status(400).send("El id debe ser un string");
            return;
        }

        const monumento = await MonumentoModel.findById(id).exec();
        if(!monumento){
            res.status(404).send(`No se ha encontrado ningun monumento con el id ${id}`);
            return;
        }

        //coger todos los datos de las apis
        const url_weather = `http://api.weatherapi.com/v1/current.json?key=69de3a91bd4a47f8aea92140230610&q=${monumento.ciudad}&aqi=no`
        const response_weather = await fetch(url_weather);

        const data_weather = await response_weather.json();

        const datos_monumento = {
            id: monumento._id.toString(),
            nombre: monumento.nombre,
            descripcion: monumento.descripcion,
            cod_postal: monumento.cod_postal,
            cod_iso: monumento.cod_iso,
            ciudad: monumento.ciudad,
            pais: monumento.pais,
            continente: monumento.continente,
            hora_actual: data_weather.location.localtime,
            cond_meteo: data_weather.current.condition.text,
        }

        res.status(200).send(datos_monumento);

    }catch(error){
        res.status(500).send(error.message);
        return;
    }
};

export default getMonumentoID;