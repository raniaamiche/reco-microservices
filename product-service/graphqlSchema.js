// graphqlschema.js
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList } = require('graphql');
const Product = require('./models/productModel');
const { sendMessage } = require('./kafka/producer');  // Importer la fonction d'envoi Kafka

// Définir le type GraphQL pour un produit
const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat }
  })
});

// Requête pour récupérer des produits
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    products: {
      type: new GraphQLList(ProductType),
      resolve() {
        return Product.find();
      }
    },
    product: {
      type: ProductType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Product.findById(args.id);
      }
    }
  }
});

// Mutation pour ajouter un produit avec envoi Kafka
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        name: { type: GraphQLString },
        price: { type: GraphQLFloat }
      },
      async resolve(parent, args) {
        // Création du produit
        const product = new Product({
          name: args.name,
          price: args.price
        });

        // Sauvegarde du produit
        const savedProduct = await product.save();

        // 📨 Envoyer un événement Kafka
        const message = {
          eventType: 'addProduct',
          productId: savedProduct._id,
          productName: savedProduct.name,
          timestamp: new Date().toISOString()
        };

        // Envoi de l'événement à Kafka
        await sendMessage(message);

        return savedProduct;
      }
    }
  }
});

// Exporter le schéma GraphQL
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
