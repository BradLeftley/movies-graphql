const { ApolloServer } = require('apollo-server-lambda');
import { PlexMovieResolver } from "./resolvers/plex-movies";
import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
import { MovieResolver } from "./resolvers/movies";

// const { resolvers, typeDefs } = await buildTypeDefsAndResolvers({
//   resolvers: [MovieResolver, PlexMovieResolver, PlexTvShowsResolver],
// })

const schema = await buildSchema({
  resolvers: [HelloResolver, MovieResolver, PlexMovieResolver, PlexTvShowsResolver]
});

const apolloServer = new ApolloServer({ csrfPrevention: true, schema, dataSources: () => ({
  movieDataSource: new MovieDataSource(),
  plexDataSource: new PlexMoviesDataSource(),
}),
},);

exports.graphqlHandler = apolloServer.createHandler();