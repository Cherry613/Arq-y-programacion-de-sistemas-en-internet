export type Product = {
    name: string;
    stock: number;
    description: string;
    price: number;
  };

export type Client = {
    name: string;
    cif: string;
}

export type Invoice = {
    client: string; //string porq apunta al id de mongo
    products: Product[]; //apunta al id de mongo de los productos
    total: number;
}

//tipo para el array del productos -> queremos nombre, (stock, como mucho el precio total) 

