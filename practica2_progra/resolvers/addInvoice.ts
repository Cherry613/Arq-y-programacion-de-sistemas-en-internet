import { Request, Response } from "npm:express@4.18.2";
import InvoiceModel from "../db/invoice.ts";
import ClientModel from "../db/clients.ts";
const addInvoice = async (req: Request, res: Response) => {
  try {
    const { client, products, total } = req.body;
    if (!client || !products || !total) {
      res.status(400).send("Name and cif are required");
      return;
    }

    //un cliente si podria pedir 2 veces el mismo pedido
    /*const alreadyExists = await InvoiceModel.findOne({ cif }).exec();
    if (alreadyExists) {
      res.status(400).send("That client already exists");
      return;
    }*/
    const alreadyExists = await ClientModel.findOne({cif: client});
    if(alreadyExists){
        return;
    }

    const newInvoice = new InvoiceModel({ client, products, total});
    await newInvoice.save();

    res.status(200).send({
      client: newInvoice.client,
      products: newInvoice.products,
      total: newInvoice.total,
      id: newInvoice._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addInvoice;