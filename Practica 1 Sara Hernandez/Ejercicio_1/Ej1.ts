//implementar una funcion con un parametro de entrada (array) y que implemente un algoritmo bubble sort, debe ser recursiva

const arr: Array<number> =[14,26,50,42,66,80,32,95];

const bubbleSort_ = (arr: Array<number>, length:number)=>{
    
    if(length <= 1){
        return arr;
    }

    for(let i = 0; i < length; i++){
        if(arr[i] > arr[i+1]){
            
            let aux = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = aux;
        }
    }

    return bubbleSort_(arr, length-1);
}

export const bubbleSort = (arr : Array<number>) => {
    bubbleSort_(arr, arr.length);
}

bubbleSort(arr);
console.log(arr);



    