"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication_Ver2 } = require("../../../auth/authUtils");
const rbacController = require("../../../controllers/rbac.controller");

router.post("/role", asyncHandler(rbacController.newRole));
router.post("/resource", asyncHandler(rbacController.newResource));
router.get("/role-list", asyncHandler(rbacController.listRole));
router.get("/resource-list", asyncHandler(rbacController.listResource));

module.exports = router;
