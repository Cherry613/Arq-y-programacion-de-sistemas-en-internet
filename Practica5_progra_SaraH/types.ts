export enum ESTADOS {
    ongoing = "ongoing",
    finish = "finish",
}

export type Cliente = {
    name: string,   //obligatorio, unico
    email: string,  //unico, obligatorio, formato email
    cards: Tarjeta[],
    travels: Viaje[],
}

export type Conductor = {
    name: string,   //obligatorio
    email: string,  //unico, obligatorio, formato email
    username: string,   //unico, obligatorio
    travels: Viaje[],
}

export type Viaje = {
    client: string, //id
    driver: string, //id
    money: number,  //obligatorio, minimo 5€
    distance: number,   //obligatorio, minimo 0.01 km
    date: Date, //obligatorio
    status: ESTADOS,
}

export type Tarjeta = {
    number: number, //formato tarjeta, obligatorio
    cvv: number,    //3 numeros solo, obligatorio
    expirity: Date, //MM/YYYY, obligatorio
    money: number, //dinero de la tarjeta
}