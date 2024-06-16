const { Types } = require("mongoose");
const { cartSchema } = require("../cart.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const findCart = async ({ userId }) => {
  return await cartSchema.findOne({ cart_userId: userId }).lean();
};

const createUserCart = async ({ userId, product }) => {
  const query = {
      cart_userId: userId,
      cart_state: "active",
    },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
      $inc: {
        cart_count_product: 1,
      },
    },
    options = {
      upsert: true,
      new: true,
    };

  return await cartSchema.findOneAndUpdate(query, updateOrInsert, options);
};

const updateOrinsert_UserCart_Quantity = async ({ userId, product }) => {
  const query = {
      cart_userId: userId,
      "cart_products.productId": product.productId,
    },
    updateSet = {
      //   $set: {
      //     "cart_products.$.quantity": product.quantity,
      //   },
      $inc: {
        // inc để tăng giá trị (cộng dồn)
        "cart_products.$.quantity": product.quantity,
      },
    },
    options = {
      upsert: true,
      new: true,
    };

  return await cartSchema.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
  findCart,
  createUserCart,
  updateOrinsert_UserCart_Quantity,
};
