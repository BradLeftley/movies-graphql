import { RESTDataSource } from "apollo-datasource-rest";
import { PlexMovie } from "src/models/plex-movie";
import { PlexTvShow } from "src/models/plex-tv-shows";
//import { env } from "process";
export class PlexMoviesDataSource extends RESTDataSource {

  baseURL = `${process.env.MEDIA_URL}`

  async get4KMovies(): Promise<PlexMovie[]> {
    const movies = await this.get(`/library/sections/3/all?type=1&sort=originallyAvailableAt%3Adesc&includeCollections=1&includeExternalMedia=1&includeAdvanced=1${process.env.PLEX_MOVIE_STUFF}`)
   
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

  async getRecentlyUpdatedTVShows(): Promise<PlexTvShow[]> {
    const movies = await this.get(`/hubs/home/recentlyAdded?type=2&sectionID=9&X-Plex-Product=Plex%20Web&X-Plex-Version=4.80.0&X-Plex-Client-Identifier=zb5srpe3j8n98s9w4j9i97qx&X-Plex-Platform=Chrome&X-Plex-Platform-Version=100.0&X-Plex-Features=external-media%2Cindirect-media&X-Plex-Model=hosted&X-Plex-Device=OSX&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=845x709%2C1440x900&X-Plex-Container-Start=12&X-Plex-Container-Size=24&X-Plex-Token=bRXuzxF4KTKoqGVsJbyb&X-Plex-Provider-Version=5.1&X-Plex-Text-Format=plain&X-Plex-Drm=widevine&X-Plex-Language=en-GB
    `)
   
    const convert = require('xml-js');

    const resultUnformatted = convert.xml2json(movies, {compact: true, spaces: 4});
    const resultFormatted = JSON.parse(resultUnformatted)
    console.log("RESULT FORMATTED", resultFormatted.MediaContainer.Directory)
    
    return resultFormatted.MediaContainer.Directory.map((tvshow: { _attributes: any; }) => tvshow._attributes);
    //  return resultFormatted.MediaContainer.Directory.map(async (movie: { _attributes: any; Media: any; image: any; parentTitle: any}) => {
    //    // const imageUrl = await this.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.parentTitle}&include_adult=false`)
    //     // const url = imageUrl.results[0].poster_path || ''
    //     // movie._attributes.image = 'https://image.tmdb.org/t/p/w220_and_h330_face/'+ url
    //   console.log("MOVIE", movie._attributes)
    //   return  movie._attributes
    //  });
  }
}
