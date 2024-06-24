//use npm i amqplib
const amqplib = require("amqplib");

const message = "Message to send from producer RabbitMQ";

const runConsumer = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic-queue";

    // đăng ký queue vào channel
    await channel.assertQueue(queueName, {
      durable: true, // crash server > start lại > tiếp tục send a message in the queue
    });

    // send a messages to queue channel
    channel.consume(
      queueName,
      (messages) => {
        console.log(
          `Received new message from queue ${queueName}: `,
          messages.content.toString()
        );
      },
      {
        noAck: true, // dữ liệu xử lý rồi thì không nhận nữa, false => sẽ gửi lại dữ liệu (có cũ đã xử lý rồi)
      }
    );
    // console.log(`new message from queue ${queueName}: `, message);
  } catch (err) {
    console.error(err);
  }
};

runConsumer().catch((err) => console.error(err));
