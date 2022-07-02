import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';

const httpLink = createHttpLink({
  uri: '/api/graphql',
});

const client = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache()
});

export default client;