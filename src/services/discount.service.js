"use strict";
const errResponse = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  convert_toObjectId_MongoDB,
  removeUndefinedNullObject,
  updateNestedObjectParser,
} = require("../utils/index");
const {
  findDiscount,
  findAll_DiscountCodes_ByShop_unSelect,
} = require("../models/repositories/discount.repo");
const { findAll_Products } = require("../models/repositories/product.repo");

/*
 Discount Services
 1 - Generator Discount Code [Shop | Admin]
 2 - Get discount amount [User]
 3 - Get all discount codes [User | Shop]
 4 - Verify discount code [User]
 5 - Delete discount code [Shop | Admin]
 6 - Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      isActive,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_uses,
      max_uses_per_user,
    } = payload;
    // kiem tra
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new errResponse.BadRequestError("Invalid start date or end date");
    }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new errResponse.BadRequestError(
        "Start date must be before end date"
      );
    }

    // create index for discount code
    if (found_Discount({ code, shopId })) {
      throw new errResponse.BadRequestError(
        "Discount code Exist, is already used"
      );
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_isActive: isActive,
      discount_shop: convert_toObjectId_MongoDB(shopId),
      discount_min_order_value: min_order_value,
      discount_product_ids: product_ids,
      discount_applies_to: applies_to,
      discount_type: type,
      discount_value: value,
      discount_max_uses: max_uses,
      discount_max_uses_per_user: max_uses_per_user,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      isActive,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_uses,
      max_uses_per_user,
    } = payload;

    const valid_payload_to_update = updateNestedObjectParser(
      removeUndefinedNullObject(payload)
    );

    // check code match with shopId
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shop: convert_toObjectId_MongoDB(shopId),
      })
      .lean();
    if (!foundDiscount) {
      throw new errResponse.BadRequestError("Discount code not found");
    }

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new errResponse.BadRequestError("Invalid start date or end date");
    }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new errResponse.BadRequestError(
        "Start date must be before end date"
      );
    }

    return await discountModel.findOneAndUpdate(
      { discount_code: code },
      valid_payload_to_update,
      { new: true }
    );
  }

  static async getProductsByDiscountCode({
    code,
    shopId,
    userId,
    limit = 50,
    page = 1,
  }) {
    // create index for discount_code
    const foundDiscount = await findDiscount({ code, shopId });
    if (!foundDiscount || !foundDiscount.discount_isActive) {
      throw new errResponse.NotFoundError(
        "Discount code not found or not active"
      );
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all product of shop - discount nay apply for all
      products = await findAll_Products({
        filter: {
          product_shop: convert_toObjectId_MongoDB(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name", "product_thumbnail", "product_price"],
      });
    }
    if (discount_applies_to === "specific") {
      // get product_ids - danh sach products can apply discount
      products = await findAll_Products({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name", "product_thumbnail", "product_price"],
      });
    }

    return products;
  }

  static async getAllDiscountByShop({ limit, page, shopId, isActive = true }) {
    const discounts = await findAll_DiscountCodes_ByShop_unSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop: convert_toObjectId_MongoDB(shopId),
        discount_isActive: isActive,
      },
      unSelect: ["__v"],
    });
    return discounts;
  }

  /*
    Apply discount code to checkout order
    products = [
      { product_id, shopId, quantity, price name },
      { product_id, shopId, quantity, price name }
    ]
  */
  static async getDiscountAmount({ code, shopId, userId, products }) {
    const foundDiscount = await findDiscount({ code, shopId });
    if (!foundDiscount) {
      throw new errResponse.NotFoundError("Discount code not found");
    }

    const {
      discount_isActive,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_isActive) {
      throw new errResponse.NotFoundError(
        "Discount code not active or expired"
      );
    }
    if (discount_max_uses === 0) {
      throw new errResponse.NotFoundError("Discount code are OUT");
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new errResponse.BadRequestError("Discount code has expired !");
    }

    // check discount_min_order_value ?
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total order
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new errResponse.BadRequestError(
          `Total order must be greater than min order value (> ${min_order_value})`
        );
      }
    }

    // check số lần được áp dụng cho 1 người
    if (discount_max_uses_per_user > 0) {
      const discount_used_by_user = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (discount_used_by_user) {
        if (discount_used_by_user.usageCount >= discount_max_uses_per_user) {
          throw new errResponse.BadRequestError(
            "The discount code has expired"
          );
        }
      }
    }

    // check discount_type [fixed-amount, percentage] >> cacl amount được giảm
    const amount =
      discount_type == "fixed-amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
}

module.exports = DiscountService;
