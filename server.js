const express = require('express');
const ApolloServer = require('apollo-server-express').ApolloServer;
const cors = require('cors');
const http = require('http')
const {schema,typeDefs,resolvers} = require('./src/schema');

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});

server.applyMiddleware({ app, path: '/graphql' });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// httpServer.listen();

httpServer.listen({ port: 9000 }, () => {
  console.log('Apollo Server on http://localhost:9000/graphql');
});