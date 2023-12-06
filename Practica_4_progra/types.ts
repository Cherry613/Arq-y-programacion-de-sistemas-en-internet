export enum ESTADO {
    TO_DO = "TO DO",
    IN_PROGRESS = "IN PROGRESS",
    IN_TEST = "IN TEST",
    CLOSED = "CLOSED"
}

export type Empresa = {    
    nombre: string,
    trabajadores: Array< Omit< Trabajador,"empresa" | "tareas">>, //va a tener max 10 trabajadores 
    tareas: Array< Omit< Tarea, "empresa" | "trabajador" >> //array de las tareas q ha creado la empresa
}

export type Trabajador = {
    dni: string
    nombre: string,
    empresa: Omit<Empresa, "trabajadores" | "tareas">,
    tareas: Array< Omit< Tarea, "trabajador" | "empresa" >> // max 10.
}

export type Tarea ={
    nombre: string,
    estado: ESTADO,
    trabajador: Omit<Trabajador, "empresa" | "tarea"> 
    empresa: Omit<Empresa, "trabajadores" | "tareas"> 
}


/*
Habrá 3 colecciones, Empresa-Trabajador-Tarea
Las tareas tienen estados (TO DO, In Progress, In Test, Closed), trabajador que la realiza y empresa que la crea
El trabajador solo puede pertenecer a una empresa y puede tener como máximo 10 tareas
Cuando una tarea llega al estado Closed se deberá eliminar y también todas sus referencias
Una empresa puede tener máximo 10 trabajadores
*/