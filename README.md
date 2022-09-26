# Welcome to making astronauts feel weird by tracking their home

I added this readme file to outline the best practices as requested, as well as the deployment steps for my own sanity.

## Hosted url:
    https://naked-assessment.netlify.app

## Best practices

### Backend
- Using router binary
- Use apollo studio for composing
- The way I’m grabbing graphql files for supergraph should be from lambda func hosting
- Question the dev tag in lambda expressions
- South africa server for AWS and same server for DB
- Every serverless deploy deploys all functions and bloats funcs
- Docker!
- Keep naming consistent between issPosition and issLocation
- Api gateway in AWS?
- Don’t give access to all tables for func
- Not expose all functions to the wild
- Use LTT for scheduled deletion
- set CI/CD pipeline secretes as I don't have access

### Frontend
- Not use `create-react-app`
- Clean up public folder
- Clean up if statements
- Not have functionality in `Map.jsx` only router
- Create `clearIntervals` on the worker to prevent memory leaks
- Api endpoint configurable or env variable
- Create service workers in index
- Standardised `.eslint` and `.vscode` file
- Seperate concerns

## Deployment process

### Deploy steps for graphql BE: 
- `serverless deploy`

### Deploy steps for new subgraph:
- `rover supergraph compose --config ./supergraph-config.yaml > supergraph.graphql`
- `serverless deploy`

### Run locally lambda func:
- `serverless invoke local -f <function name> -p query.json`
    
    Note that query.json is just a file to test queries on lambda functions.

### Deploy steps for frontend:
- `npm run build`
- `netlify deploy`
- Specify the build folder
    
#### For prod deployment:
- `netlify deploy --prod`

## New things learned:
- Graphql
- ApolloServer
- Federation
- ApolloClient
- ApolloStudio (although I ended up not using it for complexity's sake (aka I had no idea what I was doing))
- Redux-toolkit
- React-leaflet
- Serverless
- AWS
- Lambda
- DynamoDB