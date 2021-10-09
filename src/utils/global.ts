import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat, DefaultOptions } from "@apollo/client";
import { ACCESSTOKEN_ID } from "./const";

let httplink = new HttpLink({ uri: '/graphql' });
let authMiddleware = new ApolloLink((operation, forwared) => {
  operation.setContext(({ headers = {} }) => ({ 
    headers: {
      ...headers,
      authorization: localStorage.getItem(ACCESSTOKEN_ID) || null
    }
  }));
  return forwared(operation);
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httplink),
  defaultOptions
});