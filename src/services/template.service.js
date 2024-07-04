"use strict";
const templateSchema = require("../models/template.model");
const { htmlEmailToken } = require("../utils/template.html");

const newTemplate = async ({ temp_name = "HTML_EMAIL_VERIFY" }) => {
  const foundTemplate = await templateSchema.findOne({ temp_name });
  if (foundTemplate) {
    throw new Error("NAME Template already exists");
  }
  const newTemplate = await templateSchema.create({
    temp_name,
    temp_html: htmlEmailToken(),
  });
  return newTemplate;
};

const getTemplate = async ({ temp_name }) => {
  const template = await templateSchema.findOne({ temp_name });
  return template;
};

module.exports = { newTemplate, getTemplate };
