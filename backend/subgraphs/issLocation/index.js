const { ApolloServer, gql } = require('apollo-server-lambda');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');
const aws = require('aws-sdk');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

aws.config.update({region: "us-west-2" });
const dynamo = new aws.DynamoDB.DocumentClient();
// Construct a schema, using GraphQL schema language
const typeDefs = gql(readFileSync(__dirname + '/issLocationSchema.graphql', 'utf-8'));

const resolvers = {
    Query: { 
      async issPos() {
        try {
          const response = await dynamo.scan({
            TableName: "iss-coordinates",
          }).promise()
          return response.Items
        } catch (err) {
          console.error(err)
        }
      } 
    },
    LatLon: {
      __resolveReference(latLon, { fetchLatLonbyTimeStamp }){
        return fetchLatLonbyTimeStamp(latLon.timeStamp)
      }
    }
  }

  let subgraphSchema = buildSubgraphSchema({typeDefs, resolvers});
  
const server = new ApolloServer({
  schema: subgraphSchema,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

exports.issPosHandler = server.createHandler();