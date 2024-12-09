import mongoose from "mongoose";

import OrderModel from "./order.schema.js";
import { findProductRepo } from "../../product/model/product.repository.js";

export const createNewOrderRepo = async (data) => {
  // Write your code here for placing a new order
  const { orderedItems } = data;
  let order;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const item of orderedItems) {
      const productId = item.product;
      console.log(productId);
      const product = await findProductRepo(productId);
      const stock = product.stock;
      product.stock = stock - Number(item.quantity);
      await product.save();
    }
    order = new OrderModel(data);
    order.save();
    session.commitTransaction();
  } catch (error) {
    session.abortTransaction();
    console.log(error);
    throw new Error("Error ocurred while placing the order");
  }
  return order;
};
