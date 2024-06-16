"use strict";
const { cartSchema } = require("../models/cart.model");
const errResponse = require("../core/error.response");
const {
  findCart,
  createUserCart,
  updateOrinsert_UserCart_Quantity,
} = require("../models/repositories/cart.repo");
const { findProduct_ById } = require("../models/repositories/product.repo");

/*
    key feature: Cart Service
    - add product to cart [user]
    - reduce product quantity by one [user]
    - increate product quantity by one [user]
    - get cart [user]
    - delete cart [user]
    - delete item in cart [user]
*/

class CartService {
  static async addProductToCart({ userId, product = {} }) {
    const found_user_cart = await findCart({ userId });

    if (!found_user_cart) {
      // create cart and add product
      return await createUserCart({ userId, product });
    }

    // đã có cart nhưng chưa có sản phẩm cart[]
    if (!found_user_cart.cart_products.length) {
      found_user_cart.cart_products = [product];
      return found_user_cart.save();
    }

    // nếu đã có hoặc không sản phẩm đó trong giỏ hàng
    return await updateOrinsert_UserCart_Quantity({ userId, product });
  }

  /*
    Update cart - format payload FE request
    shop_order_ids: [
        {
            shopId,
            item_products: [
                {
                    quantity,
                    price,
                    shopId,
                    productId
                    old_quantity
                }
            ],
            version
        }
    ]
  */
  static async addProductToCart_v2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await findProduct_ById({ productId });
    if (!foundProduct) {
      throw new errResponse.NotFoundError("Product not exist");
    }

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new errResponse.BadRequestError("Product not belong to shop");
    }

    if (quantity == 0) {
      // delete item in cart
      return await CartService.deleteProduct_InCart({
        userId,
        productId,
      });
    }

    return await updateOrinsert_UserCart_Quantity({
      userId,
      product: {
        productId: productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteProduct_InCart({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteCart = await cartSchema.findOneAndUpdate(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await findCart({ userId });
  }
}

module.exports = CartService;
