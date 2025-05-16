const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000; 

// middleware globaux
app.use(cors());
app.use(express.json());

//  Route racine pour vérifier que l'API Gateway fonctionne
app.get('/', (req, res) => {
  res.send('✅ API Gateway is running');
});

// proxy vers le User Service (REST)
// http://localhost:3000/api/users/register => http://user-service:3001/api/users/register
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true,
  logLevel: 'debug',
}));

// vers le Product Service (GraphQL)
// http://localhost:3000/api/products => http://product-service:3002/graphql
app.use('/api/products', createProxyMiddleware({
  target: 'http://product-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/products': '/graphql' },
  logLevel: 'debug',
}));

//gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur dans API Gateway :', err.message);
  res.status(502).json({ message: 'Erreur de communication avec le service en aval' });
});

// Lancement de l'API Gateway
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running at http://localhost:${PORT}`);
});
