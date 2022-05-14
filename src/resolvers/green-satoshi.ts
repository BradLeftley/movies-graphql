import { Context } from "../types/Context";
import { GreenSatoshi } from "../models/green-satoshi";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class GreenSatoshiResolver {
  @Query(() => GreenSatoshi)
  async greensatoshi(@Ctx() context: Context) {
    console.log("WORKING", context.dataSources)

    const crypto = await context.dataSources.greenSatoshiDataSource.getGreenSatoshi();

    return crypto
  }
}
