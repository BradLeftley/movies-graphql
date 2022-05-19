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
const plex_tv_shows_1 = __webpack_require__(/*! ./resolvers/plex-tv-shows */ "./src/resolvers/plex-tv-shows.ts");
exports.server = new apollo_server_lambda_1.ApolloServer({
    schema: (0, type_graphql_1.buildSchemaSync)({
        resolvers: [movies_1.MovieResolver, plex_movies_2.PlexMovieResolver, plex_tv_shows_1.PlexTvShowsResolver, green_satoshi_2.GreenSatoshiResolver, plex_watch_list_1.PlexMovieWatchListDataSource],
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
    (0, type_graphql_1.Field)({ nullable: true }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQTZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUM3SkE7QUFJQTtBQUFBOztBQUVBO0FBMEJBO0FBeEJBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQTVCQTs7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUdBO0FBQUE7O0FBRUE7QUFlQTtBQWJBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBakJBOzs7Ozs7Ozs7Ozs7OztBQ0hBO0FBSUE7QUFBQTs7QUFFQTtBQXNDQTtBQXBDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUF4Q0E7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFJQTtBQUFBOztBQUVBO0FBb0JBO0FBbEJBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUF0QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFHQTtBQWFBO0FBWEE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBWkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7QUFHQTtBQVdBO0FBVEE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFWQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIQTtBQUdBO0FBT0E7QUFMQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFOQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIQTtBQUdBO0FBT0E7QUFMQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFOQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFQQTtBQURBO0FBQ0E7Ozs7QUFNQTtBQVJBO0FBREE7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBbkJBO0FBREE7QUFDQTs7OztBQVVBO0FBRUE7QUFEQTtBQUVBO0FBQ0E7Ozs7QUFJQTtBQXBCQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQWpCQTtBQURBO0FBQ0E7Ozs7QUFNQTtBQUdBO0FBREE7QUFDQTs7OztBQU1BO0FBakJBO0FBREE7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQURBO0FBQ0E7Ozs7QUFHQTtBQUxBO0FBREE7QUFDQTtBQUFBOzs7Ozs7Ozs7OztBQ0xBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUV2QkE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL2Fwb2xsby1zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9kYXRzb3VyY2VzL2dyZWVuLXNhdG9zaGkudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9kYXRzb3VyY2VzL21vdmllcy50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL2RhdHNvdXJjZXMvcGxleC1tb3ZpZXMudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9kYXRzb3VyY2VzL3BsZXgtd2F0Y2gtbGlzdC50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL21vZGVscy9ncmVlbi1zYXRvc2hpLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvbW9kZWxzL21vdmllLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvbW9kZWxzL3BsZXgtbW92aWUudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvcGxleC10di1zaG93cy50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL3Jlc29sdmVycy9ncmVlbi1zYXRvc2hpLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL21vdmllcy50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL3Jlc29sdmVycy9wbGV4LW1vdmllcy50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL3Jlc29sdmVycy9wbGV4LXR2LXNob3dzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImdyYXBocWwtcGxheWdyb3VuZC1taWRkbGV3YXJlLWxhbWJkYVwiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJyZWZsZWN0LW1ldGFkYXRhXCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcInR5cGUtZ3JhcGhxbFwiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJ4bWwtanNcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21vdmllLWdyYXBocWwvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25zdCB7IEFwb2xsb1NlcnZlciwgZ3FsIH0gPSByZXF1aXJlKCdhcG9sbG8tc2VydmVyLWxhbWJkYScpO1xuLy8gLy8gaW1wb3J0IHsgUGxleE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvcGxleC1tb3ZpZXNcIjtcbi8vIC8vIGltcG9ydCB7IFBsZXhUdlNob3dzUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvcGxleC10di1zaG93c1wiO1xuLy8gLy8gaW1wb3J0IHsgTW92aWVSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9tb3ZpZXNcIjtcbi8vIC8vIGdyYXBocWwuanNcblxuLy8gaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJ1xuLy8gLy8gaW1wb3J0IHsgYnVpbGRUeXBlRGVmc0FuZFJlc29sdmVycyB9IGZyb20gJ3R5cGUtZ3JhcGhxbCc7XG4vLyAvLyBpbXBvcnQgeyBQbGV4TW92aWVSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9wbGV4LW1vdmllc1wiO1xuLy8gLy8gaW1wb3J0IHsgUGxleFR2U2hvd3NSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9wbGV4LXR2LXNob3dzXCI7XG4vLyBpbXBvcnQgeyBHcmVlblNhdG9zaGlSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9ncmVlbi1zYXRvc2hpXCI7XG5cbi8vIC8vIGltcG9ydCB7IE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvbW92aWVzXCI7XG4vLyBpbXBvcnQgeyBNb3ZpZURhdGFTb3VyY2UgfSBmcm9tICcuL2RhdHNvdXJjZXMvbW92aWVzJztcbi8vIGltcG9ydCB7IFBsZXhNb3ZpZXNEYXRhU291cmNlIH0gZnJvbSAnLi9kYXRzb3VyY2VzL3BsZXgtbW92aWVzJztcbi8vIGltcG9ydCB7IEdyZWVuU2F0b3NoaURhdGFzb3VyY2UgfSBmcm9tICcuL2RhdHNvdXJjZXMvZ3JlZW4tc2F0b3NoaSc7XG4vLyBpbXBvcnQgeyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlIH0gZnJvbSAnLi9kYXRzb3VyY2VzL3BsZXgtd2F0Y2gtbGlzdCc7XG4vLyBpbXBvcnQgeyBQbGV4VHZTaG93c1Jlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3NcIjtcbi8vIGltcG9ydCB7IFBsZXhNb3ZpZVJlc29sdmVyIH0gZnJvbSAnLi9yZXNvbHZlcnMvcGxleC1tb3ZpZXMnO1xuXG5cbi8vIGV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IGdxbGBcbi8vIHR5cGUgR3JlZW5TYXRvc2hpIHtcbi8vICAgaW1hZ2VVcmw6IFN0cmluZyFcbi8vICAgbmFtZTogU3RyaW5nIVxuLy8gICBwcmljZTogU3RyaW5nIVxuLy8gICBwcmljZURpZmZlcmVuY2U6IFN0cmluZyFcbi8vICAgcHJpY2VEaWZmZXJlbmNlSG91cjogU3RyaW5nIVxuLy8gICBzeW1ib2w6IFN0cmluZyFcbi8vIH1cblxuLy8gdHlwZSBNb3ZpZSB7XG4vLyAgIGlkOiBGbG9hdCFcbi8vICAgb3ZlcnZpZXc6IFN0cmluZyFcbi8vICAgcG9zdGVyX3BhdGg6IFN0cmluZyFcbi8vICAgdGl0bGU6IFN0cmluZyFcbi8vICAgdm90ZV9hdmVyYWdlOiBGbG9hdCFcbi8vIH1cblxuLy8gdHlwZSBQbGV4TW92aWUge1xuLy8gICBpbWFnZTogU3RyaW5nIVxuLy8gICBvdmVydmlldzogU3RyaW5nIVxuLy8gICB0aXRsZTogU3RyaW5nIVxuLy8gfVxuXG4vLyB0eXBlIFBsZXhUdlNob3cge1xuLy8gICBpbWFnZTogU3RyaW5nIVxuLy8gICB0aXRsZTogU3RyaW5nIVxuLy8gICB1cGRhdGVkQXQ6IFN0cmluZyFcbi8vIH1cblxuLy8gdHlwZSBRdWVyeSB7XG4vLyAgIGdyZWVuc2F0b3NoaTogR3JlZW5TYXRvc2hpIVxuLy8gICBoZWxsb1dvcmxkOiBTdHJpbmchXG4vLyAgIG1vdmllOiBbTW92aWUhXSFcbi8vICAgcGxleG1vdmllOiBbUGxleE1vdmllIV0hXG4vLyAgIHBsZXhtb3ZpZXdhdGNobGlzdDogW1BsZXhNb3ZpZSFdIVxuLy8gICBwbGV4dHZzaG93czogW1BsZXhUdlNob3chXSFcbi8vICAgc2VhcmNoTW92aWVzKHF1ZXJ5OiBTdHJpbmchKTogW01vdmllIV0hXG4vLyB9XG5cbi8vIGA7XG4vLyAvLyBQcm92aWRlIHJlc29sdmVyIGZ1bmN0aW9ucyBmb3IgeW91ciBzY2hlbWEgZmllbGRzXG4vLyBleHBvcnQgY29uc3QgcmVzb2x2ZXJzID0ge1xuLy8gICBRdWVyeToge1xuLy8gICAgIGdyZWVuc2F0b3NoaTogW0dyZWVuU2F0b3NoaVJlc29sdmVyXSxcbi8vICAgICBwbGV4dHZzaG93czogW1BsZXhUdlNob3dzUmVzb2x2ZXJdLFxuLy8gICAgIHBsZXhtb3ZpZTogW1BsZXhNb3ZpZVJlc29sdmVyXSxcbi8vICAgfSxcbi8vIH07XG5cblxuLy8gY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7IHJlc29sdmVycywgdHlwZURlZnMsIGRhdGFTb3VyY2VzOiAoKSA9PiAoe1xuLy8gICBtb3ZpZURhdGFTb3VyY2U6IG5ldyBNb3ZpZURhdGFTb3VyY2UoKSxcbi8vICAgcGxleERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVzRGF0YVNvdXJjZSgpLFxuLy8gICBncmVlblNhdG9zaGlEYXRhU291cmNlOiBuZXcgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSgpLFxuLy8gICBwbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlOiBuZXcgUGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZSgpXG4vLyB9KSwgY3NyZlByZXZlbnRpb246IHRydWUgfSk7XG5cblxuLy8gLy8gY29uc3QgeCA9IGFzeW5jICgpOiBQcm9taXNlPHR5cGVvZiBBcG9sbG9TZXJ2ZXI+ID0+IHtcblxuLy8gLy8gICAvLyBjb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzLCB0eXBlRGVmcywgZGF0YVNvdXJjZXM6ICgpID0+ICh7XG4vLyAvLyAgIC8vICAgbW92aWVEYXRhU291cmNlOiBuZXcgTW92aWVEYXRhU291cmNlKCksXG4vLyAvLyAgIC8vICAgcGxleERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVzRGF0YVNvdXJjZSgpLFxuLy8gLy8gICAvLyAgIGdyZWVuU2F0b3NoaURhdGFTb3VyY2U6IG5ldyBHcmVlblNhdG9zaGlEYXRhc291cmNlKCksXG4vLyAvLyAgIC8vICAgcGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UoKVxuLy8gLy8gICAvLyB9KSwgY3NyZlByZXZlbnRpb246IHRydWUgfSk7XG5cbi8vIC8vICBjb25zdCBzY2hlbWEgPSAgYXdhaXQgYnVpbGRTY2hlbWEoe1xuLy8gLy8gICAgIHJlc29sdmVyczogW01vdmllUmVzb2x2ZXJdLFxuLy8gLy8gICAgIGVtaXRTY2hlbWFGaWxlOiAnc2NoZW1hcy9hZHZpc2VyLmdxbCcsXG4vLyAvLyAgIH0pXG4gIFxuLy8gLy8gICByZXR1cm4gc2NoZW1hXG4vLyAvLyB9XG5cblxuXG4vLyAvLyAgY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7IHgsIGRhdGFTb3VyY2VzOiAoKSA9PiAoe1xuLy8gLy8gICAgIG1vdmllRGF0YVNvdXJjZTogbmV3IE1vdmllRGF0YVNvdXJjZSgpLFxuLy8gLy8gICAgIHBsZXhEYXRhU291cmNlOiBuZXcgUGxleE1vdmllc0RhdGFTb3VyY2UoKSxcbi8vIC8vICAgICBncmVlblNhdG9zaGlEYXRhU291cmNlOiBuZXcgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSgpLFxuLy8gLy8gICAgIHBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlKClcbi8vIC8vICAgfSksIGNzcmZQcmV2ZW50aW9uOiB0cnVlIH0pO1xuXG5cbi8vIGV4cG9ydCBjb25zdCBncmFwaHFsSGFuZGxlciA9IHNlcnZlci5jcmVhdGVIYW5kbGVyKCk7XG5cbi8vIC8vIGNvbnN0IGdsb2JhbFNjaGVtYSA9IGJ1aWxkU2NoZW1hKHtcbi8vIC8vICAgICByZXNvbHZlcnM6IFtNb3ZpZVJlc29sdmVyXVxuLy8gLy8gfSk7XG5cbi8vIC8vIGFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlcigpIHtcbi8vIC8vICAgICBjb25zdCBzY2hlbWEgPSBhd2FpdCBnbG9iYWxTY2hlbWE7XG4vLyAvLyAgICAgcmV0dXJuIG5ldyBBcG9sbG9TZXJ2ZXIoe1xuLy8gLy8gICAgICAgICBzY2hlbWFcbi8vIC8vICAgICB9KTtcbi8vIC8vIH1cblxuLy8gLy8gZXhwb3J0IGZ1bmN0aW9uIGdyYXBocWxIYW5kbGVyKGV2ZW50OiBhbnksIGN0eDogYW55LCBjYWxsYmFjazogYW55KSB7XG4vLyAvLyAgICAgZ2V0U2VydmVyKClcbi8vIC8vICAgICAgICAgLnRoZW4oc2VydmVyID0+IHNlcnZlci5jcmVhdGVIYW5kbGVyKCkpXG4vLyAvLyAgICAgICAgIC50aGVuKGhhbmRsZXIgPT4gaGFuZGxlcihldmVudCwgY3R4LCBjYWxsYmFjaykpXG4vLyAvLyB9XG5pbXBvcnQgXCJyZWZsZWN0LW1ldGFkYXRhXCI7XG5pbXBvcnQge0Fwb2xsb1NlcnZlcn0gZnJvbSBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCI7XG5pbXBvcnQge2J1aWxkU2NoZW1hU3luY30gZnJvbSAndHlwZS1ncmFwaHFsJztcbmltcG9ydCBsYW1iZGFQbGF5Z3JvdW5kIGZyb20gXCJncmFwaHFsLXBsYXlncm91bmQtbWlkZGxld2FyZS1sYW1iZGFcIjtcbmltcG9ydCB7IE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvbW92aWVzXCI7XG5pbXBvcnQgeyBNb3ZpZURhdGFTb3VyY2UgfSBmcm9tIFwiLi9kYXRzb3VyY2VzL21vdmllc1wiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSB9IGZyb20gXCIuL2RhdHNvdXJjZXMvZ3JlZW4tc2F0b3NoaVwiO1xuaW1wb3J0IHsgUGxleE1vdmllc0RhdGFTb3VyY2UgfSBmcm9tIFwiLi9kYXRzb3VyY2VzL3BsZXgtbW92aWVzXCI7XG5pbXBvcnQgeyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlIH0gZnJvbSBcIi4vZGF0c291cmNlcy9wbGV4LXdhdGNoLWxpc3RcIjtcbmltcG9ydCB7IFBsZXhNb3ZpZVJlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtbW92aWVzXCI7XG5pbXBvcnQgeyBHcmVlblNhdG9zaGlSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9ncmVlbi1zYXRvc2hpXCI7XG5pbXBvcnQgeyBQbGV4VHZTaG93c1Jlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3NcIjtcblxuXG5leHBvcnQgY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG4gICAgc2NoZW1hOiBidWlsZFNjaGVtYVN5bmMoe1xuICAgICAgICByZXNvbHZlcnM6IFtNb3ZpZVJlc29sdmVyLCBQbGV4TW92aWVSZXNvbHZlciwgUGxleFR2U2hvd3NSZXNvbHZlciwgR3JlZW5TYXRvc2hpUmVzb2x2ZXIsIFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2VdLFxuICAgIH0pLFxuICAgIGRhdGFTb3VyY2VzOiAoKSA9PiAoe1xuICAgICAgICBtb3ZpZURhdGFTb3VyY2U6IG5ldyBNb3ZpZURhdGFTb3VyY2UoKSxcbiAgICAgICAgICBwbGV4RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZXNEYXRhU291cmNlKCksXG4gICAgICAgICAgZ3JlZW5TYXRvc2hpRGF0YVNvdXJjZTogbmV3IEdyZWVuU2F0b3NoaURhdGFzb3VyY2UoKSxcbiAgICAgICAgICBwbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlOiBuZXcgUGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZSgpXG4gICAgICB9KSxcbiAgICBpbnRyb3NwZWN0aW9uOiB0cnVlXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ3JhcGhxbEhhbmRsZXIgPSBzZXJ2ZXIuY3JlYXRlSGFuZGxlcigpO1xuXG5leHBvcnQgY29uc3QgcGxheWdyb3VuZCA9IGxhbWJkYVBsYXlncm91bmQoe1xuICAgIGVuZHBvaW50OiAnL2dyYXBocWwnXG59KTsiLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBHcmVlblNhdG9zaGkgfSBmcm9tIFwic3JjL21vZGVscy9ncmVlbi1zYXRvc2hpXCI7XG5cbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBHcmVlblNhdG9zaGlEYXRhc291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSAnaHR0cHM6Ly9hcGkuY29pbmdlY2tvLmNvbSdcblxuICBhc3luYyBnZXRHcmVlblNhdG9zaGkoKTogUHJvbWlzZTxHcmVlblNhdG9zaGk+IHtcbiAgICBjb25zdCBncmVlbnNhdG9zaGkgPSBhd2FpdCB0aGlzLmdldCgnL2FwaS92My9jb2lucy9ncmVlbi1zYXRvc2hpLXRva2VuJylcbiAgICAgY29uc29sZS5sb2coXCJBUEkgUkVUVVJORURcIiwgZ3JlZW5zYXRvc2hpKVxuICAgXG4gICBjb25zdCBuYW1lID0gZ3JlZW5zYXRvc2hpLm5hbWVcbiAgIGNvbnN0IHN5bWJvbCA9IGdyZWVuc2F0b3NoaS5zeW1ib2xcbiAgIGNvbnN0IHByaWNlID0gZ3JlZW5zYXRvc2hpLm1hcmtldF9kYXRhLmN1cnJlbnRfcHJpY2UuZ2JwXG4gICBjb25zdCBpbWFnZVVybCA9IGdyZWVuc2F0b3NoaS5pbWFnZS5zbWFsbFxuICAgY29uc3QgcHJpY2VEaWZmZXJlbmNlID0gZ3JlZW5zYXRvc2hpLm1hcmtldF9kYXRhLnByaWNlX2NoYW5nZV8yNGhfaW5fY3VycmVuY3kuZ2JwXG4gIGNvbnN0IHByaWNlRGlmZmVyZW5jZUhvdXIgPSBncmVlbnNhdG9zaGkubWFya2V0X2RhdGEucHJpY2VfY2hhbmdlX3BlcmNlbnRhZ2VfMWhfaW5fY3VycmVuY3kuZ2JwXG4gICAgY29uc3Qgb2JqOiBHcmVlblNhdG9zaGkgPSB7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgc3ltYm9sOiBzeW1ib2wsXG4gICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgIGltYWdlVXJsOiBpbWFnZVVybCxcbiAgICAgICBwcmljZURpZmZlcmVuY2U6IHByaWNlRGlmZmVyZW5jZSxcbiAgICAgICBwcmljZURpZmZlcmVuY2VIb3VyOiBwcmljZURpZmZlcmVuY2VIb3VyXG4gICAgICAgfVxuXG4gICAgICAgY29uc29sZS5sb2cob2JqKVxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuXG59XG4iLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSwgUmVxdWVzdE9wdGlvbnMgfSBmcm9tIFwiYXBvbGxvLWRhdGFzb3VyY2UtcmVzdFwiO1xuaW1wb3J0IHsgTW92aWUgfSBmcm9tIFwic3JjL21vZGVscy9tb3ZpZVwiO1xuLy9pbXBvcnQgeyBlbnYgfSBmcm9tIFwicHJvY2Vzc1wiO1xuZXhwb3J0IGNsYXNzIE1vdmllRGF0YVNvdXJjZSBleHRlbmRzIFJFU1REYXRhU291cmNlIHtcblxuICBiYXNlVVJMID0gJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMnXG5cbiAgYXN5bmMgZ2V0TW92aWUoKTogUHJvbWlzZTxNb3ZpZVtdPiB7XG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgdGhpcy5nZXQoJy9tb3ZpZS9wb3B1bGFyP3BhZ2U9MScpXG4gICAgcmV0dXJuIG1vdmllcy5yZXN1bHRzXG4gIH1cblxuICB3aWxsU2VuZFJlcXVlc3QocmVxdWVzdDogUmVxdWVzdE9wdGlvbnMpIHtcbiAgICByZXF1ZXN0LnBhcmFtcy5zZXQoJ2FwaV9rZXknLCBgJHtwcm9jZXNzLmVudi5BUElfS0VZfWApO1xuICAgICAgcmVxdWVzdC5wYXJhbXMuc2V0KCdsYW5ndWFnZScsICdlbi1VUycpXG4gIH1cbiAgYXN5bmMgc2VhcmNoTW92aWVzKHF1ZXJ5OiBzdHJpbmcpOiBQcm9taXNlPE1vdmllW10+IHtcbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCB0aGlzLmdldCgnL3NlYXJjaC9tb3ZpZT9wYWdlXzEmaW5jbHVkZV9hZHVsdD1mYWxzZScsIHtxdWVyeX0pXG4gICAgcmV0dXJuIG1vdmllcy5yZXN1bHRzXG4gIH1cbn1cbiIsImltcG9ydCB7IFJFU1REYXRhU291cmNlIH0gZnJvbSBcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIjtcbmltcG9ydCB7IFBsZXhNb3ZpZSB9IGZyb20gXCJzcmMvbW9kZWxzL3BsZXgtbW92aWVcIjtcbmltcG9ydCB7IFBsZXhUdlNob3cgfSBmcm9tIFwic3JjL21vZGVscy9wbGV4LXR2LXNob3dzXCI7XG4vL2ltcG9ydCB7IGVudiB9IGZyb20gXCJwcm9jZXNzXCI7XG5leHBvcnQgY2xhc3MgUGxleE1vdmllc0RhdGFTb3VyY2UgZXh0ZW5kcyBSRVNURGF0YVNvdXJjZSB7XG5cbiAgYmFzZVVSTCA9IGAke3Byb2Nlc3MuZW52Lk1FRElBX1VSTH1gXG5cbiAgYXN5bmMgZ2V0NEtNb3ZpZXMoKTogUHJvbWlzZTxQbGV4TW92aWVbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KGAvbGlicmFyeS9zZWN0aW9ucy8zL2FsbD90eXBlPTEmc29ydD1vcmlnaW5hbGx5QXZhaWxhYmxlQXQlM0FkZXNjJmluY2x1ZGVDb2xsZWN0aW9ucz0xJmluY2x1ZGVFeHRlcm5hbE1lZGlhPTEmaW5jbHVkZUFkdmFuY2VkPTEke3Byb2Nlc3MuZW52LlBMRVhfTU9WSUVfU1RVRkZ9YClcbiAgIFxuICAgIGNvbnN0IGNvbnZlcnQgPSByZXF1aXJlKCd4bWwtanMnKTtcblxuICAgIGNvbnN0IHJlc3VsdFVuZm9ybWF0dGVkID0gY29udmVydC54bWwyanNvbihtb3ZpZXMsIHtjb21wYWN0OiB0cnVlLCBzcGFjZXM6IDR9KTtcbiAgICBjb25zdCByZXN1bHRGb3JtYXR0ZWQgPSBKU09OLnBhcnNlKHJlc3VsdFVuZm9ybWF0dGVkKVxuXG4gICAgIHJldHVybiByZXN1bHRGb3JtYXR0ZWQuTWVkaWFDb250YWluZXIuVmlkZW8ubWFwKGFzeW5jIChtb3ZpZTogeyBfYXR0cmlidXRlczogYW55OyBNZWRpYTogYW55OyBpbWFnZTogYW55OyB0aXRsZTogYW55fSkgPT4ge1xuICAgICAgICBjb25zdCBtb3ZpZVllYXIgPSBtb3ZpZS5fYXR0cmlidXRlcy55ZWFyXG4gICAgICAgIGNvbnN0IGltYWdlVXJsID0gYXdhaXQgdGhpcy5nZXQoYGh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvc2VhcmNoL21vdmllP2FwaV9rZXk9JHtwcm9jZXNzLmVudi5BUElfS0VZfSZsYW5ndWFnZT1lbi1VUyZwYWdlPTEmcXVlcnk9JHttb3ZpZS5fYXR0cmlidXRlcy50aXRsZX0maW5jbHVkZV9hZHVsdD1mYWxzZSZ5ZWFyPSR7bW92aWVZZWFyfWApXG4gICAgICAgIGNvbnN0IHVybCA9IGltYWdlVXJsLnJlc3VsdHNbMF0ucG9zdGVyX3BhdGggfHwgJydcbiAgICAgICAgbW92aWUuX2F0dHJpYnV0ZXMuaW1hZ2UgPSAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzIyMF9hbmRfaDMzMF9mYWNlLycrIHVybFxuXG4gICAgICByZXR1cm4gIG1vdmllLl9hdHRyaWJ1dGVzXG4gICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVjZW50bHlVcGRhdGVkVFZTaG93cygpOiBQcm9taXNlPFBsZXhUdlNob3dbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KGAvbGlicmFyeS9zZWN0aW9ucy85L2FsbD8ke3Byb2Nlc3MuZW52LlBMRVhfVFZfU0hPV31cbiAgICBgKVxuICAgXG4gICAgY29uc3QgY29udmVydCA9IHJlcXVpcmUoJ3htbC1qcycpO1xuXG4gICAgY29uc3QgcmVzdWx0VW5mb3JtYXR0ZWQgPSBjb252ZXJ0LnhtbDJqc29uKG1vdmllcywge2NvbXBhY3Q6IHRydWUsIHNwYWNlczogNH0pO1xuICAgIGNvbnN0IHJlc3VsdEZvcm1hdHRlZCA9IEpTT04ucGFyc2UocmVzdWx0VW5mb3JtYXR0ZWQpXG5cbiAgICAgcmV0dXJuIHJlc3VsdEZvcm1hdHRlZC5NZWRpYUNvbnRhaW5lci5EaXJlY3RvcnkubWFwKGFzeW5jIChtb3ZpZTogeyBfYXR0cmlidXRlczogYW55OyBNZWRpYTogYW55OyBpbWFnZTogYW55OyBwYXJlbnRUaXRsZTogYW55fSkgPT4ge1xuICAgICAgIGNvbnN0IGltYWdlVXJsID0gYXdhaXQgdGhpcy5nZXQoYGh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvc2VhcmNoL3R2P2FwaV9rZXk9JHtwcm9jZXNzLmVudi5BUElfS0VZfSZsYW5ndWFnZT1lbi1VUyZwYWdlPTEmcXVlcnk9JHttb3ZpZS5fYXR0cmlidXRlcy5wYXJlbnRUaXRsZSB8fCBtb3ZpZS5fYXR0cmlidXRlcy50aXRsZX0maW5jbHVkZV9hZHVsdD1mYWxzZWApXG4gICAgICAgIGNvbnN0IHVybCA9IGltYWdlVXJsLnJlc3VsdHNbMF0gJiYgaW1hZ2VVcmwucmVzdWx0c1swXS5wb3N0ZXJfcGF0aCB8fCAnJ1xuICAgICAgICBtb3ZpZS5fYXR0cmlidXRlcy5pbWFnZSA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MjIwX2FuZF9oMzMwX2ZhY2UvJysgdXJsXG4gICAgICByZXR1cm4gIG1vdmllLl9hdHRyaWJ1dGVzXG4gICAgIH0pO1xuXG4gICAgIFxuICB9XG59IiwiaW1wb3J0IHsgUkVTVERhdGFTb3VyY2UgfSBmcm9tIFwiYXBvbGxvLWRhdGFzb3VyY2UtcmVzdFwiO1xuaW1wb3J0IHsgUGxleE1vdmllIH0gZnJvbSBcInNyYy9tb2RlbHMvcGxleC1tb3ZpZVwiO1xuXG4vL2ltcG9ydCB7IGVudiB9IGZyb20gXCJwcm9jZXNzXCI7XG5leHBvcnQgY2xhc3MgUGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZSBleHRlbmRzIFJFU1REYXRhU291cmNlIHtcblxuICBiYXNlVVJMID0gYCR7cHJvY2Vzcy5lbnYuUExFWF9NRVRBX1VSTH1gXG5cbiAgYXN5bmMgZ2V0V2F0Y2hMaXN0KCk6IFByb21pc2U8UGxleE1vdmllW10+IHtcbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCB0aGlzLmdldChgL2xpYnJhcnkvc2VjdGlvbnMvd2F0Y2hsaXN0L2FsbCR7cHJvY2Vzcy5lbnYuUExFWF9XQVRDSF9MSVNUfWApXG4gICBcbiAgICBjb25zdCBjb252ZXJ0ID0gcmVxdWlyZSgneG1sLWpzJyk7XG5cbiAgICBjb25zdCByZXN1bHRVbmZvcm1hdHRlZCA9IGNvbnZlcnQueG1sMmpzb24obW92aWVzLCB7Y29tcGFjdDogdHJ1ZSwgc3BhY2VzOiA0fSk7XG4gICAgY29uc3QgcmVzdWx0Rm9ybWF0dGVkID0gSlNPTi5wYXJzZShyZXN1bHRVbmZvcm1hdHRlZClcblxuICAgICByZXR1cm4gcmVzdWx0Rm9ybWF0dGVkLk1lZGlhQ29udGFpbmVyLlZpZGVvLm1hcChhc3luYyAobW92aWU6IHsgX2F0dHJpYnV0ZXM6IGFueTsgTWVkaWE6IGFueTsgaW1hZ2U6IGFueTsgdGl0bGU6IGFueX0pID0+IHtcbiAgICAgICAgY29uc3QgbW92aWVZZWFyID0gbW92aWUuX2F0dHJpYnV0ZXMueWVhclxuICAgICAgICBjb25zdCBpbWFnZVVybCA9IGF3YWl0IHRoaXMuZ2V0KGBodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC9tb3ZpZT9hcGlfa2V5PSR7cHJvY2Vzcy5lbnYuQVBJX0tFWX0mbGFuZ3VhZ2U9ZW4tVVMmcGFnZT0xJnF1ZXJ5PSR7bW92aWUuX2F0dHJpYnV0ZXMudGl0bGV9JmluY2x1ZGVfYWR1bHQ9ZmFsc2UmeWVhcj0ke21vdmllWWVhcn1gKVxuICAgICAgICBjb25zdCB1cmwgPSBpbWFnZVVybC5yZXN1bHRzWzBdLnBvc3Rlcl9wYXRoIHx8ICcnXG4gICAgICAgIG1vdmllLl9hdHRyaWJ1dGVzLmltYWdlID0gJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cyMjBfYW5kX2gzMzBfZmFjZS8nKyB1cmxcblxuICAgICAgcmV0dXJuICBtb3ZpZS5fYXR0cmlidXRlc1xuICAgICB9KTtcbiAgfVxuXG59IiwiaW1wb3J0IHsgRmllbGQsIE9iamVjdFR5cGUgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBPYmplY3RUeXBlKClcbmV4cG9ydCBjbGFzcyBHcmVlblNhdG9zaGkge1xuICBARmllbGQoKVxuICBuYW1lOiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIHN5bWJvbDogc3RyaW5nO1xuICBARmllbGQoKVxuICBwcmljZTogc3RyaW5nXG4gIEBGaWVsZCgpXG4gIGltYWdlVXJsOiBzdHJpbmc7IFxuICBARmllbGQoKVxuICBwcmljZURpZmZlcmVuY2U6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgcHJpY2VEaWZmZXJlbmNlSG91cjogc3RyaW5nXG59IiwiaW1wb3J0IHsgRmllbGQsIE9iamVjdFR5cGUgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBPYmplY3RUeXBlKClcbmV4cG9ydCBjbGFzcyBNb3ZpZSB7XG4gIEBGaWVsZCgpXG4gIGlkOiBudW1iZXI7XG4gIEBGaWVsZCgpXG4gIHRpdGxlOiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIG92ZXJ2aWV3OiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIHBvc3Rlcl9wYXRoOiBzdHJpbmc7IFxuICBARmllbGQoKVxuICB2b3RlX2F2ZXJhZ2U6IG51bWJlcjsgXG59IiwiaW1wb3J0IHsgRmllbGQsIE9iamVjdFR5cGUgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBPYmplY3RUeXBlKClcbmV4cG9ydCBjbGFzcyBQbGV4TW92aWUge1xuICBARmllbGQoKVxuICB0aXRsZTogc3RyaW5nO1xuICBARmllbGQoeyBudWxsYWJsZTogdHJ1ZSB9KVxuICBvdmVydmlldzogc3RyaW5nO1xuICBARmllbGQoKVxuICBpbWFnZTogc3RyaW5nXG59IiwiaW1wb3J0IHsgRmllbGQsIE9iamVjdFR5cGUgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBPYmplY3RUeXBlKClcbmV4cG9ydCBjbGFzcyBQbGV4VHZTaG93IHtcbiAgQEZpZWxkKClcbiAgdGl0bGU6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgdXBkYXRlZEF0OiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIGltYWdlOiBzdHJpbmdcbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL3R5cGVzL0NvbnRleHRcIjtcbmltcG9ydCB7IEdyZWVuU2F0b3NoaSB9IGZyb20gXCIuLi9tb2RlbHMvZ3JlZW4tc2F0b3NoaVwiO1xuaW1wb3J0IHsgQ3R4LCBRdWVyeSwgUmVzb2x2ZXIgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBSZXNvbHZlcigpXG5leHBvcnQgY2xhc3MgR3JlZW5TYXRvc2hpUmVzb2x2ZXIge1xuICBAUXVlcnkoKCkgPT4gR3JlZW5TYXRvc2hpKVxuICBhc3luYyBncmVlbnNhdG9zaGkoQEN0eCgpIGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhcIldPUktJTkdcIiwgY29udGV4dC5kYXRhU291cmNlcylcblxuICAgIGNvbnN0IGNyeXB0byA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMuZ3JlZW5TYXRvc2hpRGF0YVNvdXJjZS5nZXRHcmVlblNhdG9zaGkoKTtcblxuICAgIHJldHVybiBjcnlwdG9cbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi90eXBlcy9Db250ZXh0XCI7XG5pbXBvcnQgeyBNb3ZpZSB9IGZyb20gXCIuLi9tb2RlbHMvbW92aWVcIjtcbmltcG9ydCB7IEFyZywgQ3R4LCBRdWVyeSwgUmVzb2x2ZXIgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBSZXNvbHZlcigpXG5leHBvcnQgY2xhc3MgTW92aWVSZXNvbHZlciB7XG4gIEBRdWVyeSgoKSA9PiBbTW92aWVdKVxuICBhc3luYyBtb3ZpZShAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuICAgIGNvbnNvbGUubG9nKFwiV09SS0lOR1wiKVxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCBjb250ZXh0LmRhdGFTb3VyY2VzLm1vdmllRGF0YVNvdXJjZS5nZXRNb3ZpZSgpO1xuICAgIGNvbnNvbGUubG9nKG1vdmllcylcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGB0b2RvcyBxdWVyeSB0b29rICR7bmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFRpbWUuZ2V0VGltZSgpfW1zYFxuICAgICk7XG4gICAgcmV0dXJuIG1vdmllcztcbiAgfVxuICBAUXVlcnkoKCkgPT4gW01vdmllXSlcbiAgYXN5bmMgc2VhcmNoTW92aWVzKFxuICAgIEBDdHgoKSBjb250ZXh0OiBDb250ZXh0LFxuICAgIEBBcmcoJ3F1ZXJ5JykgcXVlcnk6IHN0cmluZ1xuICApIHtcbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCBjb250ZXh0LmRhdGFTb3VyY2VzLm1vdmllRGF0YVNvdXJjZS5zZWFyY2hNb3ZpZXMocXVlcnkpO1xuICAgIHJldHVybiBtb3ZpZXM7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vdHlwZXMvQ29udGV4dFwiO1xuaW1wb3J0IHsgUGxleE1vdmllIH0gZnJvbSBcIi4uL21vZGVscy9wbGV4LW1vdmllXCI7XG5pbXBvcnQgeyBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBQbGV4TW92aWVSZXNvbHZlciB7XG4gIEBRdWVyeSgoKSA9PiBbUGxleE1vdmllXSlcbiAgYXN5bmMgcGxleG1vdmllKEBDdHgoKSBjb250ZXh0OiBDb250ZXh0KSB7XG4gICAgY29uc29sZS5sb2coXCJXT1JLSU5HXCIpXG5cbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCBjb250ZXh0LmRhdGFTb3VyY2VzLnBsZXhEYXRhU291cmNlLmdldDRLTW92aWVzKCk7XG4gICAgY29uc29sZS5sb2cobW92aWVzKVxuICAgIHJldHVybiBtb3ZpZXM7XG4gIH1cblxuICBAUXVlcnkoKCkgPT4gW1BsZXhNb3ZpZV0pXG4gIGFzeW5jIHBsZXhtb3ZpZXdhdGNobGlzdChAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuICAgIGNvbnNvbGUubG9nKGNvbnRleHQuZGF0YVNvdXJjZXMucGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZSlcblxuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMucGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZS5nZXRXYXRjaExpc3QoKTtcbiAgICBjb25zb2xlLmxvZyhtb3ZpZXMpXG4gICAgcmV0dXJuIG1vdmllcztcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL3R5cGVzL0NvbnRleHRcIjtcbmltcG9ydCB7IFBsZXhUdlNob3cgfSBmcm9tIFwiLi4vbW9kZWxzL3BsZXgtdHYtc2hvd3NcIjtcbmltcG9ydCB7IEN0eCwgUXVlcnksIFJlc29sdmVyIH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xuXG5AUmVzb2x2ZXIoKVxuZXhwb3J0IGNsYXNzIFBsZXhUdlNob3dzUmVzb2x2ZXIge1xuICBAUXVlcnkoKCkgPT4gW1BsZXhUdlNob3ddKVxuICBhc3luYyBwbGV4dHZzaG93cyhAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuICAgIGNvbnN0IHBsZXhUdlNob3dzID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5wbGV4RGF0YVNvdXJjZS5nZXRSZWNlbnRseVVwZGF0ZWRUVlNob3dzKCk7XG4gICAgcmV0dXJuIHBsZXhUdlNob3dzO1xuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtcGxheWdyb3VuZC1taWRkbGV3YXJlLWxhbWJkYVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWZsZWN0LW1ldGFkYXRhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR5cGUtZ3JhcGhxbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ4bWwtanNcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2Fwb2xsby1zZXJ2ZXIudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=