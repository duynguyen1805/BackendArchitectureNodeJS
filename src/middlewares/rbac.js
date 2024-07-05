"use strict";
// rbac => role basic access control
const rbac = require("../middlewares/role.middleware");
const errResponse = require("../core/error.response");
const { roleList } = require("../services/rbac.service");
/**
 *
 * @param {*} resource // profile, balance, ...
 * @param {string} action // read, write, delete, update
 */
const grantAccess = (resource, action) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await roleList());
      const rol_name = req.query.role;
      const permission = rbac.can(rol_name)[action](resource);
      if (!permission.granted) {
        throw new errResponse.ForbiddenError("Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { grantAccess };
