 const { ApolloServer } = require('apollo-server-lambda');

import "reflect-metadata";
// import {ApolloServer} from "apollo-server-lambda";
import {buildSchemaSync} from 'type-graphql';
import { MovieResolver } from "./resolvers/movies";
import { MovieDataSource } from "./datsources/movies";
import { GreenSatoshiDatasource } from "./datsources/green-satoshi";
import { PlexMoviesDataSource } from "./datsources/plex-movies";
import { PlexMovieWatchListDataSource } from "./datsources/plex-watch-list";
import { PlexMovieResolver } from "./resolvers/plex-movies";
import { GreenSatoshiResolver } from "./resolvers/green-satoshi";
import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
import * as env from "dotenv"
import { CryptoDataDatasource } from "./datsources/crypto-data";
import { CryptoDataResolver } from "./resolvers/crypto-data";


env.config()
export const server = new ApolloServer({
    schema: buildSchemaSync({
        resolvers: [CryptoDataResolver, MovieResolver, PlexMovieResolver, PlexTvShowsResolver, GreenSatoshiResolver, PlexMovieWatchListDataSource],
    }),
    dataSources: () => ({
        movieDataSource: new MovieDataSource(),
          plexDataSource: new PlexMoviesDataSource(),
          greenSatoshiDataSource: new GreenSatoshiDatasource(),
          plexMovieWatchListDataSource: new PlexMovieWatchListDataSource(),
          cryptoDataDataSource: new CryptoDataDatasource()
      }),
    csrfPrevention: true,
    introspection: true,
    cors: {
      origin: ["http://dashboard.bradleyleftley.co.uk"]
    },
});


export const graphqlHandler = server.createHandler(
  {
    cors: {
      origin: 'dashboard.bradleyleftley.co.uk',
    },
  }
);

