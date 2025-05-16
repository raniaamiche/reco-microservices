// index.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');

// import correct des fonctions Kafka
const kafkaProducer = require('./kafka/producer');
const { sendProductNotification, initProducer } = kafkaProducer;

const app = express();
const PORT = 3002;

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/productDB');
    console.log('✅ MongoDB connected (Product Service)');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};


app.use(bodyParser.json());

const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    addProduct(name: String!, price: Float!): Product
  }
`);

const root = {
  products: () => [
    { id: '1', name: 'T-shirt', price: 25 },
    { id: '2', name: 'Jeans', price: 40 }
  ],

  product: ({ id }) => {
    const products = [
      { id: '1', name: 'T-shirt', price: 25 },
      { id: '2', name: 'Jeans', price: 40 }
    ];
    return products.find(product => product.id === id);
  },

  addProduct: async ({ name, price }) => {
    const newProduct = {
      id: Math.floor(Math.random() * 10000).toString(),
      name,
      price
    };

    console.log('🛍️ Nouveau produit ajouté :', newProduct);

    try {
      await sendProductNotification(newProduct); 
    } catch (err) {
      console.error('❌ Erreur lors de l\'envoi Kafka :', err);
    }

    return newProduct;
  }
};

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

app.listen(PORT, async () => {
  console.log(`🚀 Product service is running at http://localhost:${PORT}/graphql`);
  
  await connectDB();

  try {
    await initProducer(); 
    console.log('✅ Kafka producer prêt');
  } catch (err) {
    console.error('❌ Échec de l\'initialisation du producer Kafka :', err);
  }
});
