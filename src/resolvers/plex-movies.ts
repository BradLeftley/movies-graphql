import { Context } from "../types/Context";
import { PlexMovie } from "../models/plex-movie";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PlexMovieResolver {
  @Query(() => [PlexMovie])
  async plexmovie(@Ctx() context: Context) {
    console.log("WORKING")

    const movies = await context.dataSources.plexDataSource.get4KMovies();
    console.log(movies)
    return movies;
  }
}
