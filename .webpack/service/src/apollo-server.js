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
const { ApolloServer } = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
exports.typeDefs = (0, apollo_server_lambda_1.gql) `
  type Query {
    """
    A test message.
    """
    testMessage: String!
  }
`;
exports.resolvers = {
    Query: {
        testMessage: () => 'Hello World!',
    },
};
const apolloServer = new ApolloServer({ resolvers: exports.resolvers, typeDefs: exports.typeDefs });
exports.graphqlHandler = apolloServer.createHandler();


/***/ }),

/***/ "apollo-server-lambda":
/*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("apollo-server-lambda");

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2Fwb2xsby1zZXJ2ZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBTUE7QUFFQTs7Ozs7OztBQU9BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBR0E7Ozs7Ozs7Ozs7O0FDM0JBOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBRXZCQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21vdmllLWdyYXBocWwvLi9zcmMvYXBvbGxvLXNlcnZlci50cyIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL2V4dGVybmFsIGNvbW1vbmpzIFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIiIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21vdmllLWdyYXBocWwvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9tb3ZpZS1ncmFwaHFsL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IEFwb2xsb1NlcnZlciB9ID0gcmVxdWlyZSgnYXBvbGxvLXNlcnZlci1sYW1iZGEnKTtcbi8vIGltcG9ydCB7IFBsZXhNb3ZpZVJlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtbW92aWVzXCI7XG4vLyBpbXBvcnQgeyBQbGV4VHZTaG93c1Jlc29sdmVyIH0gZnJvbSBcIi4vcmVzb2x2ZXJzL3BsZXgtdHYtc2hvd3NcIjtcbi8vIGltcG9ydCB7IE1vdmllUmVzb2x2ZXIgfSBmcm9tIFwiLi9yZXNvbHZlcnMvbW92aWVzXCI7XG4vLyBncmFwaHFsLmpzXG5cbmltcG9ydCB7IGdxbCB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItbGFtYmRhJztcbi8vIENvbnN0cnVjdCBhIHNjaGVtYSwgdXNpbmcgR3JhcGhRTCBzY2hlbWEgbGFuZ3VhZ2VcbmV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IGdxbGBcbiAgdHlwZSBRdWVyeSB7XG4gICAgXCJcIlwiXG4gICAgQSB0ZXN0IG1lc3NhZ2UuXG4gICAgXCJcIlwiXG4gICAgdGVzdE1lc3NhZ2U6IFN0cmluZyFcbiAgfVxuYDtcbi8vIFByb3ZpZGUgcmVzb2x2ZXIgZnVuY3Rpb25zIGZvciB5b3VyIHNjaGVtYSBmaWVsZHNcbmV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSB7XG4gIFF1ZXJ5OiB7XG4gICAgdGVzdE1lc3NhZ2U6ICgpID0+ICdIZWxsbyBXb3JsZCEnLFxuICB9LFxufTtcblxuXG5jb25zdCBhcG9sbG9TZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzLCB0eXBlRGVmcyB9KTtcblxuXG5leHBvcnQgY29uc3QgZ3JhcGhxbEhhbmRsZXIgPSBhcG9sbG9TZXJ2ZXIuY3JlYXRlSGFuZGxlcigpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcG9sbG8tc2VydmVyLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9