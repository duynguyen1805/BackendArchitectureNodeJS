//use npm i amqplib
const amqplib = require("amqplib");

const message = "Message to send from producer RabbitMQ - BE E-commerce NodeJS";

const runProducer = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic-queue";

    // đăng ký queue vào channel
    await channel.assertQueue(queueName, {
      durable: true, // crash server > start lại > tiếp tục send a message in the queue
    });

    // send a messages to queue channel
    channel.sendToQueue(queueName, Buffer.from(message));
    // console.log("message sent to queue: ", message);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.error(err);
  }
};

runProducer()
  .then((rs) => console.log("run producer >> logs: ", rs))
  .catch((err) => console.error(err));
