"use strict";

const errResponse = require("../core/error.response");
const orderSchema = require("../models/order.model");
const { findCart_ById } = require("../models/repositories/cart.repo");
const { checkAvalableProduct } = require("../models/repositories/product.repo");

const DiscountService = require("../services/discount.service");

const { acquireLock, releaseLock } = require("../services/redis.service");

class CheckoutService {
  /* 
        Payload - format FE request
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: []
                    item_products: [
                        {
                            quantity,
                            price,
                            shopId,
                            productId
                            old_quantity
                        }
                    ],
                },
            ]
        }
    */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId
    const foundCart = await findCart_ById({ cartId });
    if (!foundCart) {
      throw new errResponse.NotFoundError("Cart not exist");
    }

    const checkout_order = {
        total_price: 0, // TONG tien hang
        feeShip: 0, // phi ship
        total_discount_per_order: 0, // TONG chiet khau moi don hang
        totalCheckout: 0, // TONG tien can thanh toan
      },
      shop_order_ids_new = []; // CHI TIET hoa don tung don hang

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        item_products = [],
        shop_discounts = [],
        shopId,
      } = shop_order_ids[i];
      // check available product - check/get price product from database
      const checkProduct_Server = await checkAvalableProduct({
        products: item_products,
      });

      if (!checkProduct_Server[0])
        throw new errResponse.BadRequestError("someone Product not exist");

      // checkout price (tong tien don hang cua 1 SHOP)
      const checkout_price = checkProduct_Server.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      // tong tien don hang truoc khi thanh toan (1 or n shop)
      checkout_order.total_price += checkout_price;

      const item_checkout = {
        shopId,
        shop_discounts,
        priceRaw: checkout_price,
        priceAppliedDiscount: checkout_price,
        item_products: checkProduct_Server,
      };

      // neu shop_discounts ton tai (> 0) >>> check tinh hop le
      if (shop_discounts.length > 0) {
        // -------------GIA SU chi co 1 discount-------------
        // getAmountDiscount - apply discount to checkout price
        const { discount = 0, totalPrice = 0 } =
          await DiscountService.getDiscountAmount({
            code: shop_discounts[0].discount_code,
            shopId,
            userId,
            products: checkProduct_Server,
          });

        // tong gia tri discount cac don hang cua 1 SHOP
        checkout_order.total_discount_per_order += discount;

        // gia sau khi discount cac don hang cua 1 SHOP
        if (discount > 0) {
          item_checkout.priceAppliedDiscount = checkout_price - discount;
        }
      }

      // tong tien hoa don can thanh toan cuoi cung
      checkout_order.totalCheckout += item_checkout.priceAppliedDiscount;
      shop_order_ids_new.push(item_checkout);
    }

    return {
      checkout_order,
      shop_order_ids,
      shop_order_ids_new,
    };
  }

  /*------------------------------------- Order -------------------------------------*/
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { checkout_order, shop_order_ids_new } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });

    /*
      "shop_order_ids_new": [
            {
                "shopId": "66600e4651d59054392893a7",
                "shop_discounts": [
                    {
                        "discount_code": "SHOP-01"
                    }
                ],
                "priceRaw": 2610000,
                "priceAppliedDiscount": 2580000,
                "item_products": [
                    {
                        "price": 660000,
                        "quantity": 1,
                        "productId": "6668002026cd01f010adc9e3"
                    },
                    {
                        "price": 650000,
                        "quantity": 3,
                        "productId": "666931bc0f6d432dd88bb821"
                    }
                ]
            },
        ]
    */
    // check product có vượt tồn kho hay không
    // get new array all product in shop_order_ids_new
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log("list products in order ::: ", products);

    const acquireLockProduct = [];

    // optimistic lock - https://www.youtube.com/watch?v=UjiGO37qugY
    for (let i = 0; i < products.length; i++) {
      const { productId, shopId } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireLockProduct.push(keyLock ? true : false); // nếu có false (có sp đã được cập quantity = 0 hoặc ẩn không bán nữa) >> thông báo người dùng chọn lại
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // nếu có 1 sản phẩm hết hàng trong kho
    if (!acquireLockProduct.includes(false)) {
      throw new errResponse.BadRequestError(
        "Some products have been updated, pls return to the cart."
      );
    }

    // nếu thành công hết >> tạo new ORDER
    const newOrder = await orderSchema.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_products: shop_order_ids_new,
      order_shipping: user_address,
      order_payment: user_payment,
    });

    // CASE: insert thành công, thì remove product có trong cart
    if (newOrder) {
      // remove product trong cart
    }

    return newOrder;
  }

  // get list orders by userId [USER]
  static async getOrdersByUser({ userId }) {}

  // get detail order by id [USER]
  static async getOneOrderByUser({ userId, orderId }) {}

  // cancel order [USER]
  static async cancelOrderByUser({ userId, orderId }) {}

  // update order status [SHOP | ADMIN]
  static async updateOrderStatus({ shopId, orderId }) {}
}

module.exports = CheckoutService;
