const { ApolloServer } = require('apollo-server-lambda');
// import { PlexMovieResolver } from "./resolvers/plex-movies";
// import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
// import { MovieResolver } from "./resolvers/movies";
// graphql.js

import { gql } from 'apollo-server-lambda';
// Construct a schema, using GraphQL schema language
export const typeDefs = gql`
  type Query {
    """
    A test message.
    """
    testMessage: String!
  }
`;
// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    testMessage: () => 'Hello World!',
  },
};


const apolloServer = new ApolloServer({ resolvers, typeDefs });


export const graphqlHandler = apolloServer.createHandler();