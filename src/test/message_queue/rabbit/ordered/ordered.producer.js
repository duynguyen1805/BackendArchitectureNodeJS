"use strict";

const amqplib = require("amqplib");

const producerOrderedMessage = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queueName = "test-ordered-queue-message";

  await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const message = `ordered message ${i}`;
    await channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
    console.log(`sent message: ${message}`);
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

producerOrderedMessage().catch((err) => console.error(err));
