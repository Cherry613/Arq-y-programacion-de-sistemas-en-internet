export const seguridad = (password: string): number =>{
    //nivel de seguridad de la contraseña
    let seguridad: number = 0;
    
    //Se debe convertir el string en array, cada caracter será un elemento del array
    const arr: string[] = password.split('');

    //Si tiene una letra y un numero sumará 1
    const Hayletra: boolean = arr.some(elem => isNaN(parseInt(elem))); //si la funcion NaN devuelve true no habra ningun numero en el array
    const Haynum:boolean = arr.some(elem => !isNaN(parseInt(elem))); //si la funcion NaN devuelve false habra numeros en el array
    if(Hayletra && Haynum) seguridad++;   

    //Si tiene tres números seguidos restará 1
    for(let i = 0; i<arr.length - 2; i++){
        //utilizando la misma logica que en el apartado anterior, si NaN es false 3 veces seguidas, habra 3 numeros seguidos
        if(!isNaN(parseInt(arr[i])) && !isNaN(parseInt(arr[i + 1])) && !isNaN(parseInt(arr[i + 2]))){   
            seguridad -= 1;
            break;
        }
    }
  
    //Si la contraseña supera los 20 caracteres sumará 2
    if(password.length > 20) seguridad += 2;

    //Si la contraseña es menor a 10 caracteres restará 1
    if(password.length < 10) seguridad -= 1;

    //Si tiene caracteres especiales sumará 1 
    const caracteres_especiales = ['!','@','#','$','%','^','&','*','(',')','_','+','-','=','[',']','{','}',';',':','|',',','.','<','>','/','?'];

    if(arr.some(elem => caracteres_especiales.includes(elem))) {
        seguridad += 1;
    }

    return seguridad;
}

console.log(seguridad("alcachofiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii78?"));