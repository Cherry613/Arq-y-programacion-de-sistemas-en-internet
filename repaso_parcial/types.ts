 export type Monumento = {
    nombre: string,
    descripcion: string,
    cod_postal: string,
    cod_iso: string,
    ciudad: string,
    pais: string,   //zip api --> name.official
    continente: string, //lo puedo sacar con el zip api y el iso --> region
    hora_actual: string, //worldtimeapi /Europe/ciudad
    cond_meteo: string,
}

/*
export type MonumentoAPI = {    //para usar este cambiar la lin 29 del schema a este type
    nombre: string,
    descripcion: string,
    cod_postal: string,
    cod_iso: string,

    ciudad: string,
    pais: string,   //zip api --> name.official
    continente: string, //lo puedo sacar con el zip api y el iso --> region
    hora_actual: string, //worldtimeapi /Europe/ciudad
    cond_meteo: string,
}*/