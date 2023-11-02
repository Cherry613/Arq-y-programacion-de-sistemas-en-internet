import { Request, Response } from "npm:express@4.18.2"; 
import ProductModel from "../db/product.ts";

const addProducts = async (req: Request, res: Response) => {
  try {
    const { name, stock, description, price } = req.body;
    if (!name || !price) {
      res.status(400).send("Name and price are required");
      return;
    }

    //no podremos añadir productos con precio negativos
    if(price < 0){
      res.status(400).send("The price can't be negative");
    }

    //no podremos añadir productos con stock negativo 
    if (stock < 0) {
      res.status(400).send("stock can't be negative");
      return;

    }

    //no añadiremos un producto que ya exista en la base de datos
    const alreadyExists = await ProductModel.findOne({ name }).exec();
    if (alreadyExists) {
      res.status(400).send("That product already exists");
      return;
    }

    const newProduct = new ProductModel({ name, stock, description, price });
    await newProduct.save();

    res.status(200).send({
      name: newProduct.name,
      stock: newProduct.stock,
      description: newProduct.description,
      price: newProduct.price,
      id: newProduct._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addProducts;