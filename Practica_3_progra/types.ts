export type Cliente = {
    dni: string;
    nombre: string;
    dinero: number;
    id_gestor: string;
    hipotecas: string[];    //array con los ids de las hipotecas que tenga el cliente
    movimientos: string[];  //todo el dinero que se mueva debe estar reflejado
};


export type Hipoteca = {
    importe_total: number;
    cuotas: number;
    id_cliente: string;
    id_gestor: string;
};


export type Gestor = {
    nombre: string;
    dni: string;
    clientes: string[];     //maximo 10 clientes (ids de los clientes)
};


