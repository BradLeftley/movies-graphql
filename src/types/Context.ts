import { CryptoDataDatasource } from "src/datsources/crypto-data";
import { GreenSatoshiDatasource } from "src/datsources/green-satoshi";
import { MovieDataSource } from "src/datsources/movies";
import { PlexMoviesDataSource } from "src/datsources/plex-movies";
import { PlexMovieWatchListDataSource } from "src/datsources/plex-watch-list";
export interface Context {
  dataSources: {
    movieDataSource: MovieDataSource;
    plexDataSource: PlexMoviesDataSource;
    greenSatoshiDataSource: GreenSatoshiDatasource;
    plexMovieWatchListDataSource: PlexMovieWatchListDataSource;
    cryptoDataDataSource: CryptoDataDatasource;
  };
}