"use strict";

const _ = require("lodash");

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

module.exports = { getInfoData, getSelectData, unGetSelectData };
