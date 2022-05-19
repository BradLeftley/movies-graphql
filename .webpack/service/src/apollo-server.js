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
            const imageUrl = await this.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${movie._attributes.parentTitle || movie._attributes.title.replace(/ *\([^)]*\) */g, "")}&include_adult=false`);
            const url = imageUrl.results[0] && imageUrl.results[0].poster_path || false;
            movie._attributes.image = url ? 'https://image.tmdb.org/t/p/w220_and_h330_face/' + url : 'https://via.placeholder.com/220x330.png';
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
        const movies = await context.dataSources.movieDataSource.getMovie();
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
        const movies = await context.dataSources.plexDataSource.get4KMovies();
        return movies;
    }
    async plexmoviewatchlist(context) {
        const movies = await context.dataSources.plexMovieWatchListDataSource.getWatchList();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbkNBO0FBSUE7QUFBQTs7QUFFQTtBQTBCQTtBQXhCQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQTVCQTs7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUdBO0FBQUE7O0FBRUE7QUFlQTtBQWJBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBakJBOzs7Ozs7Ozs7Ozs7OztBQ0hBO0FBSUE7QUFBQTs7QUFFQTtBQXVDQTtBQXJDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUF6Q0E7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFJQTtBQUFBOztBQUVBO0FBb0JBO0FBbEJBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUF0QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFHQTtBQWFBO0FBWEE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBWkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSEE7QUFHQTtBQVdBO0FBVEE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFFQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFWQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIQTtBQUdBO0FBT0E7QUFMQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFOQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNIQTtBQUdBO0FBT0E7QUFMQTtBQURBOztBQUNBO0FBRUE7QUFEQTs7QUFDQTtBQUVBO0FBREE7O0FBQ0E7QUFOQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGQTtBQUNBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBTkE7QUFEQTtBQUNBOzs7O0FBS0E7QUFQQTtBQURBO0FBQ0E7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBR0E7QUFFQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFmQTtBQURBO0FBQ0E7Ozs7QUFNQTtBQUVBO0FBREE7QUFFQTtBQUNBOzs7O0FBSUE7QUFoQkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFDQTtBQUdBO0FBRUE7QUFHQTtBQUVBO0FBQ0E7QUFHQTtBQUdBO0FBRUE7QUFDQTtBQUVBO0FBakJBO0FBREE7QUFDQTs7OztBQU1BO0FBR0E7QUFEQTtBQUNBOzs7O0FBTUE7QUFqQkE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSkE7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBREE7QUFDQTs7OztBQUdBO0FBTEE7QUFEQTtBQUNBO0FBQUE7Ozs7Ozs7Ozs7O0FDTEE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBRXZCQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvYXBvbGxvLXNlcnZlci50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL2RhdHNvdXJjZXMvZ3JlZW4tc2F0b3NoaS50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL2RhdHNvdXJjZXMvbW92aWVzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvZGF0c291cmNlcy9wbGV4LW1vdmllcy50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL2RhdHNvdXJjZXMvcGxleC13YXRjaC1saXN0LnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvbW9kZWxzL2dyZWVuLXNhdG9zaGkudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvbW92aWUudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvcGxleC1tb3ZpZS50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsLy4vc3JjL21vZGVscy9wbGV4LXR2LXNob3dzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL2dyZWVuLXNhdG9zaGkudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC8uL3NyYy9yZXNvbHZlcnMvbW92aWVzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL3BsZXgtbW92aWVzLnRzIiwid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3MudHMiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwiZ3JhcGhxbC1wbGF5Z3JvdW5kLW1pZGRsZXdhcmUtbGFtYmRhXCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcInJlZmxlY3QtbWV0YWRhdGFcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwidHlwZS1ncmFwaHFsXCIiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcInhtbC1qc1wiIiwid2VicGFjazovL21vdmllLWdyYXBocWwvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbW92aWUtZ3JhcGhxbC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL21vdmllLWdyYXBocWwvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL21vdmllLWdyYXBocWwvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIiBjb25zdCB7IEFwb2xsb1NlcnZlciB9ID0gcmVxdWlyZSgnYXBvbGxvLXNlcnZlci1sYW1iZGEnKTtcblxuaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiO1xuLy8gaW1wb3J0IHtBcG9sbG9TZXJ2ZXJ9IGZyb20gXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiO1xuaW1wb3J0IHtidWlsZFNjaGVtYVN5bmN9IGZyb20gJ3R5cGUtZ3JhcGhxbCc7XG5pbXBvcnQgbGFtYmRhUGxheWdyb3VuZCBmcm9tIFwiZ3JhcGhxbC1wbGF5Z3JvdW5kLW1pZGRsZXdhcmUtbGFtYmRhXCI7XG5pbXBvcnQgeyBNb3ZpZVJlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL21vdmllc1wiO1xuaW1wb3J0IHsgTW92aWVEYXRhU291cmNlIH0gZnJvbSBcIi4vZGF0c291cmNlcy9tb3ZpZXNcIjtcbmltcG9ydCB7IEdyZWVuU2F0b3NoaURhdGFzb3VyY2UgfSBmcm9tIFwiLi9kYXRzb3VyY2VzL2dyZWVuLXNhdG9zaGlcIjtcbmltcG9ydCB7IFBsZXhNb3ZpZXNEYXRhU291cmNlIH0gZnJvbSBcIi4vZGF0c291cmNlcy9wbGV4LW1vdmllc1wiO1xuaW1wb3J0IHsgUGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZSB9IGZyb20gXCIuL2RhdHNvdXJjZXMvcGxleC13YXRjaC1saXN0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWVSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9wbGV4LW1vdmllc1wiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvZ3JlZW4tc2F0b3NoaVwiO1xuaW1wb3J0IHsgUGxleFR2U2hvd3NSZXNvbHZlciB9IGZyb20gXCIuL3Jlc29sdmVycy9wbGV4LXR2LXNob3dzXCI7XG5cblxuZXhwb3J0IGNvbnN0IHNlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuICAgIHNjaGVtYTogYnVpbGRTY2hlbWFTeW5jKHtcbiAgICAgICAgcmVzb2x2ZXJzOiBbTW92aWVSZXNvbHZlciwgUGxleE1vdmllUmVzb2x2ZXIsIFBsZXhUdlNob3dzUmVzb2x2ZXIsIEdyZWVuU2F0b3NoaVJlc29sdmVyLCBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlXSxcbiAgICB9KSxcbiAgICBkYXRhU291cmNlczogKCkgPT4gKHtcbiAgICAgICAgbW92aWVEYXRhU291cmNlOiBuZXcgTW92aWVEYXRhU291cmNlKCksXG4gICAgICAgICAgcGxleERhdGFTb3VyY2U6IG5ldyBQbGV4TW92aWVzRGF0YVNvdXJjZSgpLFxuICAgICAgICAgIGdyZWVuU2F0b3NoaURhdGFTb3VyY2U6IG5ldyBHcmVlblNhdG9zaGlEYXRhc291cmNlKCksXG4gICAgICAgICAgcGxleE1vdmllV2F0Y2hMaXN0RGF0YVNvdXJjZTogbmV3IFBsZXhNb3ZpZVdhdGNoTGlzdERhdGFTb3VyY2UoKVxuICAgICAgfSksXG4gICAgICBjc3JmUHJldmVudGlvbjogdHJ1ZSxcbiAgICBpbnRyb3NwZWN0aW9uOiB0cnVlXG59KTtcblxuXG5leHBvcnQgY29uc3QgZ3JhcGhxbEhhbmRsZXIgPSBzZXJ2ZXIuY3JlYXRlSGFuZGxlcigpO1xuXG5leHBvcnQgY29uc3QgcGxheWdyb3VuZCA9IGxhbWJkYVBsYXlncm91bmQoe1xuICAgIGVuZHBvaW50OiAnL2dyYXBocWwnXG59KTsiLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBHcmVlblNhdG9zaGkgfSBmcm9tIFwic3JjL21vZGVscy9ncmVlbi1zYXRvc2hpXCI7XG5cbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBHcmVlblNhdG9zaGlEYXRhc291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSAnaHR0cHM6Ly9hcGkuY29pbmdlY2tvLmNvbSdcblxuICBhc3luYyBnZXRHcmVlblNhdG9zaGkoKTogUHJvbWlzZTxHcmVlblNhdG9zaGk+IHtcbiAgICBjb25zdCBncmVlbnNhdG9zaGkgPSBhd2FpdCB0aGlzLmdldCgnL2FwaS92My9jb2lucy9ncmVlbi1zYXRvc2hpLXRva2VuJylcblxuICAgXG4gICBjb25zdCBuYW1lID0gZ3JlZW5zYXRvc2hpLm5hbWVcbiAgIGNvbnN0IHN5bWJvbCA9IGdyZWVuc2F0b3NoaS5zeW1ib2xcbiAgIGNvbnN0IHByaWNlID0gZ3JlZW5zYXRvc2hpLm1hcmtldF9kYXRhLmN1cnJlbnRfcHJpY2UuZ2JwXG4gICBjb25zdCBpbWFnZVVybCA9IGdyZWVuc2F0b3NoaS5pbWFnZS5zbWFsbFxuICAgY29uc3QgcHJpY2VEaWZmZXJlbmNlID0gZ3JlZW5zYXRvc2hpLm1hcmtldF9kYXRhLnByaWNlX2NoYW5nZV8yNGhfaW5fY3VycmVuY3kuZ2JwXG4gIGNvbnN0IHByaWNlRGlmZmVyZW5jZUhvdXIgPSBncmVlbnNhdG9zaGkubWFya2V0X2RhdGEucHJpY2VfY2hhbmdlX3BlcmNlbnRhZ2VfMWhfaW5fY3VycmVuY3kuZ2JwXG4gICAgY29uc3Qgb2JqOiBHcmVlblNhdG9zaGkgPSB7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgc3ltYm9sOiBzeW1ib2wsXG4gICAgICAgcHJpY2U6IHByaWNlLFxuICAgICAgIGltYWdlVXJsOiBpbWFnZVVybCxcbiAgICAgICBwcmljZURpZmZlcmVuY2U6IHByaWNlRGlmZmVyZW5jZSxcbiAgICAgICBwcmljZURpZmZlcmVuY2VIb3VyOiBwcmljZURpZmZlcmVuY2VIb3VyXG4gICAgICAgfVxuXG4gICAgICBcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cblxufVxuIiwiaW1wb3J0IHsgUkVTVERhdGFTb3VyY2UsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSBcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIjtcbmltcG9ydCB7IE1vdmllIH0gZnJvbSBcInNyYy9tb2RlbHMvbW92aWVcIjtcbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBNb3ZpZURhdGFTb3VyY2UgZXh0ZW5kcyBSRVNURGF0YVNvdXJjZSB7XG5cbiAgYmFzZVVSTCA9ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zJ1xuXG4gIGFzeW5jIGdldE1vdmllKCk6IFByb21pc2U8TW92aWVbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KCcvbW92aWUvcG9wdWxhcj9wYWdlPTEnKVxuICAgIHJldHVybiBtb3ZpZXMucmVzdWx0c1xuICB9XG5cbiAgd2lsbFNlbmRSZXF1ZXN0KHJlcXVlc3Q6IFJlcXVlc3RPcHRpb25zKSB7XG4gICAgcmVxdWVzdC5wYXJhbXMuc2V0KCdhcGlfa2V5JywgYCR7cHJvY2Vzcy5lbnYuQVBJX0tFWX1gKTtcbiAgICAgIHJlcXVlc3QucGFyYW1zLnNldCgnbGFuZ3VhZ2UnLCAnZW4tVVMnKVxuICB9XG4gIGFzeW5jIHNlYXJjaE1vdmllcyhxdWVyeTogc3RyaW5nKTogUHJvbWlzZTxNb3ZpZVtdPiB7XG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgdGhpcy5nZXQoJy9zZWFyY2gvbW92aWU/cGFnZV8xJmluY2x1ZGVfYWR1bHQ9ZmFsc2UnLCB7cXVlcnl9KVxuICAgIHJldHVybiBtb3ZpZXMucmVzdWx0c1xuICB9XG59XG4iLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWUgfSBmcm9tIFwic3JjL21vZGVscy9wbGV4LW1vdmllXCI7XG5pbXBvcnQgeyBQbGV4VHZTaG93IH0gZnJvbSBcInNyYy9tb2RlbHMvcGxleC10di1zaG93c1wiO1xuLy9pbXBvcnQgeyBlbnYgfSBmcm9tIFwicHJvY2Vzc1wiO1xuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZXNEYXRhU291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSBgJHtwcm9jZXNzLmVudi5NRURJQV9VUkx9YFxuXG4gIGFzeW5jIGdldDRLTW92aWVzKCk6IFByb21pc2U8UGxleE1vdmllW10+IHtcbiAgICBjb25zdCBtb3ZpZXMgPSBhd2FpdCB0aGlzLmdldChgL2xpYnJhcnkvc2VjdGlvbnMvMy9hbGw/dHlwZT0xJnNvcnQ9b3JpZ2luYWxseUF2YWlsYWJsZUF0JTNBZGVzYyZpbmNsdWRlQ29sbGVjdGlvbnM9MSZpbmNsdWRlRXh0ZXJuYWxNZWRpYT0xJmluY2x1ZGVBZHZhbmNlZD0xJHtwcm9jZXNzLmVudi5QTEVYX01PVklFX1NUVUZGfWApXG5cbiAgICBjb25zdCBjb252ZXJ0ID0gcmVxdWlyZSgneG1sLWpzJyk7XG5cbiAgICBjb25zdCByZXN1bHRVbmZvcm1hdHRlZCA9IGNvbnZlcnQueG1sMmpzb24obW92aWVzLCB7IGNvbXBhY3Q6IHRydWUsIHNwYWNlczogNCB9KTtcbiAgICBjb25zdCByZXN1bHRGb3JtYXR0ZWQgPSBKU09OLnBhcnNlKHJlc3VsdFVuZm9ybWF0dGVkKVxuXG4gICAgcmV0dXJuIHJlc3VsdEZvcm1hdHRlZC5NZWRpYUNvbnRhaW5lci5WaWRlby5tYXAoYXN5bmMgKG1vdmllOiB7IF9hdHRyaWJ1dGVzOiBhbnk7IE1lZGlhOiBhbnk7IGltYWdlOiBhbnk7IHRpdGxlOiBhbnkgfSkgPT4ge1xuICAgICAgY29uc3QgbW92aWVZZWFyID0gbW92aWUuX2F0dHJpYnV0ZXMueWVhclxuICAgICAgY29uc3QgaW1hZ2VVcmwgPSBhd2FpdCB0aGlzLmdldChgaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvbW92aWU/YXBpX2tleT0ke3Byb2Nlc3MuZW52LkFQSV9LRVl9Jmxhbmd1YWdlPWVuLVVTJnBhZ2U9MSZxdWVyeT0ke21vdmllLl9hdHRyaWJ1dGVzLnRpdGxlfSZpbmNsdWRlX2FkdWx0PWZhbHNlJnllYXI9JHttb3ZpZVllYXJ9YClcbiAgICAgIGNvbnN0IHVybCA9IGltYWdlVXJsLnJlc3VsdHNbMF0ucG9zdGVyX3BhdGggfHwgJydcbiAgICAgIG1vdmllLl9hdHRyaWJ1dGVzLmltYWdlID0gJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cyMjBfYW5kX2gzMzBfZmFjZS8nICsgdXJsXG5cbiAgICAgIHJldHVybiBtb3ZpZS5fYXR0cmlidXRlc1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVjZW50bHlVcGRhdGVkVFZTaG93cygpOiBQcm9taXNlPFBsZXhUdlNob3dbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KGAvbGlicmFyeS9zZWN0aW9ucy85L2FsbD8ke3Byb2Nlc3MuZW52LlBMRVhfVFZfU0hPV31cbiAgICBgKVxuXG4gICAgY29uc3QgY29udmVydCA9IHJlcXVpcmUoJ3htbC1qcycpO1xuXG4gICAgY29uc3QgcmVzdWx0VW5mb3JtYXR0ZWQgPSBjb252ZXJ0LnhtbDJqc29uKG1vdmllcywgeyBjb21wYWN0OiB0cnVlLCBzcGFjZXM6IDQgfSk7XG4gICAgY29uc3QgcmVzdWx0Rm9ybWF0dGVkID0gSlNPTi5wYXJzZShyZXN1bHRVbmZvcm1hdHRlZClcblxuICAgIHJldHVybiByZXN1bHRGb3JtYXR0ZWQuTWVkaWFDb250YWluZXIuRGlyZWN0b3J5Lm1hcChhc3luYyAobW92aWU6IHsgX2F0dHJpYnV0ZXM6IGFueTsgTWVkaWE6IGFueTsgaW1hZ2U6IGFueTsgcGFyZW50VGl0bGU6IGFueSB9KSA9PiB7XG4gICAgICBjb25zdCBpbWFnZVVybCA9IGF3YWl0IHRoaXMuZ2V0KGBodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC90dj9hcGlfa2V5PSR7cHJvY2Vzcy5lbnYuQVBJX0tFWX0mbGFuZ3VhZ2U9ZW4tVVMmcGFnZT0xJnF1ZXJ5PSR7bW92aWUuX2F0dHJpYnV0ZXMucGFyZW50VGl0bGUgfHwgbW92aWUuX2F0dHJpYnV0ZXMudGl0bGUucmVwbGFjZSgvICpcXChbXildKlxcKSAqL2csIFwiXCIpfSZpbmNsdWRlX2FkdWx0PWZhbHNlYClcblxuICAgICAgY29uc3QgdXJsID0gaW1hZ2VVcmwucmVzdWx0c1swXSAmJiBpbWFnZVVybC5yZXN1bHRzWzBdLnBvc3Rlcl9wYXRoIHx8IGZhbHNlXG4gICAgICBtb3ZpZS5fYXR0cmlidXRlcy5pbWFnZSA9IHVybCA/ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MjIwX2FuZF9oMzMwX2ZhY2UvJyArIHVybCA6ICdodHRwczovL3ZpYS5wbGFjZWhvbGRlci5jb20vMjIweDMzMC5wbmcnXG4gICAgICByZXR1cm4gbW92aWUuX2F0dHJpYnV0ZXNcbiAgICB9KTtcblxuXG4gIH1cbn0iLCJpbXBvcnQgeyBSRVNURGF0YVNvdXJjZSB9IGZyb20gXCJhcG9sbG8tZGF0YXNvdXJjZS1yZXN0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWUgfSBmcm9tIFwic3JjL21vZGVscy9wbGV4LW1vdmllXCI7XG5cbi8vaW1wb3J0IHsgZW52IH0gZnJvbSBcInByb2Nlc3NcIjtcbmV4cG9ydCBjbGFzcyBQbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlIGV4dGVuZHMgUkVTVERhdGFTb3VyY2Uge1xuXG4gIGJhc2VVUkwgPSBgJHtwcm9jZXNzLmVudi5QTEVYX01FVEFfVVJMfWBcblxuICBhc3luYyBnZXRXYXRjaExpc3QoKTogUHJvbWlzZTxQbGV4TW92aWVbXT4ge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IHRoaXMuZ2V0KGAvbGlicmFyeS9zZWN0aW9ucy93YXRjaGxpc3QvYWxsJHtwcm9jZXNzLmVudi5QTEVYX1dBVENIX0xJU1R9YClcbiAgIFxuICAgIGNvbnN0IGNvbnZlcnQgPSByZXF1aXJlKCd4bWwtanMnKTtcblxuICAgIGNvbnN0IHJlc3VsdFVuZm9ybWF0dGVkID0gY29udmVydC54bWwyanNvbihtb3ZpZXMsIHtjb21wYWN0OiB0cnVlLCBzcGFjZXM6IDR9KTtcbiAgICBjb25zdCByZXN1bHRGb3JtYXR0ZWQgPSBKU09OLnBhcnNlKHJlc3VsdFVuZm9ybWF0dGVkKVxuXG4gICAgIHJldHVybiByZXN1bHRGb3JtYXR0ZWQuTWVkaWFDb250YWluZXIuVmlkZW8ubWFwKGFzeW5jIChtb3ZpZTogeyBfYXR0cmlidXRlczogYW55OyBNZWRpYTogYW55OyBpbWFnZTogYW55OyB0aXRsZTogYW55fSkgPT4ge1xuICAgICAgICBjb25zdCBtb3ZpZVllYXIgPSBtb3ZpZS5fYXR0cmlidXRlcy55ZWFyXG4gICAgICAgIGNvbnN0IGltYWdlVXJsID0gYXdhaXQgdGhpcy5nZXQoYGh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvc2VhcmNoL21vdmllP2FwaV9rZXk9JHtwcm9jZXNzLmVudi5BUElfS0VZfSZsYW5ndWFnZT1lbi1VUyZwYWdlPTEmcXVlcnk9JHttb3ZpZS5fYXR0cmlidXRlcy50aXRsZX0maW5jbHVkZV9hZHVsdD1mYWxzZSZ5ZWFyPSR7bW92aWVZZWFyfWApXG4gICAgICAgIGNvbnN0IHVybCA9IGltYWdlVXJsLnJlc3VsdHNbMF0ucG9zdGVyX3BhdGggfHwgJydcbiAgICAgICAgbW92aWUuX2F0dHJpYnV0ZXMuaW1hZ2UgPSAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzIyMF9hbmRfaDMzMF9mYWNlLycrIHVybFxuXG4gICAgICByZXR1cm4gIG1vdmllLl9hdHRyaWJ1dGVzXG4gICAgIH0pO1xuICB9XG5cbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIEdyZWVuU2F0b3NoaSB7XG4gIEBGaWVsZCgpXG4gIG5hbWU6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgc3ltYm9sOiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIHByaWNlOiBzdHJpbmdcbiAgQEZpZWxkKClcbiAgaW1hZ2VVcmw6IHN0cmluZzsgXG4gIEBGaWVsZCgpXG4gIHByaWNlRGlmZmVyZW5jZTogc3RyaW5nO1xuICBARmllbGQoKVxuICBwcmljZURpZmZlcmVuY2VIb3VyOiBzdHJpbmdcbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIE1vdmllIHtcbiAgQEZpZWxkKClcbiAgaWQ6IG51bWJlcjtcbiAgQEZpZWxkKClcbiAgdGl0bGU6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgb3ZlcnZpZXc6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgcG9zdGVyX3BhdGg6IHN0cmluZzsgXG4gIEBGaWVsZCgpXG4gIHZvdGVfYXZlcmFnZTogbnVtYmVyOyBcbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZSB7XG4gIEBGaWVsZCgpXG4gIHRpdGxlOiBzdHJpbmc7XG4gIEBGaWVsZCh7IG51bGxhYmxlOiB0cnVlIH0pXG4gIG92ZXJ2aWV3OiBzdHJpbmc7XG4gIEBGaWVsZCgpXG4gIGltYWdlOiBzdHJpbmdcbn0iLCJpbXBvcnQgeyBGaWVsZCwgT2JqZWN0VHlwZSB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQE9iamVjdFR5cGUoKVxuZXhwb3J0IGNsYXNzIFBsZXhUdlNob3cge1xuICBARmllbGQoKVxuICB0aXRsZTogc3RyaW5nO1xuICBARmllbGQoKVxuICB1cGRhdGVkQXQ6IHN0cmluZztcbiAgQEZpZWxkKClcbiAgaW1hZ2U6IHN0cmluZ1xufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vdHlwZXMvQ29udGV4dFwiO1xuaW1wb3J0IHsgR3JlZW5TYXRvc2hpIH0gZnJvbSBcIi4uL21vZGVscy9ncmVlbi1zYXRvc2hpXCI7XG5pbXBvcnQgeyBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBHcmVlblNhdG9zaGlSZXNvbHZlciB7XG4gIEBRdWVyeSgoKSA9PiBHcmVlblNhdG9zaGkpXG4gIGFzeW5jIGdyZWVuc2F0b3NoaShAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgY29uc3QgY3J5cHRvID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5ncmVlblNhdG9zaGlEYXRhU291cmNlLmdldEdyZWVuU2F0b3NoaSgpO1xuXG4gICAgcmV0dXJuIGNyeXB0b1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL3R5cGVzL0NvbnRleHRcIjtcbmltcG9ydCB7IE1vdmllIH0gZnJvbSBcIi4uL21vZGVscy9tb3ZpZVwiO1xuaW1wb3J0IHsgQXJnLCBDdHgsIFF1ZXJ5LCBSZXNvbHZlciB9IGZyb20gXCJ0eXBlLWdyYXBocWxcIjtcblxuQFJlc29sdmVyKClcbmV4cG9ydCBjbGFzcyBNb3ZpZVJlc29sdmVyIHtcbiAgQFF1ZXJ5KCgpID0+IFtNb3ZpZV0pXG4gIGFzeW5jIG1vdmllKEBDdHgoKSBjb250ZXh0OiBDb250ZXh0KSB7XG5cblxuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMubW92aWVEYXRhU291cmNlLmdldE1vdmllKCk7XG5cbiAgICByZXR1cm4gbW92aWVzO1xuICB9XG4gIEBRdWVyeSgoKSA9PiBbTW92aWVdKVxuICBhc3luYyBzZWFyY2hNb3ZpZXMoXG4gICAgQEN0eCgpIGNvbnRleHQ6IENvbnRleHQsXG4gICAgQEFyZygncXVlcnknKSBxdWVyeTogc3RyaW5nXG4gICkge1xuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMubW92aWVEYXRhU291cmNlLnNlYXJjaE1vdmllcyhxdWVyeSk7XG4gICAgcmV0dXJuIG1vdmllcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi90eXBlcy9Db250ZXh0XCI7XG5pbXBvcnQgeyBQbGV4TW92aWUgfSBmcm9tIFwiLi4vbW9kZWxzL3BsZXgtbW92aWVcIjtcbmltcG9ydCB7IEN0eCwgUXVlcnksIFJlc29sdmVyIH0gZnJvbSBcInR5cGUtZ3JhcGhxbFwiO1xuXG5AUmVzb2x2ZXIoKVxuZXhwb3J0IGNsYXNzIFBsZXhNb3ZpZVJlc29sdmVyIHtcbiAgQFF1ZXJ5KCgpID0+IFtQbGV4TW92aWVdKVxuICBhc3luYyBwbGV4bW92aWUoQEN0eCgpIGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICBcblxuICAgIGNvbnN0IG1vdmllcyA9IGF3YWl0IGNvbnRleHQuZGF0YVNvdXJjZXMucGxleERhdGFTb3VyY2UuZ2V0NEtNb3ZpZXMoKTtcblxuICAgIHJldHVybiBtb3ZpZXM7XG4gIH1cblxuICBAUXVlcnkoKCkgPT4gW1BsZXhNb3ZpZV0pXG4gIGFzeW5jIHBsZXhtb3ZpZXdhdGNobGlzdChAQ3R4KCkgY29udGV4dDogQ29udGV4dCkge1xuICAgIFxuXG4gICAgY29uc3QgbW92aWVzID0gYXdhaXQgY29udGV4dC5kYXRhU291cmNlcy5wbGV4TW92aWVXYXRjaExpc3REYXRhU291cmNlLmdldFdhdGNoTGlzdCgpO1xuICBcbiAgICByZXR1cm4gbW92aWVzO1xuICB9XG5cbn1cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vdHlwZXMvQ29udGV4dFwiO1xuaW1wb3J0IHsgUGxleFR2U2hvdyB9IGZyb20gXCIuLi9tb2RlbHMvcGxleC10di1zaG93c1wiO1xuaW1wb3J0IHsgQ3R4LCBRdWVyeSwgUmVzb2x2ZXIgfSBmcm9tIFwidHlwZS1ncmFwaHFsXCI7XG5cbkBSZXNvbHZlcigpXG5leHBvcnQgY2xhc3MgUGxleFR2U2hvd3NSZXNvbHZlciB7XG4gIEBRdWVyeSgoKSA9PiBbUGxleFR2U2hvd10pXG4gIGFzeW5jIHBsZXh0dnNob3dzKEBDdHgoKSBjb250ZXh0OiBDb250ZXh0KSB7XG4gICAgY29uc3QgcGxleFR2U2hvd3MgPSBhd2FpdCBjb250ZXh0LmRhdGFTb3VyY2VzLnBsZXhEYXRhU291cmNlLmdldFJlY2VudGx5VXBkYXRlZFRWU2hvd3MoKTtcbiAgICByZXR1cm4gcGxleFR2U2hvd3M7XG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1kYXRhc291cmNlLXJlc3RcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbC1wbGF5Z3JvdW5kLW1pZGRsZXdhcmUtbGFtYmRhXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZmxlY3QtbWV0YWRhdGFcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHlwZS1ncmFwaHFsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInhtbC1qc1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBvbGxvLXNlcnZlci50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==