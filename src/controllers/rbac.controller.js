"use strict";
const SuccessResponse = require("../core/success.response");
const {
  createResource,
  resourceList,
  createRole,
  roleList,
} = require("../services/rbac.service");

class rbacController {
  newRole = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Created new role",
      metadata: await createRole(req.body),
    }).send(res);
  };

  newResource = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Created new resource",
      metadata: await createResource(req.body),
    }).send(res);
  };

  listRole = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "List role",
      metadata: await roleList(req.query),
    }).send(res);
  };

  listResource = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "List resource",
      metadata: await resourceList(req.query),
    }).send(res);
  };
}

module.exports = new rbacController();
