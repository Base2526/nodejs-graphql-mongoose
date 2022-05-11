import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
  } from "@apollo/client";

export const client = () => {
    return new ApolloClient({
        uri: 'http://localhost:4040/graphql',
        cache: new InMemoryCache(),
        // link: createUploadLink(),
        debug: true
    });
}

