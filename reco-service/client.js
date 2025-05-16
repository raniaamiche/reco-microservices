// test-client.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'reco.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const recoProto = grpc.loadPackageDefinition(packageDefinition).reco;

const client = new recoProto.RecoService('localhost:50051', grpc.credentials.createInsecure());

client.GetRecommendations({ userId: '123' }, (err, response) => {
  if (err) console.error(err);
  else console.log('Recommendations:', response.productIds);
});
