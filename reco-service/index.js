const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'proto', 'reco.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const recoProto = grpc.loadPackageDefinition(packageDefinition).reco;

function GetRecommendations(call, callback) {
  const userId = call.request.userId;
  console.log(`RecoService: received request for user ${userId}`);
  
  // Simulation de recommandations
  const recommended = ['product1', 'product2', 'product3'];
  
  callback(null, { productIds: recommended });
}

function main() {
  const server = new grpc.Server();
  server.addService(recoProto.RecoService.service, { GetRecommendations });
  const address = '0.0.0.0:50051';
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`RecoService gRPC server running at ${address}`);
    server.start();
  });
}

main();
