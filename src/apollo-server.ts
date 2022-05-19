 const { ApolloServer } = require('apollo-server-lambda');

import "reflect-metadata";
// import {ApolloServer} from "apollo-server-lambda";
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
      csrfPrevention: true,
    introspection: true
});


export const graphqlHandler = server.createHandler();

export const playground = lambdaPlayground({
    endpoint: '/graphql'
});