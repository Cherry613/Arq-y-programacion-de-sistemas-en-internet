//Hacer una función que transforme fechas de formato 12 horas en formato 24 horas

const conversion_hora = (tiempo: string) => {

    const partes = tiempo.split(/:| /);

    let hora = partes[0];
    const min = partes[1];
    const am_pm = partes[2];


    if(am_pm === 'am' && parseInt(hora) < 10 && parseInt(hora) > 0) hora = 0 + hora; 
    
    if(am_pm === 'am' && parseInt(hora) === 12) hora = '00'; 

    if(am_pm === 'pm' && parseInt(hora) < 12) hora = (parseInt(hora) + 12).toString(); 

    return hora+min;
}

console.log(conversion_hora("5:00 pm"))