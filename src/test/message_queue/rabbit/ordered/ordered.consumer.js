"use strict";

const amqplib = require("amqplib");

const consumerOrderedMessage = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queueName = "test-ordered-queue-message";

  await channel.assertQueue(queueName, {
    durable: true,
  });

  // Đảm bảo rằng consumer xử lý xong 1 message hoàn thành mới đến message tiếp theo
  channel.prefetch(1);

  channel.consume(queueName, (message) => {
    const msg = message.content.toString();

    // check thứ tự xử lý nhiều message
    // giả lập thời gian xử lý message khác nhau (ramdom time)
    // result: consume message không có thứ tự
    setTimeout(() => {
      console.log("message received: ", msg);
      channel.ack(message);
    }, Math.random() * 1000);
  });
};

consumerOrderedMessage().catch((err) => console.error(err));
