"use strict";
const mongoose = require("mongoose"); // Erase if already required

const collection_name = "Orders";
const document_name = "Order";

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    order_userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    /*
      order_checkout = {
        total_price: 0, // TONG tien hang
        feeShip: 0, // phi ship
        total_discount_per_order: 0, // TONG chiet khau moi don hang
        totalCheckout: 0, // TONG tien can thanh toan
      },
    */
    order_checkout: {
      type: Object,
      default: {},
    },
    /*
      order_shipping = {
        street, city, state, country
      },
    */
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    /*
      "order_products": [
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
    order_products: { type: Array, required: true, default: [] },
    order_trackingNumber: { type: String, default: "#00018062024" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "canceled"],
      default: "pending",
    },
  },
  {
    collections: collection_name,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "updatedOn",
    },
  }
);

//Export the model
module.exports = mongoose.model(document_name, orderSchema);
