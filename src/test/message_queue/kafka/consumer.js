const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  //   brokers: ['kafka1:9092', 'kafka2:9092'],
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test_group" });

// run the consumer
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "test_topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

runConsumer().catch((err) => console.error(err));
