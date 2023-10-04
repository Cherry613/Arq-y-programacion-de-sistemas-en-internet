const seguridad = (password: string): number =>{
    let seguridad: number = 0;
    
    //Se debe convertir el string en array, cada caracter será un elemento del array
    const arr: string[] = password.split('');

    //Si tiene una letra y un numero sumará 1
    //const letras ='[a-zA-Z]';
    //const num = '[0-9]';

    const Hayletra: boolean = arr.some(elem => isNaN(parseInt(elem))); 
    const Haynum:boolean = arr.some(elem => !isNaN(parseInt(elem))); 

    //console.log(Hayletra);
    //console.log(Haynum);

    if(Hayletra && Haynum) seguridad++;   

    //Si tiene tres números seguidos restará 1
    for(let i = 0; i<arr.length - 2; i++){
        if(!isNaN(parseInt(arr[i])) && !isNaN(parseInt(arr[i + 1])) && !isNaN(parseInt(arr[i + 2]))){
            seguridad -= 1;
            break;
        }
        else{}
    }
  
    //Si la contraseña supera los 20 caracteres sumará 2
    if(password.length > 20) seguridad += 2;

    //Si la contraseña es menor a 10 caracteres restará 1
    if(password.length < 10) seguridad -= 1;

    //Si tiene caracteres especiales sumará 1 
    // !@#$%^&*()_+-=[]{};':"|,.<>/? 

    const caracteres_especiales = ['!','@','#','$','%','^','&','*','(',')','_','+','-','=','[',']','{','}',';',':','|',',','.','<','>','/','?'];

    if(arr.some(elem => caracteres_especiales.includes(elem))) {
        seguridad += 1;
    }

    return seguridad;
}

console.log(seguridad("alcachofiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii78?"));