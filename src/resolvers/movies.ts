import { Context } from "../types/Context";
import { Movie } from "../models/movie";
import { Arg, Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class MovieResolver {
  @Query(() => [Movie])
  async movie(@Ctx() context: Context) {


    const movies = await context.dataSources.movieDataSource.getMovie();

    return movies;
  }
  @Query(() => [Movie])
  async searchMovies(
    @Ctx() context: Context,
    @Arg('query') query: string
  ) {
    const movies = await context.dataSources.movieDataSource.searchMovies(query);
    return movies;
  }
}
