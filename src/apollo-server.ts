const { ApolloServer, gql } = require('apollo-server-lambda');
// import { PlexMovieResolver } from "./resolvers/plex-movies";
// import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
// import { MovieResolver } from "./resolvers/movies";
// graphql.js
import * as Express from "express";
import 'reflect-metadata'
// import { buildTypeDefsAndResolvers } from 'type-graphql';
// import { PlexMovieResolver } from "./resolvers/plex-movies";
// import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
import { GreenSatoshiResolver } from "./resolvers/green-satoshi";

// import { MovieResolver } from "./resolvers/movies";
import { MovieDataSource } from './datsources/movies';
import { PlexMoviesDataSource } from './datsources/plex-movies';
import { GreenSatoshiDatasource } from './datsources/green-satoshi';
import { PlexMovieWatchListDataSource } from './datsources/plex-watch-list';
import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
import { PlexMovieResolver } from './resolvers/plex-movies';


// export const buildHandler = async () => {
//   const { resolvers, typeDefs } = await buildTypeDefsAndResolvers({
//     resolvers: [MovieResolver, PlexMovieResolver, PlexTvShowsResolver, GreenSatoshiResolver]
//   })


//   await buildSchema ({
//     resolvers: [MovieResolver, PlexMovieResolver, PlexTvShowsResolver, GreenSatoshiResolver],
//     emitSchemaFile: 'schemas/movies.gql'
//   })

//   const server = new ApolloServer({
//     resolvers,
//     typeDefs,
//     dataSources: () => ({
//       movieDataSource: new MovieDataSource(),
//       plexDataSource: new PlexMoviesDataSource(),
//       greenSatoshiDataSource: new GreenSatoshiDatasource(),
//       plexMovieWatchListDataSource: new PlexMovieWatchListDataSource()
//     })
//   })

//   return {
//     handler
//   }
// }

// const main = async () => {
//   const schema = await buildSchema({
//     resolvers: [ MovieResolver, PlexMovieResolver, PlexTvShowsResolver, GreenSatoshiResolver]
//   });

//   console.log(schema)

//   const apolloServer = new ApolloServer({ schema, dataSources: () => ({
//     movieDataSource: new MovieDataSource(),
//     plexDataSource: new PlexMoviesDataSource(),
//     greenSatoshiDataSource: new GreenSatoshiDatasource(),
//     plexMovieWatchListDataSource: new PlexMovieWatchListDataSource()
//   }),
//   });

//   await apolloServer.start()
// };

export const typeDefs = gql`
type GreenSatoshi {
  imageUrl: String!
  name: String!
  price: String!
  priceDifference: String!
  priceDifferenceHour: String!
  symbol: String!
}

type Movie {
  id: Float!
  overview: String!
  poster_path: String!
  title: String!
  vote_average: Float!
}

type PlexMovie {
  image: String!
  overview: String!
  title: String!
}

type PlexTvShow {
  image: String!
  title: String!
  updatedAt: String!
}

type Query {
  greensatoshi: GreenSatoshi!
  helloWorld: String!
  movie: [Movie!]!
  plexmovie: [PlexMovie!]!
  plexmoviewatchlist: [PlexMovie!]!
  plextvshows: [PlexTvShow!]!
  searchMovies(query: String!): [Movie!]!
}

`;
// Provide resolver functions for your schema fields
export const resolvers = {
  Query: {
    greensatoshi: [GreenSatoshiResolver],
    plextvshows: [PlexTvShowsResolver],
    plexmovie: [PlexMovieResolver],
  },
};


const server = new ApolloServer({ resolvers, typeDefs, dataSources: () => ({
  movieDataSource: new MovieDataSource(),
  plexDataSource: new PlexMoviesDataSource(),
  greenSatoshiDataSource: new GreenSatoshiDatasource(),
  plexMovieWatchListDataSource: new PlexMovieWatchListDataSource()
}), csrfPrevention: true });

export const graphqlHandler = server.createHandler();