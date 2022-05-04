import { RESTDataSource } from "apollo-datasource-rest";
import { PlexMovie } from "src/models/plex-movie";

//import { env } from "process";
export class PlexMoviesDataSource extends RESTDataSource {

  baseURL = `${process.env.MEDIA_URL}`

  async get4KMovies(): Promise<PlexMovie[]> {
    const movies = await this.get(`/library/sections/3/all?type=1&sort=originallyAvailableAt%3Adesc&includeCollections=1&includeExternalMedia=1&includeAdvanced=1${process.env.PLEX_MOVIE_STUFF}`)
   
    const convert = require('xml-js');

    const resultUnformatted = convert.xml2json(movies, {compact: true, spaces: 4});
    const resultFormatted = JSON.parse(resultUnformatted)

     return resultFormatted.MediaContainer.Video.map((movie: { _attributes: any; Media: any; imdb_id: any}) => {
        
        const value = movie.Media.Part._attributes.file
   
        const imdb_id = value.match(/\{(.*?)\}/)[1].slice(5)

      movie._attributes.imdb_id = imdb_id
      return  movie._attributes
        
     });
  }

//   willSendRequest(request: RequestOptions) {
//     request.params.set('api_key', `${process.env.API_KEY}`);
//       request.params.set('language', 'en-US')
//   }
//   async searchMovies(query: string): Promise<Movie[]> {
//     const movies = await this.get('/search/movie?page_1&include_adult=false', {query})
//     return movies.results
//   }
}
