"use strict";
/* 
    Api Service Product kết hợp giữa Factory và Strategy
*/

const {
  ProductSchema,
  ClothingSchema,
  ElectronicSchema,
  FurnitureSchema,
} = require("../models/product.model");
const errResponse = require("../core/error.response");

const config_service_product = require("../services/product.service.v2.config");

/**
 type: "Electronic", "Clothing", "Furniture"
 payload:
 */
// define Factory class to create product
class ProductFactory {
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async CreateProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new errResponse.BadRequest(`Invalid product type: ${type}`);
    return new productClass(payload).CreateProduct();

    // switch (type) {
    //   case "Clothing":
    //     return new Clothing(payload).CreateProduct();
    //   case "Electronic":
    //     return new Electronic(payload).CreateProduct();
    //   case "Furniture":
    //     return new Furniture(payload).CreateProduct();
    //   default:
    //     throw new errResponse.BadRequest(`Invalid product type: ${type}`);
    // }
  }
}

// define base product class
class Product {
  /**
 {
    product_name: { type: String, required: true, },
    product_thumbnail: { type: String, required: true, },
    product_price: { type: Number, required: true, },
    product_description: { type: String, required: true, },
    product_quantity: { type: Number, required: true, },
    product_type: { type: String, required: true, enum: ["Electronics", "Clothing", "Furniture"], },
    product_shop: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true, },
  },
 */
  constructor({
    product_name,
    product_thumbnail,
    product_price,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumbnail = product_thumbnail;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product - product_id === _id object attributes
  async CreateProduct(product_id) {
    return await ProductSchema.create({ ...this, _id: product_id });
  }
}

// define sub-class for diferent product type "Clothing"
class Clothing extends Product {
  async CreateProduct() {
    const newClothing = await ClothingSchema.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new errResponse.BadRequest("Create new Clothing error");
    }
    // thành công newClothing - tạo product chung _id với newClothing
    const newProduct = await super.CreateProduct(newClothing._id);
    if (!newProduct)
      throw new errResponse.BadRequest("Create new Product error");

    return newProduct;
  }
}

// define sub-class for diferent product type "Electronic"
class Electronic extends Product {
  async CreateProduct() {
    const newElectronic = await ElectronicSchema.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new errResponse.BadRequest("Create new Electronic error");
    }
    // thành công newElectronic - tạo product chung _id với newElectronic
    const newProduct = await super.CreateProduct(newElectronic._id);
    if (!newProduct)
      throw new errResponse.BadRequest("Create new Product error");

    return newProduct;
  }
}

// define sub-class for diferent product type "Furniture"
class Furniture extends Product {
  async CreateProduct() {
    const newFurniture = await FurnitureSchema.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new errResponse.BadRequest("Create new Furniture error");
    }
    // thành công newFurniture - tạo product chung _id với newFurniture
    const newProduct = await super.CreateProduct(newFurniture._id);
    if (!newProduct)
      throw new errResponse.BadRequest("Create new Product error");

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

// config_service_product.map(({ type, classRef }) => {
//   ProductFactory.registerProductType(type, classRef);
// });

module.exports = ProductFactory;
