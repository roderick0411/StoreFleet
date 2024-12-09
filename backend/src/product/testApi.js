import ProductModel from "./model/product.schema.js";
import OrderModel from "../order/model/order.schema.js";
import UserModel from "../user/models/user.schema.js";

const dbPractice = async (req, res, next) => {
  console.log("Request received");
  const orders = await OrderModel.find()
    .populate("user")
    .populate("orderedItems.product");
  res.status(200).json({ orders });
};

// 66b46514f7caaafe43259a36
export { dbPractice };

// Rest API
// minprice, maxprice, minrating, maxrating

// {
//   "minPrice": 100,
//   "maxPrice": 1000,
//   "minRating": 1,
//   "maxRating": 5
// }
