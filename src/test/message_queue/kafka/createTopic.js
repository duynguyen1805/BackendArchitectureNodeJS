const { Kafka } = require("kafkajs");

// Khởi tạo một client Kafka
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"], // Địa chỉ của Kafka broker
});

// Tạo một admin client để quản lý Kafka
const admin = kafka.admin();

// Hàm async để thực hiện việc tạo topic
const createTopic = async () => {
  try {
    // Kết nối admin client đến Kafka broker
    await admin.connect();

    // Định nghĩa các thông tin của topic
    const topicConfig = {
      topic: "test_topic", // Tên của topic cần tạo
      numPartitions: 1, // Số partition (phân vùng)
      replicationFactor: 1, // Factor sao chép (replication factor)
    };

    // Tạo topic với thông tin đã định nghĩa
    await admin.createTopics({
      topics: [topicConfig],
    });

    console.log("Topic created successfully:", topicConfig.topic);
  } catch (error) {
    console.error("Error creating topic:", error);
  } finally {
    // Ngắt kết nối admin client sau khi hoàn tất
    await admin.disconnect();
  }
};

// Gọi hàm để tạo topic
createTopic();
