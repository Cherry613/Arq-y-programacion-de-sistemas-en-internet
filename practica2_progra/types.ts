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
    client: string; //id de mongo
    products: Product[]; 
    total: number;
}


