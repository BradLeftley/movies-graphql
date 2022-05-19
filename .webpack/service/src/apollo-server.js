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
const { ApolloServer } = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
__webpack_require__(/*! reflect-metadata */ "reflect-metadata");
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
exports.server = new ApolloServer({
    schema: (0, type_graphql_1.buildSchemaSync)({
        resolvers: [movies_1.MovieResolver, plex_movies_2.PlexMovieResolver, plex_tv_shows_1.PlexTvShowsResolver, green_satoshi_2.GreenSatoshiResolver, plex_watch_list_1.PlexMovieWatchListDataSource],
    }),
    dataSources: () => ({
        movieDataSource: new movies_2.MovieDataSource(),
        plexDataSource: new plex_movies_1.PlexMoviesDataSource(),
        greenSatoshiDataSource: new green_satoshi_1.GreenSatoshiDatasource(),
        plexMovieWatchListDataSource: new plex_watch_list_1.PlexMovieWatchListDataSource()
    }),
    csrfPrevention: true,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbkNBO0FBSUE7QUFBQTs7QUFFQTtBQTBCQTtBQXhCQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUE1QkE7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFHQTtBQUFBOztBQUVBO0FBZUE7QUFiQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWpCQTs7Ozs7Ozs7Ozs7Ozs7QUNIQTtBQUlBO0FBQUE7O0FBRUE7QUFzQ0E7QUFwQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBeENBOzs7Ozs7Ozs7Ozs7OztBQ0pBO0FBSUE7QUFBQTs7QUFFQTtBQW9CQTtBQWxCQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBdEJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pBO0FBR0E7QUFhQTtBQVhBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQVpBO0FBREE7QUFDQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hBO0FBR0E7QUFXQTtBQVRBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBVkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7QUFHQTtBQU9BO0FBTEE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBTkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7QUFHQTtBQU9BO0FBTEE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBTkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBUEE7QUFEQTtBQUNBOzs7O0FBTUE7QUFSQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQW5CQTtBQURBO0FBQ0E7Ozs7QUFVQTtBQUVBO0FBREE7QUFFQTtBQUNBOzs7O0FBSUE7QUFwQkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFqQkE7QUFEQTtBQUNBOzs7O0FBTUE7QUFHQTtBQURBO0FBQ0E7Ozs7QUFNQTtBQWpCQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFEQTtBQUNBOzs7O0FBR0E7QUFMQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7QUNMQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FFdkJBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9hcG9sbG8tc2VydmVyLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvZGF0c291cmNlcy9ncmVlbi1zYXRvc2hpLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvZGF0c291cmNlcy9tb3ZpZXMudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9kYXRzb3VyY2VzL3BsZXgtbW92aWVzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvZGF0c291cmNlcy9wbGV4LXdhdGNoLWxpc3QudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvZ3JlZW4tc2F0b3NoaS50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL21vZGVscy9tb3ZpZS50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL21vZGVscy9wbGV4LW1vdmllLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvbW9kZWxzL3BsZXgtdHYtc2hvd3MudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9yZXNvbHZlcnMvZ3JlZW4tc2F0b3NoaS50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL3Jlc29sdmVycy9tb3ZpZXMudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9yZXNvbHZlcnMvcGxleC1tb3ZpZXMudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9yZXNvbHZlcnMvcGxleC10di1zaG93cy50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwiYXBvbGxvLWRhdGFzb3VyY2UtcmVzdFwiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJncmFwaHFsLXBsYXlncm91bmQtbWlkZGxld2FyZS1sYW1iZGFcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwicmVmbGVjdC1tZXRhZGF0YVwiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJ0eXBlLWdyYXBocWxcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwieG1sLWpzXCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiIGNvbnN0IHsgQXBvbGxvU2VydmVyIH0gPSByZXF1aXJlKCdhcG9sbG8tc2VydmVyLWxhbWJkYScpO1xuXG5pbXBvcnQgXCJyZWZsZWN0LW1ldGFkYXRhXCI7XG4vLyBpbXBvcnQge0Fwb2xsb1NlcnZlcn0gZnJvbSBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCI7XG5pbXBvcnQge2J1aWxkU2NoZW1hU3luY30gZnJvbSAndHlwZS1ncmFwaHFsJztcbmltcG9ydCBsYW1iZGFQbGF5Z3JvdW5kIGZyb20gXCJncmFwaHFsLXBsYXlncm91bmQtbWlkZGxld2FyZS1sYW1iZGFcIjtcbmltcG9ydCB7IE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvbW92aWVzXCI7XG5pbXBvcnQgeyBNb3ZpZURhdGFTb3VyY2UgfSBmcm9tIFwiLi9kYXRzb3VyY2VzL21vdmllc1wiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpRGF0YXNvdXJjZSB9IGZyb20gXCIuL2RhdHNvdXJjZXMvZ3JlZW4tc2F0b3NoaVwiO1xuaW1wb3J0IHsgUGxleE1vdmllc0RhdGFTb3VyY2UgfSBmcm9tIFwiLi9kYXRzb3VyY2VzL3BsZXgtbW92aWVzXCI7XG5pbXBvcnQgeyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlIH0gZnJvbSBcIi4vZGF0c291cmNlcy9wbGV4LXdhdGNoLWxpc3RcIjtcbmltcG9ydCB7IFBsZXhNb3ZpZVJlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtbW92aWVzXCI7XG5pbXBvcnQgeyBHcmVlblNhdG9zaGlSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9ncmVlbi1zYXRvc2hpXCI7XG5pbXBvcnQgeyBQbGV4VHZTaG93c1Jlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3NcIjtcblxuXG5leHBvcnQgY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG4gICAgc2NoZW1hOiBidWlsZFNjaGVtYVN5bmMoe1xuICAgICAgICByZXNvbHZlcnM6IFtNb3ZpZVJlc29sdmVyLCBQbGV4TW92aWVSZXNvbHZlciwgUGxleFR2U2hvd3NSZXNvbHZlciwgR3JlZW5TYXRvc2hpUmVzb2x2ZXIsIFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2VdLFxuICAgIH0pLFxuICAgIGRhdGFTb3VyY2VzOiAoKSA9PiAoe1xuICAgICAgICBtb3ZpZURhdGFTb3VyY2U6IG5ldyBNb3ZpZURhdGFTb3VyY2UoKSxcbiAgICAgICAgICBwbGV4RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZXNEYXRhU291cmNlKCksXG4gICAgICAgICAgZ3JlZW5TYXRvc2hpRGF0YVNvdXJjZTogbmV3IEdyZWVuU2F0b3NoaURhdGFzb3VyY2UoKSxcbiAgICAgICAgICBwbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlOiBuZXcgUGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZSgpXG4gICAgICB9KSxcbiAgICAgIGNzcmZQcmV2ZW50aW9uOiB0cnVlLFxuICAgIGludHJvc3BlY3Rpb246IHRydWVcbn0pO1xuXG5cbmV4cG9ydCBjb25zdCBncmFwaHFsSGFuZGxlciA9IHNlcnZlci5jcmVhdGVIYW5kbGVyKCk7XG5cbmV4cG9ydCBjb25zdCBwbGF5Z3JvdW5kID0gbGFtYmRhUGxheWdyb3VuZCh7XG4gICAgZW5kcG9pbnQ6ICcvZ3JhcGhxbCdcbn0pOyIsImltcG9ydCB7IFJFU1REYXRhU291cmNlIH0gZnJvbSBcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIjtcbmltcG9ydCB7IEdyZWVuU2F0b3NoaSB9IGZyb20gXCJzcmMvbW9kZWxzL2dyZWVuLXNhdG9zaGlcIjtcblxuLy9pbXBvcnQgeyBlbnYgfSBmcm9tIFwicHJvY2Vzc1wiO1xuZXhwb3J0IGNsYXNzIEdyZWVuU2F0b3NoaURhdGFzb3VyY2UgZXh0ZW5kcyBSRVNURGF0YVNvdXJjZSB7XG5cbiAgYmFzZVVSTCA9ICdodHRwczovL2FwaS5jb2luZ2Vja28uY29tJ1xuXG4gIGFzeW5jIGdldEdyZWVuU2F0b3NoaSgpOiBQcm9taXNlPEdyZWVuU2F0b3NoaT4ge1xuICAgIGNvbnN0IGdyZWVuc2F0b3NoaSA9IGF3YWl0IHRoaXMuZ2V0KCcvYXBpL3YzL2NvaW5zL2dyZWVuLXNhdG9zaGktdG9rZW4nKVxuICAgICBjb25zb2xlLmxvZyhcIkFQSSBSRVRVUk5FRFwiLCBncmVlbnNhdG9zaGkpXG4gICBcbiAgIGNvbnN0IG5hbWUgPSBncmVlbnNhdG9zaGkubmFtZVxuICAgY29uc3Qgc3ltYm9sID0gZ3JlZW5zYXRvc2hpLnN5bWJvbFxuICAgY29uc3QgcHJpY2UgPSBncmVlbnNhdG9zaGkubWFya2V0X2RhdGEuY3VycmVudF9wcmljZS5nYnBcbiAgIGNvbnN0IGltYWdlVXJsID0gZ3JlZW5zYXRvc2hpLmltYWdlLnNtYWxsXG4gICBjb25zdCBwcmljZURpZmZlcmVuY2UgPSBncmVlbnNhdG9zaGkubWFya2V0X2RhdGEucHJpY2VfY2hhbmdlXzI0aF9pbl9jdXJyZW5jeS5nYnBcbiAgY29uc3QgcHJpY2VEaWZmZXJlbmNlSG91ciA9IGdyZWVuc2F0b3NoaS5tYXJrZXRfZGF0YS5wcmljZV9jaGFuZ2VfcGVyY2VudGFnZV8xaF9pbl9jdXJyZW5jeS5nYnBcbiAgICBjb25zdCBvYmo6IEdyZWVuU2F0b3NoaSA9IHtcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICBzeW1ib2w6IHN5bWJvbCxcbiAgICAgICBwcmljZTogcHJpY2UsXG4gICAgICAgaW1hZ2VVcmw6IGltYWdlVXJsLFxuICAgICAgIHByaWNlRGlmZmVyZW5jZTogcHJpY2VEaWZmZXJlbmNlLFxuICAgICAgIHByaWNlRGlmZmVyZW5jZUhvdXI6IHByaWNlRGlmZmVyZW5jZUhvdXJcbiAgICAgICB9XG5cbiAgICAgICBjb25zb2xlLmxvZyhvYmopXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG5cbn1cbiIsImltcG9ydCB7IFJFU1REYXRhU291cmNlLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBNb3ZpZSB9IGZyb20gXCJzcmMvbW9kZWxzL21vdmllXCI7XG4vL2ltcG9ydCB7IGVudiB9IGZyb20gXCJwcm9jZXNzXCI7XG5leHBvcnQgY2xhc3MgTW92aWVEYXRhU291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMydcblxuICBhc3luYyBnZXRNb3ZpZSgpOiBQcm9taXNlPE1vdmllW10+IHtcbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCB0aGlzLmdldCgnL21vdmllL3BvcHVsYXI/cGFnZT0xJylcbiAgICByZXR1cm4gbW92aWVzLnJlc3VsdHNcbiAgfVxuXG4gIHdpbGxTZW5kUmVxdWVzdChyZXF1ZXN0OiBSZXF1ZXN0T3B0aW9ucykge1xuICAgIHJlcXVlc3QucGFyYW1zLnNldCgnYXBpX2tleScsIGAke3Byb2Nlc3MuZW52LkFQSV9LRVl9YCk7XG4gICAgICByZXF1ZXN0LnBhcmFtcy5zZXQoJ2xhbmd1YWdlJywgJ2VuLVVTJylcbiAgfVxuICBhc3luYyBzZWFyY2hNb3ZpZXMocXVlcnk6IHN0cmluZyk6IFByb21pc2U8TW92aWVbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KCcvc2VhcmNoL21vdmllP3BhZ2VfMSZpbmNsdWRlX2FkdWx0PWZhbHNlJywge3F1ZXJ5fSlcbiAgICByZXR1cm4gbW92aWVzLnJlc3VsdHNcbiAgfVxufVxuIiwiaW1wb3J0IHsgUkVTVERhdGFTb3VyY2UgfSBmcm9tIFwiYXBvbGxvLWRhdGFzb3VyY2UtcmVzdFwiO1xuaW1wb3J0IHsgUGxleE1vdmllIH0gZnJvbSBcInNyYy9tb2RlbHMvcGxleC1tb3ZpZVwiO1xuaW1wb3J0IHsgUGxleFR2U2hvdyB9IGZyb20gXCJzcmMvbW9kZWxzL3BsZXgtdHYtc2hvd3NcIjtcbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBQbGV4TW92aWVzRGF0YVNvdXJjZSBleHRlbmRzIFJFU1REYXRhU291cmNlIHtcblxuICBiYXNlVVJMID0gYCR7cHJvY2Vzcy5lbnYuTUVESUFfVVJMfWBcblxuICBhc3luYyBnZXQ0S01vdmllcygpOiBQcm9taXNlPFBsZXhNb3ZpZVtdPiB7XG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgdGhpcy5nZXQoYC9saWJyYXJ5L3NlY3Rpb25zLzMvYWxsP3R5cGU9MSZzb3J0PW9yaWdpbmFsbHlBdmFpbGFibGVBdCUzQWRlc2MmaW5jbHVkZUNvbGxlY3Rpb25zPTEmaW5jbHVkZUV4dGVybmFsTWVkaWE9MSZpbmNsdWRlQWR2YW5jZWQ9MSR7cHJvY2Vzcy5lbnYuUExFWF9NT1ZJRV9TVFVGRn1gKVxuICAgXG4gICAgY29uc3QgY29udmVydCA9IHJlcXVpcmUoJ3htbC1qcycpO1xuXG4gICAgY29uc3QgcmVzdWx0VW5mb3JtYXR0ZWQgPSBjb252ZXJ0LnhtbDJqc29uKG1vdmllcywge2NvbXBhY3Q6IHRydWUsIHNwYWNlczogNH0pO1xuICAgIGNvbnN0IHJlc3VsdEZvcm1hdHRlZCA9IEpTT04ucGFyc2UocmVzdWx0VW5mb3JtYXR0ZWQpXG5cbiAgICAgcmV0dXJuIHJlc3VsdEZvcm1hdHRlZC5NZWRpYUNvbnRhaW5lci5WaWRlby5tYXAoYXN5bmMgKG1vdmllOiB7IF9hdHRyaWJ1dGVzOiBhbnk7IE1lZGlhOiBhbnk7IGltYWdlOiBhbnk7IHRpdGxlOiBhbnl9KSA9PiB7XG4gICAgICAgIGNvbnN0IG1vdmllWWVhciA9IG1vdmllLl9hdHRyaWJ1dGVzLnllYXJcbiAgICAgICAgY29uc3QgaW1hZ2VVcmwgPSBhd2FpdCB0aGlzLmdldChgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvbW92aWU/YXBpX2tleT0ke3Byb2Nlc3MuZW52LkFQSV9LRVl9Jmxhbmd1YWdlPWVuLVVTJnBhZ2U9MSZxdWVyeT0ke21vdmllLl9hdHRyaWJ1dGVzLnRpdGxlfSZpbmNsdWRlX2FkdWx0PWZhbHNlJnllYXI9JHttb3ZpZVllYXJ9YClcbiAgICAgICAgY29uc3QgdXJsID0gaW1hZ2VVcmwucmVzdWx0c1swXS5wb3N0ZXJfcGF0aCB8fCAnJ1xuICAgICAgICBtb3ZpZS5fYXR0cmlidXRlcy5pbWFnZSA9ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MjIwX2FuZF9oMzMwX2ZhY2UvJysgdXJsXG5cbiAgICAgIHJldHVybiAgbW92aWUuX2F0dHJpYnV0ZXNcbiAgICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRSZWNlbnRseVVwZGF0ZWRUVlNob3dzKCk6IFByb21pc2U8UGxleFR2U2hvd1tdPiB7XG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgdGhpcy5nZXQoYC9saWJyYXJ5L3NlY3Rpb25zLzkvYWxsPyR7cHJvY2Vzcy5lbnYuUExFWF9UVl9TSE9XfVxuICAgIGApXG4gICBcbiAgICBjb25zdCBjb252ZXJ0ID0gcmVxdWlyZSgneG1sLWpzJyk7XG5cbiAgICBjb25zdCByZXN1bHRVbmZvcm1hdHRlZCA9IGNvbnZlcnQueG1sMmpzb24obW92aWVzLCB7Y29tcGFjdDogdHJ1ZSwgc3BhY2VzOiA0fSk7XG4gICAgY29uc3QgcmVzdWx0Rm9ybWF0dGVkID0gSlNPTi5wYXJzZShyZXN1bHRVbmZvcm1hdHRlZClcblxuICAgICByZXR1cm4gcmVzdWx0Rm9ybWF0dGVkLk1lZGlhQ29udGFpbmVyLkRpcmVjdG9yeS5tYXAoYXN5bmMgKG1vdmllOiB7IF9hdHRyaWJ1dGVzOiBhbnk7IE1lZGlhOiBhbnk7IGltYWdlOiBhbnk7IHBhcmVudFRpdGxlOiBhbnl9KSA9PiB7XG4gICAgICAgY29uc3QgaW1hZ2VVcmwgPSBhd2FpdCB0aGlzLmdldChgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvdHY/YXBpX2tleT0ke3Byb2Nlc3MuZW52LkFQSV9LRVl9Jmxhbmd1YWdlPWVuLVVTJnBhZ2U9MSZxdWVyeT0ke21vdmllLl9hdHRyaWJ1dGVzLnBhcmVudFRpdGxlIHx8IG1vdmllLl9hdHRyaWJ1dGVzLnRpdGxlfSZpbmNsdWRlX2FkdWx0PWZhbHNlYClcbiAgICAgICAgY29uc3QgdXJsID0gaW1hZ2VVcmwucmVzdWx0c1swXSAmJiBpbWFnZVVybC5yZXN1bHRzWzBdLnBvc3Rlcl9wYXRoIHx8ICcnXG4gICAgICAgIG1vdmllLl9hdHRyaWJ1dGVzLmltYWdlID0gJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cyMjBfYW5kX2gzMzBfZmFjZS8nKyB1cmxcbiAgICAgIHJldHVybiAgbW92aWUuX2F0dHJpYnV0ZXNcbiAgICAgfSk7XG5cbiAgICAgXG4gIH1cbn0iLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWUgfSBmcm9tIFwic3JjL21vZGVscy9wbGV4LW1vdmllXCI7XG5cbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSBgJHtwcm9jZXNzLmVudi5QTEVYX01FVEFfVVJMfWBcblxuICBhc3luYyBnZXRXYXRjaExpc3QoKTogUHJvbWlzZTxQbGV4TW92aWVbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KGAvbGlicmFyeS9zZWN0aW9ucy93YXRjaGxpc3QvYWxsJHtwcm9jZXNzLmVudi5QTEVYX1dBVENIX0xJU1R9YClcbiAgIFxuICAgIGNvbnN0IGNvbnZlcnQgPSByZXF1aXJlKCd4bWwtanMnKTtcblxuICAgIGNvbnN0IHJlc3VsdFVuZm9ybWF0dGVkID0gY29udmVydC54bWwyanNvbihtb3ZpZXMsIHtjb21wYWN0OiB0cnVlLCBzcGFjZXM6IDR9KTtcbiAgICBjb25zdCByZXN1bHRGb3JtYXR0ZWQgPSBKU09OLnBhcnNlKHJlc3VsdFVuZm9ybWF0dGVkKVxuXG4gICAgIHJldHVybiByZXN1bHRGb3JtYXR0ZWQuTWVkaWFDb250YWluZXIuVmlkZW8ubWFwKGFzeW5jIChtb3ZpZTogeyBfYXR0cmlidXRlczogYW55OyBNZWRpYTogYW55OyBpbWFnZTogYW55OyB0aXRsZTogYW55fSkgPT4ge1xuICAgICAgICBjb25zdCBtb3ZpZVllYXIgPSBtb3ZpZS5fYXR0cmlidXRlcy55ZWFyXG4gICAgICAgIGNvbnN0IGltYWdlVXJsID0gYXdhaXQgdGhpcy5nZXQoYGh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvc2VhcmNoL21vdmllP2FwaV9rZXk9JHtwcm9jZXNzLmVudi5BUElfS0VZfSZsYW5ndWFnZT1lbi1VUyZwYWdlPTEmcXVlcnk9JHttb3ZpZS5fYXR0cmlidXRlcy50aXRsZX0maW5jbHVkZV9hZHVsdD1mYWxzZSZ5ZWFyPSR7bW92aWVZZWFyfWApXG4gICAgICAgIGNvbnN0IHVybCA9IGltYWdlVXJsLnJlc3VsdHNbMF0ucG9zdGVyX3BhdGggfHwgJydcbiAgICAgICAgbW92aWUuX2F0dHJpYnV0ZXMuaW1hZ2UgPSAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzIyMF9hbmRfaDMzMF9mYWNlLycrIHVybFxuXG4gICAgICByZXR1cm4gIG1vdmllLl9hdHRyaWJ1dGVzXG4gICAgIH0pO1xuICB9XG5cbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIEdyZWVuU2F0b3NoaSB7XG4gIEBGaWVsZCgpXG4gIG5hbWU6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgc3ltYm9sOiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIHByaWNlOiBzdHJpbmdcbiAgQEZpZWxkKClcbiAgaW1hZ2VVcmw6IHN0cmluZzsgXG4gIEBGaWVsZCgpXG4gIHByaWNlRGlmZmVyZW5jZTogc3RyaW5nO1xuICBARmllbGQoKVxuICBwcmljZURpZmZlcmVuY2VIb3VyOiBzdHJpbmdcbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIE1vdmllIHtcbiAgQEZpZWxkKClcbiAgaWQ6IG51bWJlcjtcbiAgQEZpZWxkKClcbiAgdGl0bGU6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgb3ZlcnZpZXc6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgcG9zdGVyX3BhdGg6IHN0cmluZzsgXG4gIEBGaWVsZCgpXG4gIHZvdGVfYXZlcmFnZTogbnVtYmVyOyBcbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZSB7XG4gIEBGaWVsZCgpXG4gIHRpdGxlOiBzdHJpbmc7XG4gIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXG4gIG92ZXJ2aWV3OiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIGltYWdlOiBzdHJpbmdcbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIFBsZXhUdlNob3cge1xuICBARmllbGQoKVxuICB0aXRsZTogc3RyaW5nO1xuICBARmllbGQoKVxuICB1cGRhdGVkQXQ6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgaW1hZ2U6IHN0cmluZ1xufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vdHlwZXMvQ29udGV4dFwiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpIH0gZnJvbSBcIi4uL21vZGVscy9ncmVlbi1zYXRvc2hpXCI7XG5pbXBvcnQgeyBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBHcmVlblNhdG9zaGlSZXNvbHZlciB7XG4gIEBRdWVyeSgoKSA9PiBHcmVlblNhdG9zaGkpXG4gIGFzeW5jIGdyZWVuc2F0b3NoaShAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuICAgIGNvbnNvbGUubG9nKFwiV09SS0lOR1wiLCBjb250ZXh0LmRhdGFTb3VyY2VzKVxuXG4gICAgY29uc3QgY3J5cHRvID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5ncmVlblNhdG9zaGlEYXRhU291cmNlLmdldEdyZWVuU2F0b3NoaSgpO1xuXG4gICAgcmV0dXJuIGNyeXB0b1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL3R5cGVzL0NvbnRleHRcIjtcbmltcG9ydCB7IE1vdmllIH0gZnJvbSBcIi4uL21vZGVscy9tb3ZpZVwiO1xuaW1wb3J0IHsgQXJnLCBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBNb3ZpZVJlc29sdmVyIHtcbiAgQFF1ZXJ5KCgpID0+IFtNb3ZpZV0pXG4gIGFzeW5jIG1vdmllKEBDdHgoKSBjb250ZXh0OiBDb250ZXh0KSB7XG4gICAgY29uc29sZS5sb2coXCJXT1JLSU5HXCIpXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IERhdGUoKTtcblxuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMubW92aWVEYXRhU291cmNlLmdldE1vdmllKCk7XG4gICAgY29uc29sZS5sb2cobW92aWVzKVxuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYHRvZG9zIHF1ZXJ5IHRvb2sgJHtuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZS5nZXRUaW1lKCl9bXNgXG4gICAgKTtcbiAgICByZXR1cm4gbW92aWVzO1xuICB9XG4gIEBRdWVyeSgoKSA9PiBbTW92aWVdKVxuICBhc3luYyBzZWFyY2hNb3ZpZXMoXG4gICAgQEN0eCgpIGNvbnRleHQ6IENvbnRleHQsXG4gICAgQEFyZygncXVlcnknKSBxdWVyeTogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMubW92aWVEYXRhU291cmNlLnNlYXJjaE1vdmllcyhxdWVyeSk7XG4gICAgcmV0dXJuIG1vdmllcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi90eXBlcy9Db250ZXh0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWUgfSBmcm9tIFwiLi4vbW9kZWxzL3BsZXgtbW92aWVcIjtcbmltcG9ydCB7IEN0eCwgUXVlcnksIFJlc29sdmVyIH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xuXG5AUmVzb2x2ZXIoKVxuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZVJlc29sdmVyIHtcbiAgQFF1ZXJ5KCgpID0+IFtQbGV4TW92aWVdKVxuICBhc3luYyBwbGV4bW92aWUoQEN0eCgpIGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICBjb25zb2xlLmxvZyhcIldPUktJTkdcIilcblxuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMucGxleERhdGFTb3VyY2UuZ2V0NEtNb3ZpZXMoKTtcbiAgICBjb25zb2xlLmxvZyhtb3ZpZXMpXG4gICAgcmV0dXJuIG1vdmllcztcbiAgfVxuXG4gIEBRdWVyeSgoKSA9PiBbUGxleE1vdmllXSlcbiAgYXN5bmMgcGxleG1vdmlld2F0Y2hsaXN0KEBDdHgoKSBjb250ZXh0OiBDb250ZXh0KSB7XG4gICAgY29uc29sZS5sb2coY29udGV4dC5kYXRhU291cmNlcy5wbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlKVxuXG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5wbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlLmdldFdhdGNoTGlzdCgpO1xuICAgIGNvbnNvbGUubG9nKG1vdmllcylcbiAgICByZXR1cm4gbW92aWVzO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vdHlwZXMvQ29udGV4dFwiO1xuaW1wb3J0IHsgUGxleFR2U2hvdyB9IGZyb20gXCIuLi9tb2RlbHMvcGxleC10di1zaG93c1wiO1xuaW1wb3J0IHsgQ3R4LCBRdWVyeSwgUmVzb2x2ZXIgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBSZXNvbHZlcigpXG5leHBvcnQgY2xhc3MgUGxleFR2U2hvd3NSZXNvbHZlciB7XG4gIEBRdWVyeSgoKSA9PiBbUGxleFR2U2hvd10pXG4gIGFzeW5jIHBsZXh0dnNob3dzKEBDdHgoKSBjb250ZXh0OiBDb250ZXh0KSB7XG4gICAgY29uc3QgcGxleFR2U2hvd3MgPSBhd2FpdCBjb250ZXh0LmRhdGFTb3VyY2VzLnBsZXhEYXRhU291cmNlLmdldFJlY2VudGx5VXBkYXRlZFRWU2hvd3MoKTtcbiAgICByZXR1cm4gcGxleFR2U2hvd3M7XG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbC1wbGF5Z3JvdW5kLW1pZGRsZXdhcmUtbGFtYmRhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZmxlY3QtbWV0YWRhdGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHlwZS1ncmFwaHFsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInhtbC1qc1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBvbGxvLXNlcnZlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==