// const { ApolloServer, gql } = require('apollo-server-lambda');
// // import { PlexMovieResolver } from "./resolvers/plex-movies";
// // import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
// // import { MovieResolver } from "./resolvers/movies";
// // graphql.js

// import 'reflect-metadata'
// // import { buildTypeDefsAndResolvers } from 'type-graphql';
// // import { PlexMovieResolver } from "./resolvers/plex-movies";
// // import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
// import { GreenSatoshiResolver } from "./resolvers/green-satoshi";

// // import { MovieResolver } from "./resolvers/movies";
// import { MovieDataSource } from './datsources/movies';
// import { PlexMoviesDataSource } from './datsources/plex-movies';
// import { GreenSatoshiDatasource } from './datsources/green-satoshi';
// import { PlexMovieWatchListDataSource } from './datsources/plex-watch-list';
// import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
// import { PlexMovieResolver } from './resolvers/plex-movies';


// export const typeDefs = gql`
// type GreenSatoshi {
//   imageUrl: String!
//   name: String!
//   price: String!
//   priceDifference: String!
//   priceDifferenceHour: String!
//   symbol: String!
// }

// type Movie {
//   id: Float!
//   overview: String!
//   poster_path: String!
//   title: String!
//   vote_average: Float!
// }

// type PlexMovie {
//   image: String!
//   overview: String!
//   title: String!
// }

// type PlexTvShow {
//   image: String!
//   title: String!
//   updatedAt: String!
// }

// type Query {
//   greensatoshi: GreenSatoshi!
//   helloWorld: String!
//   movie: [Movie!]!
//   plexmovie: [PlexMovie!]!
//   plexmoviewatchlist: [PlexMovie!]!
//   plextvshows: [PlexTvShow!]!
//   searchMovies(query: String!): [Movie!]!
// }

// `;
// // Provide resolver functions for your schema fields
// export const resolvers = {
//   Query: {
//     greensatoshi: [GreenSatoshiResolver],
//     plextvshows: [PlexTvShowsResolver],
//     plexmovie: [PlexMovieResolver],
//   },
// };


// const server = new ApolloServer({ resolvers, typeDefs, dataSources: () => ({
//   movieDataSource: new MovieDataSource(),
//   plexDataSource: new PlexMoviesDataSource(),
//   greenSatoshiDataSource: new GreenSatoshiDatasource(),
//   plexMovieWatchListDataSource: new PlexMovieWatchListDataSource()
// }), csrfPrevention: true });


// // const x = async (): Promise<typeof ApolloServer> => {

// //   // const server = new ApolloServer({ resolvers, typeDefs, dataSources: () => ({
// //   //   movieDataSource: new MovieDataSource(),
// //   //   plexDataSource: new PlexMoviesDataSource(),
// //   //   greenSatoshiDataSource: new GreenSatoshiDatasource(),
// //   //   plexMovieWatchListDataSource: new PlexMovieWatchListDataSource()
// //   // }), csrfPrevention: true });

// //  const schema =  await buildSchema({
// //     resolvers: [MovieResolver],
// //     emitSchemaFile: 'schemas/adviser.gql',
// //   })
  
// //   return schema
// // }



// //  const server = new ApolloServer({ x, dataSources: () => ({
// //     movieDataSource: new MovieDataSource(),
// //     plexDataSource: new PlexMoviesDataSource(),
// //     greenSatoshiDataSource: new GreenSatoshiDatasource(),
// //     plexMovieWatchListDataSource: new PlexMovieWatchListDataSource()
// //   }), csrfPrevention: true });


// export const graphqlHandler = server.createHandler();

// // const globalSchema = buildSchema({
// //     resolvers: [MovieResolver]
// // });

// // async function getServer() {
// //     const schema = await globalSchema;
// //     return new ApolloServer({
// //         schema
// //     });
// // }

// // export function graphqlHandler(event: any, ctx: any, callback: any) {
// //     getServer()
// //         .then(server => server.createHandler())
// //         .then(handler => handler(event, ctx, callback))
// // }
import "reflect-metadata";
import {ApolloServer} from "apollo-server-lambda";
import {buildSchemaSync} from 'type-graphql';
import lambdaPlayground from "graphql-playground-middleware-lambda";
import { MovieResolver } from "./resolvers/movies";
import { MovieDataSource } from "./datsources/movies";
import { GreenSatoshiDatasource } from "./datsources/green-satoshi";
import { PlexMoviesDataSource } from "./datsources/plex-movies";
import { PlexMovieWatchListDataSource } from "./datsources/plex-watch-list";
import { PlexMovieResolver } from "./resolvers/plex-movies";
import { GreenSatoshiResolver } from "./resolvers/green-satoshi";
import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";


export const server = new ApolloServer({
    schema: buildSchemaSync({
        resolvers: [MovieResolver, PlexMovieResolver, PlexTvShowsResolver, GreenSatoshiResolver, PlexMovieWatchListDataSource],
    }),
    dataSources: () => ({
        movieDataSource: new MovieDataSource(),
          plexDataSource: new PlexMoviesDataSource(),
          greenSatoshiDataSource: new GreenSatoshiDatasource(),
          plexMovieWatchListDataSource: new PlexMovieWatchListDataSource()
      }),
    introspection: true
});


export const graphqlHandler = server.createHandler();

export const playground = lambdaPlayground({
    endpoint: '/graphql'
});