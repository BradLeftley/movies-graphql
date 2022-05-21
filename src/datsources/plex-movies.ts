import { RESTDataSource } from "apollo-datasource-rest";
import { PlexMovie } from "src/models/plex-movie";
import { PlexTvShow } from "src/models/plex-tv-shows";
//import { env } from "process";
export class PlexMoviesDataSource extends RESTDataSource {

  baseURL = `${process.env.MEDIA_URL}`

  async get4KMovies(): Promise<PlexMovie[]> {
    const movies = await this.get(`/library/sections/3/all?type=1&sort=originallyAvailableAt%3Adesc&includeCollections=1&includeExternalMedia=1&includeAdvanced=1${process.env.PLEX_MOVIE_STUFF}`)

    const convert = require('xml-js');

    const resultUnformatted = convert.xml2json(movies, { compact: true, spaces: 4 });
    const resultFormatted = JSON.parse(resultUnformatted)

    return resultFormatted.MediaContainer.Video.map(async (movie: { _attributes: any; Media: any; image: any; title: any }) => {
      const movieYear = movie._attributes.year
      const imageUrl = await this.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.title}&include_adult=false&year=${movieYear}`)
      const url = imageUrl.results[0].poster_path || ''
      movie._attributes.image = 'https://image.tmdb.org/t/p/w220_and_h330_face/' + url

      return movie._attributes
    });
  }

  async getRecentlyUpdatedTVShows(): Promise<PlexTvShow[]> {
    const movies = await this.get(`/library/sections/9/all?${process.env.PLEX_TV_SHOW}
    `)

    const convert = require('xml-js');

    const resultUnformatted = convert.xml2json(movies, { compact: true, spaces: 4 });
    const resultFormatted = JSON.parse(resultUnformatted)

    return resultFormatted.MediaContainer.Directory.map(async (movie: { _attributes: any; Media: any; image: any; parentTitle: any }) => {
      const imageUrl = await this.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.parentTitle || movie._attributes.title.replace(/ *\([^)]*\) */g, "")}&include_adult=false`)

      const url = imageUrl.results[0] && imageUrl.results[0].poster_path || false
      movie._attributes.image = url ? 'https://image.tmdb.org/t/p/w220_and_h330_face/' + url : 'https://via.placeholder.com/220x330.png'
      return movie._attributes
    });
  }

  async getUHDMovies(): Promise<PlexMovie[]> {
    const movies = await this.get(`/library/sections/2/all?type=1&sort=addedAt%3Adesc&includeCollections=1&includeExternalMedia=1&includeAdvanced=1${process.env.PLEX_MOVIE_STUFF}`)
 
    const convert = require('xml-js');

    const resultUnformatted = convert.xml2json(movies, { compact: true, spaces: 4 });
    const resultFormatted = JSON.parse(resultUnformatted)

    return resultFormatted.MediaContainer.Video.map(async (movie: { _attributes: any; Media: any; image: any; title: any }) => {
      const movieYear = movie._attributes.year
      const imageUrl = await this.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.title}&include_adult=false&year=${movieYear}`)
      const url = imageUrl.results[0].poster_path || ''
      movie._attributes.image = 'https://image.tmdb.org/t/p/w220_and_h330_face/' + url

      return movie._attributes
    });
  }
}