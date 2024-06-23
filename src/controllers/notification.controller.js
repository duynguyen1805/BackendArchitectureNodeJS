"use strict";

const NotificationService = require("../services/notification.service");
const SuccessResponse = require("../core/success.response");

class NotificationController {
  // getNotifications
  getNotifications = async (req, res, next) => {
    new SuccessResponse.OK({
      message: "Get notifications successfully",
      metadata: await NotificationService.getNotifications(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
