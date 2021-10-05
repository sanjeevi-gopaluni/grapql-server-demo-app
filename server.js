
const express = require('express');
const {
  graphqlExpress,
  graphiqlExpress,
} = require('graphql-server-express');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
var cors = require('cors')
const bodyParser = require('body-parser');
const PORT = 9000;
const app = new express();
const { schema } = require('./src/schema');

 
// Express stuff
app.use(cors())
app.use(
  '/graphql', bodyParser.json(),
  graphqlExpress({
    schema
  })
);

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/graphql`
}));
const ws = createServer(app);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/graphql',
  });
});