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

const {
  removeUndefinedNullObject,
  updateNestedObjectParser,
} = require("../utils/index");

const {
  findAll_DraftsProduct_ByShop,
  publish_Product_ByShop,
  findAll_PublishedProduct_ByShop,
  unPublish_Product_ByShop,
  searchProducts_ByUser,
  findAll_Products,
  find_DetailProduct,
  update_ProductById,
} = require("../models/repositories/product.repo");

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
      throw new errResponse.BadRequestError(`Invalid product type: ${type}`);
    return new productClass(payload).CreateProduct();
  }
  static async UpdateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new errResponse.BadRequestError(`Invalid product type: ${type}`);
    return new productClass(payload).UpdateProduct(product_id);
  }

  // --------------------------QUERY--------------------------
  static async findAll_DraftsProduct_ByShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isDraft: true };
    return await findAll_DraftsProduct_ByShop({ query, limit, skip });
  }
  static async findAll_PublishedProduct_ByShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isPublished: true };
    return await findAll_PublishedProduct_ByShop({ query, limit, skip });
  }
  static async searchProducts_ByUser({ keySearch }) {
    return await searchProducts_ByUser({ keySearch });
  }
  static async findAll_Products({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    select = ["_id", "product_name", "product_thumbnail", "product_price"],
  }) {
    return await findAll_Products({
      limit,
      sort,
      page,
      filter,
      select,
    });
  }
  static async find_DetailProduct({ product_id, unSelect = ["__v"] }) {
    return await find_DetailProduct({ product_id, unSelect });
  }
  // END QUERY

  // ---------------------------PUT---------------------------
  static async publish_Product_ByShop({ product_shop, product_id }) {
    return await publish_Product_ByShop({ product_shop, product_id });
  }
  static async unPublish_Product_ByShop({ product_shop, product_id }) {
    return await unPublish_Product_ByShop({ product_shop, product_id });
  }
  // END PUT
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

  // update new product - product_id === _id object attributes
  async UpdateProduct({ product_id, bodyUpdate }) {
    return await update_ProductById({
      product_id,
      bodyUpdate,
      model: ProductSchema,
    });
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
      throw new errResponse.BadRequestError("Create new Clothing error");
    }
    // thành công newClothing - tạo product chung _id với newClothing
    const newProduct = await super.CreateProduct(newClothing._id);
    if (!newProduct)
      throw new errResponse.BadRequestError("Create new Product error");

    return newProduct;
  }

  async UpdateProduct(product_id) {
    /**
     * check update o dau? children hay Products
     * remove attribute has null or undefined >> không update field đó
     * removeUndefinedNullObject >> it WORK nhưng collection Products cha lưu product_attributes bị mất fields nào bị null or undefined
     * giải pháp >> updateNestedObjectParser
     */

    const objectParams = removeUndefinedNullObject(this);
    if (objectParams.product_attributes) {
      // update children
      await update_ProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: ClothingSchema,
      });
    }

    const updateProduct = await super.UpdateProduct({
      product_id,
      bodyUpdate: updateNestedObjectParser(objectParams),
    });

    return updateProduct;
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
      throw new errResponse.BadRequestError("Create new Electronic error");
    }
    // thành công newElectronic - tạo product chung _id với newElectronic
    const newProduct = await super.CreateProduct(newElectronic._id);
    if (!newProduct)
      throw new errResponse.BadRequestError("Create new Product error");

    return newProduct;
  }

  async UpdateProduct(product_id) {
    const objectParams = removeUndefinedNullObject(this);
    if (objectParams.product_attributes) {
      // update children
      await update_ProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: ElectronicSchema,
      });
    }

    const updateProduct = await super.UpdateProduct({
      product_id,
      bodyUpdate: updateNestedObjectParser(objectParams),
    });

    return updateProduct;
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
      throw new errResponse.BadRequestError("Create new Furniture error");
    }
    // thành công newFurniture - tạo product chung _id với newFurniture
    const newProduct = await super.CreateProduct(newFurniture._id);
    if (!newProduct)
      throw new errResponse.BadRequestError("Create new Product error");

    return newProduct;
  }

  async UpdateProduct(product_id) {
    const objectParams = removeUndefinedNullObject(this);
    if (objectParams.product_attributes) {
      // update children
      await update_ProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: FurnitureSchema,
      });
    }

    const updateProduct = await super.UpdateProduct({
      product_id,
      bodyUpdate: updateNestedObjectParser(objectParams),
    });

    return updateProduct;
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
