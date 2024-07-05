"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../../helpers/asyncHandler");
const { authentication_Ver2 } = require("../../../auth/authUtils");
const profileController = require("../../../controllers/profile.controller");
const { grantAccess } = require("../../../middlewares/rbac");

// admin - truy cap tat ca
router.get(
  "/viewAny",
  grantAccess("profile", "read:any"),
  asyncHandler(profileController.profiles)
);

// shop - truy cap cua no (own)
router.get(
  "/viewOwn",
  grantAccess("profile", "read:own"),
  asyncHandler(profileController.profile_getOne)
);

module.exports = router;
