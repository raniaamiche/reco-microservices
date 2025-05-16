const { Kafka } = require('kafkajs');

// Config Kafka
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092'],
  retry: {
    retries: 10,           // Nombre de tentatives
    initialRetryTime: 3000 // 3 secondes entre les tentatives
  },
  connectionTimeout: 10000, // Timeout pour la connexion
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const startConsumer = async () => {
  try {
    console.log('🔌 Connexion au broker Kafka...');
    await consumer.connect();
    console.log('✅ Connecté à Kafka');

    await consumer.subscribe({ topic: 'product-topic', fromBeginning: true });

    console.log('📬 Abonné au topic "product-topic"...');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        console.log(`📨 Message reçu [${topic} | ${partition}]: ${value}`);

        // TODO: Traitement logique de la notification
      },
    });

  } catch (error) {
    console.error('❌ Erreur dans le consumer Kafka :', error.message);

    // Reconnexion automatique après une courte pause
    console.log('🔁 Nouvelle tentative dans 5 secondes...');
    setTimeout(startConsumer, 5000);
  }
};

// Lancer le consumer
startConsumer();

// Détecter les arrêts et fermer proprement
process.on('SIGINT', async () => {
  console.log('🛑 Arrêt en cours...');
  await consumer.disconnect();
  process.exit();
});
