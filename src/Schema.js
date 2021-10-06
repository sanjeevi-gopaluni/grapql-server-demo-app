const fs = require('fs');
const path = require('path');

const { makeExecutableSchema } = require('graphql-tools');

const { resolvers } =require('./resolvers');

const schemaFile = path.join(__dirname, '../schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = { schema,typeDefs,resolvers };