import { Context } from "../types/Context";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { GreenSatoshi } from "../models/green-satoshi";

@Resolver()
export class CryptoDataResolver {
 @Query(() => GreenSatoshi)
  async cryptodata(
    @Ctx() context: Context,
    @Arg('query') query: string
  ) {
    const movies = await context.dataSources.cryptoDataDataSource.getCryptoData(query);
    return movies;
  }
}
