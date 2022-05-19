/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/apollo-server.ts":
/*!******************************!*\
  !*** ./src/apollo-server.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.playground = exports.graphqlHandler = exports.server = void 0;
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
const graphql_playground_middleware_lambda_1 = __webpack_require__(/*! graphql-playground-middleware-lambda */ "graphql-playground-middleware-lambda");
const movies_1 = __webpack_require__(/*! ./resolvers/movies */ "./src/resolvers/movies.ts");
const movies_2 = __webpack_require__(/*! ./datsources/movies */ "./src/datsources/movies.ts");
const green_satoshi_1 = __webpack_require__(/*! ./datsources/green-satoshi */ "./src/datsources/green-satoshi.ts");
const plex_movies_1 = __webpack_require__(/*! ./datsources/plex-movies */ "./src/datsources/plex-movies.ts");
const plex_watch_list_1 = __webpack_require__(/*! ./datsources/plex-watch-list */ "./src/datsources/plex-watch-list.ts");
const plex_movies_2 = __webpack_require__(/*! ./resolvers/plex-movies */ "./src/resolvers/plex-movies.ts");
const green_satoshi_2 = __webpack_require__(/*! ./resolvers/green-satoshi */ "./src/resolvers/green-satoshi.ts");
exports.server = new apollo_server_lambda_1.ApolloServer({
    schema: (0, type_graphql_1.buildSchemaSync)({
        resolvers: [movies_1.MovieResolver, plex_movies_2.PlexMovieResolver, green_satoshi_2.GreenSatoshiResolver, plex_watch_list_1.PlexMovieWatchListDataSource],
    }),
    dataSources: () => ({
        movieDataSource: new movies_2.MovieDataSource(),
        plexDataSource: new plex_movies_1.PlexMoviesDataSource(),
        greenSatoshiDataSource: new green_satoshi_1.GreenSatoshiDatasource(),
        plexMovieWatchListDataSource: new plex_watch_list_1.PlexMovieWatchListDataSource()
    }),
    introspection: true
});
exports.graphqlHandler = exports.server.createHandler();
exports.playground = (0, graphql_playground_middleware_lambda_1.default)({
    endpoint: '/graphql'
});


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
        console.log("API RETURNED", greensatoshi);
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

/***/ "./src/models/movie.ts":
/*!*****************************!*\
  !*** ./src/models/movie.ts ***!
  \*****************************/
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
exports.Movie = void 0;
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let Movie = class Movie {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Movie.prototype, "overview", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Movie.prototype, "poster_path", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Movie.prototype, "vote_average", void 0);
Movie = __decorate([
    (0, type_graphql_1.ObjectType)()
], Movie);
exports.Movie = Movie;


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

/***/ "./src/resolvers/movies.ts":
/*!*********************************!*\
  !*** ./src/resolvers/movies.ts ***!
  \*********************************/
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
exports.MovieResolver = void 0;
const movie_1 = __webpack_require__(/*! ../models/movie */ "./src/models/movie.ts");
const type_graphql_1 = __webpack_require__(/*! type-graphql */ "type-graphql");
let MovieResolver = class MovieResolver {
    async movie(context) {
        console.log("WORKING");
        const startTime = new Date();
        const movies = await context.dataSources.movieDataSource.getMovie();
        console.log(movies);
        console.log(`todos query took ${new Date().getTime() - startTime.getTime()}ms`);
        return movies;
    }
    async searchMovies(context, query) {
        const movies = await context.dataSources.movieDataSource.searchMovies(query);
        return movies;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [movie_1.Movie]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "movie", null);
__decorate([
    (0, type_graphql_1.Query)(() => [movie_1.Movie]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "searchMovies", null);
MovieResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MovieResolver);
exports.MovieResolver = MovieResolver;


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

/***/ "graphql-playground-middleware-lambda":
/*!*******************************************************!*\
  !*** external "graphql-playground-middleware-lambda" ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = require("graphql-playground-middleware-lambda");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQTZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDNUpBO0FBSUE7QUFBQTs7QUFFQTtBQTBCQTtBQXhCQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUE1QkE7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFHQTtBQUFBOztBQUVBO0FBZUE7QUFiQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWpCQTs7Ozs7Ozs7Ozs7Ozs7QUNIQTtBQUlBO0FBQUE7O0FBRUE7QUFzQ0E7QUFwQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBeENBOzs7Ozs7Ozs7Ozs7OztBQ0pBO0FBSUE7QUFBQTs7QUFFQTtBQW9CQTtBQWxCQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBdEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pBO0FBR0E7QUFhQTtBQVhBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQVpBO0FBREE7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBO0FBR0E7QUFXQTtBQVRBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBVkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7QUFHQTtBQU9BO0FBTEE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBTkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBUEE7QUFEQTtBQUNBOzs7O0FBTUE7QUFSQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQW5CQTtBQURBO0FBQ0E7Ozs7QUFVQTtBQUVBO0FBREE7QUFFQTtBQUNBOzs7O0FBSUE7QUFwQkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFqQkE7QUFEQTtBQUNBOzs7O0FBTUE7QUFHQTtBQURBO0FBQ0E7Ozs7QUFNQTtBQWpCQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7QUNMQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FFdkJBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9hcG9sbG8tc2VydmVyLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvZGF0c291cmNlcy9ncmVlbi1zYXRvc2hpLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvZGF0c291cmNlcy9tb3ZpZXMudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9kYXRzb3VyY2VzL3BsZXgtbW92aWVzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvZGF0c291cmNlcy9wbGV4LXdhdGNoLWxpc3QudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvZ3JlZW4tc2F0b3NoaS50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL21vZGVscy9tb3ZpZS50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL21vZGVscy9wbGV4LW1vdmllLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL2dyZWVuLXNhdG9zaGkudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9yZXNvbHZlcnMvbW92aWVzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL3BsZXgtbW92aWVzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImdyYXBocWwtcGxheWdyb3VuZC1taWRkbGV3YXJlLWxhbWJkYVwiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJyZWZsZWN0LW1ldGFkYXRhXCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcInR5cGUtZ3JhcGhxbFwiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJ4bWwtanNcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21vdmllLWdyYXBocWwvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25zdCB7IEFwb2xsb1NlcnZlciwgZ3FsIH0gPSByZXF1aXJlKCdhcG9sbG8tc2VydmVyLWxhbWJkYScpO1xuLy8gLy8gaW1wb3J0IHsgUGxleE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvcGxleC1tb3ZpZXNcIjtcbi8vIC8vIGltcG9ydCB7IFBsZXhUdlNob3dzUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvcGxleC10di1zaG93c1wiO1xuLy8gLy8gaW1wb3J0IHsgTW92aWVSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9tb3ZpZXNcIjtcbi8vIC8vIGdyYXBocWwuanNcblxuLy8gaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJ1xuLy8gLy8gaW1wb3J0IHsgYnVpbGRUeXBlRGVmc0FuZFJlc29sdmVycyB9IGZyb20gJ3R5cGUtZ3JhcGhxbCc7XG4vLyAvLyBpbXBvcnQgeyBQbGV4TW92aWVSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9wbGV4LW1vdmllc1wiO1xuLy8gLy8gaW1wb3J0IHsgUGxleFR2U2hvd3NSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9wbGV4LXR2LXNob3dzXCI7XG4vLyBpbXBvcnQgeyBHcmVlblNhdG9zaGlSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9ncmVlbi1zYXRvc2hpXCI7XG5cbi8vIC8vIGltcG9ydCB7IE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvbW92aWVzXCI7XG4vLyBpbXBvcnQgeyBNb3ZpZURhdGFTb3VyY2UgfSBmcm9tICcuL2RhdHNvdXJjZXMvbW92aWVzJztcbi8vIGltcG9ydCB7IFBsZXhNb3ZpZXNEYXRhU291cmNlIH0gZnJvbSAnLi9kYXRzb3VyY2VzL3BsZXgtbW92aWVzJztcbi8vIGltcG9ydCB7IEdyZWVuU2F0b3NoaURhdGFzb3VyY2UgfSBmcm9tICcuL2RhdHNvdXJjZXMvZ3JlZW4tc2F0b3NoaSc7XG4vLyBpbXBvcnQgeyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlIH0gZnJvbSAnLi9kYXRzb3VyY2VzL3BsZXgtd2F0Y2gtbGlzdCc7XG4vLyBpbXBvcnQgeyBQbGV4VHZTaG93c1Jlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3NcIjtcbi8vIGltcG9ydCB7IFBsZXhNb3ZpZVJlc29sdmVyIH0gZnJvbSAnLi9yZXNvbHZlcnMvcGxleC1tb3ZpZXMnO1xuXG5cbi8vIGV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IGdxbGBcbi8vIHR5cGUgR3JlZW5TYXRvc2hpIHtcbi8vICAgaW1hZ2VVcmw6IFN0cmluZyFcbi8vICAgbmFtZTogU3RyaW5nIVxuLy8gICBwcmljZTogU3RyaW5nIVxuLy8gICBwcmljZURpZmZlcmVuY2U6IFN0cmluZyFcbi8vICAgcHJpY2VEaWZmZXJlbmNlSG91cjogU3RyaW5nIVxuLy8gICBzeW1ib2w6IFN0cmluZyFcbi8vIH1cblxuLy8gdHlwZSBNb3ZpZSB7XG4vLyAgIGlkOiBGbG9hdCFcbi8vICAgb3ZlcnZpZXc6IFN0cmluZyFcbi8vICAgcG9zdGVyX3BhdGg6IFN0cmluZyFcbi8vICAgdGl0bGU6IFN0cmluZyFcbi8vICAgdm90ZV9hdmVyYWdlOiBGbG9hdCFcbi8vIH1cblxuLy8gdHlwZSBQbGV4TW92aWUge1xuLy8gICBpbWFnZTogU3RyaW5nIVxuLy8gICBvdmVydmlldzogU3RyaW5nIVxuLy8gICB0aXRsZTogU3RyaW5nIVxuLy8gfVxuXG4vLyB0eXBlIFBsZXhUdlNob3cge1xuLy8gICBpbWFnZTogU3RyaW5nIVxuLy8gICB0aXRsZTogU3RyaW5nIVxuLy8gICB1cGRhdGVkQXQ6IFN0cmluZyFcbi8vIH1cblxuLy8gdHlwZSBRdWVyeSB7XG4vLyAgIGdyZWVuc2F0b3NoaTogR3JlZW5TYXRvc2hpIVxuLy8gICBoZWxsb1dvcmxkOiBTdHJpbmchXG4vLyAgIG1vdmllOiBbTW92aWUhXSFcbi8vICAgcGxleG1vdmllOiBbUGxleE1vdmllIV0hXG4vLyAgIHBsZXhtb3ZpZXdhdGNobGlzdDogW1BsZXhNb3ZpZSFdIVxuLy8gICBwbGV4dHZzaG93czogW1BsZXhUdlNob3chXSFcbi8vICAgc2VhcmNoTW92aWVzKHF1ZXJ5OiBTdHJpbmchKTogW01vdmllIV0hXG4vLyB9XG5cbi8vIGA7XG4vLyAvLyBQcm92aWRlIHJlc29sdmVyIGZ1bmN0aW9ucyBmb3IgeW91ciBzY2hlbWEgZmllbGRzXG4vLyBleHBvcnQgY29uc3QgcmVzb2x2ZXJzID0ge1xuLy8gICBRdWVyeToge1xuLy8gICAgIGdyZWVuc2F0b3NoaTogW0dyZWVuU2F0b3NoaVJlc29sdmVyXSxcbi8vICAgICBwbGV4dHZzaG93czogW1BsZXhUdlNob3dzUmVzb2x2ZXJdLFxuLy8gICAgIHBsZXhtb3ZpZTogW1BsZXhNb3ZpZVJlc29sdmVyXSxcbi8vICAgfSxcbi8vIH07XG5cblxuLy8gY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7IHJlc29sdmVycywgdHlwZURlZnMsIGRhdGFTb3VyY2VzOiAoKSA9PiAoe1xuLy8gICBtb3ZpZURhdGFTb3VyY2U6IG5ldyBNb3ZpZURhdGFTb3VyY2UoKSxcbi8vICAgcGxleERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVzRGF0YVNvdXJjZSgpLFxuLy8gICBncmVlblNhdG9zaGlEYXRhU291cmNlOiBuZXcgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSgpLFxuLy8gICBwbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlOiBuZXcgUGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZSgpXG4vLyB9KSwgY3NyZlByZXZlbnRpb246IHRydWUgfSk7XG5cblxuLy8gLy8gY29uc3QgeCA9IGFzeW5jICgpOiBQcm9taXNlPHR5cGVvZiBBcG9sbG9TZXJ2ZXI+ID0+IHtcblxuLy8gLy8gICAvLyBjb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzLCB0eXBlRGVmcywgZGF0YVNvdXJjZXM6ICgpID0+ICh7XG4vLyAvLyAgIC8vICAgbW92aWVEYXRhU291cmNlOiBuZXcgTW92aWVEYXRhU291cmNlKCksXG4vLyAvLyAgIC8vICAgcGxleERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVzRGF0YVNvdXJjZSgpLFxuLy8gLy8gICAvLyAgIGdyZWVuU2F0b3NoaURhdGFTb3VyY2U6IG5ldyBHcmVlblNhdG9zaGlEYXRhc291cmNlKCksXG4vLyAvLyAgIC8vICAgcGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UoKVxuLy8gLy8gICAvLyB9KSwgY3NyZlByZXZlbnRpb246IHRydWUgfSk7XG5cbi8vIC8vICBjb25zdCBzY2hlbWEgPSAgYXdhaXQgYnVpbGRTY2hlbWEoe1xuLy8gLy8gICAgIHJlc29sdmVyczogW01vdmllUmVzb2x2ZXJdLFxuLy8gLy8gICAgIGVtaXRTY2hlbWFGaWxlOiAnc2NoZW1hcy9hZHZpc2VyLmdxbCcsXG4vLyAvLyAgIH0pXG4gIFxuLy8gLy8gICByZXR1cm4gc2NoZW1hXG4vLyAvLyB9XG5cblxuXG4vLyAvLyAgY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7IHgsIGRhdGFTb3VyY2VzOiAoKSA9PiAoe1xuLy8gLy8gICAgIG1vdmllRGF0YVNvdXJjZTogbmV3IE1vdmllRGF0YVNvdXJjZSgpLFxuLy8gLy8gICAgIHBsZXhEYXRhU291cmNlOiBuZXcgUGxleE1vdmllc0RhdGFTb3VyY2UoKSxcbi8vIC8vICAgICBncmVlblNhdG9zaGlEYXRhU291cmNlOiBuZXcgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSgpLFxuLy8gLy8gICAgIHBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlKClcbi8vIC8vICAgfSksIGNzcmZQcmV2ZW50aW9uOiB0cnVlIH0pO1xuXG5cbi8vIGV4cG9ydCBjb25zdCBncmFwaHFsSGFuZGxlciA9IHNlcnZlci5jcmVhdGVIYW5kbGVyKCk7XG5cbi8vIC8vIGNvbnN0IGdsb2JhbFNjaGVtYSA9IGJ1aWxkU2NoZW1hKHtcbi8vIC8vICAgICByZXNvbHZlcnM6IFtNb3ZpZVJlc29sdmVyXVxuLy8gLy8gfSk7XG5cbi8vIC8vIGFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlcigpIHtcbi8vIC8vICAgICBjb25zdCBzY2hlbWEgPSBhd2FpdCBnbG9iYWxTY2hlbWE7XG4vLyAvLyAgICAgcmV0dXJuIG5ldyBBcG9sbG9TZXJ2ZXIoe1xuLy8gLy8gICAgICAgICBzY2hlbWFcbi8vIC8vICAgICB9KTtcbi8vIC8vIH1cblxuLy8gLy8gZXhwb3J0IGZ1bmN0aW9uIGdyYXBocWxIYW5kbGVyKGV2ZW50OiBhbnksIGN0eDogYW55LCBjYWxsYmFjazogYW55KSB7XG4vLyAvLyAgICAgZ2V0U2VydmVyKClcbi8vIC8vICAgICAgICAgLnRoZW4oc2VydmVyID0+IHNlcnZlci5jcmVhdGVIYW5kbGVyKCkpXG4vLyAvLyAgICAgICAgIC50aGVuKGhhbmRsZXIgPT4gaGFuZGxlcihldmVudCwgY3R4LCBjYWxsYmFjaykpXG4vLyAvLyB9XG5pbXBvcnQgXCJyZWZsZWN0LW1ldGFkYXRhXCI7XG5pbXBvcnQge0Fwb2xsb1NlcnZlcn0gZnJvbSBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCI7XG5pbXBvcnQge2J1aWxkU2NoZW1hU3luY30gZnJvbSAndHlwZS1ncmFwaHFsJztcbmltcG9ydCBsYW1iZGFQbGF5Z3JvdW5kIGZyb20gXCJncmFwaHFsLXBsYXlncm91bmQtbWlkZGxld2FyZS1sYW1iZGFcIjtcbmltcG9ydCB7IE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvbW92aWVzXCI7XG5pbXBvcnQgeyBNb3ZpZURhdGFTb3VyY2UgfSBmcm9tIFwiLi9kYXRzb3VyY2VzL21vdmllc1wiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSB9IGZyb20gXCIuL2RhdHNvdXJjZXMvZ3JlZW4tc2F0b3NoaVwiO1xuaW1wb3J0IHsgUGxleE1vdmllc0RhdGFTb3VyY2UgfSBmcm9tIFwiLi9kYXRzb3VyY2VzL3BsZXgtbW92aWVzXCI7XG5pbXBvcnQgeyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlIH0gZnJvbSBcIi4vZGF0c291cmNlcy9wbGV4LXdhdGNoLWxpc3RcIjtcbmltcG9ydCB7IFBsZXhNb3ZpZVJlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtbW92aWVzXCI7XG5pbXBvcnQgeyBHcmVlblNhdG9zaGlSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9ncmVlbi1zYXRvc2hpXCI7XG5cblxuZXhwb3J0IGNvbnN0IHNlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuICAgIHNjaGVtYTogYnVpbGRTY2hlbWFTeW5jKHtcbiAgICAgICAgcmVzb2x2ZXJzOiBbTW92aWVSZXNvbHZlciwgUGxleE1vdmllUmVzb2x2ZXIsIEdyZWVuU2F0b3NoaVJlc29sdmVyLCBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlXSxcbiAgICB9KSxcbiAgICBkYXRhU291cmNlczogKCkgPT4gKHtcbiAgICAgICAgbW92aWVEYXRhU291cmNlOiBuZXcgTW92aWVEYXRhU291cmNlKCksXG4gICAgICAgICAgcGxleERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVzRGF0YVNvdXJjZSgpLFxuICAgICAgICAgIGdyZWVuU2F0b3NoaURhdGFTb3VyY2U6IG5ldyBHcmVlblNhdG9zaGlEYXRhc291cmNlKCksXG4gICAgICAgICAgcGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UoKVxuICAgICAgfSksXG4gICAgaW50cm9zcGVjdGlvbjogdHJ1ZVxufSk7XG5cblxuZXhwb3J0IGNvbnN0IGdyYXBocWxIYW5kbGVyID0gc2VydmVyLmNyZWF0ZUhhbmRsZXIoKTtcblxuZXhwb3J0IGNvbnN0IHBsYXlncm91bmQgPSBsYW1iZGFQbGF5Z3JvdW5kKHtcbiAgICBlbmRwb2ludDogJy9ncmFwaHFsJ1xufSk7IiwiaW1wb3J0IHsgUkVTVERhdGFTb3VyY2UgfSBmcm9tIFwiYXBvbGxvLWRhdGFzb3VyY2UtcmVzdFwiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpIH0gZnJvbSBcInNyYy9tb2RlbHMvZ3JlZW4tc2F0b3NoaVwiO1xuXG4vL2ltcG9ydCB7IGVudiB9IGZyb20gXCJwcm9jZXNzXCI7XG5leHBvcnQgY2xhc3MgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSBleHRlbmRzIFJFU1REYXRhU291cmNlIHtcblxuICBiYXNlVVJMID0gJ2h0dHBzOi8vYXBpLmNvaW5nZWNrby5jb20nXG5cbiAgYXN5bmMgZ2V0R3JlZW5TYXRvc2hpKCk6IFByb21pc2U8R3JlZW5TYXRvc2hpPiB7XG4gICAgY29uc3QgZ3JlZW5zYXRvc2hpID0gYXdhaXQgdGhpcy5nZXQoJy9hcGkvdjMvY29pbnMvZ3JlZW4tc2F0b3NoaS10b2tlbicpXG4gICAgIGNvbnNvbGUubG9nKFwiQVBJIFJFVFVSTkVEXCIsIGdyZWVuc2F0b3NoaSlcbiAgIFxuICAgY29uc3QgbmFtZSA9IGdyZWVuc2F0b3NoaS5uYW1lXG4gICBjb25zdCBzeW1ib2wgPSBncmVlbnNhdG9zaGkuc3ltYm9sXG4gICBjb25zdCBwcmljZSA9IGdyZWVuc2F0b3NoaS5tYXJrZXRfZGF0YS5jdXJyZW50X3ByaWNlLmdicFxuICAgY29uc3QgaW1hZ2VVcmwgPSBncmVlbnNhdG9zaGkuaW1hZ2Uuc21hbGxcbiAgIGNvbnN0IHByaWNlRGlmZmVyZW5jZSA9IGdyZWVuc2F0b3NoaS5tYXJrZXRfZGF0YS5wcmljZV9jaGFuZ2VfMjRoX2luX2N1cnJlbmN5LmdicFxuICBjb25zdCBwcmljZURpZmZlcmVuY2VIb3VyID0gZ3JlZW5zYXRvc2hpLm1hcmtldF9kYXRhLnByaWNlX2NoYW5nZV9wZXJjZW50YWdlXzFoX2luX2N1cnJlbmN5LmdicFxuICAgIGNvbnN0IG9iajogR3JlZW5TYXRvc2hpID0ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgIHN5bWJvbDogc3ltYm9sLFxuICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICBpbWFnZVVybDogaW1hZ2VVcmwsXG4gICAgICAgcHJpY2VEaWZmZXJlbmNlOiBwcmljZURpZmZlcmVuY2UsXG4gICAgICAgcHJpY2VEaWZmZXJlbmNlSG91cjogcHJpY2VEaWZmZXJlbmNlSG91clxuICAgICAgIH1cblxuICAgICAgIGNvbnNvbGUubG9nKG9iailcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cblxufVxuIiwiaW1wb3J0IHsgUkVTVERhdGFTb3VyY2UsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSBcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIjtcbmltcG9ydCB7IE1vdmllIH0gZnJvbSBcInNyYy9tb2RlbHMvbW92aWVcIjtcbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBNb3ZpZURhdGFTb3VyY2UgZXh0ZW5kcyBSRVNURGF0YVNvdXJjZSB7XG5cbiAgYmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zJ1xuXG4gIGFzeW5jIGdldE1vdmllKCk6IFByb21pc2U8TW92aWVbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KCcvbW92aWUvcG9wdWxhcj9wYWdlPTEnKVxuICAgIHJldHVybiBtb3ZpZXMucmVzdWx0c1xuICB9XG5cbiAgd2lsbFNlbmRSZXF1ZXN0KHJlcXVlc3Q6IFJlcXVlc3RPcHRpb25zKSB7XG4gICAgcmVxdWVzdC5wYXJhbXMuc2V0KCdhcGlfa2V5JywgYCR7cHJvY2Vzcy5lbnYuQVBJX0tFWX1gKTtcbiAgICAgIHJlcXVlc3QucGFyYW1zLnNldCgnbGFuZ3VhZ2UnLCAnZW4tVVMnKVxuICB9XG4gIGFzeW5jIHNlYXJjaE1vdmllcyhxdWVyeTogc3RyaW5nKTogUHJvbWlzZTxNb3ZpZVtdPiB7XG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgdGhpcy5nZXQoJy9zZWFyY2gvbW92aWU/cGFnZV8xJmluY2x1ZGVfYWR1bHQ9ZmFsc2UnLCB7cXVlcnl9KVxuICAgIHJldHVybiBtb3ZpZXMucmVzdWx0c1xuICB9XG59XG4iLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWUgfSBmcm9tIFwic3JjL21vZGVscy9wbGV4LW1vdmllXCI7XG5pbXBvcnQgeyBQbGV4VHZTaG93IH0gZnJvbSBcInNyYy9tb2RlbHMvcGxleC10di1zaG93c1wiO1xuLy9pbXBvcnQgeyBlbnYgfSBmcm9tIFwicHJvY2Vzc1wiO1xuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZXNEYXRhU291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSBgJHtwcm9jZXNzLmVudi5NRURJQV9VUkx9YFxuXG4gIGFzeW5jIGdldDRLTW92aWVzKCk6IFByb21pc2U8UGxleE1vdmllW10+IHtcbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCB0aGlzLmdldChgL2xpYnJhcnkvc2VjdGlvbnMvMy9hbGw/dHlwZT0xJnNvcnQ9b3JpZ2luYWxseUF2YWlsYWJsZUF0JTNBZGVzYyZpbmNsdWRlQ29sbGVjdGlvbnM9MSZpbmNsdWRlRXh0ZXJuYWxNZWRpYT0xJmluY2x1ZGVBZHZhbmNlZD0xJHtwcm9jZXNzLmVudi5QTEVYX01PVklFX1NUVUZGfWApXG4gICBcbiAgICBjb25zdCBjb252ZXJ0ID0gcmVxdWlyZSgneG1sLWpzJyk7XG5cbiAgICBjb25zdCByZXN1bHRVbmZvcm1hdHRlZCA9IGNvbnZlcnQueG1sMmpzb24obW92aWVzLCB7Y29tcGFjdDogdHJ1ZSwgc3BhY2VzOiA0fSk7XG4gICAgY29uc3QgcmVzdWx0Rm9ybWF0dGVkID0gSlNPTi5wYXJzZShyZXN1bHRVbmZvcm1hdHRlZClcblxuICAgICByZXR1cm4gcmVzdWx0Rm9ybWF0dGVkLk1lZGlhQ29udGFpbmVyLlZpZGVvLm1hcChhc3luYyAobW92aWU6IHsgX2F0dHJpYnV0ZXM6IGFueTsgTWVkaWE6IGFueTsgaW1hZ2U6IGFueTsgdGl0bGU6IGFueX0pID0+IHtcbiAgICAgICAgY29uc3QgbW92aWVZZWFyID0gbW92aWUuX2F0dHJpYnV0ZXMueWVhclxuICAgICAgICBjb25zdCBpbWFnZVVybCA9IGF3YWl0IHRoaXMuZ2V0KGBodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC9tb3ZpZT9hcGlfa2V5PSR7cHJvY2Vzcy5lbnYuQVBJX0tFWX0mbGFuZ3VhZ2U9ZW4tVVMmcGFnZT0xJnF1ZXJ5PSR7bW92aWUuX2F0dHJpYnV0ZXMudGl0bGV9JmluY2x1ZGVfYWR1bHQ9ZmFsc2UmeWVhcj0ke21vdmllWWVhcn1gKVxuICAgICAgICBjb25zdCB1cmwgPSBpbWFnZVVybC5yZXN1bHRzWzBdLnBvc3Rlcl9wYXRoIHx8ICcnXG4gICAgICAgIG1vdmllLl9hdHRyaWJ1dGVzLmltYWdlID0gJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cyMjBfYW5kX2gzMzBfZmFjZS8nKyB1cmxcblxuICAgICAgcmV0dXJuICBtb3ZpZS5fYXR0cmlidXRlc1xuICAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldFJlY2VudGx5VXBkYXRlZFRWU2hvd3MoKTogUHJvbWlzZTxQbGV4VHZTaG93W10+IHtcbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCB0aGlzLmdldChgL2xpYnJhcnkvc2VjdGlvbnMvOS9hbGw/JHtwcm9jZXNzLmVudi5QTEVYX1RWX1NIT1d9XG4gICAgYClcbiAgIFxuICAgIGNvbnN0IGNvbnZlcnQgPSByZXF1aXJlKCd4bWwtanMnKTtcblxuICAgIGNvbnN0IHJlc3VsdFVuZm9ybWF0dGVkID0gY29udmVydC54bWwyanNvbihtb3ZpZXMsIHtjb21wYWN0OiB0cnVlLCBzcGFjZXM6IDR9KTtcbiAgICBjb25zdCByZXN1bHRGb3JtYXR0ZWQgPSBKU09OLnBhcnNlKHJlc3VsdFVuZm9ybWF0dGVkKVxuXG4gICAgIHJldHVybiByZXN1bHRGb3JtYXR0ZWQuTWVkaWFDb250YWluZXIuRGlyZWN0b3J5Lm1hcChhc3luYyAobW92aWU6IHsgX2F0dHJpYnV0ZXM6IGFueTsgTWVkaWE6IGFueTsgaW1hZ2U6IGFueTsgcGFyZW50VGl0bGU6IGFueX0pID0+IHtcbiAgICAgICBjb25zdCBpbWFnZVVybCA9IGF3YWl0IHRoaXMuZ2V0KGBodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC90dj9hcGlfa2V5PSR7cHJvY2Vzcy5lbnYuQVBJX0tFWX0mbGFuZ3VhZ2U9ZW4tVVMmcGFnZT0xJnF1ZXJ5PSR7bW92aWUuX2F0dHJpYnV0ZXMucGFyZW50VGl0bGUgfHwgbW92aWUuX2F0dHJpYnV0ZXMudGl0bGV9JmluY2x1ZGVfYWR1bHQ9ZmFsc2VgKVxuICAgICAgICBjb25zdCB1cmwgPSBpbWFnZVVybC5yZXN1bHRzWzBdICYmIGltYWdlVXJsLnJlc3VsdHNbMF0ucG9zdGVyX3BhdGggfHwgJydcbiAgICAgICAgbW92aWUuX2F0dHJpYnV0ZXMuaW1hZ2UgPSAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzIyMF9hbmRfaDMzMF9mYWNlLycrIHVybFxuICAgICAgcmV0dXJuICBtb3ZpZS5fYXR0cmlidXRlc1xuICAgICB9KTtcblxuICAgICBcbiAgfVxufSIsImltcG9ydCB7IFJFU1REYXRhU291cmNlIH0gZnJvbSBcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIjtcbmltcG9ydCB7IFBsZXhNb3ZpZSB9IGZyb20gXCJzcmMvbW9kZWxzL3BsZXgtbW92aWVcIjtcblxuLy9pbXBvcnQgeyBlbnYgfSBmcm9tIFwicHJvY2Vzc1wiO1xuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UgZXh0ZW5kcyBSRVNURGF0YVNvdXJjZSB7XG5cbiAgYmFzZVVSTCA9IGAke3Byb2Nlc3MuZW52LlBMRVhfTUVUQV9VUkx9YFxuXG4gIGFzeW5jIGdldFdhdGNoTGlzdCgpOiBQcm9taXNlPFBsZXhNb3ZpZVtdPiB7XG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgdGhpcy5nZXQoYC9saWJyYXJ5L3NlY3Rpb25zL3dhdGNobGlzdC9hbGwke3Byb2Nlc3MuZW52LlBMRVhfV0FUQ0hfTElTVH1gKVxuICAgXG4gICAgY29uc3QgY29udmVydCA9IHJlcXVpcmUoJ3htbC1qcycpO1xuXG4gICAgY29uc3QgcmVzdWx0VW5mb3JtYXR0ZWQgPSBjb252ZXJ0LnhtbDJqc29uKG1vdmllcywge2NvbXBhY3Q6IHRydWUsIHNwYWNlczogNH0pO1xuICAgIGNvbnN0IHJlc3VsdEZvcm1hdHRlZCA9IEpTT04ucGFyc2UocmVzdWx0VW5mb3JtYXR0ZWQpXG5cbiAgICAgcmV0dXJuIHJlc3VsdEZvcm1hdHRlZC5NZWRpYUNvbnRhaW5lci5WaWRlby5tYXAoYXN5bmMgKG1vdmllOiB7IF9hdHRyaWJ1dGVzOiBhbnk7IE1lZGlhOiBhbnk7IGltYWdlOiBhbnk7IHRpdGxlOiBhbnl9KSA9PiB7XG4gICAgICAgIGNvbnN0IG1vdmllWWVhciA9IG1vdmllLl9hdHRyaWJ1dGVzLnllYXJcbiAgICAgICAgY29uc3QgaW1hZ2VVcmwgPSBhd2FpdCB0aGlzLmdldChgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvbW92aWU/YXBpX2tleT0ke3Byb2Nlc3MuZW52LkFQSV9LRVl9Jmxhbmd1YWdlPWVuLVVTJnBhZ2U9MSZxdWVyeT0ke21vdmllLl9hdHRyaWJ1dGVzLnRpdGxlfSZpbmNsdWRlX2FkdWx0PWZhbHNlJnllYXI9JHttb3ZpZVllYXJ9YClcbiAgICAgICAgY29uc3QgdXJsID0gaW1hZ2VVcmwucmVzdWx0c1swXS5wb3N0ZXJfcGF0aCB8fCAnJ1xuICAgICAgICBtb3ZpZS5fYXR0cmlidXRlcy5pbWFnZSA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MjIwX2FuZF9oMzMwX2ZhY2UvJysgdXJsXG5cbiAgICAgIHJldHVybiAgbW92aWUuX2F0dHJpYnV0ZXNcbiAgICAgfSk7XG4gIH1cblxufSIsImltcG9ydCB7IEZpZWxkLCBPYmplY3RUeXBlIH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xuXG5AT2JqZWN0VHlwZSgpXG5leHBvcnQgY2xhc3MgR3JlZW5TYXRvc2hpIHtcbiAgQEZpZWxkKClcbiAgbmFtZTogc3RyaW5nO1xuICBARmllbGQoKVxuICBzeW1ib2w6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgcHJpY2U6IHN0cmluZ1xuICBARmllbGQoKVxuICBpbWFnZVVybDogc3RyaW5nOyBcbiAgQEZpZWxkKClcbiAgcHJpY2VEaWZmZXJlbmNlOiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIHByaWNlRGlmZmVyZW5jZUhvdXI6IHN0cmluZ1xufSIsImltcG9ydCB7IEZpZWxkLCBPYmplY3RUeXBlIH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xuXG5AT2JqZWN0VHlwZSgpXG5leHBvcnQgY2xhc3MgTW92aWUge1xuICBARmllbGQoKVxuICBpZDogbnVtYmVyO1xuICBARmllbGQoKVxuICB0aXRsZTogc3RyaW5nO1xuICBARmllbGQoKVxuICBvdmVydmlldzogc3RyaW5nO1xuICBARmllbGQoKVxuICBwb3N0ZXJfcGF0aDogc3RyaW5nOyBcbiAgQEZpZWxkKClcbiAgdm90ZV9hdmVyYWdlOiBudW1iZXI7IFxufSIsImltcG9ydCB7IEZpZWxkLCBPYmplY3RUeXBlIH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xuXG5AT2JqZWN0VHlwZSgpXG5leHBvcnQgY2xhc3MgUGxleE1vdmllIHtcbiAgQEZpZWxkKClcbiAgdGl0bGU6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgb3ZlcnZpZXc6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgaW1hZ2U6IHN0cmluZ1xufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vdHlwZXMvQ29udGV4dFwiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpIH0gZnJvbSBcIi4uL21vZGVscy9ncmVlbi1zYXRvc2hpXCI7XG5pbXBvcnQgeyBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBHcmVlblNhdG9zaGlSZXNvbHZlciB7XG4gIEBRdWVyeSgoKSA9PiBHcmVlblNhdG9zaGkpXG4gIGFzeW5jIGdyZWVuc2F0b3NoaShAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuICAgIGNvbnNvbGUubG9nKFwiV09SS0lOR1wiLCBjb250ZXh0LmRhdGFTb3VyY2VzKVxuXG4gICAgY29uc3QgY3J5cHRvID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5ncmVlblNhdG9zaGlEYXRhU291cmNlLmdldEdyZWVuU2F0b3NoaSgpO1xuXG4gICAgcmV0dXJuIGNyeXB0b1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL3R5cGVzL0NvbnRleHRcIjtcbmltcG9ydCB7IE1vdmllIH0gZnJvbSBcIi4uL21vZGVscy9tb3ZpZVwiO1xuaW1wb3J0IHsgQXJnLCBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBNb3ZpZVJlc29sdmVyIHtcbiAgQFF1ZXJ5KCgpID0+IFtNb3ZpZV0pXG4gIGFzeW5jIG1vdmllKEBDdHgoKSBjb250ZXh0OiBDb250ZXh0KSB7XG4gICAgY29uc29sZS5sb2coXCJXT1JLSU5HXCIpXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcblxuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMubW92aWVEYXRhU291cmNlLmdldE1vdmllKCk7XG4gICAgY29uc29sZS5sb2cobW92aWVzKVxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYHRvZG9zIHF1ZXJ5IHRvb2sgJHtuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZS5nZXRUaW1lKCl9bXNgXG4gICAgKTtcbiAgICByZXR1cm4gbW92aWVzO1xuICB9XG4gIEBRdWVyeSgoKSA9PiBbTW92aWVdKVxuICBhc3luYyBzZWFyY2hNb3ZpZXMoXG4gICAgQEN0eCgpIGNvbnRleHQ6IENvbnRleHQsXG4gICAgQEFyZygncXVlcnknKSBxdWVyeTogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMubW92aWVEYXRhU291cmNlLnNlYXJjaE1vdmllcyhxdWVyeSk7XG4gICAgcmV0dXJuIG1vdmllcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi90eXBlcy9Db250ZXh0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWUgfSBmcm9tIFwiLi4vbW9kZWxzL3BsZXgtbW92aWVcIjtcbmltcG9ydCB7IEN0eCwgUXVlcnksIFJlc29sdmVyIH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xuXG5AUmVzb2x2ZXIoKVxuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZVJlc29sdmVyIHtcbiAgQFF1ZXJ5KCgpID0+IFtQbGV4TW92aWVdKVxuICBhc3luYyBwbGV4bW92aWUoQEN0eCgpIGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhcIldPUktJTkdcIilcblxuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMucGxleERhdGFTb3VyY2UuZ2V0NEtNb3ZpZXMoKTtcbiAgICBjb25zb2xlLmxvZyhtb3ZpZXMpXG4gICAgcmV0dXJuIG1vdmllcztcbiAgfVxuXG4gIEBRdWVyeSgoKSA9PiBbUGxleE1vdmllXSlcbiAgYXN5bmMgcGxleG1vdmlld2F0Y2hsaXN0KEBDdHgoKSBjb250ZXh0OiBDb250ZXh0KSB7XG4gICAgY29uc29sZS5sb2coY29udGV4dC5kYXRhU291cmNlcy5wbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlKVxuXG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5wbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlLmdldFdhdGNoTGlzdCgpO1xuICAgIGNvbnNvbGUubG9nKG1vdmllcylcbiAgICByZXR1cm4gbW92aWVzO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbC1wbGF5Z3JvdW5kLW1pZGRsZXdhcmUtbGFtYmRhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZmxlY3QtbWV0YWRhdGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHlwZS1ncmFwaHFsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInhtbC1qc1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBvbGxvLXNlcnZlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==