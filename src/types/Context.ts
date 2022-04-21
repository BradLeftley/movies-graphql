import { MovieDataSource } from "src/datsources/movies";

export interface Context {
  dataSources: {
    movieDataSource: MovieDataSource;
  };
}