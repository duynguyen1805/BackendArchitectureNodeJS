"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

/**
 * Returns an object containing only the specified fields from the input object.
 *
 * @param {Object} options - An object containing the fields and object to pick from.
 * @param {Array} options.fileds - An array of fields to pick from the object.
 * @param {Object} options.object - The object to pick fields from.
 * @return {Object} An object containing only the specified fields from the input object.
 */
const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

/**
 * Returns an object with the keys from the given array and the value set to 1.
 *
 * @param {Array} select - An array of keys to be used as the object keys.
 * @return {Object} An object with the keys from the given array and the value set to 1.
 */
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

/**
 * Removes all undefined and null values from an object recursively (nested level 1).
 *
 *
 * @param {object} obj - The object to remove undefined and null values from.
 * @return {object} - A new object with undefined and null values removed.
 */
// const removeUndefinedNullObject = (obj) => {
//   Object.keys(obj).forEach((k) => {
//     if (obj[k] == undefined || obj[k] == null) delete obj[k];
//   });

//   return obj;
// };
const removeUndefinedNullObject = (obj) => {
  const result = {};

  Object.keys(obj).forEach((k) => {
    const current = obj[k];

    if ([null, undefined].includes(current)) return;
    if (Array.isArray(current)) return;

    if (typeof current === "object") {
      result[k] = removeUndefinedNullObject(current);
      return;
    }

    result[k] = current;
  });

  return result;
};
/*
  const a = {
    b: {
      c: 1,
      d: 2,
    }
  }

  db.collection.updateOne(
    `b.c: 1`,
    `b.d: 2`,
  )
*/
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response || []).forEach((key) => {
        final[`${k}.${key}`] = response[key];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};

// const removeUndefinedNullObject_ALLLevel_Nested_ObjectParse = (obj) => {
//   const result = {};

//   Object.keys(obj).forEach((k) => {
//     const current = obj[k];

//     if ([null, undefined].includes(current)) return;
//     if (Array.isArray(current)) {
//       const filteredArray = current.filter(
//         (item) => ![null, undefined].includes(item)
//       );
//       if (filteredArray.length > 0) result[k] = filteredArray;
//     } else if (typeof current === "object") {
//       const nestedObj = removeUndefinedNullObject(current);
//       if (Object.keys(nestedObj).length > 0) result[k] = nestedObj;
//     } else {
//       result[k] = current;
//     }
//   });

//   return result;
// };

const convert_toObjectId_MongoDB = (string_id) => {
  return new Types.ObjectId(string_id);
};

// replate  placeholder templatehtml sendmail
const replacePlaceholder = (template, params) => {
  Object.keys(params).forEach((key) => {
    const placeholder = `{{${key}}}`; // verify key
    template = template.replace(new RegExp(placeholder, "g"), params[key]);
  });

  return template;
};

const customizeProductId = ({ product_shop }) => {
  const ramdom = Math.floor(Math.random() * 899999 + 100000);
  return `${ramdom}-${product_shop}`;
};

const ramdomID = ({ value_attach }) => {
  const ramdom = Math.floor(Math.random() * 899999 + 100000);
  return `${ramdom}-${value_attach}`;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedNullObject,
  updateNestedObjectParser,
  // removeUndefinedNullObject_ALLLevel_Nested_ObjectParse,
  convert_toObjectId_MongoDB,
  replacePlaceholder,
  customizeProductId,
  ramdomID,
};
