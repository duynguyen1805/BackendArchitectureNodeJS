const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");

// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// INIT DATABASE
require("./db/init.mongodb");
// count connections & check overload
// const {
//   countConnect,
//   checkOverloadConnect,
// } = require("./helpers/check.connectDB");
// countConnect();
// checkOverloadConnect();

// INIT MIDDLEWARE
// http log
app.use(morgan("combined")); // app.use(morgan("combined"));
// hide information about
app.use(helmet());
// tối ưu băng thông, nén data ở sv
app.use(compression());
// Sử dụng CORS middleware để xử lý Cross-Origin Resource Sharing
app.use(cors());
// const allowedOrigins = process.env.URL_FONTEND.split(",");
let allowedOrigins;
if (process.env.NODE_ENV === "development") {
  // Lấy biến môi trường từ .env.local trong môi trường development
  require("dotenv").config({ path: ".env" });
  allowedOrigins = process.env.URL_FRONTEND;
} else {
  allowedOrigins = process.env.URL_FRONTEND;
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Sử dụng body-parser để xử lý dữ liệu từ request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// INIT ROUTES
app.use(require("./routes"));

// HANDLING ERROR
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack, // >>> hiển thị code sai vị trí nào
    message: error.message,
  });
});

module.exports = { app };
