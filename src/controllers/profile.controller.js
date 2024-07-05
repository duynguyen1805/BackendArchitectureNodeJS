"use strict";

const SuccessResponse = require("../core/success.response");

class ProfileController {
  // admin
  profiles = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "view any profiles",
      metadata: [
        {
          user_id: 1,
        },
        {
          user_id: 2,
        },
        {
          user_id: 3,
        },
      ],
    }).send(res);
  };

  // shop
  profile_getOne = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "view own profile",
      metadata: {
        user_id: 2,
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
