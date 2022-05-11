const { ApolloServer } = require('apollo-server-lambda');
import { PlexMovieResolver } from "./resolvers/plex-movies";
import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
import { MovieResolver } from "./resolvers/movies";

const { resolvers, typeDefs } = await buildTypeDefsAndResolvers({
  resolvers: [MovieResolver, PlexMovieResolver, PlexTvShowsResolver],
})


const server = new ApolloServer({ typeDefs, resolvers, csrfPrevention: true });

exports.graphqlHandler = server.createHandler();