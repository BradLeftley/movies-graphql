import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query, Ctx } from "type-graphql";
import { Context } from "./types/Context";
import { Movie } from "./models/movie";
import { MovieDataSource } from "./datsources/movies";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}

@Resolver()
export class MovieResolver {
  @Query(() => [Movie])
  async movie(@Ctx() context: Context) {
    console.log("WORKING")
    const startTime = new Date();

    const movies = await context.dataSources.movieDataSource.getMovie();
    console.log(movies)
    console.log(
      `todos query took ${new Date().getTime() - startTime.getTime()}ms`
    );
    return movies;


  }
}


const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver, MovieResolver]
  });

  const apolloServer = new ApolloServer({ schema, dataSources: () => ({
    movieDataSource: new MovieDataSource(),
  }), 
});

  await apolloServer.start()
  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();