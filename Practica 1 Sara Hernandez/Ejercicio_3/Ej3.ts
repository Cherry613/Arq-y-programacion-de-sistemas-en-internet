//Hacer una función que transforme fechas de formato 12 horas en formato 24 horas

export const conversion_hora = (tiempo: string) => {

    //https://www.freecodecamp.org/espanol/news/el-split-de-javascript-como-dividir-una-cadena-de-caracteres-en-un-arreglo-con-js/
    //de ahi aprendi a usar expresiones regulares para dividir arrays con varios limitadores
    const partes = tiempo.split(/:| /); // split separa o por : o por espacios mediante el uso de la expresion regular

    let hora = partes[0];   //primera parte del array seran las horas
    const min = partes[1];  //segunda parte del array seran los minutos
    const am_pm = partes[2];    //ultima parte del array sera el am o pm

    if(am_pm === 'am' && parseInt(hora) < 10 && parseInt(hora) > 0) hora = 0 + hora;    //si es por la mañana y es antes de las 10 añadimos un 0 delante de la hora (ej. 8:00 am -> 0800)
    
    if(am_pm === 'am' && parseInt(hora) === 12) hora = '00';    //si son las 12 de la mañana se cambia la hora por 00 para conseguir que sea 0000

    if(am_pm === 'pm' && parseInt(hora) < 12) hora = (parseInt(hora) + 12).toString();  //si es por la tarde se sumaran 12 horas a cada hora, excepto a las 12:00

    return hora+min;
}

console.log(conversion_hora("5:00 pm"))