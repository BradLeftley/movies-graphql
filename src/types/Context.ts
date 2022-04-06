import { TodoDataSource } from "src/datsources/movies";

export interface Context {
  dataSources: {
    todoDataSource: TodoDataSource;
  };
}