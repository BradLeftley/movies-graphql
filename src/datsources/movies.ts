import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { Movie } from "src/models/movie";
//import { env } from "process";
export class MovieDataSource extends RESTDataSource {

  baseURL = 'https://api.themoviedb.org/3'

  async getMovie(): Promise<Movie[]> {
    const movies = await this.get('/movie/popular?page=1')
    return movies.results
  }

  willSendRequest(request: RequestOptions) {
    request.params.set('api_key', `${process.env.API_KEY}`);
      request.params.set('language', 'en-US')
  }
  async searchMovies(query: string): Promise<Movie[]> {
    const movies = await this.get('/search/movie?page_1&include_adult=false', {query})
    return movies.results
  }
}
