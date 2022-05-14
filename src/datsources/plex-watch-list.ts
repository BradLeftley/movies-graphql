import { RESTDataSource } from "apollo-datasource-rest";
import { PlexMovie } from "src/models/plex-movie";

//import { env } from "process";
export class PlexMovieWatchListDataSource extends RESTDataSource {

  baseURL = `${process.env.PLEX_META_URL}`

  async getWatchList(): Promise<PlexMovie[]> {
    const movies = await this.get(`/library/sections/watchlist/all${process.env.PLEX_WATCH_LIST}`)
   
    const convert = require('xml-js');

    const resultUnformatted = convert.xml2json(movies, {compact: true, spaces: 4});
    const resultFormatted = JSON.parse(resultUnformatted)

     return resultFormatted.MediaContainer.Video.map(async (movie: { _attributes: any; Media: any; image: any; title: any}) => {
        const movieYear = movie._attributes.year
        const imageUrl = await this.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.title}&include_adult=false&year=${movieYear}`)
        const url = imageUrl.results[0].poster_path || ''
        movie._attributes.image = 'https://image.tmdb.org/t/p/w220_and_h330_face/'+ url

      return  movie._attributes
     });
  }

}