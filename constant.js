const ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  WRITE: "WRITE",
  EDIT: "EDIT",
};

const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: "Redis lỗi rầu.!",
      en: "Service connection error.! Timeoutttt",
    },
  };

module.exports = { ROLE, REDIS_CONNECT_TIMEOUT, REDIS_CONNECT_MESSAGE };
