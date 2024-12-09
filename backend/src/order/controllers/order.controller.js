// Please don't change the pre-written code
// Import the necessary modules here

import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

import { findProductRepo } from "../../product/model/product.repository.js";

export const createNewOrder = async (req, res, next) => {
  // Write your code here for placing a new order
  try {
    const { orderedItems } = req.body;
    for (const item of orderedItems) {
      const productId = item.product;
      const product = await findProductRepo(productId);
      if (!product) {
        return next(
          new ErrorHandler(
            400,
            "Product not found! " + item.product + item.name
          )
        );
      }
      if (product.stock < Number(item.quantity)) {
        return next(
          new ErrorHandler(
            400,
            "Not enough stock! " +
              item.product +
              " " +
              item.name +
              ` Available: ${product.stock} | Ordered: ${item.quantity}`
          )
        );
      }
      if (product.name != item.name) {
        return next(
          new ErrorHandler(
            400,
            "Name of the product doesn't match with our records"
          )
        );
      }
    }

    req.body.user = req.user._id;
    req.body.paidAt = new Date();
    const order = await createNewOrderRepo(req.body);
    res.status(201).json({ success: true, order });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};
