"use strict";

const errResponse = require("../core/error.response");
const resourceSchema = require("../models/resource.model");
const roleSchema = require("../models/role.model");

/**
 * create resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
const createResource = async ({
  name = "profile",
  slug = "pro0001",
  description = "profile",
}) => {
  try {
    // check name or slug is exist

    // new resource
    const resource = await resourceSchema.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  } catch (error) {
    return error;
  }
};

const resourceList = async ({
  userId = 0, // admin
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // check ADMIN ? middleware function

    // get list resource
    const resources = await resourceSchema.aggregate([
      {
        $project: {
          _id: userId,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createdAt: 1,
        },
      },
    ]);

    return resources;
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = "SHOP",
  slug = "shop0001",
  description = "SHOP",
  grants = [], // [{ role: "ADMIN", resource: "profile", action: "read:any", attributes: "*, !totalPrice.example" }]
}) => {
  try {
    // check role exist

    // new role
    const role = await roleSchema.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });

    return role;
  } catch (error) {
    return error;
  }
};

const roleList = async ({
  userId = 0, // admin
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // check ADMIN ? middleware function

    // get list role - format like grantList_Example from role.middleware.js
    const roles = await roleSchema.aggregate([
      {
        $unwind: "$rol_grants", // n records rol_grants convert => n records role with per rol_grants
      },
      {
        $lookup: {
          from: "Resources",
          localField: "rol_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          role: "$rol_name",
          resource: "$resource.src_name",
          action: "$rol_grants.actions",
          attributes: "$rol_grants.attributes",
        },
      },
      {
        $unwind: "$action",
      },
      {
        $project: {
          role: 1,
          resource: 1,
          action: "$action",
          attributes: 1,
        },
      },
    ]);

    return roles;
  } catch (error) {
    return [];
  }
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
