import { Context } from "../types/Context";
import { PlexTvShow } from "../models/plex-tv-shows";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PlexTvShowsResolver {
  @Query(() => [PlexTvShow])
  async plextvshow(@Ctx() context: Context) {
    console.log("HEREER")

    const plexTvShows = await context.dataSources.plexDataSource.getRecentlyUpdatedTVShows();
    console.log("ewrerr")
    return plexTvShows;
  }
}
