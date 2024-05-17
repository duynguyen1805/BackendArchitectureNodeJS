const { app } = require("./src/app");
// Port
const port = process.env.PORT || 4000;

// Khởi động server và lắng nghe các yêu cầu từ client
const server = app.listen(port, () => {
  console.log(`Server eCommerce is running on port ${port}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Exit server eCommerce"));
// });
