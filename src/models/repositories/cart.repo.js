const { Types } = require("mongoose");
const { cartSchema } = require("../cart.model");
const {
  getSelectData,
  unGetSelectData,
  convert_toObjectId_MongoDB,
} = require("../../utils");

const findCart = async ({ userId }) => {
  return await cartSchema.findOne({ cart_userId: userId });
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

const insertNewProductOrUpdateQuantity = async ({ userId, product }) => {
  const query = {
    cart_userId: userId,
    "cart_products.productId": product.productId,
  };
  const found_productId_inCart = await cartSchema.findOne(query);

  if (found_productId_inCart) {
    // CASE 1: product exist in cart >> update quantity
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": product.quantity,
      },
    };

    return await cartSchema.findOneAndUpdate(query, updateSet, { new: true });
  } else {
    // CASE 2: product not exist in cart >> add new product in cart_products
    return await createUserCart({ userId, product });
  }
};

module.exports = {
  findCart,
  createUserCart,
  insertNewProductOrUpdateQuantity,
};
