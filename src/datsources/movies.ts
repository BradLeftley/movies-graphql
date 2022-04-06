import { RESTDataSource } from "apollo-datasource-rest";
import { Todo } from "src/models/movie";

export class TodoDataSource extends RESTDataSource {
    constructor() {
      super();
    }
  
    async getTodo(): Promise<Todo[]> {
      return [
        {
          "userId": 1,
          "id": 1,
          "title": "delectus aut autem",
          "completed": false
        }]
    }
}