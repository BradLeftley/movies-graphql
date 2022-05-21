import { Context } from "../types/Context";
import { PlexMovie } from "../models/plex-movie";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PlexMovieResolver {
  @Query(() => [PlexMovie])
  async plexmovie(@Ctx() context: Context) {
    const movies = await context.dataSources.plexDataSource.get4KMovies();
    return movies;
  }

  @Query(() => [PlexMovie])
  async plexmoviewatchlist(@Ctx() context: Context) {
    const movies = await context.dataSources.plexMovieWatchListDataSource.getWatchList();
    return movies;
  }
  @Query(() => [PlexMovie])
  async plexmovieuhd(@Ctx() context: Context) {
    const movies = await context.dataSources.plexDataSource.getUHDMovies();
    return movies;
  }
}
