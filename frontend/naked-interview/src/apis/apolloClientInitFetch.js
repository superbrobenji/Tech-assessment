import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

//TODO add stucture here for getting last hour of data
export const getGraphData = () => {
    const client = new ApolloClient({
        uri: 'https://o3pyjy0hy1.execute-api.us-east-1.amazonaws.com/dev/api',
        cache: new InMemoryCache(),
      });
        return client
        .query({
        query: gql`
        query issPos {
            issPos {
                iss_position {
                    latitude
                    longitude
                } 
                timestamp
            }
          }
        `,
    })
}

