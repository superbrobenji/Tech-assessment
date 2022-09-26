const { ApolloServer } = require('apollo-server-lambda');
const { ApolloGateway } = require('@apollo/gateway');
const {
    ApolloServerPluginLandingPageLocalDefault
  } = require('apollo-server-core');
const { watch } = require('fs');
const { readFile } = require('fs/promises');

const server = new ApolloServer({
  gateway: new ApolloGateway({
    async supergraphSdl({ update, healthCheck }) {
      // create a file watcher
      const watcher = watch(__dirname + '/supergraph.graphql');
      // subscribe to file changes
      watcher.on('change', async () => {
        // update the supergraph schema
        try {
          const updatedSupergraph = await readFile(__dirname + '/supergraph.graphql', 'utf-8');
          // optional health check update to ensure our services are responsive
          await healthCheck(updatedSupergraph);
          // update the supergraph schema
          update(updatedSupergraph);
        } catch (e) {
          // handle errors that occur during health check or while updating the supergraph schema
          console.error(e);
        }
      });

      return {
        supergraphSdl: await readFile(__dirname + '/supergraph.graphql', 'utf-8'),
        // cleanup is called when the gateway is stopped
        async cleanup() {
          watcher.close();
        }
      }
    },
  }),
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});
exports.supergraphHandler = server.createHandler();