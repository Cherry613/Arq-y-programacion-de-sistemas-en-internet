import { Request, Response } from "npm:express@4.18.2";
import ProductModel from "../db/product.ts";

const deleteProduct = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;
    const product = await ProductModel.findOneAndDelete({ _id: id }).exec();  //q borre el producto cuyo _id sea igual al id q hemos cogido en parametros
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }
    res.status(200).send("Product deleted");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deleteProduct;