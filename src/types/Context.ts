import { MovieDataSource } from "src/datsources/movies";
import { PlexMoviesDataSource } from "src/datsources/plex-movies";
export interface Context {
  dataSources: {
    movieDataSource: MovieDataSource;
    plexDataSource: PlexMoviesDataSource;
  };
}