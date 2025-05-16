// kafka/producer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'product-service',
  brokers: ['kafka:9092'],
  retry: {
    initialRetryTime: 3000,
    retries: 10
  }
});

const producer = kafka.producer();

const initProducer = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connected.');
  } catch (err) {
    console.error('❌ Failed to connect to Kafka. Retrying...', err);
    setTimeout(initProducer, 5000); // retry after 5s
  }
};

const sendProductNotification = async (product) => {
  try {
    await producer.send({
      topic: 'product-topic',
      messages: [{ value: JSON.stringify(product) }]
    });
    console.log('📤 Notification envoyée à Kafka:', product);
  } catch (err) {
    console.error('❌ Erreur lors de l\'envoi Kafka:', err);
  }
};

// 🔴 IMPORTANT : exporter un objet avec les deux fonctions
module.exports = {
  initProducer,
  sendProductNotification
};
