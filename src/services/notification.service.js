"use strict";

const notificationSchema = require("../models/notification.model");

class NotificationService {
  static async pushNotification({
    type = "SHOP-NEW-PRODUCT",
    senderId = 1,
    receiverId = 1,
    content = "Content default",
    options = {},
  }) {
    let noti_content = content;
    if (type == "SHOP-NEW-PRODUCT") {
      noti_content = "Shop ${ABC} vừa ra mắt sản phẩm mới: ${SP_01}";
    } else if (type == "PROMOTIONS-NEW") {
      noti_content = "Khuyen mai ${KM_01} vừa ra mắt";
    } // còn tiếp

    const newNoti = await notificationSchema.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receiverId: receiverId,
      noti_content: noti_content,
      noti_options: options,
    });

    return newNoti;
  }

  // get list notification
  static async getNotifications({ userId = 1, type = "ALL", isRead = 0 }) {
    const match = { noti_receiverId: userId };
    if (type !== "ALL") {
      match["noti_type"] = type;
    }

    return await notificationSchema.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receiverId: 1,
          noti_content: {
            $concat: [
              {
                $substr: ["$noti_options.shopId", 0, -1],
              },
              " vừa thêm mới một sản phẩm: ",
              {
                $substr: ["$noti_options.product_name", 0, -1],
              },
            ],
          },
          noti_options: 1,
          noti_isRead: 1,
          noti_createdAt: 1,
        },
      },
    ]);
  }
}

module.exports = NotificationService;
