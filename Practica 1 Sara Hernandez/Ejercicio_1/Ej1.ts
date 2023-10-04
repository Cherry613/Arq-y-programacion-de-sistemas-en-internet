//implementar una funcion con un parametro de entrada (array) y que implemente un algoritmo bubble sort, debe ser recursiva

const arr: Array<number> =[654,65,89,21,51,48,82,3,5,4,0,2,1,9,7,98,651,21];
//let arr: Array<number> = [8,4,5,6,2,1];

const bubbleSort_ = (arr: Array<number>, length:number)=>{
    
    if(length <= 1){
        return arr;
    }

    for(let i= 0; i<length; i++){
        if(arr[i]>arr[i+1]){
            
            let aux = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = aux;
        }
    }

    return bubbleSort_(arr,length-1);
}


const bubbleSort = (arr : Array<number>) => {
    bubbleSort_(arr, arr.length);
}

bubbleSort(arr);
console.log(arr);



    