/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/apollo-server.ts":
/*!******************************!*\
  !*** ./src/apollo-server.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.graphqlHandler = exports.resolvers = exports.typeDefs = void 0;
const { ApolloServer, gql } = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const green_satoshi_1 = __webpack_require__(/*! ./resolvers/green-satoshi */ "./src/resolvers/green-satoshi.ts");
const movies_1 = __webpack_require__(/*! ./datsources/movies */ "./src/datsources/movies.ts");
const plex_movies_1 = __webpack_require__(/*! ./datsources/plex-movies */ "./src/datsources/plex-movies.ts");
const green_satoshi_2 = __webpack_require__(/*! ./datsources/green-satoshi */ "./src/datsources/green-satoshi.ts");
const plex_watch_list_1 = __webpack_require__(/*! ./datsources/plex-watch-list */ "./src/datsources/plex-watch-list.ts");
const plex_tv_shows_1 = __webpack_require__(/*! ./resolvers/plex-tv-shows */ "./src/resolvers/plex-tv-shows.ts");
const plex_movies_2 = __webpack_require__(/*! ./resolvers/plex-movies */ "./src/resolvers/plex-movies.ts");
exports.typeDefs = gql `
type GreenSatoshi {
  imageUrl: String!
  name: String!
  price: String!
  priceDifference: String!
  priceDifferenceHour: String!
  symbol: String!
}

type Movie {
  id: Float!
  overview: String!
  poster_path: String!
  title: String!
  vote_average: Float!
}

type PlexMovie {
  image: String!
  overview: String!
  title: String!
}

type PlexTvShow {
  image: String!
  title: String!
  updatedAt: String!
}

type Query {
  greensatoshi: GreenSatoshi!
  helloWorld: String!
  movie: [Movie!]!
  plexmovie: [PlexMovie!]!
  plexmoviewatchlist: [PlexMovie!]!
  plextvshows: [PlexTvShow!]!
  searchMovies(query: String!): [Movie!]!
}

`;
exports.resolvers = {
    Query: {
        greensatoshi: [green_satoshi_1.GreenSatoshiResolver],
        plextvshows: [plex_tv_shows_1.PlexTvShowsResolver],
        plexmovie: [plex_movies_2.PlexMovieResolver],
    },
};
const server = new ApolloServer({ resolvers: exports.resolvers, typeDefs: exports.typeDefs, dataSources: () => ({
        movieDataSource: new movies_1.MovieDataSource(),
        plexDataSource: new plex_movies_1.PlexMoviesDataSource(),
        greenSatoshiDataSource: new green_satoshi_2.GreenSatoshiDatasource(),
        plexMovieWatchListDataSource: new plex_watch_list_1.PlexMovieWatchListDataSource()
    }), csrfPrevention: true });
exports.graphqlHandler = server.createHandler();


/***/ }),

/***/ "./src/datsources/green-satoshi.ts":
/*!*****************************************!*\
  !*** ./src/datsources/green-satoshi.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GreenSatoshiDatasource = void 0;
const apollo_datasource_rest_1 = __webpack_require__(/*! apollo-datasource-rest */ "apollo-datasource-rest");
class GreenSatoshiDatasource extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super(...arguments);
        this.baseURL = 'https://api.coingecko.com';
    }
    async getGreenSatoshi() {
        const greensatoshi = await this.get('/api/v3/coins/green-satoshi-token');
        const name = greensatoshi.name;
        const symbol = greensatoshi.symbol;
        const price = greensatoshi.market_data.current_price.gbp;
        const imageUrl = greensatoshi.image.small;
        const priceDifference = greensatoshi.market_data.price_change_24h_in_currency.gbp;
        const priceDifferenceHour = greensatoshi.market_data.price_change_percentage_1h_in_currency.gbp;
        const obj = {
            name: name,
            symbol: symbol,
            price: price,
            imageUrl: imageUrl,
            priceDifference: priceDifference,
            priceDifferenceHour: priceDifferenceHour
        };
        console.log(obj);
        return obj;
    }
}
exports.GreenSatoshiDatasource = GreenSatoshiDatasource;


/***/ }),

/***/ "./src/datsources/movies.ts":
/*!**********************************!*\
  !*** ./src/datsources/movies.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovieDataSource = void 0;
const apollo_datasource_rest_1 = __webpack_require__(/*! apollo-datasource-rest */ "apollo-datasource-rest");
class MovieDataSource extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super(...arguments);
        this.baseURL = 'https://api.themoviedb.org/3';
    }
    async getMovie() {
        const movies = await this.get('/movie/popular?page=1');
        return movies.results;
    }
    willSendRequest(request) {
        request.params.set('api_key', `${process.env.API_KEY}`);
        request.params.set('language', 'en-US');
    }
    async searchMovies(query) {
        const movies = await this.get('/search/movie?page_1&include_adult=false', { query });
        return movies.results;
    }
}
exports.MovieDataSource = MovieDataSource;


/***/ }),

/***/ "./src/datsources/plex-movies.ts":
/*!***************************************!*\
  !*** ./src/datsources/plex-movies.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlexMoviesDataSource = void 0;
const apollo_datasource_rest_1 = __webpack_require__(/*! apollo-datasource-rest */ "apollo-datasource-rest");
class PlexMoviesDataSource extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super(...arguments);
        this.baseURL = `${process.env.MEDIA_URL}`;
    }
    async get4KMovies() {
        const movies = await this.get(`/library/sections/3/all?type=1&sort=originallyAvailableAt%3Adesc&includeCollections=1&includeExternalMedia=1&includeAdvanced=1${process.env.PLEX_MOVIE_STUFF}`);
        const convert = __webpack_require__(/*! xml-js */ "xml-js");
        const resultUnformatted = convert.xml2json(movies, { compact: true, spaces: 4 });
        const resultFormatted = JSON.parse(resultUnformatted);
        return resultFormatted.MediaContainer.Video.map(async (movie) => {
            const movieYear = movie._attributes.year;
            const imageUrl = await this.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.title}&include_adult=false&year=${movieYear}`);
            const url = imageUrl.results[0].poster_path || '';
            movie._attributes.image = 'https://image.tmdb.org/t/p/w220_and_h330_face/' + url;
            return movie._attributes;
        });
    }
    async getRecentlyUpdatedTVShows() {
        const movies = await this.get(`/library/sections/9/all?${process.env.PLEX_TV_SHOW}
    `);
        const convert = __webpack_require__(/*! xml-js */ "xml-js");
        const resultUnformatted = convert.xml2json(movies, { compact: true, spaces: 4 });
        const resultFormatted = JSON.parse(resultUnformatted);
        return resultFormatted.MediaContainer.Directory.map(async (movie) => {
            const imageUrl = await this.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.parentTitle || movie._attributes.title}&include_adult=false`);
            const url = imageUrl.results[0] && imageUrl.results[0].poster_path || '';
            movie._attributes.image = 'https://image.tmdb.org/t/p/w220_and_h330_face/' + url;
            return movie._attributes;
        });
    }
}
exports.PlexMoviesDataSource = PlexMoviesDataSource;


/***/ }),

/***/ "./src/datsources/plex-watch-list.ts":
/*!*******************************************!*\
  !*** ./src/datsources/plex-watch-list.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlexMovieWatchListDataSource = void 0;
const apollo_datasource_rest_1 = __webpack_require__(/*! apollo-datasource-rest */ "apollo-datasource-rest");
class PlexMovieWatchListDataSource extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super(...arguments);
        this.baseURL = `${process.env.PLEX_META_URL}`;
    }
    async getWatchList() {
        const movies = await this.get(`/library/sections/watchlist/all${process.env.PLEX_WATCH_LIST}`);
        const convert = __webpack_require__(/*! xml-js */ "xml-js");
        const resultUnformatted = convert.xml2json(movies, { compact: true, spaces: 4 });
        const resultFormatted = JSON.parse(resultUnformatted);
        return resultFormatted.MediaContainer.Video.map(async (movie) => {
            const movieYear = movie._attributes.year;
            const imageUrl = await this.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.title}&include_adult=false&year=${movieYear}`);
            const url = imageUrl.results[0].poster_path || '';
            movie._attributes.image = 'https://image.tmdb.org/t/p/w220_and_h330_face/' + url;
            return movie._attributes;
        });
    }
}
exports.PlexMovieWatchListDataSource = PlexMovieWatchListDataSource;


/***/ }),

/***/ "./src/models/green-satoshi.ts":
/*!*************************************!*\
  !*** ./src/models/green-satoshi.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GreenSatoshi = void 0;
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let GreenSatoshi = class GreenSatoshi {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GreenSatoshi.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GreenSatoshi.prototype, "symbol", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GreenSatoshi.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GreenSatoshi.prototype, "imageUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GreenSatoshi.prototype, "priceDifference", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GreenSatoshi.prototype, "priceDifferenceHour", void 0);
GreenSatoshi = __decorate([
    (0, type_graphql_1.ObjectType)()
], GreenSatoshi);
exports.GreenSatoshi = GreenSatoshi;


/***/ }),

/***/ "./src/models/plex-movie.ts":
/*!**********************************!*\
  !*** ./src/models/plex-movie.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlexMovie = void 0;
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let PlexMovie = class PlexMovie {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlexMovie.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlexMovie.prototype, "overview", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlexMovie.prototype, "image", void 0);
PlexMovie = __decorate([
    (0, type_graphql_1.ObjectType)()
], PlexMovie);
exports.PlexMovie = PlexMovie;


/***/ }),

/***/ "./src/models/plex-tv-shows.ts":
/*!*************************************!*\
  !*** ./src/models/plex-tv-shows.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlexTvShow = void 0;
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let PlexTvShow = class PlexTvShow {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlexTvShow.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlexTvShow.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlexTvShow.prototype, "image", void 0);
PlexTvShow = __decorate([
    (0, type_graphql_1.ObjectType)()
], PlexTvShow);
exports.PlexTvShow = PlexTvShow;


/***/ }),

/***/ "./src/resolvers/green-satoshi.ts":
/*!****************************************!*\
  !*** ./src/resolvers/green-satoshi.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GreenSatoshiResolver = void 0;
const green_satoshi_1 = __webpack_require__(/*! ../models/green-satoshi */ "./src/models/green-satoshi.ts");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let GreenSatoshiResolver = class GreenSatoshiResolver {
    async greensatoshi(context) {
        console.log("WORKING", context.dataSources);
        const crypto = await context.dataSources.greenSatoshiDataSource.getGreenSatoshi();
        return crypto;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => green_satoshi_1.GreenSatoshi),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GreenSatoshiResolver.prototype, "greensatoshi", null);
GreenSatoshiResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GreenSatoshiResolver);
exports.GreenSatoshiResolver = GreenSatoshiResolver;


/***/ }),

/***/ "./src/resolvers/plex-movies.ts":
/*!**************************************!*\
  !*** ./src/resolvers/plex-movies.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlexMovieResolver = void 0;
const plex_movie_1 = __webpack_require__(/*! ../models/plex-movie */ "./src/models/plex-movie.ts");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let PlexMovieResolver = class PlexMovieResolver {
    async plexmovie(context) {
        console.log("WORKING");
        const movies = await context.dataSources.plexDataSource.get4KMovies();
        console.log(movies);
        return movies;
    }
    async plexmoviewatchlist(context) {
        console.log(context.dataSources.plexMovieWatchListDataSource);
        const movies = await context.dataSources.plexMovieWatchListDataSource.getWatchList();
        console.log(movies);
        return movies;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [plex_movie_1.PlexMovie]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlexMovieResolver.prototype, "plexmovie", null);
__decorate([
    (0, type_graphql_1.Query)(() => [plex_movie_1.PlexMovie]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlexMovieResolver.prototype, "plexmoviewatchlist", null);
PlexMovieResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlexMovieResolver);
exports.PlexMovieResolver = PlexMovieResolver;


/***/ }),

/***/ "./src/resolvers/plex-tv-shows.ts":
/*!****************************************!*\
  !*** ./src/resolvers/plex-tv-shows.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlexTvShowsResolver = void 0;
const plex_tv_shows_1 = __webpack_require__(/*! ../models/plex-tv-shows */ "./src/models/plex-tv-shows.ts");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let PlexTvShowsResolver = class PlexTvShowsResolver {
    async plextvshows(context) {
        const plexTvShows = await context.dataSources.plexDataSource.getRecentlyUpdatedTVShows();
        return plexTvShows;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [plex_tv_shows_1.PlexTvShow]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlexTvShowsResolver.prototype, "plextvshows", null);
PlexTvShowsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlexTvShowsResolver);
exports.PlexTvShowsResolver = PlexTvShowsResolver;


/***/ }),

/***/ "apollo-datasource-rest":
/*!*****************************************!*\
  !*** external "apollo-datasource-rest" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("apollo-datasource-rest");

/***/ }),

/***/ "apollo-server-lambda":
/*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("apollo-server-lambda");

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("reflect-metadata");

/***/ }),

/***/ "type-graphql":
/*!*******************************!*\
  !*** external "type-graphql" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("type-graphql");

/***/ }),

/***/ "xml-js":
/*!*************************!*\
  !*** external "xml-js" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("xml-js");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/apollo-server.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aHFsLy4vc3JjL2Fwb2xsby1zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9kYXRzb3VyY2VzL2dyZWVuLXNhdG9zaGkudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9kYXRzb3VyY2VzL21vdmllcy50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL2RhdHNvdXJjZXMvcGxleC1tb3ZpZXMudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9kYXRzb3VyY2VzL3BsZXgtd2F0Y2gtbGlzdC50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL21vZGVscy9ncmVlbi1zYXRvc2hpLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvbW9kZWxzL3BsZXgtbW92aWUudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvcGxleC10di1zaG93cy50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL3Jlc29sdmVycy9ncmVlbi1zYXRvc2hpLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL3BsZXgtbW92aWVzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3MudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwicmVmbGVjdC1tZXRhZGF0YVwiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJ0eXBlLWdyYXBocWxcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwieG1sLWpzXCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBBcG9sbG9TZXJ2ZXIsIGdxbCB9ID0gcmVxdWlyZSgnYXBvbGxvLXNlcnZlci1sYW1iZGEnKTtcbi8vIGltcG9ydCB7IFBsZXhNb3ZpZVJlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtbW92aWVzXCI7XG4vLyBpbXBvcnQgeyBQbGV4VHZTaG93c1Jlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3NcIjtcbi8vIGltcG9ydCB7IE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvbW92aWVzXCI7XG4vLyBncmFwaHFsLmpzXG5pbXBvcnQgKiBhcyBFeHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnXG4vLyBpbXBvcnQgeyBidWlsZFR5cGVEZWZzQW5kUmVzb2x2ZXJzIH0gZnJvbSAndHlwZS1ncmFwaHFsJztcbi8vIGltcG9ydCB7IFBsZXhNb3ZpZVJlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtbW92aWVzXCI7XG4vLyBpbXBvcnQgeyBQbGV4VHZTaG93c1Jlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3NcIjtcbmltcG9ydCB7IEdyZWVuU2F0b3NoaVJlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL2dyZWVuLXNhdG9zaGlcIjtcblxuLy8gaW1wb3J0IHsgTW92aWVSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9tb3ZpZXNcIjtcbmltcG9ydCB7IE1vdmllRGF0YVNvdXJjZSB9IGZyb20gJy4vZGF0c291cmNlcy9tb3ZpZXMnO1xuaW1wb3J0IHsgUGxleE1vdmllc0RhdGFTb3VyY2UgfSBmcm9tICcuL2RhdHNvdXJjZXMvcGxleC1tb3ZpZXMnO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSB9IGZyb20gJy4vZGF0c291cmNlcy9ncmVlbi1zYXRvc2hpJztcbmltcG9ydCB7IFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UgfSBmcm9tICcuL2RhdHNvdXJjZXMvcGxleC13YXRjaC1saXN0JztcbmltcG9ydCB7IFBsZXhUdlNob3dzUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvcGxleC10di1zaG93c1wiO1xuaW1wb3J0IHsgUGxleE1vdmllUmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycy9wbGV4LW1vdmllcyc7XG5cblxuLy8gZXhwb3J0IGNvbnN0IGJ1aWxkSGFuZGxlciA9IGFzeW5jICgpID0+IHtcbi8vICAgY29uc3QgeyByZXNvbHZlcnMsIHR5cGVEZWZzIH0gPSBhd2FpdCBidWlsZFR5cGVEZWZzQW5kUmVzb2x2ZXJzKHtcbi8vICAgICByZXNvbHZlcnM6IFtNb3ZpZVJlc29sdmVyLCBQbGV4TW92aWVSZXNvbHZlciwgUGxleFR2U2hvd3NSZXNvbHZlciwgR3JlZW5TYXRvc2hpUmVzb2x2ZXJdXG4vLyAgIH0pXG5cblxuLy8gICBhd2FpdCBidWlsZFNjaGVtYSAoe1xuLy8gICAgIHJlc29sdmVyczogW01vdmllUmVzb2x2ZXIsIFBsZXhNb3ZpZVJlc29sdmVyLCBQbGV4VHZTaG93c1Jlc29sdmVyLCBHcmVlblNhdG9zaGlSZXNvbHZlcl0sXG4vLyAgICAgZW1pdFNjaGVtYUZpbGU6ICdzY2hlbWFzL21vdmllcy5ncWwnXG4vLyAgIH0pXG5cbi8vICAgY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG4vLyAgICAgcmVzb2x2ZXJzLFxuLy8gICAgIHR5cGVEZWZzLFxuLy8gICAgIGRhdGFTb3VyY2VzOiAoKSA9PiAoe1xuLy8gICAgICAgbW92aWVEYXRhU291cmNlOiBuZXcgTW92aWVEYXRhU291cmNlKCksXG4vLyAgICAgICBwbGV4RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZXNEYXRhU291cmNlKCksXG4vLyAgICAgICBncmVlblNhdG9zaGlEYXRhU291cmNlOiBuZXcgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSgpLFxuLy8gICAgICAgcGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UoKVxuLy8gICAgIH0pXG4vLyAgIH0pXG5cbi8vICAgcmV0dXJuIHtcbi8vICAgICBoYW5kbGVyXG4vLyAgIH1cbi8vIH1cblxuLy8gY29uc3QgbWFpbiA9IGFzeW5jICgpID0+IHtcbi8vICAgY29uc3Qgc2NoZW1hID0gYXdhaXQgYnVpbGRTY2hlbWEoe1xuLy8gICAgIHJlc29sdmVyczogWyBNb3ZpZVJlc29sdmVyLCBQbGV4TW92aWVSZXNvbHZlciwgUGxleFR2U2hvd3NSZXNvbHZlciwgR3JlZW5TYXRvc2hpUmVzb2x2ZXJdXG4vLyAgIH0pO1xuXG4vLyAgIGNvbnNvbGUubG9nKHNjaGVtYSlcblxuLy8gICBjb25zdCBhcG9sbG9TZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgc2NoZW1hLCBkYXRhU291cmNlczogKCkgPT4gKHtcbi8vICAgICBtb3ZpZURhdGFTb3VyY2U6IG5ldyBNb3ZpZURhdGFTb3VyY2UoKSxcbi8vICAgICBwbGV4RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZXNEYXRhU291cmNlKCksXG4vLyAgICAgZ3JlZW5TYXRvc2hpRGF0YVNvdXJjZTogbmV3IEdyZWVuU2F0b3NoaURhdGFzb3VyY2UoKSxcbi8vICAgICBwbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlOiBuZXcgUGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZSgpXG4vLyAgIH0pLFxuLy8gICB9KTtcblxuLy8gICBhd2FpdCBhcG9sbG9TZXJ2ZXIuc3RhcnQoKVxuLy8gfTtcblxuZXhwb3J0IGNvbnN0IHR5cGVEZWZzID0gZ3FsYFxudHlwZSBHcmVlblNhdG9zaGkge1xuICBpbWFnZVVybDogU3RyaW5nIVxuICBuYW1lOiBTdHJpbmchXG4gIHByaWNlOiBTdHJpbmchXG4gIHByaWNlRGlmZmVyZW5jZTogU3RyaW5nIVxuICBwcmljZURpZmZlcmVuY2VIb3VyOiBTdHJpbmchXG4gIHN5bWJvbDogU3RyaW5nIVxufVxuXG50eXBlIE1vdmllIHtcbiAgaWQ6IEZsb2F0IVxuICBvdmVydmlldzogU3RyaW5nIVxuICBwb3N0ZXJfcGF0aDogU3RyaW5nIVxuICB0aXRsZTogU3RyaW5nIVxuICB2b3RlX2F2ZXJhZ2U6IEZsb2F0IVxufVxuXG50eXBlIFBsZXhNb3ZpZSB7XG4gIGltYWdlOiBTdHJpbmchXG4gIG92ZXJ2aWV3OiBTdHJpbmchXG4gIHRpdGxlOiBTdHJpbmchXG59XG5cbnR5cGUgUGxleFR2U2hvdyB7XG4gIGltYWdlOiBTdHJpbmchXG4gIHRpdGxlOiBTdHJpbmchXG4gIHVwZGF0ZWRBdDogU3RyaW5nIVxufVxuXG50eXBlIFF1ZXJ5IHtcbiAgZ3JlZW5zYXRvc2hpOiBHcmVlblNhdG9zaGkhXG4gIGhlbGxvV29ybGQ6IFN0cmluZyFcbiAgbW92aWU6IFtNb3ZpZSFdIVxuICBwbGV4bW92aWU6IFtQbGV4TW92aWUhXSFcbiAgcGxleG1vdmlld2F0Y2hsaXN0OiBbUGxleE1vdmllIV0hXG4gIHBsZXh0dnNob3dzOiBbUGxleFR2U2hvdyFdIVxuICBzZWFyY2hNb3ZpZXMocXVlcnk6IFN0cmluZyEpOiBbTW92aWUhXSFcbn1cblxuYDtcbi8vIFByb3ZpZGUgcmVzb2x2ZXIgZnVuY3Rpb25zIGZvciB5b3VyIHNjaGVtYSBmaWVsZHNcbmV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSB7XG4gIFF1ZXJ5OiB7XG4gICAgZ3JlZW5zYXRvc2hpOiBbR3JlZW5TYXRvc2hpUmVzb2x2ZXJdLFxuICAgIHBsZXh0dnNob3dzOiBbUGxleFR2U2hvd3NSZXNvbHZlcl0sXG4gICAgcGxleG1vdmllOiBbUGxleE1vdmllUmVzb2x2ZXJdLFxuICB9LFxufTtcblxuXG5jb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzLCB0eXBlRGVmcywgZGF0YVNvdXJjZXM6ICgpID0+ICh7XG4gIG1vdmllRGF0YVNvdXJjZTogbmV3IE1vdmllRGF0YVNvdXJjZSgpLFxuICBwbGV4RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZXNEYXRhU291cmNlKCksXG4gIGdyZWVuU2F0b3NoaURhdGFTb3VyY2U6IG5ldyBHcmVlblNhdG9zaGlEYXRhc291cmNlKCksXG4gIHBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlKClcbn0pLCBjc3JmUHJldmVudGlvbjogdHJ1ZSB9KTtcblxuZXhwb3J0IGNvbnN0IGdyYXBocWxIYW5kbGVyID0gc2VydmVyLmNyZWF0ZUhhbmRsZXIoKTsiLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBHcmVlblNhdG9zaGkgfSBmcm9tIFwic3JjL21vZGVscy9ncmVlbi1zYXRvc2hpXCI7XG5cbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBHcmVlblNhdG9zaGlEYXRhc291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSAnaHR0cHM6Ly9hcGkuY29pbmdlY2tvLmNvbSdcblxuICBhc3luYyBnZXRHcmVlblNhdG9zaGkoKTogUHJvbWlzZTxHcmVlblNhdG9zaGk+IHtcbiAgICBjb25zdCBncmVlbnNhdG9zaGkgPSBhd2FpdCB0aGlzLmdldCgnL2FwaS92My9jb2lucy9ncmVlbi1zYXRvc2hpLXRva2VuJylcbiAgICAvLyBjb25zb2xlLmxvZyhcIkFQSSBSRVRVUk5FRFwiLCBncmVlbnNhdG9zaGkpXG4gICBcbiAgIGNvbnN0IG5hbWUgPSBncmVlbnNhdG9zaGkubmFtZVxuICAgY29uc3Qgc3ltYm9sID0gZ3JlZW5zYXRvc2hpLnN5bWJvbFxuICAgY29uc3QgcHJpY2UgPSBncmVlbnNhdG9zaGkubWFya2V0X2RhdGEuY3VycmVudF9wcmljZS5nYnBcbiAgIGNvbnN0IGltYWdlVXJsID0gZ3JlZW5zYXRvc2hpLmltYWdlLnNtYWxsXG4gICBjb25zdCBwcmljZURpZmZlcmVuY2UgPSBncmVlbnNhdG9zaGkubWFya2V0X2RhdGEucHJpY2VfY2hhbmdlXzI0aF9pbl9jdXJyZW5jeS5nYnBcbiAgY29uc3QgcHJpY2VEaWZmZXJlbmNlSG91ciA9IGdyZWVuc2F0b3NoaS5tYXJrZXRfZGF0YS5wcmljZV9jaGFuZ2VfcGVyY2VudGFnZV8xaF9pbl9jdXJyZW5jeS5nYnBcbiAgICBjb25zdCBvYmo6IEdyZWVuU2F0b3NoaSA9IHtcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICBzeW1ib2w6IHN5bWJvbCxcbiAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgaW1hZ2VVcmw6IGltYWdlVXJsLFxuICAgICAgIHByaWNlRGlmZmVyZW5jZTogcHJpY2VEaWZmZXJlbmNlLFxuICAgICAgIHByaWNlRGlmZmVyZW5jZUhvdXI6IHByaWNlRGlmZmVyZW5jZUhvdXJcbiAgICAgICB9XG5cbiAgICAgICBjb25zb2xlLmxvZyhvYmopXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG5cbn1cbiIsImltcG9ydCB7IFJFU1REYXRhU291cmNlLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBNb3ZpZSB9IGZyb20gXCJzcmMvbW9kZWxzL21vdmllXCI7XG4vL2ltcG9ydCB7IGVudiB9IGZyb20gXCJwcm9jZXNzXCI7XG5leHBvcnQgY2xhc3MgTW92aWVEYXRhU291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMydcblxuICBhc3luYyBnZXRNb3ZpZSgpOiBQcm9taXNlPE1vdmllW10+IHtcbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCB0aGlzLmdldCgnL21vdmllL3BvcHVsYXI/cGFnZT0xJylcbiAgICByZXR1cm4gbW92aWVzLnJlc3VsdHNcbiAgfVxuXG4gIHdpbGxTZW5kUmVxdWVzdChyZXF1ZXN0OiBSZXF1ZXN0T3B0aW9ucykge1xuICAgIHJlcXVlc3QucGFyYW1zLnNldCgnYXBpX2tleScsIGAke3Byb2Nlc3MuZW52LkFQSV9LRVl9YCk7XG4gICAgICByZXF1ZXN0LnBhcmFtcy5zZXQoJ2xhbmd1YWdlJywgJ2VuLVVTJylcbiAgfVxuICBhc3luYyBzZWFyY2hNb3ZpZXMocXVlcnk6IHN0cmluZyk6IFByb21pc2U8TW92aWVbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KCcvc2VhcmNoL21vdmllP3BhZ2VfMSZpbmNsdWRlX2FkdWx0PWZhbHNlJywge3F1ZXJ5fSlcbiAgICByZXR1cm4gbW92aWVzLnJlc3VsdHNcbiAgfVxufVxuIiwiaW1wb3J0IHsgUkVTVERhdGFTb3VyY2UgfSBmcm9tIFwiYXBvbGxvLWRhdGFzb3VyY2UtcmVzdFwiO1xuaW1wb3J0IHsgUGxleE1vdmllIH0gZnJvbSBcInNyYy9tb2RlbHMvcGxleC1tb3ZpZVwiO1xuaW1wb3J0IHsgUGxleFR2U2hvdyB9IGZyb20gXCJzcmMvbW9kZWxzL3BsZXgtdHYtc2hvd3NcIjtcbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBQbGV4TW92aWVzRGF0YVNvdXJjZSBleHRlbmRzIFJFU1REYXRhU291cmNlIHtcblxuICBiYXNlVVJMID0gYCR7cHJvY2Vzcy5lbnYuTUVESUFfVVJMfWBcblxuICBhc3luYyBnZXQ0S01vdmllcygpOiBQcm9taXNlPFBsZXhNb3ZpZVtdPiB7XG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgdGhpcy5nZXQoYC9saWJyYXJ5L3NlY3Rpb25zLzMvYWxsP3R5cGU9MSZzb3J0PW9yaWdpbmFsbHlBdmFpbGFibGVBdCUzQWRlc2MmaW5jbHVkZUNvbGxlY3Rpb25zPTEmaW5jbHVkZUV4dGVybmFsTWVkaWE9MSZpbmNsdWRlQWR2YW5jZWQ9MSR7cHJvY2Vzcy5lbnYuUExFWF9NT1ZJRV9TVFVGRn1gKVxuICAgXG4gICAgY29uc3QgY29udmVydCA9IHJlcXVpcmUoJ3htbC1qcycpO1xuXG4gICAgY29uc3QgcmVzdWx0VW5mb3JtYXR0ZWQgPSBjb252ZXJ0LnhtbDJqc29uKG1vdmllcywge2NvbXBhY3Q6IHRydWUsIHNwYWNlczogNH0pO1xuICAgIGNvbnN0IHJlc3VsdEZvcm1hdHRlZCA9IEpTT04ucGFyc2UocmVzdWx0VW5mb3JtYXR0ZWQpXG5cbiAgICAgcmV0dXJuIHJlc3VsdEZvcm1hdHRlZC5NZWRpYUNvbnRhaW5lci5WaWRlby5tYXAoYXN5bmMgKG1vdmllOiB7IF9hdHRyaWJ1dGVzOiBhbnk7IE1lZGlhOiBhbnk7IGltYWdlOiBhbnk7IHRpdGxlOiBhbnl9KSA9PiB7XG4gICAgICAgIGNvbnN0IG1vdmllWWVhciA9IG1vdmllLl9hdHRyaWJ1dGVzLnllYXJcbiAgICAgICAgY29uc3QgaW1hZ2VVcmwgPSBhd2FpdCB0aGlzLmdldChgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvbW92aWU/YXBpX2tleT0ke3Byb2Nlc3MuZW52LkFQSV9LRVl9Jmxhbmd1YWdlPWVuLVVTJnBhZ2U9MSZxdWVyeT0ke21vdmllLl9hdHRyaWJ1dGVzLnRpdGxlfSZpbmNsdWRlX2FkdWx0PWZhbHNlJnllYXI9JHttb3ZpZVllYXJ9YClcbiAgICAgICAgY29uc3QgdXJsID0gaW1hZ2VVcmwucmVzdWx0c1swXS5wb3N0ZXJfcGF0aCB8fCAnJ1xuICAgICAgICBtb3ZpZS5fYXR0cmlidXRlcy5pbWFnZSA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MjIwX2FuZF9oMzMwX2ZhY2UvJysgdXJsXG5cbiAgICAgIHJldHVybiAgbW92aWUuX2F0dHJpYnV0ZXNcbiAgICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRSZWNlbnRseVVwZGF0ZWRUVlNob3dzKCk6IFByb21pc2U8UGxleFR2U2hvd1tdPiB7XG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgdGhpcy5nZXQoYC9saWJyYXJ5L3NlY3Rpb25zLzkvYWxsPyR7cHJvY2Vzcy5lbnYuUExFWF9UVl9TSE9XfVxuICAgIGApXG4gICBcbiAgICBjb25zdCBjb252ZXJ0ID0gcmVxdWlyZSgneG1sLWpzJyk7XG5cbiAgICBjb25zdCByZXN1bHRVbmZvcm1hdHRlZCA9IGNvbnZlcnQueG1sMmpzb24obW92aWVzLCB7Y29tcGFjdDogdHJ1ZSwgc3BhY2VzOiA0fSk7XG4gICAgY29uc3QgcmVzdWx0Rm9ybWF0dGVkID0gSlNPTi5wYXJzZShyZXN1bHRVbmZvcm1hdHRlZClcblxuICAgICByZXR1cm4gcmVzdWx0Rm9ybWF0dGVkLk1lZGlhQ29udGFpbmVyLkRpcmVjdG9yeS5tYXAoYXN5bmMgKG1vdmllOiB7IF9hdHRyaWJ1dGVzOiBhbnk7IE1lZGlhOiBhbnk7IGltYWdlOiBhbnk7IHBhcmVudFRpdGxlOiBhbnl9KSA9PiB7XG4gICAgICAgY29uc3QgaW1hZ2VVcmwgPSBhd2FpdCB0aGlzLmdldChgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvdHY/YXBpX2tleT0ke3Byb2Nlc3MuZW52LkFQSV9LRVl9Jmxhbmd1YWdlPWVuLVVTJnBhZ2U9MSZxdWVyeT0ke21vdmllLl9hdHRyaWJ1dGVzLnBhcmVudFRpdGxlIHx8IG1vdmllLl9hdHRyaWJ1dGVzLnRpdGxlfSZpbmNsdWRlX2FkdWx0PWZhbHNlYClcbiAgICAgICAgY29uc3QgdXJsID0gaW1hZ2VVcmwucmVzdWx0c1swXSAmJiBpbWFnZVVybC5yZXN1bHRzWzBdLnBvc3Rlcl9wYXRoIHx8ICcnXG4gICAgICAgIG1vdmllLl9hdHRyaWJ1dGVzLmltYWdlID0gJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cyMjBfYW5kX2gzMzBfZmFjZS8nKyB1cmxcbiAgICAgIHJldHVybiAgbW92aWUuX2F0dHJpYnV0ZXNcbiAgICAgfSk7XG5cbiAgICAgXG4gIH1cbn0iLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWUgfSBmcm9tIFwic3JjL21vZGVscy9wbGV4LW1vdmllXCI7XG5cbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSBgJHtwcm9jZXNzLmVudi5QTEVYX01FVEFfVVJMfWBcblxuICBhc3luYyBnZXRXYXRjaExpc3QoKTogUHJvbWlzZTxQbGV4TW92aWVbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KGAvbGlicmFyeS9zZWN0aW9ucy93YXRjaGxpc3QvYWxsJHtwcm9jZXNzLmVudi5QTEVYX1dBVENIX0xJU1R9YClcbiAgIFxuICAgIGNvbnN0IGNvbnZlcnQgPSByZXF1aXJlKCd4bWwtanMnKTtcblxuICAgIGNvbnN0IHJlc3VsdFVuZm9ybWF0dGVkID0gY29udmVydC54bWwyanNvbihtb3ZpZXMsIHtjb21wYWN0OiB0cnVlLCBzcGFjZXM6IDR9KTtcbiAgICBjb25zdCByZXN1bHRGb3JtYXR0ZWQgPSBKU09OLnBhcnNlKHJlc3VsdFVuZm9ybWF0dGVkKVxuXG4gICAgIHJldHVybiByZXN1bHRGb3JtYXR0ZWQuTWVkaWFDb250YWluZXIuVmlkZW8ubWFwKGFzeW5jIChtb3ZpZTogeyBfYXR0cmlidXRlczogYW55OyBNZWRpYTogYW55OyBpbWFnZTogYW55OyB0aXRsZTogYW55fSkgPT4ge1xuICAgICAgICBjb25zdCBtb3ZpZVllYXIgPSBtb3ZpZS5fYXR0cmlidXRlcy55ZWFyXG4gICAgICAgIGNvbnN0IGltYWdlVXJsID0gYXdhaXQgdGhpcy5nZXQoYGh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvc2VhcmNoL21vdmllP2FwaV9rZXk9JHtwcm9jZXNzLmVudi5BUElfS0VZfSZsYW5ndWFnZT1lbi1VUyZwYWdlPTEmcXVlcnk9JHttb3ZpZS5fYXR0cmlidXRlcy50aXRsZX0maW5jbHVkZV9hZHVsdD1mYWxzZSZ5ZWFyPSR7bW92aWVZZWFyfWApXG4gICAgICAgIGNvbnN0IHVybCA9IGltYWdlVXJsLnJlc3VsdHNbMF0ucG9zdGVyX3BhdGggfHwgJydcbiAgICAgICAgbW92aWUuX2F0dHJpYnV0ZXMuaW1hZ2UgPSAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzIyMF9hbmRfaDMzMF9mYWNlLycrIHVybFxuXG4gICAgICByZXR1cm4gIG1vdmllLl9hdHRyaWJ1dGVzXG4gICAgIH0pO1xuICB9XG5cbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIEdyZWVuU2F0b3NoaSB7XG4gIEBGaWVsZCgpXG4gIG5hbWU6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgc3ltYm9sOiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIHByaWNlOiBzdHJpbmdcbiAgQEZpZWxkKClcbiAgaW1hZ2VVcmw6IHN0cmluZzsgXG4gIEBGaWVsZCgpXG4gIHByaWNlRGlmZmVyZW5jZTogc3RyaW5nO1xuICBARmllbGQoKVxuICBwcmljZURpZmZlcmVuY2VIb3VyOiBzdHJpbmdcbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZSB7XG4gIEBGaWVsZCgpXG4gIHRpdGxlOiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIG92ZXJ2aWV3OiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIGltYWdlOiBzdHJpbmdcbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIFBsZXhUdlNob3cge1xuICBARmllbGQoKVxuICB0aXRsZTogc3RyaW5nO1xuICBARmllbGQoKVxuICB1cGRhdGVkQXQ6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgaW1hZ2U6IHN0cmluZ1xufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vdHlwZXMvQ29udGV4dFwiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpIH0gZnJvbSBcIi4uL21vZGVscy9ncmVlbi1zYXRvc2hpXCI7XG5pbXBvcnQgeyBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBHcmVlblNhdG9zaGlSZXNvbHZlciB7XG4gIEBRdWVyeSgoKSA9PiBHcmVlblNhdG9zaGkpXG4gIGFzeW5jIGdyZWVuc2F0b3NoaShAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuICAgIGNvbnNvbGUubG9nKFwiV09SS0lOR1wiLCBjb250ZXh0LmRhdGFTb3VyY2VzKVxuXG4gICAgY29uc3QgY3J5cHRvID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5ncmVlblNhdG9zaGlEYXRhU291cmNlLmdldEdyZWVuU2F0b3NoaSgpO1xuXG4gICAgcmV0dXJuIGNyeXB0b1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL3R5cGVzL0NvbnRleHRcIjtcbmltcG9ydCB7IFBsZXhNb3ZpZSB9IGZyb20gXCIuLi9tb2RlbHMvcGxleC1tb3ZpZVwiO1xuaW1wb3J0IHsgQ3R4LCBRdWVyeSwgUmVzb2x2ZXIgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBSZXNvbHZlcigpXG5leHBvcnQgY2xhc3MgUGxleE1vdmllUmVzb2x2ZXIge1xuICBAUXVlcnkoKCkgPT4gW1BsZXhNb3ZpZV0pXG4gIGFzeW5jIHBsZXhtb3ZpZShAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuICAgIGNvbnNvbGUubG9nKFwiV09SS0lOR1wiKVxuXG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5wbGV4RGF0YVNvdXJjZS5nZXQ0S01vdmllcygpO1xuICAgIGNvbnNvbGUubG9nKG1vdmllcylcbiAgICByZXR1cm4gbW92aWVzO1xuICB9XG5cbiAgQFF1ZXJ5KCgpID0+IFtQbGV4TW92aWVdKVxuICBhc3luYyBwbGV4bW92aWV3YXRjaGxpc3QoQEN0eCgpIGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhjb250ZXh0LmRhdGFTb3VyY2VzLnBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UpXG5cbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCBjb250ZXh0LmRhdGFTb3VyY2VzLnBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UuZ2V0V2F0Y2hMaXN0KCk7XG4gICAgY29uc29sZS5sb2cobW92aWVzKVxuICAgIHJldHVybiBtb3ZpZXM7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi90eXBlcy9Db250ZXh0XCI7XG5pbXBvcnQgeyBQbGV4VHZTaG93IH0gZnJvbSBcIi4uL21vZGVscy9wbGV4LXR2LXNob3dzXCI7XG5pbXBvcnQgeyBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBQbGV4VHZTaG93c1Jlc29sdmVyIHtcbiAgQFF1ZXJ5KCgpID0+IFtQbGV4VHZTaG93XSlcbiAgYXN5bmMgcGxleHR2c2hvd3MoQEN0eCgpIGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICBjb25zdCBwbGV4VHZTaG93cyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMucGxleERhdGFTb3VyY2UuZ2V0UmVjZW50bHlVcGRhdGVkVFZTaG93cygpO1xuICAgIHJldHVybiBwbGV4VHZTaG93cztcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLWRhdGFzb3VyY2UtcmVzdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWZsZWN0LW1ldGFkYXRhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR5cGUtZ3JhcGhxbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ4bWwtanNcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2Fwb2xsby1zZXJ2ZXIudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=