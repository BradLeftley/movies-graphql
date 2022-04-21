import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import { MovieResolver } from "./resolvers/movies";
import { MovieDataSource } from "./datsources/movies";
import * as env from "dotenv"

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}




const main = async () => {
  env.config()
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
