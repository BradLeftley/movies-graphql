import { Context } from "../types/Context";
import { PlexTvShow } from "../models/plex-tv-shows";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PlexTvShowsResolver {
  @Query(() => [PlexTvShow])
  async plextvshows(@Ctx() context: Context) {
    const plexTvShows = await context.dataSources.plexDataSource.getRecentlyUpdatedTVShows();
    return plexTvShows;
  }
}
