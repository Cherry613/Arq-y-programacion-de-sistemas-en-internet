import { Request, Response } from "npm:express@4.18.2";
import ProductModel from "../db/product.ts";

const getProducts = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.find().exec();

    res.status(200).send(product);
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default getProducts;