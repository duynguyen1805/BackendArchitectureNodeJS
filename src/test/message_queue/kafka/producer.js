const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  //   brokers: ['kafka1:9092', 'kafka2:9092'],
  brokers: ["localhost:9092"],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner, // Sử dụng partitioner cũ
});

// run producer
const runProducer = async () => {
  await producer.connect();
  await producer.send({
    topic: "test_topic",
    messages: [{ value: "Hello KafkaJS user By me!" }],
  });

  await producer.disconnect();
};

runProducer().catch((err) => console.error(err));
