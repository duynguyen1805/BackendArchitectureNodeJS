//use npm i amqplib
const amqplib = require("amqplib");

const message = "Message to send from producer RabbitMQ - BE E-commerce NodeJS";

const runProducerDLX = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notiExchange"; // khai báo exChange loại direct có tên là "notiExchange"
    const notificationQueue = "notiQueue"; // khai báo queue (assertQueue) co tên là "notiQueue"
    const notificationExchangeDLX = "notiExchangeDLX"; // exChange direct => sử dụng khi có msg lỗi
    const notificationRoutingKeyDLX = "notiRoutingKeyDLX"; // routing key

    // assert exchange normal
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // assert queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // cho phép các kết nối truy cập cùng 1 lúc vào hàng đợi này
      deadLetterExchange: notificationExchangeDLX, // err|dead msg sẽ gửi với exChange DLX
      deadLetterRoutingKey: notificationRoutingKeyDLX, // err|dead msg sẽ gửi với routing key DLX
    });

    // bind queue - lien ke queue voi exchange - (msg -> notificationExchange -> notificationQueue)
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // send message
    const msg = 'a new message from file "producerDLX.js"';
    console.log("message sent to queue: ", msg);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000", // 10s
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.error(err);
  }
};

runProducerDLX()
  .then((rs) => console.log("run producer >> logs: ", rs))
  .catch((err) => console.error(err));
