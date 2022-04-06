import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query, Ctx } from "type-graphql";
import { Context } from "./types/Context";
import { Todo } from "./models/movie";
import { TodoDataSource } from "./datsources/movies";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  async todo(@Ctx() context: Context) {
    console.log("WORKING")
    const startTime = new Date();

    const todos = await context.dataSources.todoDataSource.getTodo();
    console.log(todos)
    console.log(
      `todos query took ${new Date().getTime() - startTime.getTime()}ms`
    );
    return todos;


  }
}


const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver, TodoResolver]
  });

  const apolloServer = new ApolloServer({ schema, dataSources: () => ({
    TodoDataSource: new TodoDataSource(),
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