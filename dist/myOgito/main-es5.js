function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
  /***/
  "./$$_lazy_route_resource lazy recursive":
  /*!******************************************************!*\
    !*** ./$$_lazy_route_resource lazy namespace object ***!
    \******************************************************/

  /*! no static exports found */

  /***/
  function $$_lazy_route_resourceLazyRecursive(module, exports) {
    function webpackEmptyAsyncContext(req) {
      // Here Promise.resolve().then() is used instead of new Promise() to prevent
      // uncaught exception popping up in devtools
      return Promise.resolve().then(function () {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      });
    }

    webpackEmptyAsyncContext.keys = function () {
      return [];
    };

    webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
    module.exports = webpackEmptyAsyncContext;
    webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
    /***/
  },

  /***/
  "./src/app/app-configuration.ts":
  /*!**************************************!*\
    !*** ./src/app/app-configuration.ts ***!
    \**************************************/

  /*! exports provided: AppConfiguration */

  /***/
  function srcAppAppConfigurationTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppConfiguration", function () {
      return AppConfiguration;
    });

    var AppConfiguration = function AppConfiguration() {
      _classCallCheck(this, AppConfiguration);
    };

    AppConfiguration.qGsServerUrl = 'http://localhost/qgis/qgis_mapserv.fcgi.exe?';
    AppConfiguration.wmsVersion = '1.3.0';
    AppConfiguration.wfsVersion = '2.0';
    AppConfiguration.wmtsVersion = '1.0.0';
    AppConfiguration.qgsProject = 'qgs_projects/DenaiLama/mappingDenaiLama.qgs'; //mappingDenaiLama

    AppConfiguration.srsName = 'EPSG:32647'; // tomarlo de aqui o del projecto?
    // la ruta para accederlo dentro de la app

    AppConfiguration.curProject = 'http://localhost/' + AppConfiguration.qgsProject; // to fecth the xml project file

    AppConfiguration.svgFolder = '../../assets/svg/';
    AppConfiguration.qgsProjectFolder = 'D:/PhD/code/fromScratch/myOgito/src/assets/'; // la ruta para accederlo desde Qgs Server

    AppConfiguration.QgsFileProject = AppConfiguration.qgsProjectFolder + AppConfiguration.qgsProject; // to use with tqhe qgis server

    AppConfiguration.mapZoom = 13;
    AppConfiguration.maxZoom = 20;
    AppConfiguration.minZoom = 8;
    AppConfiguration.threshold = 1000; // Distance in meter to close a polygon being drawn with a line.

    /***/
  },

  /***/
  "./src/app/app-routing.module.ts":
  /*!***************************************!*\
    !*** ./src/app/app-routing.module.ts ***!
    \***************************************/

  /*! exports provided: AppRoutingModule */

  /***/
  function srcAppAppRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function () {
      return AppRoutingModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _home_home_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./home/home.component */
    "./src/app/home/home.component.ts");

    var routes = [{
      path: '',
      component: _home_home_component__WEBPACK_IMPORTED_MODULE_2__["HomeComponent"]
    }, {
      path: '**',
      redirectTo: ''
    }];

    var AppRoutingModule = function AppRoutingModule() {
      _classCallCheck(this, AppRoutingModule);
    };

    AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
    AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function AppRoutingModule_Factory(t) {
        return new (t || AppRoutingModule)();
      },
      imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, {
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/app.component.ts":
  /*!**********************************!*\
    !*** ./src/app/app.component.ts ***!
    \**********************************/

  /*! exports provided: AppComponent */

  /***/
  function srcAppAppComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
      return AppComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");

    var AppComponent = function AppComponent() {
      _classCallCheck(this, AppComponent);

      this.title = 'myOgito';
    };

    AppComponent.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)();
    };

    AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 1,
      vars: 0,
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
        }
      },
      directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */", "[_nghost-%COMP%] {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n    font-size: 14px;\n    color: #333;\n    box-sizing: border-box;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n\n  h1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%], h5[_ngcontent-%COMP%], h6[_ngcontent-%COMP%] {\n    margin: 8px 0;\n  }\n\n  p[_ngcontent-%COMP%] {\n    margin: 0;\n  }\n\n  .spacer[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n\n  .toolbar[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 40px;\n    display: flex;\n    align-items: center;\n    background-color: #1976d2;\n    color: white;\n    font-weight: 600;\n  }\n\n  .toolbar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    margin: 0 16px;\n  }\n\n  .toolbar[_ngcontent-%COMP%]   #twitter-logo[_ngcontent-%COMP%] {\n    height: 40px;\n    margin: 0 16px;\n  }\n\n  .toolbar[_ngcontent-%COMP%]   #twitter-logo[_ngcontent-%COMP%]:hover {\n    opacity: 0.8;\n  }\n\n  .content[_ngcontent-%COMP%] {\n    display: flex;\n    margin: 82px auto 32px;\n    padding: 0 16px;\n    max-width: 960px;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  svg.material-icons[_ngcontent-%COMP%] {\n    height: 24px;\n    width: auto;\n  }\n\n  svg.material-icons[_ngcontent-%COMP%]:not(:last-child) {\n    margin-right: 8px;\n  }\n\n  .card[_ngcontent-%COMP%]   svg.material-icons[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {\n    fill: #888;\n  }\n\n  .card-container[_ngcontent-%COMP%] {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: center;\n    margin-top: 16px;\n  }\n\n  .card[_ngcontent-%COMP%] {\n    border-radius: 4px;\n    border: 1px solid #eee;\n    background-color: #fafafa;\n    height: 40px;\n    width: 200px;\n    margin: 0 8px 16px;\n    padding: 16px;\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: center;\n    transition: all 0.2s ease-in-out;\n    line-height: 24px;\n  }\n\n  .card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(:last-child) {\n    margin-right: 0;\n  }\n\n  .card.card-small[_ngcontent-%COMP%] {\n    height: 16px;\n    width: 168px;\n  }\n\n  .card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card) {\n    cursor: pointer;\n  }\n\n  .card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card):hover {\n    transform: translateY(-3px);\n    box-shadow: 0 4px 17px rgba(0, 0, 0, 0.35);\n  }\n\n  .card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card):hover   .material-icons[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {\n    fill: rgb(105, 103, 103);\n  }\n\n  .card.highlight-card[_ngcontent-%COMP%] {\n    background-color: #1976d2;\n    color: white;\n    font-weight: 600;\n    border: none;\n    width: auto;\n    min-width: 30%;\n    position: relative;\n  }\n\n  .card.card.highlight-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    margin-left: 60px;\n  }\n\n  svg#rocket[_ngcontent-%COMP%] {\n    width: 80px;\n    position: absolute;\n    left: -10px;\n    top: -24px;\n  }\n\n  svg#rocket-smoke[_ngcontent-%COMP%] {\n    height: calc(100vh - 95px);\n    position: absolute;\n    top: 10px;\n    right: 180px;\n    z-index: -10;\n  }\n\n  a[_ngcontent-%COMP%], a[_ngcontent-%COMP%]:visited, a[_ngcontent-%COMP%]:hover {\n    color: #1976d2;\n    text-decoration: none;\n  }\n\n  a[_ngcontent-%COMP%]:hover {\n    color: #125699;\n  }\n\n  .terminal[_ngcontent-%COMP%] {\n    position: relative;\n    width: 80%;\n    max-width: 600px;\n    border-radius: 6px;\n    padding-top: 45px;\n    margin-top: 8px;\n    overflow: hidden;\n    background-color: rgb(15, 15, 16);\n  }\n\n  .terminal[_ngcontent-%COMP%]::before {\n    content: \"\\2022 \\2022 \\2022\";\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 4px;\n    background: rgb(58, 58, 58);\n    color: #c2c3c4;\n    width: 100%;\n    font-size: 2rem;\n    line-height: 0;\n    padding: 14px 0;\n    text-indent: 4px;\n  }\n\n  .terminal[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%] {\n    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;\n    color: white;\n    padding: 0 1rem 1rem;\n    margin: 0;\n  }\n\n  .circle-link[_ngcontent-%COMP%] {\n    height: 40px;\n    width: 40px;\n    border-radius: 40px;\n    margin: 8px;\n    background-color: white;\n    border: 1px solid #eeeeee;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n    transition: 1s ease-out;\n  }\n\n  .circle-link[_ngcontent-%COMP%]:hover {\n    transform: translateY(-0.25rem);\n    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);\n  }\n\n  footer[_ngcontent-%COMP%] {\n    margin-top: 8px;\n    display: flex;\n    align-items: center;\n    line-height: 20px;\n  }\n\n  footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n  }\n\n  .github-star-badge[_ngcontent-%COMP%] {\n    color: #24292e;\n    display: flex;\n    align-items: center;\n    font-size: 12px;\n    padding: 3px 10px;\n    border: 1px solid rgba(27,31,35,.2);\n    border-radius: 3px;\n    background-image: linear-gradient(-180deg,#fafbfc,#eff3f6 90%);\n    margin-left: 4px;\n    font-weight: 600;\n    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;\n  }\n\n  .github-star-badge[_ngcontent-%COMP%]:hover {\n    background-image: linear-gradient(-180deg,#f0f3f6,#e6ebf1 90%);\n    border-color: rgba(27,31,35,.35);\n    background-position: -.5em;\n  }\n\n  .github-star-badge[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n    height: 16px;\n    width: 16px;\n    margin-right: 4px;\n  }\n\n  svg#clouds[_ngcontent-%COMP%] {\n    position: fixed;\n    bottom: -160px;\n    left: -230px;\n    z-index: -10;\n    width: 1920px;\n  }\n\n\n  \n  @media screen and (max-width: 767px) {\n\n    .card-container[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]:not(.circle-link), .terminal[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .card[_ngcontent-%COMP%]:not(.highlight-card) {\n      height: 16px;\n      margin: 8px 0;\n    }\n\n    .card.highlight-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n      margin-left: 72px;\n    }\n\n    svg#rocket-smoke[_ngcontent-%COMP%] {\n      right: 120px;\n      transform: rotate(-5deg);\n    }\n  }\n\n  @media screen and (max-width: 575px) {\n    svg#rocket-smoke[_ngcontent-%COMP%] {\n      display: none;\n      visibility: hidden;\n    }\n  }"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.scss']
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/app.module.ts":
  /*!*******************************!*\
    !*** ./src/app/app.module.ts ***!
    \*******************************/

  /*! exports provided: AppModule */

  /***/
  function srcAppAppModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppModule", function () {
      return AppModule;
    });
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./app-routing.module */
    "./src/app/app-routing.module.ts");
    /* harmony import */


    var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./app.component */
    "./src/app/app.component.ts");
    /* harmony import */


    var _map_map_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./map/map.component */
    "./src/app/map/map.component.ts");
    /* harmony import */


    var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/platform-browser/animations */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/animations.js");
    /* harmony import */


    var _home_home_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./home/home.component */
    "./src/app/home/home.component.ts");
    /* harmony import */


    var _material_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./material-module */
    "./src/app/material-module.ts");
    /* harmony import */


    var _editing_toolbar_editing_toolbar_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./editing-toolbar/editing-toolbar.component */
    "./src/app/editing-toolbar/editing-toolbar.component.ts");
    /* harmony import */


    var _layer_panel_layer_panel_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ./layer-panel/layer-panel.component */
    "./src/app/layer-panel/layer-panel.component.ts");
    /* harmony import */


    var _symbol_list_symbol_list_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ./symbol-list/symbol-list.component */
    "./src/app/symbol-list/symbol-list.component.ts");
    /* harmony import */


    var _toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! ./toolbar/toolbar.component */
    "./src/app/toolbar/toolbar.component.ts");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");

    var AppModule = function AppModule() {
      _classCallCheck(this, AppModule);
    };

    AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
    });
    AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      factory: function AppModule_Factory(t) {
        return new (t || AppModule)();
      },
      providers: [_layer_panel_layer_panel_component__WEBPACK_IMPORTED_MODULE_9__["LayerPanelComponent"]],
      imports: [[_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_5__["BrowserAnimationsModule"], _material_module__WEBPACK_IMPORTED_MODULE_7__["DemoMaterialModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_12__["FormsModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["HammerModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_13__["HttpClientModule"]]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, {
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"], _map_map_component__WEBPACK_IMPORTED_MODULE_4__["MapComponent"], _home_home_component__WEBPACK_IMPORTED_MODULE_6__["HomeComponent"], _editing_toolbar_editing_toolbar_component__WEBPACK_IMPORTED_MODULE_8__["EditingToolbarComponent"], _layer_panel_layer_panel_component__WEBPACK_IMPORTED_MODULE_9__["LayerPanelComponent"], _symbol_list_symbol_list_component__WEBPACK_IMPORTED_MODULE_10__["SymbolListComponent"], _toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_11__["ToolbarComponent"]],
        imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_5__["BrowserAnimationsModule"], _material_module__WEBPACK_IMPORTED_MODULE_7__["DemoMaterialModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_12__["FormsModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["HammerModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_13__["HttpClientModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
          declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"], _map_map_component__WEBPACK_IMPORTED_MODULE_4__["MapComponent"], _home_home_component__WEBPACK_IMPORTED_MODULE_6__["HomeComponent"], _editing_toolbar_editing_toolbar_component__WEBPACK_IMPORTED_MODULE_8__["EditingToolbarComponent"], _layer_panel_layer_panel_component__WEBPACK_IMPORTED_MODULE_9__["LayerPanelComponent"], _symbol_list_symbol_list_component__WEBPACK_IMPORTED_MODULE_10__["SymbolListComponent"], _toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_11__["ToolbarComponent"]],
          imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_5__["BrowserAnimationsModule"], _material_module__WEBPACK_IMPORTED_MODULE_7__["DemoMaterialModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_12__["FormsModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["HammerModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_13__["HttpClientModule"]],
          providers: [_layer_panel_layer_panel_component__WEBPACK_IMPORTED_MODULE_9__["LayerPanelComponent"]],
          bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/editing-toolbar/editing-toolbar.component.ts":
  /*!**************************************************************!*\
    !*** ./src/app/editing-toolbar/editing-toolbar.component.ts ***!
    \**************************************************************/

  /*! exports provided: EditingToolbarComponent */

  /***/
  function srcAppEditingToolbarEditingToolbarComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "EditingToolbarComponent", function () {
      return EditingToolbarComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/material/icon */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
    /* harmony import */


    var _open_layers_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../open-layers.service */
    "./src/app/open-layers.service.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _angular_material_card__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/material/card */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
    /* harmony import */


    var _angular_material_divider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/material/divider */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
    /* harmony import */


    var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! @angular/material/toolbar */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/toolbar.js");
    /* harmony import */


    var _angular_material_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/material/button */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
    /* harmony import */


    var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! @angular/material/tooltip */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");

    var _c0 = ["symbolList"];

    function EditingToolbarComponent_div_0_button_4_Template(rf, ctx) {
      if (rf & 1) {
        var _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 26);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_button_4_Template_button_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8);

          var ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r7.drawingShapes("Point");
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "add_location");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r2.actionActive["Point"] ? "active" : "normal");
      }
    }

    function EditingToolbarComponent_div_0_button_5_Template(rf, ctx) {
      if (rf & 1) {
        var _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 27);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_button_5_Template_button_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r10);

          var ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r9.drawingShapes("LineString");
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "mat-icon", 28);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r3.actionActive["LineString"] ? "active" : "normal");
      }
    }

    function EditingToolbarComponent_div_0_button_6_Template(rf, ctx) {
      if (rf & 1) {
        var _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 29);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_button_6_Template_button_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r12);

          var ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r11.drawingShapes("Polygon");
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "mat-icon", 30);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r4.actionActive["Polygon"] ? "active" : "normal");
      }
    }

    function EditingToolbarComponent_div_0_button_7_Template(rf, ctx) {
      if (rf & 1) {
        var _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 31);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_button_7_Template_button_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r14);

          var ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r13.drawingShapes("Square");
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "crop_square");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r5.actionActive["Square"] ? "active" : "normal");
      }
    }

    function EditingToolbarComponent_div_0_button_8_Template(rf, ctx) {
      if (rf & 1) {
        var _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 32);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_button_8_Template_button_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r16);

          var ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r15.drawingShapes("Circle");
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "radio_button_unchecked");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r6.actionActive["Circle"] ? "active" : "normal");
      }
    }

    function EditingToolbarComponent_div_0_Template(rf, ctx) {
      if (rf & 1) {
        var _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("panstart", function EditingToolbarComponent_div_0_Template_div_panstart_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r17.onPanStart($event);
        })("panmove", function EditingToolbarComponent_div_0_Template_div_panmove_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r19.onPan($event);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "mat-divider", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-toolbar");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, EditingToolbarComponent_div_0_button_4_Template, 3, 1, "button", 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, EditingToolbarComponent_div_0_button_5_Template, 2, 1, "button", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, EditingToolbarComponent_div_0_button_6_Template, 2, 1, "button", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, EditingToolbarComponent_div_0_button_7_Template, 3, 1, "button", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, EditingToolbarComponent_div_0_button_8_Template, 3, 1, "button", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "button", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_9_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          ctx_r20.startEditAction("ModifyBox");
          return ctx_r20.showSymbolPanel(false);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "mat-icon", 9);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "button", 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_11_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          ctx_r21.startEditAction("Copy");
          return ctx_r21.showSymbolPanel(false);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "content_copy");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "button", 11);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_14_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          ctx_r22.startEditAction("Rotate");
          return ctx_r22.showSymbolPanel(false);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "rotate_right");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "button", 12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_17_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          ctx_r23.startEditAction("Measure");
          return ctx_r23.showSymbolPanel(false);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "straighten");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "button", 13);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_20_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          ctx_r24.startEditAction("Delete");
          return ctx_r24.showSymbolPanel(false);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "delete_forever");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "button", 14);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_23_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          ctx_r25.startEditAction("Identify");
          return ctx_r25.showSymbolPanel(false);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "mat-icon", 15);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "button", 16);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_25_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          ctx_r26.startEditAction("Identify");
          return ctx_r26.showSymbolPanel(false);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "search");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "button", 17);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_28_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r27.startEditAction("Undo");
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "undo");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "button", 18);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_31_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r28.showSymbolPanel(true);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "mat-icon", 19);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "category");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "button", 20);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_34_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r29.saveLayer();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "save_alt");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "button", 21);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_37_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r30.saveAllLayer();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "save");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "span", 22);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 23);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "button", 24);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EditingToolbarComponent_div_0_Template_button_click_42_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18);

          var ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r31.closeEditingToolbar();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "mat-icon", 25);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "close");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("left", ctx_r1.x, "px")("top", ctx_r1.y, "px");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("vertical", true);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.layerTypeEdit$ == "Point" || ctx_r1.layerTypeEdit$ == "Multi");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.layerTypeEdit$ == "Line" || ctx_r1.layerTypeEdit$ == "Multi" || ctx_r1.layerTypeEdit$ == "Polygon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.layerTypeEdit$ == "Polygon" || ctx_r1.layerTypeEdit$ == "Multi");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.layerTypeEdit$ == "Polygon" || ctx_r1.layerTypeEdit$ == "Multi");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.layerTypeEdit$ == "Polygon" || ctx_r1.layerTypeEdit$ == "Multi");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.actionActive["ModifyBox"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.actionActive["Copy"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.actionActive["Rotate"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.actionActive["Measure"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.actionActive["Delete"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.actionActive["Identify"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.actionActive["Search"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.actionActive["showSymbols"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r1.stopSave);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r1.stopSaveAll);
      }
    }

    var EditingToolbarComponent = /*#__PURE__*/function () {
      function EditingToolbarComponent(iconRegistry, sanitizer, openLayersService) {
        var _this = this;

        _classCallCheck(this, EditingToolbarComponent);

        this.openLayersService = openLayersService;
        this.x = 0;
        this.y = 0;
        this.startX = 0;
        this.startY = 0;
        this.stopSave = false;
        this.stopSaveAll = false;
        this.actionActive = {
          Point: false,
          LineString: false,
          Polygon: false,
          Square: false,
          Box: false,
          Circle: false,
          ModifyBox: false,
          Rotate: false,
          Copy: false,
          Identify: false,
          Delete: false,
          Measure: false
        };
        iconRegistry.addSvgIcon('add_line', sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-line-nodes-24px.svg'));
        iconRegistry.addSvgIcon('selectBoxFeature', sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-select-box2-24px.svg'));
        iconRegistry.addSvgIcon('add_poly', sanitizer.bypassSecurityTrustResourceUrl('assets/img/add-poly-layer24px.svg'));
        iconRegistry.addSvgIcon('identify', sanitizer.bypassSecurityTrustResourceUrl('assets/img/identify-24px.svg'));
        this.subsToShowEditToolbar = this.openLayersService.showEditToolbar$.subscribe(function (data) {
          _this.showToolbar(data);
        }, function (error) {
          console.log('Error in subscription to openLayersService.showEditToolbar$');
        });
        this.subsToGeomTypeEditing = this.openLayersService.layerEditing$.subscribe(function (data) {
          // console.log('data aqui', data);
          _this.updateLayerTypeEdit(data.layerGeom);
        }, function (error) {
          console.log('Error in subscription openLayersService.geomTypeEditing$');
        });
      }

      _createClass(EditingToolbarComponent, [{
        key: "onPanStart",
        value: function onPanStart(event) {
          this.startX = this.x;
          this.startY = this.y;
        }
      }, {
        key: "onPan",
        value: function onPan(event) {
          event.preventDefault();
          this.x = this.startX + event.deltaX;
          this.y = this.startY + event.deltaY;
        }
      }, {
        key: "closeEditingToolbar",
        value: function closeEditingToolbar() {
          this.isVisible$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        }
      }, {
        key: "updateLayerTypeEdit",
        value: function updateLayerTypeEdit(geomType) {
          /** Updates the observable layerTypeEdit$ that is used in the page to show editing symbols according to the
           * geometry type of the layer
           * @param geomType: string indicating the geometry type
           */
          this.layerTypeEdit$ = geomType; // console.log('this.layerTypeEdit$', this.layerTypeEdit$);
        }
      }, {
        key: "drawingShapes",
        value: function drawingShapes(shapeType) {
          /**
           *   Updates the observable in services to remove the interaction
           */
          if (true === this.actionActive[shapeType]) {
            // The layer was on editing
            this.openLayersService.updateShapeEditType(null); //

            this.showSymbolPanel(false);
          } else {
            this.openLayersService.updateShapeEditType(shapeType);
            this.showSymbolPanel(true);
          }

          this.highlightAction(shapeType);
        }
      }, {
        key: "highlightAction",
        value: function highlightAction(action) {
          // update the current action
          this.actionActive[action] = !this.actionActive[action]; // change the rest of interactions to false

          for (var key in this.actionActive) {
            // console.log("otra...this.actionActive[key]",key,this.actionActive[key]);
            if (key !== action && true === this.actionActive[key]) {
              this.actionActive[key] = !this.actionActive[key];
            }
          }
        }
      }, {
        key: "startEditAction",
        value: function startEditAction(action) {
          /**
           * Select with a rectangle
           */
          if (true === this.actionActive[action]) {
            // action was active --> it must be stopped
            // console.log('que entra.. action', action, this.actionActive[action],true === this.actionActive[action]);
            this.openLayersService.updateEditAction(null);
          } else {
            this.openLayersService.updateEditAction(action);
          } // add an observable to control enable
          // this.openLayersService.updateEditAction(action);


          this.highlightAction(action);
        } // identifyFeatures(){

        /**
         * Identify Feautures, the user select element(s) and the information is retrieved
         */

        /*  alert("add Code to identify Features");
         }
        copiarFeatures(){
          /**
           * Copiar Features, the user select element(s) and paste in the location when the click is released
           */
        //alert("add Code to copiar Features");

        /*}
        rotateFeatures(){
          /**
           * Rotate
           */
        // alert("add Code to rotate Features");

        /*}
        measureDistance(){
          /**
           * Measure Distance
           */

        /* alert("add Code to measure Distance");
        } */

      }, {
        key: "showSymbolPanel",
        value: function showSymbolPanel(visible) {
          /**
           * Updates the observable that allows to show/hide the symbolPanel
           */
          // #TODO add a validation to know if is visible or not?
          this.openLayersService.updateShowSymbolPanel(visible);
        }
      }, {
        key: "deleteFeat",
        value: function deleteFeat(action) {
          // #TODO remove the code was change to emit one event.

          /**
           * Updates the observable that allows to start deleting in the map,
           * highlight the button and unselect the others
           */
          if (true === this.actionActive.Delete) {
            // The deleting was active
            // console.log ("stop interaction de delete", this.actionActive['delete']);
            this.openLayersService.updateDeleteFeats(false); //
          } else {
            this.openLayersService.updateDeleteFeats(true);
            console.log('first time here');
          }

          this.highlightAction('Delete');
        }
      }, {
        key: "saveLayer",
        value: function saveLayer() {
          var _this2 = this;

          /** Enable user to save edit in the layer being updated the observable to show the editing toolbar and
           */
          if (confirm('Do you want to save edits in the current layer:?')) {
            this.openLayersService.updateSaveCurrentLayer(true); // disable the button

            this.stopSave = true; // add a timeout to enable the button

            setTimeout(function () {
              _this2.stopSave = false;
            }, 10000);
          }
        }
      }, {
        key: "saveAllLayer",
        value: function saveAllLayer() {
          var _this3 = this;

          alert('Add here the code to save all edits in all layers');
          /** Enable user to save edit in all the layers
           */

          if (confirm('Do you want to save all the edits in the all layers:?')) {
            // this.openLayersService.updateSaveCurrentLayer(true);
            // disable the button
            this.stopSaveAll = true; // add a timeout to enable the button

            setTimeout(function () {
              _this3.stopSaveAll = false;
            }, 10000);
          }
        }
      }, {
        key: "undoEdit",
        value: function undoEdit(data) {}
      }, {
        key: "ngOnInit",
        value: function ngOnInit() {
          this.isVisible$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        }
      }, {
        key: "showToolbar",
        value: function showToolbar(visible) {
          /** Updates the observable to show the editing toolbar
           *  @param visible: boolean
           */
          this.isVisible$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(visible); // desactivar todas las actions??

          for (var key in this.actionActive) {
            // console.log("showing fresh tool ]",key,this.actionActive[key]);
            if (true === this.actionActive[key]) {
              this.actionActive[key] = !this.actionActive[key];
            }
          }
        }
      }]);

      return EditingToolbarComponent;
    }();

    EditingToolbarComponent.ɵfac = function EditingToolbarComponent_Factory(t) {
      return new (t || EditingToolbarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconRegistry"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["DomSanitizer"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_open_layers_service__WEBPACK_IMPORTED_MODULE_4__["OpenLayersService"]));
    };

    EditingToolbarComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: EditingToolbarComponent,
      selectors: [["app-editing-toolbar"]],
      viewQuery: function EditingToolbarComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, true);
        }

        if (rf & 2) {
          var _t;

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.symbolList = _t.first);
        }
      },
      decls: 2,
      vars: 3,
      consts: [["class", "editToolbar", 3, "left", "top", "panstart", "panmove", 4, "ngIf"], [1, "editToolbar", 3, "panstart", "panmove"], [3, "vertical"], ["mat-icon-button", "", "matTooltip", "Add point/marker", 3, "ngClass", "click", 4, "ngIf"], ["mat-icon-button", "", "matTooltip", "Add line", 3, "ngClass", "click", 4, "ngIf"], ["mat-icon-button", "", "matTooltip", "Add polygon", 3, "ngClass", "click", 4, "ngIf"], ["mat-icon-button", "", "matTooltip", "Add Square", 3, "ngClass", "click", 4, "ngIf"], ["mat-icon-button", "", "matTooltip", "Add Circle", 3, "ngClass", "click", 4, "ngIf"], ["mat-icon-button", "", "matTooltip", "Select element(s)", 3, "ngClass", "click"], ["svgIcon", "selectBoxFeature"], ["mat-icon-button", "", "matTooltip", "Copiar element(s)", 3, "ngClass", "click"], ["mat-icon-button", "", "matTooltip", "Rotate element(s)", 3, "ngClass", "click"], ["mat-icon-button", "", "matTooltip", "Measure Distance", 3, "ngClass", "click"], ["mat-icon-button", "", "aria-label", "delete", "matTooltip", "Delete element", 3, "ngClass", "click"], ["mat-icon-button", "", "aria-label", "identify", "matTooltip", "Identify element", 3, "ngClass", "click"], ["svgIcon", "identify"], ["mat-icon-button", "", "aria-label", "identify", "matTooltip", "Search in map", 3, "ngClass", "click"], ["mat-icon-button", "", "aria-label", "UndoLastEdit", "matTooltip", "Undo", 3, "click"], ["mat-icon-button", "", "matTooltip", "Select/Change symbol", 3, "ngClass", "click"], ["aria-label", ""], ["mat-icon-button", "", "matTooltip", "Save all edits into the layers/disable pending #TODO", 3, "disabled", "click"], ["mat-icon-button", "", "matTooltip", "Save all edits in all layers", 3, "disabled", "click"], [1, "spacer"], [1, "divClosing"], ["mat-mini-fab", "", 1, "matCloseWrapper", 3, "click"], [1, "closeIcon"], ["mat-icon-button", "", "matTooltip", "Add point/marker", 3, "ngClass", "click"], ["mat-icon-button", "", "matTooltip", "Add line", 3, "ngClass", "click"], ["svgIcon", "add_line"], ["mat-icon-button", "", "matTooltip", "Add polygon", 3, "ngClass", "click"], ["svgIcon", "add_poly"], ["mat-icon-button", "", "matTooltip", "Add Square", 3, "ngClass", "click"], ["mat-icon-button", "", "matTooltip", "Add Circle", 3, "ngClass", "click"]],
      template: function EditingToolbarComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, EditingToolbarComponent_div_0_Template, 45, 20, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](1, "async");
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](1, 1, ctx.isVisible$));
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_6__["MatCard"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_7__["MatDivider"], _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_8__["MatToolbar"], _angular_material_button__WEBPACK_IMPORTED_MODULE_9__["MatButton"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_10__["MatTooltip"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgClass"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIcon"]],
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["AsyncPipe"]],
      styles: [".editToolbar[_ngcontent-%COMP%] {\n  z-index: 2;\n  #width: 3%;\n  max-width: 45%;\n  margin-left: 25%;\n  margin-top: 5%;\n  flex-direction: row;\n  position: absolute;\n  border-radius: 3px;\n}\n\n.editToolbar[_ngcontent-%COMP%]:hover {\n  cursor: pointer;\n}\n\n.mat-toolbar[_ngcontent-%COMP%] {\n  flex-direction: row;\n  height: 100%;\n}\n\n.mat-toolbar[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover {\n  background-color: #e35183;\n}\n\n.closeIcon[_ngcontent-%COMP%] {\n  font-size: 0.8vw;\n  text-align: center;\n  vertical-align: top !important;\n  width: 1.5vw !important;\n  height: 1.5vw !important;\n  padding-top: 0;\n  margin-top: 0;\n  padding-right: 0;\n}\n\n.closeIcon[_ngcontent-%COMP%]:hover {\n  background-color: #fff2e1 !important;\n}\n\n.matCloseWrapper[_ngcontent-%COMP%] {\n  padding: 0 0 0 0;\n  width: 1.7vw !important;\n  height: 1.7vw !important;\n}\n\n.mat-card[_ngcontent-%COMP%] {\n  padding: 1px 1px;\n}\n\n.divClosing[_ngcontent-%COMP%] {\n  float: right;\n  height: 100%;\n}\n\n.editingTools[_ngcontent-%COMP%] {\n  float: left;\n  height: 100%;\n  background-color: white;\n}\n\n.spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n\n.active[_ngcontent-%COMP%] {\n  background: #e35183;\n}\n\n.toolbarDivider[_ngcontent-%COMP%] {\n  background-color: #e35183;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZWRpdGluZy10b29sYmFyL0Q6XFxQaERcXGNvZGVcXGZyb21TY3JhdGNoXFxteU9naXRvL3NyY1xcYXBwXFxlZGl0aW5nLXRvb2xiYXJcXGVkaXRpbmctdG9vbGJhci5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvZWRpdGluZy10b29sYmFyL2VkaXRpbmctdG9vbGJhci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFVBQUE7RUFDQSxVQUFBO0VBQ0EsY0FBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtBQ0NGOztBREVBO0VBQ0UsZUFBQTtBQ0NGOztBRENBO0VBQ0UsbUJBQUE7RUFDQSxZQUFBO0FDRUY7O0FEQ0E7RUFDRSx5QkFBQTtBQ0VGOztBREFBO0VBQ0UsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLDhCQUFBO0VBQ0EsdUJBQUE7RUFDQSx3QkFBQTtFQUNBLGNBQUE7RUFDQSxhQUFBO0VBQ0EsZ0JBQUE7QUNHRjs7QUREQTtFQUNFLG9DQUFBO0FDSUY7O0FERkE7RUFDRSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0Esd0JBQUE7QUNLRjs7QURGQTtFQUNFLGdCQUFBO0FDS0Y7O0FESEE7RUFDRSxZQUFBO0VBQ0EsWUFBQTtBQ01GOztBREpBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtBQ09GOztBRExBO0VBQ0UsY0FBQTtBQ1FGOztBRE5BO0VBQ0UsbUJBQUE7QUNTRjs7QURQQTtFQUNFLHlCQUFBO0FDVUYiLCJmaWxlIjoic3JjL2FwcC9lZGl0aW5nLXRvb2xiYXIvZWRpdGluZy10b29sYmFyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmVkaXRUb29sYmFye1xyXG4gIHotaW5kZXg6IDI7XHJcbiAgI3dpZHRoOiAzJTsgIC8vMyVcclxuICBtYXgtd2lkdGg6IDQ1JTtcclxuICBtYXJnaW4tbGVmdDogMjUlOyAgLy85NSVcclxuICBtYXJnaW4tdG9wOjUlO1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICAvL2JhY2tncm91bmQtY29sb3I6ICNhZDE0NTchaW1wb3J0YW50OyAgIC8vc2FtZSB0aGF0IHByaW1hcnkgY29sb3JcclxufVxyXG4uZWRpdFRvb2xiYXI6aG92ZXIge1xyXG4gIGN1cnNvcjpwb2ludGVyO1xyXG59XHJcbi5tYXQtdG9vbGJhciB7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICBoZWlnaHQ6IDEwMCU7IC8vMTAwJSBvZiB0aGUgcGFyZW50IChkaXYpXHJcbiAgLy8gdGhlIHByaW1hcnkgY29sb3Igb2YgdGhlIHRoZW1lXHJcbn1cclxuLm1hdC10b29sYmFyIDpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UzNTE4MzsgIC8vdG8gZm9jdXMgdGhlIGljb25zXHJcbn1cclxuLmNsb3NlSWNvbiB7XHJcbiAgZm9udC1zaXplOiAwLjh2dztcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgdmVydGljYWwtYWxpZ246IHRvcCAhaW1wb3J0YW50O1xyXG4gIHdpZHRoOiAxLjV2dyAhaW1wb3J0YW50O1xyXG4gIGhlaWdodDogIDEuNXZ3ICFpbXBvcnRhbnQ7XHJcbiAgcGFkZGluZy10b3A6IDA7XHJcbiAgbWFyZ2luLXRvcDogMDtcclxuICBwYWRkaW5nLXJpZ2h0OiAwO1xyXG4gfVxyXG4uY2xvc2VJY29uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmMmUxICFpbXBvcnRhbnQ7XHJcbn1cclxuLm1hdENsb3NlV3JhcHBlcntcclxuICBwYWRkaW5nOiAwIDAgMCAwO1xyXG4gIHdpZHRoOiAxLjd2dyAhaW1wb3J0YW50O1xyXG4gIGhlaWdodDogMS43dncgIWltcG9ydGFudDtcclxuICAvLyBsaW5lLWhlaWdodDogMThweCAhaW1wb3J0YW50O1xyXG59XHJcbi5tYXQtY2FyZHtcclxuICBwYWRkaW5nOjFweCAxcHg7XHJcbn1cclxuLmRpdkNsb3Npbmd7XHJcbiAgZmxvYXQ6IHJpZ2h0O1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG4uZWRpdGluZ1Rvb2xze1xyXG4gIGZsb2F0OmxlZnQ7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG59XHJcbi5zcGFjZXIge1xyXG4gIGZsZXg6IDEgMSBhdXRvO1xyXG59XHJcbi5hY3RpdmUge1xyXG4gIGJhY2tncm91bmQ6ICNlMzUxODM7ICAgLy9ncmVlbjtcclxufVxyXG4udG9vbGJhckRpdmlkZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNlMzUxODM7ICAvLyBmb3IgdGVzdGluZyAtLVxyXG59XHJcbiIsIi5lZGl0VG9vbGJhciB7XG4gIHotaW5kZXg6IDI7XG4gICN3aWR0aDogMyU7XG4gIG1heC13aWR0aDogNDUlO1xuICBtYXJnaW4tbGVmdDogMjUlO1xuICBtYXJnaW4tdG9wOiA1JTtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG59XG5cbi5lZGl0VG9vbGJhcjpob3ZlciB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLm1hdC10b29sYmFyIHtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4ubWF0LXRvb2xiYXIgOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UzNTE4Mztcbn1cblxuLmNsb3NlSWNvbiB7XG4gIGZvbnQtc2l6ZTogMC44dnc7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IHRvcCAhaW1wb3J0YW50O1xuICB3aWR0aDogMS41dncgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAxLjV2dyAhaW1wb3J0YW50O1xuICBwYWRkaW5nLXRvcDogMDtcbiAgbWFyZ2luLXRvcDogMDtcbiAgcGFkZGluZy1yaWdodDogMDtcbn1cblxuLmNsb3NlSWNvbjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmYyZTEgIWltcG9ydGFudDtcbn1cblxuLm1hdENsb3NlV3JhcHBlciB7XG4gIHBhZGRpbmc6IDAgMCAwIDA7XG4gIHdpZHRoOiAxLjd2dyAhaW1wb3J0YW50O1xuICBoZWlnaHQ6IDEuN3Z3ICFpbXBvcnRhbnQ7XG59XG5cbi5tYXQtY2FyZCB7XG4gIHBhZGRpbmc6IDFweCAxcHg7XG59XG5cbi5kaXZDbG9zaW5nIHtcbiAgZmxvYXQ6IHJpZ2h0O1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5lZGl0aW5nVG9vbHMge1xuICBmbG9hdDogbGVmdDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbn1cblxuLnNwYWNlciB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuXG4uYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogI2UzNTE4Mztcbn1cblxuLnRvb2xiYXJEaXZpZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UzNTE4Mztcbn0iXX0= */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](EditingToolbarComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-editing-toolbar',
          templateUrl: './editing-toolbar.component.html',
          styleUrls: ['./editing-toolbar.component.scss']
        }]
      }], function () {
        return [{
          type: _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconRegistry"]
        }, {
          type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["DomSanitizer"]
        }, {
          type: _open_layers_service__WEBPACK_IMPORTED_MODULE_4__["OpenLayersService"]
        }];
      }, {
        symbolList: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: ['symbolList', {
            "static": false
          }]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/home/home.component.ts":
  /*!****************************************!*\
    !*** ./src/app/home/home.component.ts ***!
    \****************************************/

  /*! exports provided: HomeComponent */

  /***/
  function srcAppHomeHomeComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HomeComponent", function () {
      return HomeComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/material/toolbar */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/toolbar.js");
    /* harmony import */


    var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/material/button */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
    /* harmony import */


    var _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/material/menu */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/menu.js");
    /* harmony import */


    var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/material/icon */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
    /* harmony import */


    var _map_map_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../map/map.component */
    "./src/app/map/map.component.ts");
    /* harmony import */


    var _toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../toolbar/toolbar.component */
    "./src/app/toolbar/toolbar.component.ts");
    /* harmony import */


    var _editing_toolbar_editing_toolbar_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ../editing-toolbar/editing-toolbar.component */
    "./src/app/editing-toolbar/editing-toolbar.component.ts");
    /* harmony import */


    var _symbol_list_symbol_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ../symbol-list/symbol-list.component */
    "./src/app/symbol-list/symbol-list.component.ts");

    var HomeComponent = /*#__PURE__*/function () {
      function HomeComponent() {
        _classCallCheck(this, HomeComponent);
      }

      _createClass(HomeComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "openProject",
        value: function openProject() {
          console.log('add code to open a QGs Project');
        }
      }, {
        key: "showInfo",
        value: function showInfo() {
          //alert("Aqui se muestra la info");
          alert("Your screen dimensions are: " + screen.width + "x" + screen.height);
        }
      }, {
        key: "editSettings",
        value: function editSettings() {
          // Here you can edit the project to be display
          console.log('add code to edit settings, e.g., project to edit..');
        }
      }, {
        key: "exitToApp",
        value: function exitToApp() {
          confirm("Exiting app");
        }
      }]);

      return HomeComponent;
    }();

    HomeComponent.ɵfac = function HomeComponent_Factory(t) {
      return new (t || HomeComponent)();
    };

    HomeComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: HomeComponent,
      selectors: [["app-home"]],
      decls: 28,
      vars: 1,
      consts: [[1, "toolbarWrapper"], ["role", "banner", 1, "toolbar"], ["color", "primary"], ["mat-icon-button", "", "aria-label", "Menu", 3, "matMenuTriggerFor"], ["myMenu", "matMenu"], ["mat-menu-item", "", "disabled", "", 3, "click"], ["mat-menu-item", "", 3, "click"], [1, "title"], [1, "spacer"], ["mat-icon-button", "", 3, "click"]],
      template: function HomeComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-toolbar", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "button", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "mat-icon");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "menu");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-menu", null, 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "button", 5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HomeComponent_Template_button_click_8_listener() {
            return ctx.editSettings();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "mat-icon");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "settings ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Settings");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "button", 6);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HomeComponent_Template_button_click_13_listener() {
            return ctx.showInfo();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "mat-icon");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "info ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "About");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "\xA0OGITO ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "span", 8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HomeComponent_Template_button_click_21_listener() {
            return ctx.exitToApp();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "mat-icon");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " exit_to_app");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "app-map");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "app-toolbar");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "app-editing-toolbar");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "app-symbol-list");
        }

        if (rf & 2) {
          var _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matMenuTriggerFor", _r0);
        }
      },
      directives: [_angular_material_toolbar__WEBPACK_IMPORTED_MODULE_1__["MatToolbar"], _angular_material_button__WEBPACK_IMPORTED_MODULE_2__["MatButton"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__["MatMenuTrigger"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__["MatIcon"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__["_MatMenu"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__["MatMenuItem"], _map_map_component__WEBPACK_IMPORTED_MODULE_5__["MapComponent"], _toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_6__["ToolbarComponent"], _editing_toolbar_editing_toolbar_component__WEBPACK_IMPORTED_MODULE_7__["EditingToolbarComponent"], _symbol_list_symbol_list_component__WEBPACK_IMPORTED_MODULE_8__["SymbolListComponent"]],
      styles: [".toolbar[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 7%;\n  display: flex;\n  align-items: center;\n  font-weight: 600;\n}\n\n.toolbarWrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 7%;\n}\n\n.title[_ngcontent-%COMP%] {\n  padding-left: 20px;\n}\n\n.spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n\n.mat-toolbar[_ngcontent-%COMP%] {\n  height: 100%;\n}\n\nfooter[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  display: flex;\n  align-items: center;\n  line-height: 20px;\n}\n\nfooter[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n\n.terminal[_ngcontent-%COMP%] {\n  position: relative;\n  width: 80%;\n  max-width: 600px;\n  border-radius: 6px;\n  padding-top: 45px;\n  margin-top: 8px;\n  overflow: hidden;\n  background-color: #0f0f10;\n}\n\n@media screen and (min-width: 900px) {\n  .mat-toolbar[_ngcontent-%COMP%] {\n    background-color: #78002e;\n  }\n\n  .mat-icon[_ngcontent-%COMP%] {\n    font-size: 24px;\n  }\n\n  .title[_ngcontent-%COMP%] {\n    padding-left: 5px;\n  }\n}\n\n@media screen and (min-width: 1400px) {\n  .mat-toolbar[_ngcontent-%COMP%] {\n    background-color: #ad1457;\n  }\n\n  .mat-icon[_ngcontent-%COMP%] {\n    font-size: 36px;\n  }\n}\n\n@media screen and (min-width: 1900px) {\n  .mat-toolbar[_ngcontent-%COMP%] {\n    background-color: darkred;\n  }\n  .mat-toolbar[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n    font-size: 48px;\n  }\n}\n\n@media screen and (min-width: 5200px) {\n  .mat-toolbar[_ngcontent-%COMP%] {\n    background-color: #e35183;\n  }\n  .mat-toolbar[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n    font-size: 72px;\n  }\n}\n\n@media screen and (min-width: 5800px) {\n  .mat-toolbar[_ngcontent-%COMP%] {\n    background-color: darkred;\n  }\n  .mat-toolbar[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n    font-size: 72px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaG9tZS9EOlxcUGhEXFxjb2RlXFxmcm9tU2NyYXRjaFxcbXlPZ2l0by9zcmNcXGFwcFxcaG9tZVxcaG9tZS5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvaG9tZS9ob21lLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0Usa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFFQSxVQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7QUNERjs7QURJQTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFVBQUE7QUNERjs7QURJQTtFQUNFLGtCQUFBO0FDREY7O0FER0E7RUFDRSxjQUFBO0FDQUY7O0FERUE7RUFDRSxZQUFBO0FDQ0Y7O0FEQ0E7RUFDRSxlQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7QUNFRjs7QURDQTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtBQ0VGOztBREVBO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EseUJBQUE7QUNDRjs7QURFQTtFQUNFO0lBQ0UseUJBQUE7RUNDRjs7RURDQTtJQUNFLGVBQUE7RUNFRjs7RURBQTtJQUNFLGlCQUFBO0VDR0Y7QUFDRjs7QURERTtFQUNFO0lBQ0UseUJBQUE7RUNHSjs7RURERTtJQUNJLGVBQUE7RUNJTjtBQUNGOztBREFFO0VBQ0U7SUFDRSx5QkFBQTtFQ0VKO0VEREk7SUFDRSxlQUFBO0VDR047QUFDRjs7QURFQTtFQUNFO0lBQ0UseUJBQUE7RUNBRjtFRENFO0lBQ0UsZUFBQTtFQ0NKO0FBQ0Y7O0FESUE7RUFDRTtJQUNFLHlCQUFBO0VDRkY7RURHRTtJQUNFLGVBQUE7RUNESjtBQUNGIiwiZmlsZSI6InNyYy9hcHAvaG9tZS9ob21lLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi50b29sYmFyIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgdG9wOiAwO1xyXG4gIGxlZnQ6IDA7XHJcbiAgcmlnaHQ6IDA7XHJcbiAgLy9oZWlnaHQ6IDQwcHg7XHJcbiAgaGVpZ2h0OiA3JTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAvL2JvcmRlcjogZGFzaGVkO1xyXG4gfVxyXG4udG9vbGJhcldyYXBwZXIge1xyXG4gIGRpc3BsYXk6ZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGhlaWdodDogNyU7XHJcbn1cclxuXHJcbi50aXRsZSB7XHJcbiAgcGFkZGluZy1sZWZ0OiAyMHB4O1xyXG59XHJcbi5zcGFjZXIge1xyXG4gIGZsZXg6IDEgMSBhdXRvO1xyXG59XHJcbi5tYXQtdG9vbGJhcntcclxuICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuZm9vdGVyIHtcclxuICBtYXJnaW4tdG9wOiA4cHg7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGxpbmUtaGVpZ2h0OiAyMHB4O1xyXG59XHJcblxyXG5mb290ZXIgYSB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG5cclxuLnRlcm1pbmFsIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgd2lkdGg6IDgwJTtcclxuICBtYXgtd2lkdGg6IDYwMHB4O1xyXG4gIGJvcmRlci1yYWRpdXM6IDZweDtcclxuICBwYWRkaW5nLXRvcDogNDVweDtcclxuICBtYXJnaW4tdG9wOiA4cHg7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTUsIDE1LCAxNik7XHJcbn1cclxuXHJcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDkwMHB4KSB7XHJcbiAgLm1hdC10b29sYmFyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICM3ODAwMmU7IC8vIHByaW1hcnkgZGFyayBjb2xvciBvbmx5IGZvciB0ZXN0IHJlbW92ZWQgbGF0ZXIgdG8ga2VlcCB0aGUgcHJpbWFyeSBjb2xvclxyXG4gIH1cclxuICAubWF0LWljb24ge1xyXG4gICAgZm9udC1zaXplOiAyNHB4O1xyXG4gIH1cclxuICAudGl0bGUge1xyXG4gICAgcGFkZGluZy1sZWZ0OiA1cHg7XHJcbiAgfVxyXG59XHJcbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogMTQwMHB4KXtcclxuICAgIC5tYXQtdG9vbGJhciB7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNhZDE0NTc7IC8vIHByaW1hcnkgbm9ybWFsIGNvbG9yIG9ubHkgZm9yIHRlc3QgcmVtb3ZlZCBsYXRlciB0byBrZWVwIHRoZSBwcmltYXJ5IGNvbG9yXHJcbiAgICB9XHJcbiAgICAubWF0LWljb24ge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMzZweDtcclxuICAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogMTkwMHB4KXtcclxuICAgIC5tYXQtdG9vbGJhciAge1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBkYXJrcmVkOyAgLy8gb25seSBmb3IgdGVzdCByZW1vdmVkIGxhdGVyIHRvIGtlZXAgdGhlIHByaW1hcnkgY29sb3JcclxuICAgICAgLm1hdC1pY29uIHtcclxuICAgICAgICBmb250LXNpemU6IDQ4cHg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4vLyBpaXlhbWEgMjQnJyAvLyByZXNvbHV0aW9uIGlzIDE5MjAgeCAxMDgwIC8vdmlld2FibGUgYXJlYSA1MjEuMjggeCAyOTMuMjJtbSAvL1BpeGVsIHBpdGNoXHQwLjI3Mm1tXHJcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDUyMDBweCl7XHJcbiAgLm1hdC10b29sYmFyICB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTM1MTgzOyAgLy8gcHJpbWFyeSBsaWdodCBvbmx5IGZvciB0ZXN0IHJlbW92ZWQgbGF0ZXIgdG8ga2VlcCB0aGUgcHJpbWFyeSBjb2xvclxyXG4gICAgLm1hdC1pY29uIHtcclxuICAgICAgZm9udC1zaXplOiA3MnB4O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gaWl5YW1hIDI3JycgLy8gcmVzb2x1dGlvbiBpcyAxOTIwIHggMTA4MC8vIHZpZXdhYmxlIGFyZWEgNTk3LjYgeCAzMzYuMm1tIC8vUGl4ZWwgcGl0Y2hcdDAuMzExbW1cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNTgwMHB4KXtcclxuICAubWF0LXRvb2xiYXIgIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGRhcmtyZWQ7ICAvLyBvbmx5IGZvciB0ZXN0IHJlbW92ZWQgbGF0ZXIgdG8ga2VlcCB0aGUgcHJpbWFyeSBjb2xvclxyXG4gICAgLm1hdC1pY29uIHtcclxuICAgICAgZm9udC1zaXplOiA3MnB4O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuIiwiLnRvb2xiYXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGhlaWdodDogNyU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG5cbi50b29sYmFyV3JhcHBlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogNyU7XG59XG5cbi50aXRsZSB7XG4gIHBhZGRpbmctbGVmdDogMjBweDtcbn1cblxuLnNwYWNlciB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuXG4ubWF0LXRvb2xiYXIge1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbmZvb3RlciB7XG4gIG1hcmdpbi10b3A6IDhweDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbGluZS1oZWlnaHQ6IDIwcHg7XG59XG5cbmZvb3RlciBhIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLnRlcm1pbmFsIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogODAlO1xuICBtYXgtd2lkdGg6IDYwMHB4O1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIHBhZGRpbmctdG9wOiA0NXB4O1xuICBtYXJnaW4tdG9wOiA4cHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJhY2tncm91bmQtY29sb3I6ICMwZjBmMTA7XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDkwMHB4KSB7XG4gIC5tYXQtdG9vbGJhciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzc4MDAyZTtcbiAgfVxuXG4gIC5tYXQtaWNvbiB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICB9XG5cbiAgLnRpdGxlIHtcbiAgICBwYWRkaW5nLWxlZnQ6IDVweDtcbiAgfVxufVxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogMTQwMHB4KSB7XG4gIC5tYXQtdG9vbGJhciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2FkMTQ1NztcbiAgfVxuXG4gIC5tYXQtaWNvbiB7XG4gICAgZm9udC1zaXplOiAzNnB4O1xuICB9XG59XG5AbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxOTAwcHgpIHtcbiAgLm1hdC10b29sYmFyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBkYXJrcmVkO1xuICB9XG4gIC5tYXQtdG9vbGJhciAubWF0LWljb24ge1xuICAgIGZvbnQtc2l6ZTogNDhweDtcbiAgfVxufVxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNTIwMHB4KSB7XG4gIC5tYXQtdG9vbGJhciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UzNTE4MztcbiAgfVxuICAubWF0LXRvb2xiYXIgLm1hdC1pY29uIHtcbiAgICBmb250LXNpemU6IDcycHg7XG4gIH1cbn1cbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDU4MDBweCkge1xuICAubWF0LXRvb2xiYXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6IGRhcmtyZWQ7XG4gIH1cbiAgLm1hdC10b29sYmFyIC5tYXQtaWNvbiB7XG4gICAgZm9udC1zaXplOiA3MnB4O1xuICB9XG59Il19 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](HomeComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-home',
          templateUrl: './home.component.html',
          styleUrls: ['./home.component.scss']
        }]
      }], function () {
        return [];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/layer-panel/layer-panel.component.ts":
  /*!******************************************************!*\
    !*** ./src/app/layer-panel/layer-panel.component.ts ***!
    \******************************************************/

  /*! exports provided: LayerPanelComponent */

  /***/
  function srcAppLayerPanelLayerPanelComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "LayerPanelComponent", function () {
      return LayerPanelComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/cdk/drag-drop */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/drag-drop.js");
    /* harmony import */


    var _open_layers_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../open-layers.service */
    "./src/app/open-layers.service.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _angular_material_card__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/material/card */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
    /* harmony import */


    var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/material/button */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
    /* harmony import */


    var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/material/icon */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
    /* harmony import */


    var _angular_material_divider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! @angular/material/divider */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
    /* harmony import */


    var _angular_material_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/material/list */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/list.js");

    function LayerPanelComponent_div_0_mat_list_option_12_Template(rf, ctx) {
      if (rf & 1) {
        var _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-list-option", 12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function LayerPanelComponent_div_0_mat_list_option_12_Template_mat_list_option_click_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r38);

          var layer_r36 = ctx.$implicit;

          var ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r37.onLayerVisClick($event, layer_r36);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 13);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 14);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "button", 15);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function LayerPanelComponent_div_0_mat_list_option_12_Template_button_click_5_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r38);

          var layer_r36 = ctx.$implicit;

          var ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r39.onEditLayerClick($event, layer_r36);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-icon", 16);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "edit");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var layer_r36 = ctx.$implicit;

        var ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", layer_r36["layerName"])("ngClass", ctx_r34.layerActive == layer_r36["layerName"] ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", layer_r36["layerTitle"], " ");
      }
    }

    function LayerPanelComponent_div_0_Template(rf, ctx) {
      if (rf & 1) {
        var _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("panstart", function LayerPanelComponent_div_0_Template_div_panstart_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r41);

          var ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r40.onPanStart($event);
        })("panmove", function LayerPanelComponent_div_0_Template_div_panmove_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r41);

          var ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r42.onPan($event);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-card-title-group");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-card-title", 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Layers ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "button", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function LayerPanelComponent_div_0_Template_button_click_5_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r41);

          var ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r43.closeLayerPanel(false);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-icon", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "close");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "mat-divider", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("cdkDropListDropped", function LayerPanelComponent_div_0_Template_div_cdkDropListDropped_9_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r41);

          var ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r44.drop($event);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "mat-selection-list", null, 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](12, LayerPanelComponent_div_0_mat_list_option_12_Template, 8, 3, "mat-list-option", 9);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "mat-divider", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "span");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Background Layers");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "mat-selection-list", null, 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 11);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("cdkDropListDropped", function LayerPanelComponent_div_0_Template_div_cdkDropListDropped_18_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r41);

          var ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r45.dropBase($event);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("left", ctx_r32.x, "px")("top", ctx_r32.y, "px");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r32.editLayers);
      }
    }

    var LayerPanelComponent = /*#__PURE__*/function () {
      function LayerPanelComponent(openLayersService) {
        _classCallCheck(this, LayerPanelComponent);

        this.openLayersService = openLayersService;
        this.layerVisClick = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"](); // emit an event when a layer is clicked in the list

        this.editLayerClick = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"](); // emit an event when the edit button of a layer is clicked

        this.layersOrder = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"](); // emit an event when layers were reordered (drop)

        this.layersBackOrder = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"](); // emit an event when the order of base layers changes

        this.layerBackVisClick = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"](); // emit an event when the edit button of a layer is clicked

        this.x = 0;
        this.y = 0;
        this.startX = 0;
        this.startY = 0;
        this.selectedOptions = []; // preSelection = AppConfiguration.layerBaseList2.base_img.name; // ['name']];// 'OSM' The name
        //  editLayers = [['0'], ['1']];

        this.baseLayers = []; // WMS layers as background; layers; too ?
      }

      _createClass(LayerPanelComponent, [{
        key: "drop",
        value: function drop(event) {
          /** Moves the layers in the panel after a drop gesture and emits a layersOrder event
           * that is capture by the map component that effectively reorder the layers in the map.
           * @param event --> cdkDragDrop event
           */
          Object(_angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_2__["moveItemInArray"])(this.editLayers, event.previousIndex, event.currentIndex);
          this.layersOrder.emit(this.editLayers);
          /* #TODO remove, this was changed because I used a child component.
          this.openLayersService.updateOrderEditLayers(this.editLayers);
           this.openLayersService.updateEditingLayer(this.editLayers[0]);  // debria ser true or false
           this.openLayersService.updateShowEditTools(this.editLayers[0][2]); // pos 2 tiene el tipo
           */
        }
      }, {
        key: "dropBase",
        value: function dropBase(event) {
          Object(_angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_2__["moveItemInArray"])(this.baseLayers, event.previousIndex, event.currentIndex);
          this.layersBackOrder.emit(this.baseLayers);
        }
      }, {
        key: "ngOnInit",
        value: function ngOnInit() {
          this.showLayerPanel$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(true);
        }
      }, {
        key: "onEditLayerClick",
        value: function onEditLayerClick($event, layer) {
          /** allows to start editing a particular layer in the layer panel
           * @param $event for the future, doing nothing with it so far.
           * @param item: item (layer) that was clicked on to start/stop editing
           */
          $event.preventDefault();
          $event.stopImmediatePropagation();
          console.log('que entra..getting better', $event, layer.layerName);
          this.editLayerClick.emit(layer); // with this the map should act accordingly to stop/start editing.
          // tslint:disable-next-line:triple-equals

          if (this.layerActive == layer.layerName) {
            this.layerActive = null;
            this.openLayersService.updateShowEditToolbar(false);
          } else {
            this.layerActive = layer.layerName;
          }
        }
      }, {
        key: "closeLayerPanel",
        value: function closeLayerPanel(value) {
          /** Updates the value of the observable $showLayerPanel$ that controls the layer Panel visibility
           * @param value, type boolean
           */
          console.log(value);
          this.showLayerPanel$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(value);
        }
      }, {
        key: "onPanStart",
        value: function onPanStart(event) {
          /** Sets the current coordinates of the layerPanel to use later when setting a new position
           * triggered when a pan event starts in the layerpanel card
           * @param event, type event
           */
          this.startX = this.x;
          this.startY = this.y;
        }
      }, {
        key: "onPan",
        value: function onPan(event) {
          /** Sets the new location of the layerPanel after a pan event was triggered in the layerPanel card
           * @param event, type event
           */
          event.preventDefault();
          this.x = this.startX + event.deltaX;
          this.y = this.startY + event.deltaY;
        }
      }, {
        key: "onEditListChange",
        value: function onEditListChange($event, selectedList, options) {
          /**
           * Updates layers order on the map. This is for editable layers
           * @param $event: the event emitted
           * @param selectedList: list of layers being selected to become visible
           */
          this.selectedOptions = selectedList.map(function (s) {
            return s.value;
          });
          console.log('sigo', this.selectedOptions); // Actualizando las lista de las capas
          //this.layerListChanged.emit(this.selectedOptions);  // emit the change
          //console.log('que tiene this.layerListChanged ', this.layerListChanged);
          // #TODO uncomment this.openLayersService.updateVisLayers(this.selectedOptions);
        }
      }, {
        key: "onBackListChange",
        value: function onBackListChange($event, selectedList) {
          /**
           * Updates layers visibility on the map. This is for background layers
           * @param $event: the event emitted
           * @param selectedList: list of layers being selected to become visible
           */
          this.selectedOptions = selectedList.map(function (s) {
            return s.value;
          });
          console.log('sigo', this.selectedOptions); // Actualizando las lista de las capas

          this.layerBackVisClick.emit(this.selectedOptions); // the order
          // this.selectedOption =$event;
        }
      }, {
        key: "onLayerVisClick",
        value: function onLayerVisClick($event, layer) {
          /** This function emit an event to allow the map component to know that a layer was clicked
           * @param $event: to stop event propagation
           * @param layer: the layer that the user clicked on to show/hide
           */
          $event.preventDefault();
          $event.stopImmediatePropagation();
          this.layerVisClick.emit(layer); // emit the change
        }
      }, {
        key: "onLayerBackVisClick",
        value: function onLayerBackVisClick($event, layer) {
          /** This function emit an event to allow the map component to know that a layer was clicked
           * @param $event: to stop event propagation
           * @param layer: the layer that the user clicked on to show/hide
           */
          $event.preventDefault();
          $event.stopImmediatePropagation();
          this.layerBackVisClick.emit(layer); // emit the change
        }
      }]);

      return LayerPanelComponent;
    }();

    LayerPanelComponent.ɵfac = function LayerPanelComponent_Factory(t) {
      return new (t || LayerPanelComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_open_layers_service__WEBPACK_IMPORTED_MODULE_3__["OpenLayersService"]));
    };

    LayerPanelComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: LayerPanelComponent,
      selectors: [["app-layer-panel"]],
      inputs: {
        editLayers: "editLayers"
      },
      outputs: {
        layerVisClick: "layerVisClick",
        editLayerClick: "editLayerClick",
        layersOrder: "layersOrder",
        layersBackOrder: "layersBackOrder",
        layerBackVisClick: "layerBackVisClick"
      },
      decls: 2,
      vars: 3,
      consts: [["class", "example-list", 3, "left", "top", "panstart", "panmove", 4, "ngIf"], [1, "example-list", 3, "panstart", "panmove"], [1, "layerPanelCard"], [1, "panelTitle"], ["mat-mini-fab", "", 1, "matCloseWrapper", 3, "click"], [1, "closeIcon"], [1, "toolbarDivider"], ["cdkDropList", "", 1, "example-list-top", 3, "cdkDropListDropped"], ["listElayer", ""], ["class", "example-box mat-primary", "checkboxPosition", "before", "cdkDrag", "", 3, "value", "ngClass", "click", 4, "ngFor", "ngForOf"], ["sbLayers", ""], ["cdkDropList", "", 3, "cdkDropListDropped"], ["checkboxPosition", "before", "cdkDrag", "", 1, "example-box", "mat-primary", 3, "value", "ngClass", "click"], [1, "selectList"], [2, "display", "flex", "align-items", "center"], ["mat-icon-button", "", 3, "click"], [1, "editIcon"]],
      template: function LayerPanelComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, LayerPanelComponent_div_0_Template, 19, 5, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](1, "async");
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](1, 1, ctx.showLayerPanel$));
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCard"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCardTitleGroup"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCardTitle"], _angular_material_button__WEBPACK_IMPORTED_MODULE_6__["MatButton"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__["MatIcon"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_8__["MatDivider"], _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_2__["CdkDropList"], _angular_material_list__WEBPACK_IMPORTED_MODULE_9__["MatSelectionList"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _angular_material_list__WEBPACK_IMPORTED_MODULE_9__["MatListOption"], _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_2__["CdkDrag"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgClass"]],
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["AsyncPipe"]],
      styles: [".closeIcon[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover {\n  background-color: #e35183;\n}\n\n.editIcon[_ngcontent-%COMP%] {\n  font-size: 1vw;\n  text-align: center;\n  width: 1.5vw !important;\n  height: 1.5vw !important;\n  padding-top: 0;\n  margin-top: 0;\n  padding-right: 0;\n}\n\n.editIcon[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover {\n  background-color: #fff2e1 !important;\n}\n\n.spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n\n.toolbarDivider[_ngcontent-%COMP%] {\n  padding-top: 5px !important;\n}\n\n.example-box[_ngcontent-%COMP%] {\n  border-bottom: solid 1px #ccc;\n  color: rgba(0, 20, 0, 0.87);\n  display: flex;\n  flex-direction: column;\n  align-items: baseline;\n  background: white;\n  font-size: 0.8vw;\n  width: 100%;\n  position: relative;\n}\n\n.selectList[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.cdk-drag-preview[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  border-radius: 4px;\n  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n\n.cdk-drag-placeholder[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n\n.cdk-drag-animating[_ngcontent-%COMP%] {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n\n.example-box[_ngcontent-%COMP%]:last-child {\n  border: none;\n}\n\n.example-list.cdk-drop-list-dragging[_ngcontent-%COMP%]   .example-box[_ngcontent-%COMP%]:not(.cdk-drag-placeholder) {\n  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);\n}\n\n.mat-list-option[_ngcontent-%COMP%] {\n  height: 2vw !important;\n  vertical-align: middle !important;\n  padding-top: 4px !important;\n}\n\n[_nghost-%COMP%]     .mat-list-item-content {\n  height: 1.2vw !important;\n}\n\n[_nghost-%COMP%]     .mat-list-text {\n  padding-left: 5px !important;\n}\n\n[_nghost-%COMP%]     .mat-pseudo-checkbox::after {\n  color: darkred !important;\n}\n\n[_nghost-%COMP%]     .mat-option.mat-active {\n  background: blue !important;\n}\n\n.active[_ngcontent-%COMP%] {\n  background: #fff2e1;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbGF5ZXItcGFuZWwvRDpcXFBoRFxcY29kZVxcZnJvbVNjcmF0Y2hcXG15T2dpdG8vc3JjXFxhcHBcXGxheWVyLXBhbmVsXFxsYXllci1wYW5lbC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDRSx5QkFBQTtBQ0FGOztBREdBO0VBQ0UsY0FBQTtFQUNBLGtCQUFBO0VBRUEsdUJBQUE7RUFDQSx3QkFBQTtFQUNBLGNBQUE7RUFDQSxhQUFBO0VBQ0EsZ0JBQUE7QUNERjs7QURHQTtFQUNFLG9DQUFBO0FDQUY7O0FER0E7RUFDRSxjQUFBO0FDQUY7O0FER0E7RUFDRSwyQkFBQTtBQ0FGOztBREVBO0VBQ0UsNkJBQUE7RUFDQSwyQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLFdBQUE7RUFFQSxrQkFBQTtBQ0FGOztBREVBO0VBQ0UsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7QUNDRjs7QURHQTtFQUNFLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxxSEFBQTtBQ0FGOztBREtBO0VBQ0UsVUFBQTtBQ0ZGOztBREtBO0VBQ0Usc0RBQUE7QUNGRjs7QURLQTtFQUNFLFlBQUE7QUNGRjs7QURLQTtFQUNFLHNEQUFBO0FDRkY7O0FES0E7RUFDRSxzQkFBQTtFQUNBLGlDQUFBO0VBQ0EsMkJBQUE7QUNGRjs7QURNQTtFQUVFLHdCQUFBO0FDSkY7O0FEUUE7RUFDRSw0QkFBQTtBQ0xGOztBRFVBO0VBQ0UseUJBQUE7QUNQRjs7QURTQTtFQUNFLDJCQUFBO0FDTkY7O0FEU0E7RUFDRSxtQkFBQTtBQ05GIiwiZmlsZSI6InNyYy9hcHAvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLmNsb3NlSWNvbiA6aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNlMzUxODM7ICAvL3RvIGZvY3VzIHRoZSBpY29uc1xyXG59XHJcblxyXG4uZWRpdEljb24ge1xyXG4gIGZvbnQtc2l6ZTogMXZ3O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAvL3ZlcnRpY2FsLWFsaWduOiB0b3AgIWltcG9ydGFudDtcclxuICB3aWR0aDogMS41dncgIWltcG9ydGFudDtcclxuICBoZWlnaHQ6ICAxLjV2dyAhaW1wb3J0YW50O1xyXG4gIHBhZGRpbmctdG9wOiAwO1xyXG4gIG1hcmdpbi10b3A6IDA7XHJcbiAgcGFkZGluZy1yaWdodDogMDtcclxufVxyXG4uZWRpdEljb24gOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmMmUxICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5zcGFjZXIge1xyXG4gIGZsZXg6IDEgMSBhdXRvO1xyXG59XHJcblxyXG4udG9vbGJhckRpdmlkZXIge1xyXG4gIHBhZGRpbmctdG9wOiA1cHggIWltcG9ydGFudDtcclxufVxyXG4uZXhhbXBsZS1ib3gge1xyXG4gIGJvcmRlci1ib3R0b206IHNvbGlkIDFweCAjY2NjO1xyXG4gIGNvbG9yOiByZ2JhKDAsIDIwLCAwLCAwLjg3KTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgYWxpZ24taXRlbXM6IGJhc2VsaW5lO1xyXG4gIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gIGZvbnQtc2l6ZTogMC44dnc7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgLy9tYXgtd2lkdGg6IDIwJTtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuLnNlbGVjdExpc3R7XHJcbiAgZGlzcGxheTpmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO1xyXG4gIGFsaWduLWl0ZW1zOmNlbnRlcjtcclxufVxyXG5cclxuXHJcbi5jZGstZHJhZy1wcmV2aWV3IHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGJvcmRlci1yYWRpdXM6IDRweDtcclxuICBib3gtc2hhZG93OiAwIDVweCA1cHggLTNweCByZ2JhKDAsIDAsIDAsIDAuMiksXHJcbiAgMCA4cHggMTBweCAxcHggcmdiYSgwLCAwLCAwLCAwLjE0KSxcclxuICAwIDNweCAxNHB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xyXG59XHJcblxyXG4uY2RrLWRyYWctcGxhY2Vob2xkZXIge1xyXG4gIG9wYWNpdHk6IDA7XHJcbn1cclxuXHJcbi5jZGstZHJhZy1hbmltYXRpbmcge1xyXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAyNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKTtcclxufVxyXG5cclxuLmV4YW1wbGUtYm94Omxhc3QtY2hpbGQge1xyXG4gIGJvcmRlcjogbm9uZTtcclxufVxyXG5cclxuLmV4YW1wbGUtbGlzdC5jZGstZHJvcC1saXN0LWRyYWdnaW5nIC5leGFtcGxlLWJveDpub3QoLmNkay1kcmFnLXBsYWNlaG9sZGVyKSB7XHJcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDI1MG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xyXG59XHJcblxyXG4ubWF0LWxpc3Qtb3B0aW9uIHtcclxuICBoZWlnaHQ6MnZ3ICFpbXBvcnRhbnQ7XHJcbiAgdmVydGljYWwtYWxpZ246bWlkZGxlICFpbXBvcnRhbnQ7XHJcbiAgcGFkZGluZy10b3A6IDRweCAhaW1wb3J0YW50OyAgLy8gI1RPRE8gaGFjZXJsbyBkaWZmZXJlbnRlIHJlc3BvbnNpdmUgZGVzaWduXHJcbn1cclxuXHJcbi8vIHRvIHJlbW92ZSB0aGUgcGFkZGluZyBpbiBtYXQtbGlzdFxyXG46aG9zdCA6Om5nLWRlZXAgLm1hdC1saXN0LWl0ZW0tY29udGVudCB7XHJcbiAgLy9wYWRkaW5nOiAwICFpbXBvcnRhbnQ7XHJcbiAgaGVpZ2h0OjEuMnZ3ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi8vIHRvIHJlbW92ZSB0aGUgcGFkZGluZyBvbiB0aGUgdGV4dCBvZiB0aGUgbGlzdFxyXG46aG9zdCA6Om5nLWRlZXAgLm1hdC1saXN0LXRleHQge1xyXG4gIHBhZGRpbmctbGVmdDogNXB4ICFpbXBvcnRhbnQ7ICAvLyByaWd0aCBsZWZ0XHJcbiAgLy9wYWRkaW5nLXRvcDogNXB4ICFpbXBvcnRhbnQ7ICAvLyByaWd0aCBsZWZ0XHJcbi8vICBoZWlnaHQ6IDF2dyAhaW1wb3J0YW50O1xyXG59XHJcblxyXG46aG9zdCA6Om5nLWRlZXAgLm1hdC1wc2V1ZG8tY2hlY2tib3g6OmFmdGVyIHtcclxuICBjb2xvcjogZGFya3JlZCAhaW1wb3J0YW50O1xyXG59XHJcbjpob3N0IDo6bmctZGVlcCAubWF0LW9wdGlvbi5tYXQtYWN0aXZlIHtcclxuICBiYWNrZ3JvdW5kOiBibHVlICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5hY3RpdmUge1xyXG4gIGJhY2tncm91bmQ6ICNmZmYyZTE7XHJcbn1cclxuIiwiLmNsb3NlSWNvbiA6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTM1MTgzO1xufVxuXG4uZWRpdEljb24ge1xuICBmb250LXNpemU6IDF2dztcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB3aWR0aDogMS41dncgIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAxLjV2dyAhaW1wb3J0YW50O1xuICBwYWRkaW5nLXRvcDogMDtcbiAgbWFyZ2luLXRvcDogMDtcbiAgcGFkZGluZy1yaWdodDogMDtcbn1cblxuLmVkaXRJY29uIDpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmYyZTEgIWltcG9ydGFudDtcbn1cblxuLnNwYWNlciB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuXG4udG9vbGJhckRpdmlkZXIge1xuICBwYWRkaW5nLXRvcDogNXB4ICFpbXBvcnRhbnQ7XG59XG5cbi5leGFtcGxlLWJveCB7XG4gIGJvcmRlci1ib3R0b206IHNvbGlkIDFweCAjY2NjO1xuICBjb2xvcjogcmdiYSgwLCAyMCwgMCwgMC44Nyk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcbiAgYmFja2dyb3VuZDogd2hpdGU7XG4gIGZvbnQtc2l6ZTogMC44dnc7XG4gIHdpZHRoOiAxMDAlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5zZWxlY3RMaXN0IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4uY2RrLWRyYWctcHJldmlldyB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgYm94LXNoYWRvdzogMCA1cHggNXB4IC0zcHggcmdiYSgwLCAwLCAwLCAwLjIpLCAwIDhweCAxMHB4IDFweCByZ2JhKDAsIDAsIDAsIDAuMTQpLCAwIDNweCAxNHB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMTIpO1xufVxuXG4uY2RrLWRyYWctcGxhY2Vob2xkZXIge1xuICBvcGFjaXR5OiAwO1xufVxuXG4uY2RrLWRyYWctYW5pbWF0aW5nIHtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDI1MG1zIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpO1xufVxuXG4uZXhhbXBsZS1ib3g6bGFzdC1jaGlsZCB7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuLmV4YW1wbGUtbGlzdC5jZGstZHJvcC1saXN0LWRyYWdnaW5nIC5leGFtcGxlLWJveDpub3QoLmNkay1kcmFnLXBsYWNlaG9sZGVyKSB7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAyNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKTtcbn1cblxuLm1hdC1saXN0LW9wdGlvbiB7XG4gIGhlaWdodDogMnZ3ICFpbXBvcnRhbnQ7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGUgIWltcG9ydGFudDtcbiAgcGFkZGluZy10b3A6IDRweCAhaW1wb3J0YW50O1xufVxuXG46aG9zdCA6Om5nLWRlZXAgLm1hdC1saXN0LWl0ZW0tY29udGVudCB7XG4gIGhlaWdodDogMS4ydncgIWltcG9ydGFudDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC5tYXQtbGlzdC10ZXh0IHtcbiAgcGFkZGluZy1sZWZ0OiA1cHggIWltcG9ydGFudDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC5tYXQtcHNldWRvLWNoZWNrYm94OjphZnRlciB7XG4gIGNvbG9yOiBkYXJrcmVkICFpbXBvcnRhbnQ7XG59XG5cbjpob3N0IDo6bmctZGVlcCAubWF0LW9wdGlvbi5tYXQtYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogYmx1ZSAhaW1wb3J0YW50O1xufVxuXG4uYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogI2ZmZjJlMTtcbn0iXX0= */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LayerPanelComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-layer-panel',
          templateUrl: './layer-panel.component.html',
          styleUrls: ['./layer-panel.component.scss']
        }]
      }], function () {
        return [{
          type: _open_layers_service__WEBPACK_IMPORTED_MODULE_3__["OpenLayersService"]
        }];
      }, {
        editLayers: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        layerVisClick: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        editLayerClick: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        layersOrder: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        layersBackOrder: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        layerBackVisClick: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/map-qgs-style.service.ts":
  /*!******************************************!*\
    !*** ./src/app/map-qgs-style.service.ts ***!
    \******************************************/

  /*! exports provided: MapQgsStyleService */

  /***/
  function srcAppMapQgsStyleServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "MapQgsStyleService", function () {
      return MapQgsStyleService;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var ol_style_Circle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ol/style/Circle */
    "./node_modules/ol/style/Circle.js");
    /* harmony import */


    var ol_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ol/style */
    "./node_modules/ol/style.js");
    /* harmony import */


    var ol_has_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ol/has.js */
    "./node_modules/ol/has.js");
    /* harmony import */


    var _app_configuration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./app-configuration */
    "./src/app/app-configuration.ts");

    var MapQgsStyleService = /*#__PURE__*/function () {
      function MapQgsStyleService() {
        _classCallCheck(this, MapQgsStyleService);

        /** Retrieves the styles for WFS layers in the Qgs project associated
         *
         */
        this.svgFolder = _app_configuration__WEBPACK_IMPORTED_MODULE_4__["AppConfiguration"].svgFolder;
        this.nodes = {};
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
      }

      _createClass(MapQgsStyleService, [{
        key: "findStyle",
        value: function findStyle(feature, layerName) {
          /** Given a feature and the layerName it returns the corresponding style
           * it is used to get the styles for WFS layers in the Qgs project associated
           * @param { feature } the feature for which to find a rendering style  -- no needed apparently
           * @param { layerName } the name of a WFS layer to be rendered
           */
          // console.log("layername in finding style", layerName) ;
          // const featType = feature.getGeometry().getType();
          // here include a default value and styling for # resolution or just somethig reasonable
          var styleLyr = this.nodes[layerName];

          if (Object.keys(styleLyr).length > 0) {
            var attr = styleLyr[Object.keys(styleLyr)[0]]["attr"]; // Which is the attribute used in the simbology

            var featValue = feature.get(attr);

            var _iterator = _createForOfIteratorHelper(Object.getOwnPropertyNames(styleLyr)),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var key = _step.value;

                if (styleLyr[key]['value'] == featValue) {
                  // console.log ("encontrado",styleLyr[key]['style']);
                  return styleLyr[key]['style']; // and array of style is ok too
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }
      }, {
        key: "createLinePattern",
        value: function createLinePattern(fillColor, angle, spacing, line_width) {
          var pixelRatio = ol_has_js__WEBPACK_IMPORTED_MODULE_3__["DEVICE_PIXEL_RATIO"];
          this.canvas.width = 8 * pixelRatio;
          this.canvas.height = 8 * pixelRatio;
          this.context.fillStyle = 'rgba(255,255,255,0.8)';
          this.context.beginPath();
          this.context.fillRect(0, 0, this.canvas.width, this.canvas.width); // just fill the pattern

          this.context.fill(); // the stroke

          this.context.beginPath();

          switch (angle) {
            case 45:
              {
                this.context.moveTo(0, this.canvas.height);
                this.context.lineTo(this.canvas.width, 0);
                break;
              }

            case 90:
              {
                this.context.moveTo(2, 0);
                this.context.lineTo(2, this.canvas.height);
                break;
              }

            case 135:
              {
                this.context.moveTo(0, 0);
                this.context.lineTo(this.canvas.width, this.canvas.height);
                break;
              }

            case 180:
              {
                this.context.moveTo(0, 0);
                this.context.lineTo(this.canvas.width, 0);
                break;
              }

            default:
              for (var i = 10; i < 200; i += 20) {
                this.context.moveTo(0, i);
                this.context.lineTo(this.canvas.width, i);
              }

          }

          this.context.lineWidth = line_width * 2; // in qgis looks good but thinner in OL

          this.context.strokeStyle = fillColor;
          this.context.stroke();
          this.context.fill();
          var thePattern = this.context.createPattern(this.canvas, 'repeat');
          return thePattern;
        }
      }, {
        key: "getRGBAcolor",
        value: function getRGBAcolor(color) {
          var transparency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1';

          /** takes a color and retunr in a rgba format used in OL
           * @param color: string color as given in the qgs project file
           * @param transparency: string containing de transparency from 0 to 1
           * by default it put 1 as the transparency.
           * return a string with the color in the rgba format
           */
          var rgbaColor = color.split(',');
          rgbaColor = 'rgba('.concat(rgbaColor[0], ', ', rgbaColor[1], ', ', rgbaColor[2], ',', transparency, ')');
          return rgbaColor;
        }
      }, {
        key: "mapQgsSymbol",
        value: function mapQgsSymbol(symType, symLyrCls, symAlpha, props) {
          /** Retrieves a OL style that is "equivalent" to the style described in a QGS project
           * for now only categorized symbols are supported
           * #TODO implement graduated symbols, it should not be hard
           * @param {symType} type of symbol
           * @param {symLyrCls} name of the symbol layer
           * @param {symAlpha} value of the alfa layer for the symbol
           * @param {props} name of the layer
           * @returns {Olstyle} style in the format of a OL style (it could and array)e
           */
          var newStyle;
          var color;
          var outColor;
          var stroke;
          var fill;
          var symText;
          var symStyle = {};

          for (var l = 0; l < props.length; l++) {
            var propNode = props[l];
            var clave = propNode.getAttribute('k');
            var valor = propNode.getAttribute('v'); // console.log("que viene en symLyrCls", symLyrCls);

            symStyle[clave] = valor;
          }

          switch (symLyrCls) {
            case "SimpleFill":
              {
                stroke = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Stroke"]({
                  lineJoin: symStyle["joinstyle"],
                  width: +symStyle["outline_width"]
                });
                color = this.getRGBAcolor(symStyle["color"], '0.7');
                outColor = this.getRGBAcolor(symStyle["outline_color"], '1');
                stroke.setColor(outColor);
                var fillStyle = symStyle["style"];

                switch (fillStyle) {
                  case "no":
                    {
                      newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                        stroke: stroke
                      });
                      break;
                    }

                  default:
                    {
                      // by default fills the style
                      fill = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Fill"]({
                        color: color
                      });
                      newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                        stroke: stroke,
                        fill: fill
                      });
                    }
                }

                break;
              }

            case 'LinePatternFill':
              {
                stroke = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Stroke"]({
                  lineJoin: symStyle["joinstyle"],
                  width: +symStyle["line_width"]
                });
                color = this.getRGBAcolor(symStyle['color'], '0.7');
                fill = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Fill"]();
                var pattern = this.createLinePattern(color, +symStyle["angle"], symStyle["distance"], +symStyle["line_width"]); //

                fill.setColor(pattern);
                stroke.setColor("black");
                newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                  stroke: stroke,
                  fill: fill
                });
                break;
              }

            case 'SimpleLine':
              {
                var capStyle = symStyle["capstyle"];

                if (symStyle["capstyle"] == 'flat') {
                  capStyle = 'butt';
                }

                var lineDash = '';

                if (symStyle["use_custom_dash"] == "1") {
                  lineDash = symStyle["customdash"].split(";").map(Number);
                }

                color = this.getRGBAcolor(symStyle["line_color"], '1');
                stroke = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Stroke"]({
                  color: color,
                  lineCap: capStyle,
                  lineJoin: symStyle["joinstyle"],
                  lineDash: lineDash,
                  lineDashOffset: symStyle["offset"],
                  //miterLimit: symStyle["joinstyle"],
                  width: +symStyle["line_width"]
                });
                newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                  stroke: stroke
                });
                break;
              }

            case 'SimpleMarker':
              {
                // console.log("THIS is NEEXXXXT");
                var offset = symStyle["offset"].split(",");
                color = this.getRGBAcolor(symStyle['color']);
                outColor = this.getRGBAcolor(symStyle['outline_color']);
                fill = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Fill"]({
                  color: color
                });
                stroke = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Stroke"]({
                  color: outColor,
                  lineJoin: symStyle['joinstyle'],
                  width: +symStyle['outline_width'] * 2 // test *2

                });
                newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                  image: new ol_style_Circle__WEBPACK_IMPORTED_MODULE_1__["default"]({
                    radius: +symStyle['size'] * 2,
                    fill: fill,
                    stroke: stroke
                  })
                });
                break;
              }

            case 'SvgMarker':
              {
                color = this.getRGBAcolor(symStyle['color']); // this is symStyle["color"]

                outColor = this.getRGBAcolor(symStyle['outline_color']);
                var filename = this.svgFolder.concat(symStyle['name']);
                var size = symStyle['size'];
                var outlineWidth = +symStyle["outline_width"];
                var verticalAnchorPoint = symStyle['vertical_anchor_point'];
                newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                  image: new ol_style__WEBPACK_IMPORTED_MODULE_2__["Icon"]({
                    color: color,
                    crossOrigin: 'anonymous',
                    // imgSize: [50, 50],   // it was 20 #TODO responsive to zoom scale
                    scale: 0.03,
                    src: filename
                  })
                }); // console.log('svgMarker in the case', newStyle);

                break;
              }

            case 'FontMarker':
              {
                color = this.getRGBAcolor(symStyle['color']);
                outColor = this.getRGBAcolor(symStyle['outline_color']);
                stroke = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Stroke"]({
                  color: color,
                  lineJoin: symStyle['joinstyle'],
                  lineDashOffset: symStyle['offset'],
                  width: +symStyle["line_width"]
                });
                var textBaseline = 'top';

                var _offset = symStyle["offset"].split(",");

                var offsetY = _offset[1];

                if (symStyle["chr"] == "o" && symStyle["font"] == "Geosiana Desa") {
                  offsetY = 2 * 19;
                  textBaseline = "bottom";
                  symStyle["chr"] = '\n'.concat(symStyle["chr"]);
                }

                symText = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Text"]({
                  font: "normal ".concat(symStyle["size"], "px ", symStyle["font"]),
                  offsetX: _offset[0],
                  offsetY: offsetY,
                  textBaseline: textBaseline,
                  // placement: ,   // lets keep the default that is point
                  scale: 2,
                  text: symStyle['chr'],
                  fill: new ol_style__WEBPACK_IMPORTED_MODULE_2__["Fill"]({
                    color: color
                  })
                });
                newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                  text: symText
                });
                break;
              }

            case 'FilledMarker':
              {
                color = this.getRGBAcolor(symStyle['color']);
                var _size = symStyle['size'];
                var scaleMethod = symStyle['diameter'];
                var angle = symStyle['angle'];
                fill = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Fill"]({
                  color: color
                });
                stroke = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Stroke"]({
                  color: 'black',
                  width: 2
                }); //

                switch (symStyle['name']) {
                  case 'star':
                    {
                      newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                        image: new ol_style__WEBPACK_IMPORTED_MODULE_2__["RegularShape"]({
                          fill: fill,
                          stroke: stroke,
                          points: 5,
                          radius: _size * 2,
                          radius2: _size,
                          angle: 0
                        })
                      });
                      break;
                    }

                  case 'cross_fill':
                    {
                      newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                        image: new ol_style__WEBPACK_IMPORTED_MODULE_2__["RegularShape"]({
                          fill: fill,
                          stroke: stroke,
                          points: 4,
                          radius: _size * 2,
                          radius2: 0,
                          angle: 0
                        })
                      });
                      break;
                    }

                  case 'square':
                    {
                      newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                        image: new ol_style__WEBPACK_IMPORTED_MODULE_2__["RegularShape"]({
                          fill: fill,
                          stroke: stroke,
                          points: 4,
                          radius: _size * 2,
                          angle: Math.PI / 4
                        })
                      });
                      break;
                    }

                  case 'triangle':
                    {
                      newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                        image: new ol_style__WEBPACK_IMPORTED_MODULE_2__["RegularShape"]({
                          fill: fill,
                          stroke: stroke,
                          points: 3,
                          radius: _size * 2,
                          angle: 0
                        })
                      });
                      break;
                    }

                  default:
                    {
                      // by default a x
                      newStyle = new ol_style__WEBPACK_IMPORTED_MODULE_2__["Style"]({
                        image: new ol_style__WEBPACK_IMPORTED_MODULE_2__["RegularShape"]({
                          fill: fill,
                          stroke: stroke,
                          points: 4,
                          radius: 10,
                          radius2: 0,
                          angle: Math.PI / 4
                        })
                      });
                      break;
                    }
                }

                break;
              }
          }

          return newStyle;
        }
      }, {
        key: "findDefaultStyleProvisional",
        value: function findDefaultStyleProvisional(geometry, layerName) {
          /** Retrieves a default style for a feature of the given geometry in the given layer
           * This can be used to provide style for sketch layers..
           * @param {geometry} geomtry type
           * @param {layerName} name of the layer
           * @returns {Style} default style to render the feature
           */
        }
      }, {
        key: "createLayerStyles",
        value: function createLayerStyles(layerName, xmlRendererV2) {
          /** Retrieves a default style for a feature of the given geometry in the given layer
           * This function receives the content of the Xml project to parse it and get the symbology of each layer
           * This is to avoid asking the user to fill the qml files per layer
           * @param {xmlRendererV2} the portion of the xml related to styles - renderer-v2
           * @returns {layerName} the name of the layerNames as keys and styles (symbology) as values
           */
          // console.log(`layerName ${ layerName }`);
          var renderer = xmlRendererV2;
          var symbolType = renderer.getAttribute("type"); // const symbols = renderer.getElementsByTagName('symbols')[0];

          if (symbolType == "categorizedSymbol") {
            var attr = renderer.getAttribute('attr').split(".")[0];
            var categories = renderer.getElementsByTagName("categories"); // aqui tengo el id era el [1].
            // console.log('cuantos valores', categories[0].children.length);

            var tnodes = {};

            for (var i = 0; i < categories[0].children.length; i++) {
              var node = renderer.getElementsByTagName("category")[i];
              var label = node.getAttribute("label");
              var symbol = node.getAttribute("symbol");
              var value = node.getAttribute("value"); // here, loading the different classes

              if (value.length > 0) {
                tnodes[symbol] = {
                  "attr": attr,
                  "value": value,
                  "label": label,
                  "symbol": symbol,
                  "style": ""
                };
              }
            }

            var symbols = renderer.getElementsByTagName("symbols")[0]; // aqui tengo el id era el [1].

            var syms = symbols.getElementsByTagName("symbol");

            for (var j = 0; j < syms.length; j++) {
              var symNode = syms[j];
              var symAlpha = symNode.getAttribute("alpha");
              var symName = symNode.getAttribute("name"); // here is the real value of the symbol

              var symType = symNode.getAttribute("type");

              if (tnodes.hasOwnProperty(symName)) {
                var layers = symNode.getElementsByTagName("layer");
                var olStyleLst = [];

                for (var l = 0; l < layers.length; l++) {
                  var symLyrCls = symNode.getElementsByTagName("layer")[l].getAttribute("class");
                  var props = symNode.getElementsByTagName("layer")[l].getElementsByTagName("prop");
                  var olStyle = this.mapQgsSymbol(symType, symLyrCls, symAlpha, props); // #TODO add symbol inside filledMarker

                  if (olStyle) {
                    olStyleLst.push(olStyle);
                    tnodes[symName]["symLyrCls"] = symLyrCls;
                  }
                }

                if (olStyleLst.length > 1) {
                  // switch the order of the styles   #TODO check if needed
                  var olStyleLst2 = [];

                  for (var s = 0; s < olStyleLst.length; s++) {
                    olStyleLst2.push(olStyleLst[olStyleLst.length - 1 - s]);
                  } // olStyleLst = olStyleLst2;

                }

                tnodes[symName].style = olStyleLst; // using the tnodes[symName].style is te same than tnodes[symName]["style"]

                tnodes[symName].alpha = symAlpha;
                tnodes[symName].type = symType;
              }
            }

            this.nodes[layerName] = tnodes;
          } else if (symbolType == "graduatedSymbol") {// For future versions  graduated color, this also includes
            // SVG icons
          } else if (symbolType == "singleSymbol") {// For future versions  unique symbol, this also includes
            // SVG icons
          }
        }
      }, {
        key: "getLayerStyle",
        value: function getLayerStyle(layerName) {
          /** return the style for a layer
           * @param layername: string, the name of the layer
           */
          if (this.nodes[layerName]) {
            // console.log("consigue algo?",this.nodes[layerName] );
            return this.nodes[layerName];
          }
        }
      }, {
        key: "getLayerStyles",
        value: function getLayerStyles() {
          /** Return the styles for all the layers
           *  #TODO verify if is useful or not. apparently is not being used.
           */
          if (this.nodes) {
            return this.nodes;
          }

          return null;
        }
      }]);

      return MapQgsStyleService;
    }();

    MapQgsStyleService.ɵfac = function MapQgsStyleService_Factory(t) {
      return new (t || MapQgsStyleService)();
    };

    MapQgsStyleService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: MapQgsStyleService,
      factory: MapQgsStyleService.ɵfac,
      providedIn: 'root'
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MapQgsStyleService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
          providedIn: 'root'
        }]
      }], function () {
        return [];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/map/map.component.ts":
  /*!**************************************!*\
    !*** ./src/app/map/map.component.ts ***!
    \**************************************/

  /*! exports provided: MapComponent */

  /***/
  function srcAppMapMapComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "MapComponent", function () {
      return MapComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var _app_configuration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ../app-configuration */
    "./src/app/app-configuration.ts");
    /* harmony import */


    var ol_ol_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ol/ol.css */
    "./node_modules/ol/ol.css");
    /* harmony import */


    var ol__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ol */
    "./node_modules/ol/index.js");
    /* harmony import */


    var ol_sphere__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ol/sphere */
    "./node_modules/ol/sphere.js");
    /* harmony import */


    var ol_proj__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ol/proj */
    "./node_modules/ol/proj.js");
    /* harmony import */


    var proj4__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! proj4 */
    "./node_modules/proj4/lib/index.js");
    /* harmony import */


    var ol_proj_proj4__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ol/proj/proj4 */
    "./node_modules/ol/proj/proj4.js");
    /* harmony import */


    var ol_proj_Projection__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ol/proj/Projection */
    "./node_modules/ol/proj/Projection.js");
    /* harmony import */


    var ol_source_Vector__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ol/source/Vector */
    "./node_modules/ol/source/Vector.js");
    /* harmony import */


    var ol_layer_Vector__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! ol/layer/Vector */
    "./node_modules/ol/layer/Vector.js");
    /* harmony import */


    var ol_layer_Tile__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! ol/layer/Tile */
    "./node_modules/ol/layer/Tile.js");
    /* harmony import */


    var ol_source_OSM__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! ol/source/OSM */
    "./node_modules/ol/source/OSM.js");
    /* harmony import */


    var ol_format_WMScapabilities_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
    /*! ol/format/WMScapabilities.js */
    "./node_modules/ol/format/WMScapabilities.js");
    /* harmony import */


    var ol_Overlay__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
    /*! ol/Overlay */
    "./node_modules/ol/Overlay.js");
    /* harmony import */


    var ol_interaction__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
    /*! ol/interaction */
    "./node_modules/ol/interaction.js");
    /* harmony import */


    var ol_geom_Point__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
    /*! ol/geom/Point */
    "./node_modules/ol/geom/Point.js");
    /* harmony import */


    var ol_style__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(
    /*! ol/style */
    "./node_modules/ol/style.js");
    /* harmony import */


    var ol_style_Circle__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(
    /*! ol/style/Circle */
    "./node_modules/ol/style/Circle.js");
    /* harmony import */


    var ol_format__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(
    /*! ol/format */
    "./node_modules/ol/format.js");
    /* harmony import */


    var ol_control_ZoomSlider__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(
    /*! ol/control/ZoomSlider */
    "./node_modules/ol/control/ZoomSlider.js");
    /* harmony import */


    var ol_control_ScaleLine__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(
    /*! ol/control/ScaleLine */
    "./node_modules/ol/control/ScaleLine.js");
    /* harmony import */


    var ol_geom__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(
    /*! ol/geom */
    "./node_modules/ol/geom.js");
    /* harmony import */


    var ol_geom_Polygon__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(
    /*! ol/geom/Polygon */
    "./node_modules/ol/geom/Polygon.js");
    /* harmony import */


    var ol_format_WFS__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(
    /*! ol/format/WFS */
    "./node_modules/ol/format/WFS.js");
    /* harmony import */


    var ol_format_GML__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(
    /*! ol/format/GML */
    "./node_modules/ol/format/GML.js");
    /* harmony import */


    var ol_events_condition_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(
    /*! ol/events/condition.js */
    "./node_modules/ol/events/condition.js");
    /* harmony import */


    var _map_qgs_style_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(
    /*! ../map-qgs-style.service */
    "./src/app/map-qgs-style.service.ts");
    /* harmony import */


    var _open_layers_service__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(
    /*! ../open-layers.service */
    "./src/app/open-layers.service.ts");
    /* harmony import */


    var _layer_panel_layer_panel_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(
    /*! ../layer-panel/layer-panel.component */
    "./src/app/layer-panel/layer-panel.component.ts");

    var MapComponent = /*#__PURE__*/function () {
      function MapComponent(mapQgsStyleService, openLayersService) {
        var _this4 = this;

        _classCallCheck(this, MapComponent);

        this.mapQgsStyleService = mapQgsStyleService;
        this.openLayersService = openLayersService;
        this.existingProject = true;
        this.wgs84ID = 'EPSG:4326';
        this.mapCenterXY = [0, 0]; // the center of the map in the project EPSG coordinates

        this.mapZoom = _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].mapZoom;
        this.fieldWFSLayers = {};
        this.layerStyles = {};
        this.select = null;
        this.loadedWfsLayers = []; // [{layerName: 'uno', layerTitle: 'Layer 1'}, {layerName: 'dos', layerTitle: 'layer 2'}];

        this.curEditingLayer = null;
        this.cacheFeatures = [];
        this.canBeUndo = false;
        this.editBuffer = []; // Try one array for everything.
        // cacheBuffer = [];
        // editSketchBuffer = []; // #TDOD remove?

        this.layersGeometryType = {};
        this.layersOrder = [];
        this.featId = 1000; // to have an internal identifier for features when editing

        this.subsToShapeEdit = this.openLayersService.shapeEditType$.subscribe(function (data) {
          if (data != null) {
            _this4.enableAddShape(data);
          } else {
            _this4.removeInteractions(); // remove drawingInteractions

          }
        }, function (error) {
          console.log('Error in shapeEditType', error);
        });
        this.subsTocurrentSymbol = this.openLayersService.currentSymbol$.subscribe(function (style) {
          _this4.changeSymbol(style);
        }, function (error) {
          console.log('Error changing the style for drawing elements', error);
          alert('Error changing the style, select a symbol');
        });
        this.subsToSaveCurrentLayer = this.openLayersService.saveCurrentLayer$.subscribe(function (data) {
          console.log('que entra de la subscription...', data);

          if (data) {
            // (data) is equivalent to (data === true)
            _this4.saveEdits(_this4.curEditingLayer);
          }
        }, function (error) {
          return alert('Error saving layer ' + error);
        });
        this.subsToZoomHome = this.openLayersService.zoomHome$.subscribe(function (data) {
          if (data) {
            _this4.zoomToHome();
          }
        }, function (error) {
          return alert("Error starting zooming Home" + error);
        });
        /*this.openLayersService.deleteFeats$.subscribe(
          data => {
            console.log('que viene', data);
            this.removeInteractions();
            if (true === data) {
              this.startDeleting();
            }
          },
          error => alert('Error deleting features' + error)
        ); */

        this.openLayersService.editAction$.subscribe( // starts an action and stop the others..is this ready with stop interactions?
        function (data) {
          console.log('que viene', data);

          _this4.removeInteractions();

          if (data === null) {
            return;
          }

          switch (data) {
            case 'ModifyBox':
              {
                _this4.startTranslating();

                break;
              }

            case 'Rotate':
              {
                _this4.startRotating();

                break;
              }

            case 'Copy':
              {
                _this4.startCopying();

                break;
              }

            case 'Identify':
              {
                _this4.startIdentifying();

                break;
              }

            case 'Delete':
              {
                _this4.startDeleting();

                break;
              }

            case 'Measure':
              {
                _this4.startMeasuring();

                break;
              }

            case 'Undo':
              {
                _this4.undoLastEdit();

                break;
              }
          }
        }, function (error) {
          return alert('Error implementing action on features' + error);
        });
      }

      _createClass(MapComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this5 = this;

          // initialize the map
          this.initializeMap(); // read the project

          var qgsProject = this.readProjectFile(_app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].curProject);
          qgsProject.then(function (data) {
            _this5.parseProject(data);

            _this5.updateMapView(); // uses the projection of the project file and extent to get a center


            _this5.workQgsProject();

            _this5.existingProject = true;

            _this5.openLayersService.updateExistingProject(_this5.existingProject);
          }, function (error) {
            _this5.loadDefaultMap();

            console.log('There is an error retrieving the qGis project of the application, please check the configuration');
          });
        }
      }, {
        key: "changeSymbol",
        value: function changeSymbol(style) {
          this.currentStyle = style.value;
          this.currentClass = style.key; // console.log('current class and Style', style, this.currentClass, this.currentStyle );
        }
      }, {
        key: "initializeMap",
        value: function initializeMap() {
          // customized pinch interactions
          this.pinchZoom = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["PinchZoom"]({
            constrainResolution: true
          });
          this.pinchRotate = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["PinchRotate"]({
            constrainResolution: true
          });
          this.dragPan = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragPan"]();
          this.dragRotate = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragRotate"]();
          this.dragZoom = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragZoom"](); //

          this.dragAndDropInteraction = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragAndDrop"]({
            formatConstructors: [ol_format__WEBPACK_IMPORTED_MODULE_20__["GeoJSON"], ol_format__WEBPACK_IMPORTED_MODULE_20__["KML"]]
          });
          this.map = new ol__WEBPACK_IMPORTED_MODULE_4__["Map"]({
            layers: [new ol_layer_Tile__WEBPACK_IMPORTED_MODULE_12__["default"]({
              source: new ol_source_OSM__WEBPACK_IMPORTED_MODULE_13__["default"]({
                crossOrigin: null
              })
            })],
            interactions: Object(ol_interaction__WEBPACK_IMPORTED_MODULE_16__["defaults"])({
              pinchZoom: false,
              pinchRotate: false
            }).extend([this.dragAndDropInteraction, this.pinchRotate, this.pinchZoom, this.dragRotate, this.dragZoom]),
            target: 'map',
            view: new ol__WEBPACK_IMPORTED_MODULE_4__["View"]({
              projection: 'EPSG:3857',
              center: [0, 0],
              zoom: 3
            })
          }); // initialize the select style

          this.selectStyle = new ol_style__WEBPACK_IMPORTED_MODULE_18__["Style"]({
            stroke: new ol_style__WEBPACK_IMPORTED_MODULE_18__["Stroke"]({
              color: 'rgba(255, 154, 131,0.9)',
              width: 2,
              lineDash: [5, 2]
            }),
            fill: new ol_style__WEBPACK_IMPORTED_MODULE_18__["Fill"]({
              color: 'rgba(234, 240, 216, 0.8)'
            }),
            image: new ol_style_Circle__WEBPACK_IMPORTED_MODULE_19__["default"]({
              radius: 7,
              fill: new ol_style__WEBPACK_IMPORTED_MODULE_18__["Fill"]({
                color: 'rgba(255, 154, 131, 0.1)'
              }),
              stroke: new ol_style__WEBPACK_IMPORTED_MODULE_18__["Stroke"]({
                color: '#EE266D',
                width: 2,
                lineDash: [8, 5]
              })
            })
          });
        }
      }, {
        key: "createMeasureTooltip",
        value: function createMeasureTooltip() {
          if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
          }

          this.measureTooltipElement = document.createElement('div');
          this.measureTooltipElement.className = 'tooltip tooltip-measure';
          this.measureTooltip = new ol_Overlay__WEBPACK_IMPORTED_MODULE_15__["default"]({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
          });
          this.map.addOverlay(this.measureTooltip);
        }
      }, {
        key: "updateMapView",
        value: function updateMapView() {
          /** Uses the map extent and projection written in the Qgs project (this.mapCanvasExtent [xmin, xmax, ymin, ymax])
           * to update the mapView after the map initialization.
           *  To do that creates to point and calculate the center.
           */
          // get a center for the map
          var leftMinCorner = new ol_geom_Point__WEBPACK_IMPORTED_MODULE_17__["default"]([this.mapCanvasExtent[0], this.mapCanvasExtent[2]]);
          var rightMinCorner = new ol_geom_Point__WEBPACK_IMPORTED_MODULE_17__["default"]([this.mapCanvasExtent[1], this.mapCanvasExtent[3]]);
          var leftMaxCorner = new ol_geom_Point__WEBPACK_IMPORTED_MODULE_17__["default"]([this.mapCanvasExtent[0], this.mapCanvasExtent[3]]); // console.log ('extent and puntos', this.mapCanvasExtent, leftMinCorner.getCoordinates(),
          //   rightMinCorner.getCoordinates(), leftMaxCorner.getCoordinates());

          var hDistance = Object(ol_sphere__WEBPACK_IMPORTED_MODULE_5__["getDistance"])(Object(ol_proj__WEBPACK_IMPORTED_MODULE_6__["transform"])(leftMinCorner.getCoordinates(), this.srsID, this.wgs84ID), Object(ol_proj__WEBPACK_IMPORTED_MODULE_6__["transform"])(rightMinCorner.getCoordinates(), this.srsID, this.wgs84ID));
          var vDistance = Object(ol_sphere__WEBPACK_IMPORTED_MODULE_5__["getDistance"])(Object(ol_proj__WEBPACK_IMPORTED_MODULE_6__["transform"])(leftMinCorner.getCoordinates(), this.srsID, this.wgs84ID), Object(ol_proj__WEBPACK_IMPORTED_MODULE_6__["transform"])(leftMaxCorner.getCoordinates(), this.srsID, this.wgs84ID));
          this.mapCenterXY = [this.mapCanvasExtent[0] + hDistance / 2, this.mapCanvasExtent[2] + vDistance / 2]; // #TODO this works with projected coordinates --> check for others

          this.view = new ol__WEBPACK_IMPORTED_MODULE_4__["View"]({
            center: [this.mapCenterXY[0], this.mapCenterXY[1]],
            // extent: this.mapCanvasExtent, // not sure if this will prevent the draggig outside the extent.
            zoom: _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].mapZoom,
            minZoom: _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].minZoom,
            maxZoom: _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].maxZoom,
            projection: this.srsID // this.projectProjection // 'EPSG:4326'

          });
          this.map.setView(this.view); // this.view.fit(this.mapCanvasExtent);

          this.map.addControl(new ol_control_ZoomSlider__WEBPACK_IMPORTED_MODULE_21__["default"]());
          this.map.addControl(new ol_control_ScaleLine__WEBPACK_IMPORTED_MODULE_22__["default"]());
          this.map.on('touchstart', function (e) {
            console.log('length', e.touches.length);
          }); // console.log('this.view.getCenter', this.view.getCenter(), this.view.getProjection(), this.view.calculateExtent());
        }
      }, {
        key: "zoomToHome",
        value: function zoomToHome() {
          /**
           * Centers the map canvas view to the center and zoom specified in the Qgsprojec file extent and the appConfiguration
           */
          console.log('que entra zoomtoHome', [this.mapCenterXY[0], this.mapCenterXY[1]]);
          this.map.getView().setRotation(0);
          this.map.getView().setZoom(_app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].mapZoom);
          this.map.getView().setCenter([this.mapCenterXY[0], this.mapCenterXY[1]]);
        }
      }, {
        key: "workQgsProject",
        value: function workQgsProject() {
          /** Retrieves the capabilities WFS and WMS associated to the qgis project listed in AppConfiguration
           * it send these capabilities to other functions to load the WMS and WFS layers
           */
          // request getCapabilities to load WMS images
          var qGsProject = _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].QgsFileProject;
          var qGsServerUrl = _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].qGsServerUrl; // console.log("qGsServerUrl",qGsServerUrl)

          var wmsVersion = 'SERVICE=WMS&VERSION=' + _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].wmsVersion;
          var capRequest = '&REQUEST=GetCapabilities&map=';
          var urlWMS = qGsServerUrl + wmsVersion + capRequest + qGsProject;
          var parser; // console.log('urlWMS', urlWMS);

          parser = new ol_format_WMScapabilities_js__WEBPACK_IMPORTED_MODULE_14__["default"]();
          var self = this;
          var resultXml = fetch(urlWMS).then(function (response) {
            return response.text();
          }).then(function (text) {
            var xmlWMS = parser.read(text);
            self.loadWMSlayers(xmlWMS);
            return xmlWMS;
          })["catch"](function (error) {
            return console.error(error);
          }); // now go to the WFS

          var wfsVersion = 'SERVICE=WFS&VERSION=' + _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].wfsVersion;
          var urlWFS = qGsServerUrl + wfsVersion + capRequest + qGsProject; // console.log('urlWFS', urlWFS);

          var resultWfs = fetch(urlWFS).then(function (response) {
            return response.text();
          }).then(function (text) {
            // console.log('result WFS Cap para continuar', text);
            self.loadWFSlayers(text); // self.layerPanel.updateLayerList(self.loadedWfsLayers);   // trying another approach with input

            return text;
          })["catch"](function (error) {
            return console.error(error);
          });
        }
      }, {
        key: "parseProject",
        value: function parseProject(qgsfile) {
          /** uses the xml text of qgs project file listed in AppConfiguration to load
           * it send part of the xml text to other functions to load part of the project
           * 1. A dictionary of layer styles
           * 2. A dictionary with the layer geometries
           *
           */
          var fieldLayers = {};
          var xmlParser = new DOMParser();
          var xmlText = xmlParser.parseFromString(qgsfile, 'text/xml'); // console.log ("xmlText", xmlText);

          this.projectTitle = xmlText.getElementsByTagName('title')[0].childNodes[0].nodeValue; // register the project projection definion in proj4 format

          var projectionDef = xmlText.getElementsByTagName('proj4')[0].childNodes[0].nodeValue;
          this.srsID = xmlText.getElementsByTagName('authid')[0].childNodes[0].nodeValue;
          proj4__WEBPACK_IMPORTED_MODULE_7__["default"].defs(this.srsID, projectionDef);
          Object(ol_proj_proj4__WEBPACK_IMPORTED_MODULE_8__["register"])(proj4__WEBPACK_IMPORTED_MODULE_7__["default"]);
          var mapcanvas = xmlText.getElementsByTagName('mapcanvas')[0];
          var units = mapcanvas.getElementsByTagName('units')[0].childNodes[0].nodeValue;
          var extent = mapcanvas.getElementsByTagName('extent')[0];
          var xmin = Number(extent.getElementsByTagName('xmin')[0].childNodes[0].nodeValue);
          var xmax = Number(extent.getElementsByTagName('xmax')[0].childNodes[0].nodeValue);
          var ymin = Number(extent.getElementsByTagName('ymin')[0].childNodes[0].nodeValue);
          var ymax = Number(extent.getElementsByTagName('ymax')[0].childNodes[0].nodeValue); // console.log(`xmin xmax ymin ymax ${ xmin } ${ xmax } ${ ymin } ${ ymax } `);
          // extent [minx, miny, maxx, maxy].

          this.mapCanvasExtent = [xmin, xmax, ymin, ymax];
          var projectionWKT = xmlText.getElementsByTagName('wkt');

          if (projectionWKT.length > 0) {
            var projectWKT = xmlText.getElementsByTagName('wkt')[0].childNodes[0].nodeValue.replace('PROJCRS', 'PROJCS');
            var m = projectWKT.indexOf('[', projectWKT.indexOf('BBOX'));
            var n = projectWKT.indexOf(']', m);
            var bbox = projectWKT.slice(m + 1, n).split(',');
            this.BBOX = [Number(bbox[0]), Number(bbox[1]), Number(bbox[2]), Number(bbox[3])]; // console.log(`bbox ${ this.BBOX }`);
          } else {
            this.BBOX = this.mapCanvasExtent;
          }

          this.projectProjection = new ol_proj_Projection__WEBPACK_IMPORTED_MODULE_9__["default"]({
            code: this.srsID,
            extent: this.BBOX
          });
          var layerTreeGroup = xmlText.getElementsByTagName('layer-tree-group')[0]; // get the order in which layers are rendered

          var nLayers = layerTreeGroup.getElementsByTagName('layer-tree-layer').length;

          for (var i = 0; i < nLayers; i++) {
            var node = layerTreeGroup.getElementsByTagName('layer-tree-layer')[i];
            var layerName = node.getAttribute('name');
            this.layersOrder.push(layerName); // #TODO evaluate if this is needed or worthy, it is not being used somewhere else
          } // get the map layers and symbology


          var legendGroups = {};

          for (var _i = 0; _i < xmlText.getElementsByTagName('legendgroup').length; _i++) {
            var legendGroup = xmlText.getElementsByTagName('legendgroup')[_i];

            var groupName = legendGroup.getAttribute('name'); // console.log('groupName', groupName);

            var layersinGroup = [];

            for (var j = 0; j < legendGroup.getElementsByTagName('legendlayer').length; j++) {
              var layerInGroup = legendGroup.getElementsByTagName('legendlayer')[j].getAttribute('name'); // console.log('layerInGroup', layerInGroup);

              layersinGroup.push(layerInGroup);
            }

            legendGroups[groupName] = layersinGroup;
          } // #TODO implement something with the groups in the legend


          var mapLayersLst = xmlText.getElementsByTagName('maplayer');

          for (var _i2 = 0; _i2 < mapLayersLst.length; _i2++) {
            var lyr = xmlText.getElementsByTagName('maplayer')[_i2];

            var _layerName = lyr.getElementsByTagName('layername')[0].childNodes[0].nodeValue;
            var layerGeom = lyr.getAttribute('geometry');
            this.layersGeometryType[_layerName] = {
              layerName: _layerName,
              layerGeom: layerGeom
            };
            var renderer = lyr.getElementsByTagName('renderer-v2')[0]; // create the OL style for the renderer

            if (renderer) {
              this.mapQgsStyleService.createLayerStyles(_layerName, renderer);
            } // get the fields, what to do with no-editable fields in QGIS?
            // preferred option is not to edit or input data via keyboard, just select icons oas osm


            var fieldLst = {};
            var fieldsConf = lyr.getElementsByTagName('fieldConfiguration')[0];

            if (fieldsConf) {
              for (var k = 0; k < fieldsConf.children.length; k++) {
                var field = lyr.getElementsByTagName('field')[k];
                var fieldName = field.getAttribute('name');
                fieldLst[fieldName] = field.getElementsByTagName('editWidget')[0].getAttribute('type');
              }

              fieldLayers[_layerName] = fieldLst;
            }
          } // console.log('fields of layer', fieldLayers);
          // console.log('this.layersGeometryType', this.layersGeometryType);  // #TODO not sure if this is worthy layers migth be not published..


          this.fieldWFSLayers = fieldLayers;
          this.layerStyles = this.mapQgsStyleService.getLayerStyles(); // need to check if this is working well;
          // console.log(this.layerStyles);
        }
      }, {
        key: "loadWMSlayers",
        value: function loadWMSlayers(XmlCapText) {// This function load the layers in the QGS project from a OL xmlCapabilities file
          // console.log('Entra WMS', XmlCapText);
        }
      }, {
        key: "getEditingStyle",
        value: function getEditingStyle() {
          var editingstyle = [new ol_style__WEBPACK_IMPORTED_MODULE_18__["Style"]({
            fill: new ol_style__WEBPACK_IMPORTED_MODULE_18__["Fill"]({
              color: 'rgba(153, 202, 255, 0.5)'
            }),
            stroke: new ol_style__WEBPACK_IMPORTED_MODULE_18__["Stroke"]({
              color: 'blue',
              width: 2,
              lineDash: [8, 10]
            }),
            image: this.imageCircle(15)
          }), new ol_style__WEBPACK_IMPORTED_MODULE_18__["Style"]({
            image: this.imageCircle(10)
          }), new ol_style__WEBPACK_IMPORTED_MODULE_18__["Style"]({
            image: this.imageCircle(5)
          })];
          return editingstyle;
        }
      }, {
        key: "imageCircle",
        value: function imageCircle(radius) {
          return new ol_style_Circle__WEBPACK_IMPORTED_MODULE_19__["default"]({
            stroke: new ol_style__WEBPACK_IMPORTED_MODULE_18__["Stroke"]({
              color: 'red',
              width: 2
            }),
            radius: radius // equivale a radius: radius

          });
        }
      }, {
        key: "enableAddShape",
        value: function enableAddShape(shape) {
          var _this6 = this;

          /** enable the map to draw shape of the Shapetype
           * @param shape: string, type of shape to add e.g., 'POINT', 'LINE', 'CIRCLE'
           */
          // previously addShapeToLayer check the API OL
          // console.log ('shape', shape, this.curEditingLayer);
          var self = this;

          if (!this.curEditingLayer) {
            alert('No layer selected to edit');
            return;
          }
          /*  commented on 23/06
          let tsource: any = null;
          this.map.getLayers().forEach(
            layer => {
              if (layer.get('name') === self.curEditingLayer.layerName) {
                tsource = layer.getSource();
                // console.log('Finds the current layer to add shapes', tsource);
              }
            }); */


          var tsource = this.curEditingLayer.source; // console.log('Finds the current layer to add shapes', this.curEditingLayer, tsource);

          var type;
          var geometryFunction; // deactivate tany interaction? or remove?

          this.removeInteractions(); // remove select, modify, delete interactions

          try {
            // this.cacheFeatures = [];  // to remove whatever is there and only undo the last action
            switch (shape) {
              case 'Point':
                {
                  this.draw = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Draw"]({
                    source: tsource,
                    type: shape,
                    freehand: false,
                    stopClick: true,
                    style: this.getEditingStyle()
                  });
                  this.removeDragPinchInteractions(); // a ver si el mapa deja de moverse cuando se dibuja

                  break;
                }

              case 'LineString':
                {
                  this.draw = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Draw"]({
                    source: tsource,
                    type: shape,
                    freehand: true,
                    stopClick: true,
                    style: this.getEditingStyle(),
                    condition: function condition(olBrowserEvent) {
                      if (olBrowserEvent.originalEvent.touches) {
                        console.log('tocuhes legth', olBrowserEvent.originalEvent.touches.length);
                        return olBrowserEvent.originalEvent.touches.length < 2;
                      } // dibuja si hay menos de undos dedos..--> mo working


                      return false;
                    }
                  });
                  this.removeDragPinchInteractions(); // to fix the zig zag lines #TODO test it

                  break;
                }

              case 'Polygon':
                {
                  this.draw = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Draw"]({
                    source: tsource,
                    type: shape,
                    freehand: true,
                    stopClick: true,
                    style: this.getEditingStyle(),
                    condition: function condition(olBrowserEvent) {
                      if (olBrowserEvent.originalEvent.touches) {
                        return olBrowserEvent.originalEvent.touches.length < 2;
                      } // dibuja si hay menos de undos dedos..--> mo working


                      return false;
                    }
                  });
                  break;
                }

              case 'Square':
                {
                  this.draw = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Draw"]({
                    source: tsource,
                    type: shape,
                    freehand: true,
                    stopClick: true,
                    style: this.getEditingStyle(),
                    condition: function condition(olBrowserEvent) {
                      if (olBrowserEvent.originalEvent.touches) {
                        return olBrowserEvent.originalEvent.touches.length < 2;
                      } // dibuja si hay menos de undos dedos..--> mo working


                      return false;
                    }
                  });
                  break;
                }

              case 'Circle':
                {
                  // #TODO change code
                  this.draw = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Draw"]({
                    source: tsource,
                    type: shape,
                    freehand: true,
                    stopClick: true,
                    style: this.getEditingStyle(),
                    condition: function condition(olBrowserEvent) {
                      if (olBrowserEvent.originalEvent.touches) {
                        return olBrowserEvent.originalEvent.touches.length < 2;
                      } // dibuja si hay menos de undos dedos..--> mo working


                      return false;
                    }
                  });
                  break;
                }
            }

            this.map.addInteraction(this.draw); // adding snap interaction always after th draw interaction

            this.snap = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Snap"]({
              source: tsource
            });
            this.map.addInteraction(this.snap);
            this.createMeasureTooltip();
            var listener;
            this.draw.on('drawstart', function (evt) {
              var sketch = evt.feature;
              var tooltipCoord = evt.coordinate;
              listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output; // show the tooltip only when drawing polys

                if (self.draw.type_ === 'LineString' && self.curEditingLayer.geometry === 'Polygon') {
                  // self.curEditingLayer[2]
                  //    let geom = e.feature.getProperties().geometry;
                  var last = geom.getLastCoordinate();
                  var first = geom.getFirstCoordinate();
                  var sourceProj = self.map.getView().getProjection();
                  var distance = Object(ol_sphere__WEBPACK_IMPORTED_MODULE_5__["getDistance"])(Object(ol_proj__WEBPACK_IMPORTED_MODULE_6__["transform"])(first, sourceProj, 'EPSG:4326'), Object(ol_proj__WEBPACK_IMPORTED_MODULE_6__["transform"])(last, sourceProj, 'EPSG:4326')); // # TODO aqui revisar el buffer y lo demas.

                  if (distance < _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].threshold) {
                    output = Math.round(distance * 100) / 100 + ' ' + 'm'; // round to 2 decimal places

                    tooltipCoord = geom.getFirstCoordinate();
                    self.measureTooltipElement.innerHTML = output;
                    self.measureTooltip.setPosition(tooltipCoord);
                  }
                }
              });
            });
            this.draw.on('drawend', function (e) {
              // adding an temporal ID, to handle undo
              e.feature.setId(_this6.curEditingLayer.layerName.concat('.', String(_this6.featId)));
              _this6.featId = _this6.featId + 1; // setting the class to set a style

              if (_this6.currentClass) {
                e.feature.set('class', _this6.currentClass);
              } else {
                alert('Select a symbol');
                return; // #TODO check this
              } // console.log('feat', e.feature, e.feature.getStyle());
              // correct geometry when drawing circles


              if (self.draw.type_ === 'Circle' && e.feature.getGeometry().getType() !== 'Polygon') {
                e.feature.setGeometry(new ol_geom_Polygon__WEBPACK_IMPORTED_MODULE_24__["fromCircle"](e.feature.getGeometry()));
              } // automatic closing of lines to produce a polygon


              if (self.draw.type_ === 'LineString' && self.curEditingLayer.geometry === 'Polygon') {
                console.log('cuando entra aqui');
                var geom = e.feature.getProperties().geometry;
                var threshold = _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].threshold;
                var last = geom.getLastCoordinate();
                var first = geom.getFirstCoordinate();

                var sourceProj = _this6.map.getView().getProjection(); // transform coordinates to a 4326 to use getDistance


                var distance = Object(ol_sphere__WEBPACK_IMPORTED_MODULE_5__["getDistance"])(Object(ol_proj__WEBPACK_IMPORTED_MODULE_6__["transform"])(first, sourceProj, 'EPSG:4326'), Object(ol_proj__WEBPACK_IMPORTED_MODULE_6__["transform"])(last, sourceProj, 'EPSG:4326')); //

                if (distance < threshold) {
                  var newCoordinates = e.feature.getProperties().geometry.getCoordinates();
                  newCoordinates.push(first); // console.log("la crea o no antes ?", newCoordinates[newCoordinates.length -1]);

                  var tgeometry = new ol_geom__WEBPACK_IMPORTED_MODULE_23__["Polygon"]([newCoordinates]);

                  if (tgeometry) {
                    e.feature.setGeometry(tgeometry);
                  }
                }

                self.measureTooltipElement.className = 'tooltip tooltip-static'; // #TODO styling is not working

                self.measureTooltip.setOffset([0, -7]);
              } // adding the interactions that were stopped when drawing


              if (self.draw.type_ === 'Point' || self.draw.type_ === 'Circle') {
                // console.log('interaction en el timeout', self.map.getInteractions());
                setTimeout(function () {
                  self.addDragPinchInteractions();
                }, 1000);
              } // adding features to a buffer cache


              self.editBuffer.push({
                layerName: self.curEditingLayer.layerName,
                transaction: 'insert',
                feats: e.feature,
                dirty: true,
                // 'layer': self.curEditingLayer[0],
                source: tsource
              }); // console.log('editbuffer', self.editBuffer);

              self.canBeUndo = true;
              self.cacheFeatures.push({
                layerName: self.curEditingLayer.layerName,
                transaction: 'insert',
                feats: e.feature,
                dirty: true,
                // 'layer': self.curEditingLayer[0],
                source: tsource
              }); // unset tooltip so that a new one can be created

              self.measureTooltipElement.innerHTML = '';
              self.measureTooltipElement = null;
              self.map.removeOverlay(self.measureTooltip);
              self.createMeasureTooltip();
            });
          } catch (e) {
            console.log('Error adding draw interactions', e);
          }
        }
      }, {
        key: "startDeleting",
        value: function startDeleting() {
          var _this7 = this;

          /** Creates a new select interaction that will be used to delete features
           * in the current editing layer  #TODO: simplify if possible concerning wfs layers and sketch layers
           */
          var tlayer;

          try {
            this.map.getLayers().forEach(function (layer) {
              if (layer.get('name') === _this7.curEditingLayer.layerName) {
                console.log('layer.get(\'name\')', layer.get('name'), _this7.curEditingLayer.layerName === layer.get('name'));
                tlayer = layer;
                return;
              }
            });
          } catch (e) {
            console.log('error getting the layer in deleting', e);
          }

          this.select = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Select"]({
            condition: ol_events_condition_js__WEBPACK_IMPORTED_MODULE_27__["click"],
            layers: [tlayer],
            hitTolerance: 7 // check if this is enough

          });
          this.map.addInteraction(this.select);
          var self = this;
          var dirty = true; // HERE add code to delete from the source and add to the buffer

          this.select.on('select', function (e) {
            var selectedFeatures = e.target.getFeatures(); // const cacheFeatures = [];

            if (selectedFeatures.getLength() <= 0) {
              return;
            }

            if (self.curEditingLayer.geometry === 'Point' || self.curEditingLayer.geometry === 'Line' || self.curEditingLayer.geometry === 'Polygon') {
              selectedFeatures.forEach(function (f) {
                var lastFeat = f.clone();
                lastFeat.setId(f.getId()); // to enable adding the feat again?

                var tempId = f.getId(); // cacheFeatures.push(lastFeat);
                // remove feature from the source

                self.curEditingLayer.source.removeFeature(f); // insert feature in a cache --> for undo

                self.editBuffer.push({
                  layerName: self.curEditingLayer.layerName,
                  transaction: 'delete',
                  feats: lastFeat,
                  dirty: dirty,
                  source: self.curEditingLayer.source
                });
              }); // clear the selection --> the style will also be clear

              self.select.getFeatures().clear(); // update the possibility to undo and the cache for that

              self.canBeUndo = true; // self.cacheFeatures.push(cacheFeatures); // this keep open the possibility to delete several an undo several actions

              console.log('cache', self.cacheFeatures);
              console.log('editBuffer', self.editBuffer);
              return;
            } else {
              // this.ediLayer.geometry is different .. so a sketch layer
              selectedFeatures.forEach(function (f) {
                // cacheFeatures.push(());
                // insert feature in a cache --> for undo
                self.editBuffer.push({
                  layerName: self.curEditingLayer.layerName,
                  transaction: 'delete',
                  feats: f.clone(),
                  dirty: true,
                  source: self.curEditingLayer.source
                });
                self.curEditingLayer.removeFeature(f);
              }); // clear the selection --> the style will also be clear

              self.select.getFeatures().clear(); // self.curEditingLayer.source.refresh(); // #TODO is this needed?
              // update the possibility to undo

              self.canBeUndo = true;
            }
          });
        }
      }, {
        key: "removeDragPinchInteractions",
        value: function removeDragPinchInteractions() {
          try {
            var self = this;
            this.map.getInteractions().forEach(function (interaction) {
              if (interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragPan"] || interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragZoom"] || interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragRotate"] || interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["PinchZoom"] || interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["PinchRotate"]) {
                // self.map.removeInteraction(interaction);
                interaction.setActive(false);
              }
            });
            console.log('es posible que aun quede pinchzoom? o se puede incluir en el if de arriba', this.map.getInteractions());

            if (this.pinchZoom) {
              this.map.removeInteraction(this.pinchZoom); // check if is there
            }

            if (this.pinchRotate) {
              this.map.removeInteraction(this.pinchRotate); // check if is there
            }
          } catch (e) {
            console.log('Error removing Drag/Pinch interactions', e);
          }
        }
      }, {
        key: "loadWFSlayers",
        value: function loadWFSlayers(XmlCapText) {
          var _this8 = this;

          /** This function load in the map, the layers available in the QGS project via WFS
           * @param XmlCapText the xml text produced by the getCapabilities request
           */
          var self = this;
          var xmlParser = new DOMParser();
          var xmlText = xmlParser.parseFromString(XmlCapText, 'text/xml');
          var featureTypeList = xmlText.getElementsByTagName('FeatureTypeList')[0]; // console.log('XmlCapText', XmlCapText);

          var tnodes = {};
          var otherSrsLst = [];
          var operationsLst = [];
          var srs;
          var operation;
          var nLayers = featureTypeList.children.length - 1; // te feature list contains a set of operations too

          var _loop = function _loop(i) {
            // let node = featureList[i];
            var node = featureTypeList.getElementsByTagName('FeatureType')[i]; // console.log("node",node);

            var layerName = node.getElementsByTagName('Name')[0].childNodes[0].nodeValue;
            var layerTitle = node.getElementsByTagName('Title')[0].childNodes[0].nodeValue;
            var defaultSRS = node.getElementsByTagName('DefaultSRS')[0].childNodes[0].nodeValue; // validation or warning
            // tslint:disable-next-line:triple-equals

            if (defaultSRS != _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].srsName) {// #TODO uncomment the following line
              // alert(`The layer ${ layerName }has a different default SRS than the SRS of the project`);
            }

            var otherSrs = node.getElementsByTagName('OtherSRS'); // this will get a list

            for (var j = 0; j < otherSrs.length; j++) {
              srs = node.getElementsByTagName('OtherSRS')[j].childNodes[0].nodeValue;

              if (srs.length > 0) {
                otherSrsLst[j] = srs;
              }
            }

            var operations = node.getElementsByTagName('Operations')[0]; // this will get a list

            for (var _j = 0; _j < operations.children.length; _j++) {
              operation = operations.getElementsByTagName('Operation')[_j].childNodes[0].nodeValue;

              if (operation.length > 0) {
                operationsLst[_j] = operation;
              }
            } // adding a log message for a warning concerning the operations available in the projects


            if (!operationsLst.includes('Query') || !operationsLst.includes('Insert') || !operationsLst.includes('Update') || !operationsLst.includes('Delete')) {// #TODO uncomment alert (`The layer ${ layerTitle } is missing an updating operation, please check your WFS configuration`);
            }

            var bBox = node.getElementsByTagName('ows:WGS84BoundingBox')[0];
            var dimensions = bBox.getAttribute('dimensions');
            var lowCorner = bBox.getElementsByTagName('ows:LowerCorner')[0].childNodes[0].nodeValue; // x and y

            var upperCorner = bBox.getElementsByTagName('ows:UpperCorner')[0].childNodes[0].nodeValue; // x and y
            // adding a log message for a warning concerning the extension
            // tslint:disable-next-line:triple-equals

            if (lowCorner.split(' ')[0] == '0' && lowCorner.split(' ')[1] == '0' && // tslint:disable-next-line:triple-equals
            upperCorner.split(' ')[0] == '0' && upperCorner.split(' ')[1] == '0') {} // #TODO uncomment alert (`The BBOX of ${ layerTitle } might be misConfigured, please check the WFS service`);
            // #TODO: raise a warning if the operations excludes Query, Insert, Update or delete
            // console.log("bBox", dimensions, [lowCorner.split(" ")[0], lowCorner.split(" ")[1]]);


            if (layerName.length > 0) {
              // store layer properties to use later
              var geom = _this8.findGeometryType(layerName); // check editable fields
              // load the layer in the map


              var qGsProject = _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].QgsFileProject;
              var qGsServerUrl = _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].qGsServerUrl;
              var outputFormat = '&outputFormat=GeoJSON';
              var loadedLayers = [];
              var wfsVersion = 'SERVICE=WFS&VERSION=' + _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].wfsVersion; // console.log('layername', layerName, 'urlWFS', urlWFS);

              var urlWFS = qGsServerUrl + wfsVersion + '&request=GetFeature&typename=' + layerName + outputFormat + '&srsname=' + defaultSRS + '&map=' + qGsProject;

              try {
                var vectorSource = new ol_source_Vector__WEBPACK_IMPORTED_MODULE_10__["default"]({
                  format: new ol_format__WEBPACK_IMPORTED_MODULE_20__["GeoJSON"](),
                  // the url can be setup to include extent, projection and resolution
                  url: urlWFS
                });
                var wfsVectorLayer = new ol_layer_Vector__WEBPACK_IMPORTED_MODULE_11__["default"]({
                  source: vectorSource,
                  name: layerName,
                  // extent [minx, miny, maxx, maxy].
                  // extent: [lowCorner.split(' ')[0], lowCorner.split(' ')[1],
                  //  upperCorner.split(' ')[0], upperCorner.split(' ')[1]],
                  visible: true,
                  zIndex: nLayers - i,
                  style: function style(feature) {
                    // console.log(feature.getGeometry().getType(), name);
                    var layerStyle = self.mapQgsStyleService.findStyle(feature, layerName);

                    if (!layerStyle) {
                      layerStyle = self.mapQgsStyleService.findDefaultStyleProvisional(feature.getGeometry().getType(), layerName);
                    }

                    return layerStyle;
                  }
                });
                tnodes[layerName] = {
                  layerName: layerName,
                  // layerGeom,
                  layerTitle: layerTitle,
                  defaultSRS: defaultSRS,
                  otherSrs: otherSrsLst,
                  lowCorner: [lowCorner.split(' ')[0], lowCorner.split(' ')[1]],
                  upperCorner: [upperCorner.split(' ')[0], upperCorner.split(' ')[1]],
                  operations: operationsLst,
                  geometry: geom,
                  source: vectorSource // dimensions: dimensions,
                  // bbox: bBox,

                };

                _this8.map.addLayer(wfsVectorLayer);

                _this8.loadedWfsLayers.push(tnodes[layerName]); // wfsVectorLayer
                // console.log(`Layer added ${ layerName }`);

              } catch (e) {
                console.log("An error occurred when adding the ".concat(layerTitle), e);
              }
            }
          };

          for (var i = 0; i < nLayers; i++) {
            _loop(i);
          } // this.loadedWfsLayers = tnodes;
          // console.log('loaded layers', this.loadedWfsLayers);


          return this.loadedWfsLayers;
        }
      }, {
        key: "loadDefaultMap",
        value: function loadDefaultMap() {// aqui uun default Map #TODO
        }
      }, {
        key: "readProjectFile",
        value: function readProjectFile(projectFile) {
          var qgsProj = fetch(projectFile, {
            method: 'GET'
          }).then(function (response) {
            return response.text();
          }).then(function (text) {
            // console.log(text);
            return text;
          })["catch"](function (err) {
            console.log('Error', err);
            return '';
          });
          return qgsProj;
        }
      }, {
        key: "updateMapVisibleLayer",
        value: function updateMapVisibleLayer(selectedLayer) {
          /** update the visibility of a layer in the map
           * @param selectedLayer the layer that was clicked to show/hide
           */
          // console.log('prueba event capture from child emitter', selectedLayer);
          this.map.getLayers().forEach(function (layer) {
            // tslint:disable-next-line:triple-equals
            if (selectedLayer.layerName == layer.get('name')) {
              layer.setVisible(!layer.getVisible());
            }
          });
        }
      }, {
        key: "updateEditingLayer",
        value: function updateEditingLayer(layer) {
          // console.log('evento emitido, que llega', layer);

          /**  starts or stops the editing mode for the layerName given
           * if there were some edits --> asks for saving changes
           * @param layerName: the layer that the user select to start/stop editing
           */
          // tslint:disable-next-line:triple-equals
          if (this.curEditingLayer) {
            // a layer was being edited - ask for saving changes
            this.stopEditing(this.curEditingLayer); // test is changes are save to the rigth layer, otherwise it should go #

            if (this.curEditingLayer === layer) {
              this.curEditingLayer = null;
              return;
            }
          } // the user wants to switch to another layer, already the edit was stopped with the previous layer


          this.curEditingLayer = layer;
          this.startEditing(layer);
        }
      }, {
        key: "stopEditing",
        value: function stopEditing(editLayer) {
          /** Disables the interactions on the map to start moving/panning and stop drawing
           *  asks to save changes in the layer if any and call the function for it.
           *  @param editLayer, the layer that was edited / #TODO editLayer is not required
           */
          // stop interactions
          // clear current class and symbol --> it is necessary? when stopping editing but not for saving;
          this.currentClass = null;
          this.currentStyle = null;
          this.removeInteractions();
        }
      }, {
        key: "saveEdits",
        value: function saveEdits(editLayer) {
          // console.log('editBuffer.indexOf(editLayer.layerName', this.editBuffer.findIndex(x => x.layerName ===  editLayer.layerName) );
          console.log('en save', this.editBuffer);

          if (!(this.editBuffer.length > 0)) {
            // nothing to save
            return;
          }

          if (this.editBuffer.findIndex(function (x) {
            return x.layerName === editLayer.layerName;
          }) === -1) {
            // nothing to save in the editLayer
            return;
          }

          if (editLayer.geometry === 'Point' || editLayer.geometry === 'Line' || editLayer.geometry === 'Polygon') {
            this.writeTransactWfs(editLayer);
          } else {
            this.saveSketchLayer(editLayer); // it is a 'multi' geometry --> sketch layer
          }
        }
      }, {
        key: "saveSketchLayer",
        value: function saveSketchLayer(editLayer) {
          // #TODO

          /** saves the changes in a sketch layer
           * @param editLayer: name of the layer to be saved.
           */
          if (this.editBuffer.length > 0) {
            if (!confirm('Do you want to save changes?')) {
              //  do not want to save changes
              return;
            }

            this.saveSketchLayer(editLayer); // save the changes

            return;
          }
        }
      }, {
        key: "startEditing",
        value: function startEditing(layer) {
          /** Enables the interaction in the map to draw features
           * and update two observables in openLayerService:
           * the geometry type of the layer being edited, and
           * the visibility of the editing toolbar
           */
          // console.log ('entra a startEditing', layer );
          try {
            // this.removeInteractions();  //#TODO verify this is done in addShape
            // update the observables
            this.openLayersService.updateShowEditToolbar(true);
            this.openLayersService.updateLayerEditing(layer.layerName, layer.geometry); // clear caches and styles  // #TODO best way to do...
            // this.cacheFeatures = [];

            this.currentClass = null; // forcing the user to pick and style and cleaning previous style? check
          } catch (e) {
            alert('Error starting editing...');
          }
        }
      }, {
        key: "removeFeatEditBuffer",
        value: function removeFeatEditBuffer(feat) {
          var _this9 = this;

          /**
           * removes a feature from the editBuffer
           * @param feat: the feat to be removed
           */
          this.editBuffer.forEach(function (item, index) {
            if (item.feats === feat) {
              _this9.editBuffer.splice(index, 1);
            }
          });
        }
      }, {
        key: "undoLastEdit",
        value: function undoLastEdit() {
          var _this10 = this;

          /**
           * Undo the last action (insert, update (move), delete)   #TODO update observable to disable button
           * uses the this.editBuffer to do so and the cacheFeatures
           */
          // get only the records for the current layer
          var curEdits = this.editBuffer.filter(function (obj) {
            return obj.layerName === _this10.curEditingLayer.layerName;
          }); // console.log('curEdits and this.editBuffer', curEdits, this.editBuffer);

          if (!(curEdits.length > 0)) {
            // nothing to save in current layer
            return;
          }

          var lastOperation = this.editBuffer.filter(function (obj) {
            return obj.layerName === _this10.curEditingLayer.layerName;
          }).pop(); // curEdits.pop();

          console.log('lastOperatoion', lastOperation);

          switch (lastOperation.transaction) {
            // rotate and translate are treated as update #TODO change attributes
            case 'insert':
              {
                // remove from the source
                console.log('feat', lastOperation.feats);
                this.curEditingLayer.source.removeFeature(lastOperation.feats);
                break;
              }

            case 'update':
              {
                // change to the oldFeat // there could be several features
                lastOperation.feats.forEach(function (feat) {
                  var oldFeat = feat.get('oldFeat');
                  oldFeat.getGeometry();
                  var curFeatGeomClone = feat.getGeometry().clone(); // set the geometry to the old one

                  feat.setGeometry(oldFeat.getGeometry()); // set the new old geometry to the current one

                  feat.set('oldFeat', curFeatGeomClone); // Changes should be available in the buffer
                });
                break;
              }

            case 'delete':
              {
                // insert back
                // console.log('temp feat', lastOperation.feats.getProperties().class);
                lastOperation.feats.setStyle(null); // to allow the style function of the layer to render the feat properly

                this.curEditingLayer.source.addFeature(lastOperation.feats); // TODO styling  //lastOperation.feats
                // this.removeFeatEditBuffer(lastOperation.feats);
              }
          } // remove from the edit Buffer


          this.removeFeatEditBuffer(lastOperation.feats);
          console.log('this.editBuffer', this.editBuffer);
        }
      }, {
        key: "writeTransactWfs",
        value: function writeTransactWfs(editLayer) {
          var _this11 = this;

          console.log("entra a save...", this.editBuffer);
          /** saves changes on a wfs layer
           * @param editLayer: layer to save changes stored in the editBuffer
           */
          // sacar los elementos de la capa y remover del arreglo.

          var layerTrs = []; // initialize

          layerTrs[editLayer.layerName] = []; // is this needed?

          layerTrs[editLayer.layerName].insert = [];
          layerTrs[editLayer.layerName]["delete"] = [];
          layerTrs[editLayer.layerName].update = [];
          layerTrs[editLayer.layerName].source = editLayer.source;
          this.editBuffer.forEach(function (t) {
            // create the node for CRU
            // console.log("la consigue o no", layer.get('name'));
            if (t.layerName === editLayer.layerName) {
              // save edits in current edit layer
              switch (t.transaction) {
                case 'insert':
                  layerTrs[editLayer.layerName].insert.push(t.feats); // t.feats is only one feat

                  break;

                case 'delete':
                  layerTrs[editLayer.layerName]["delete"].push(t.feats); // t.feats is one feat #TODO next ver delete several

                  break;

                case 'update':
                  /* t.feats.forEach(f => {
                    layerTrs[editLayer.layerName].update.push(f); // t.feats is an array with one or several feats
                  }); */
                  layerTrs[editLayer.layerName].update.push(t.feats[0]); // t.feats is an array with one or several feats

                  break;
              }
            }
          });
          console.log('array insert', layerTrs[editLayer.layerName].insert);
          console.log('array update', layerTrs[editLayer.layerName].update);
          console.log('array delete', layerTrs[editLayer.layerName]["delete"]); // Another solution can be to empty the editBuffer here --> it could be some data loss if the insertion fails
          // configure nodes.

          var strService = 'SERVICE=WFS&VERSION=' + _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].wfsVersion + '&REQUEST=DescribeFeatureType';
          var strUrl = _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].qGsServerUrl + strService + '&map=' + _app_configuration__WEBPACK_IMPORTED_MODULE_2__["AppConfiguration"].QgsFileProject;
          var formatWFS = new ol_format_WFS__WEBPACK_IMPORTED_MODULE_25__["default"]();
          var formatGML = new ol_format_GML__WEBPACK_IMPORTED_MODULE_26__["default"]({
            featureNS: 'http://localhost',
            featureType: editLayer.layerName
          });
          var node;
          var xs = new XMLSerializer();
          var str;
          var res; // Edits should be done in chain... 1)insert, 2)updates, 3) deletes

          if (layerTrs[editLayer.layerName].insert.length > 0) {
            node = formatWFS.writeTransaction(layerTrs[editLayer.layerName].insert, null, null, formatGML);
            str = xs.serializeToString(node);
            return fetch(strUrl, {
              method: 'POST',
              body: str
            }).then(function (textInsert) {
              console.log('text response insert WFS', textInsert.text());
              layerTrs[editLayer.layerName].insert = [];

              if (layerTrs[editLayer.layerName].update.length > 0) {
                // Edits should be done in chain... 1)insert, 2)updates, 3) deletes
                node = formatWFS.writeTransaction(null, layerTrs[editLayer.layerName].update, null, formatGML);
                str = xs.serializeToString(node);
                console.log('pasa x aqui?');
                return fetch(strUrl, {
                  method: 'POST',
                  body: str
                }).then(function (respUpdate) {
                  console.log('text response update WFS', respUpdate.text());
                  layerTrs[editLayer.layerName].update = [];

                  if (layerTrs[editLayer.layerName]["delete"].length > 0) {
                    // Edits should be done in chain... 1)insert, 2)updates, 3) deletes // if enter here only deletes were done
                    node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName]["delete"], formatGML);
                    str = xs.serializeToString(node);
                    return fetch(strUrl, {
                      method: 'POST',
                      body: str
                    }).then(function (respDelete) {
                      return respDelete.text();
                    }).then(function (textDelete) {
                      console.log('text response update WFS', textDelete);
                      layerTrs[editLayer.layerName]["delete"] = [];
                    })["catch"](function (error) {
                      return console.error(error);
                    });
                  }
                });
              }
            }).then(function () {
              // cleaning the editbuffer after inserting - updating and deleting
              _this11.editBuffer = _this11.editBuffer.filter(function (obj) {
                return obj.layerName !== editLayer.layerName;
              });
              console.log('this.editBufferTemp after saving', _this11.editBuffer);
            });
          }

          if (layerTrs[editLayer.layerName].update.length > 0) {
            // Edits should be done in chain... 1)insert, 2)updates, 3) deletes // if enter here no inserts were done
            node = formatWFS.writeTransaction(null, layerTrs[editLayer.layerName].update, null, formatGML);
            str = xs.serializeToString(node);
            return fetch(strUrl, {
              method: 'POST',
              body: str
            }).then(function (respUpdate) {
              console.log('text response update WFS', respUpdate.text());
              layerTrs[editLayer.layerName].update = [];

              if (layerTrs[editLayer.layerName]["delete"].length > 0) {
                // Edits should be done in chain... 1)insert, 2)updates, 3) deletes // if enter here only deletes were done
                node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName]["delete"], formatGML);
                str = xs.serializeToString(node);
                return fetch(strUrl, {
                  method: 'POST',
                  body: str
                }).then(function (respDelete) {
                  return respDelete.text();
                }).then(function (textDelete) {
                  console.log('text response update WFS', textDelete);
                  layerTrs[editLayer.layerName]["delete"] = [];
                  console.log('edit array', layerTrs[editLayer.layerName]["delete"]);
                });
              }
            }).then(function () {
              // cleaning the editbuffer when only updates and deletes where done
              _this11.editBuffer = _this11.editBuffer.filter(function (obj) {
                return obj.layerName !== editLayer.layerName;
              });
              console.log('this.editBufferTemp after saving', _this11.editBuffer);
            });
          }

          if (layerTrs[editLayer.layerName]["delete"].length > 0) {
            console.log('entra aqui?.. mientras espera la subscription..'); // Edits should be done in chain... 1)insert, 2)updates, 3) deletes // if enter here only deletes were done

            node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName]["delete"], formatGML);
            str = xs.serializeToString(node);
            return fetch(strUrl, {
              method: 'POST',
              body: str
            }).then(function (respDelete) {
              return respDelete.text();
            }).then(function (respDelete) {
              console.log('text response update WFS', respDelete);
              layerTrs[editLayer.layerName]["delete"] = []; // cleaning the editbuffer when only deletes were done

              _this11.editBuffer = _this11.editBuffer.filter(function (obj) {
                return obj.layerName !== editLayer.layerName;
              });
              console.log('this.editBufferTemp after saving', _this11.editBuffer);
            });
          }
        }
      }, {
        key: "saveWFSAll",
        value: function saveWFSAll() {
          /** this saves all the changes accumulated in the editWFSbuffer
           * it helps to prevent any data loss
           * #TODO
           */
        }
      }, {
        key: "findLayer",
        value: function findLayer(layername) {
          var _this12 = this;

          /**
           * find the object layer with the name @layername
           * @param layername: string, the name of the layer to find
           * @return tlayer: the object layer found
           */
          var tlayer = null;

          try {
            this.map.getLayers().forEach(function (layer) {
              if (layer.get('name') === layername) {
                console.log('layer.get(\'name\')', layer.get('name'), _this12.curEditingLayer.layerName === layer.get('name'));
                tlayer = layer;
                return tlayer;
              }
            });
          } catch (e) {
            console.log('error getting the layer', e);
          }
        }
      }, {
        key: "startTranslating",
        value: function startTranslating() {
          var _this13 = this;

          /** enables to move (translate features selected with a rectangle
           * The user first select the features and then click in the location where those features will be located
           * so far no difference in the code for sketch and WFS layers..
           */
          var lyr = this.findLayer(this.curEditingLayer.layerName);
          var updateFeats = [];

          if (lyr === null) {
            alert('Error retrieving current layer');
            return;
          }

          this.removeInteractions();
          this.select = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Select"]({
            layers: [lyr],
            condition: ol_events_condition_js__WEBPACK_IMPORTED_MODULE_27__["click"],
            hitTolerance: 7,
            style: this.selectStyle
          });
          this.map.addInteraction(this.select);
          console.log('interactions in the map', this.map.getInteractions());
          this.dragBox = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragBox"]({
            className: 'boxSelect'
          });
          this.map.addInteraction(this.dragBox);
          var self = this;
          var tsource = this.curEditingLayer.source; // add #TODO here the rest of the code.
          // clear a previous selection

          this.dragBox.on('boxend', function () {
            if (_this13.dragBox.getGeometry() == null) {
              return;
            }

            var extent = _this13.dragBox.getGeometry().getExtent();

            tsource.forEachFeatureIntersectingExtent(extent, function (f) {
              var lastFeat = f.clone();
              lastFeat.setId(f.getId());
              f.set('oldFeat', lastFeat);
              self.select.getFeatures().push(f);
              self.cacheFeatures.push({
                layerName: self.curEditingLayer.layerName,
                transaction: 'translate',
                feats: lastFeat,
                source: self.curEditingLayer.source
              });
            });
          }); // Add the translation interaction to the selected features

          var selectedFeatures = this.select.getFeatures();
          this.translate = new ol_interaction__WEBPACK_IMPORTED_MODULE_16__["Translate"]({
            features: selectedFeatures
          });
          this.map.addInteraction(this.translate); // insert features into the editBuffer and cacheFeatures

          this.translate.on('translateend', function () {
            console.log('selected features', selectedFeatures);
            selectedFeatures.forEach(function (f) {
              updateFeats.push(f);
            }); // const tempId = f.getId();
            // independently of old or new feat, just add the translation) #TODO check if the order is correct --> last position is saved

            self.editBuffer.push({
              layerName: self.curEditingLayer.layerName,
              transaction: 'update',
              feats: updateFeats,
              source: tsource
            });

            _this13.select.getFeatures().clear();
          });
          console.log('self.editBuffer', self.editBuffer); // clear the selection
          //
          // action can be undo

          this.canBeUndo = true; // each time of starting a box clear features

          this.dragBox.on('boxstart', function () {
            self.select.getFeatures().clear();
          });
        }
      }, {
        key: "startRotating",
        value: function startRotating() {}
      }, {
        key: "startCopying",
        value: function startCopying() {}
      }, {
        key: "startIdentifying",
        value: function startIdentifying() {}
      }, {
        key: "startMeasuring",
        value: function startMeasuring() {}
      }, {
        key: "updateOrderVisibleLayers",
        value: function updateOrderVisibleLayers(editLayers) {
          var _this14 = this;

          /** updates the order in which layers are rendered in the map
           * @param editLayers: the list of layers to arrange the order (emitted by the layerPanel component)
           */
          var nLayers = editLayers.length;
          var tIndex = 1;

          var _iterator2 = _createForOfIteratorHelper(editLayers),
              _step2;

          try {
            var _loop2 = function _loop2() {
              var lyr = _step2.value;

              _this14.map.getLayers().forEach(function (layer) {
                if (layer.get('name') == lyr.layerName) {
                  layer.setZIndex(nLayers - tIndex);
                  tIndex = tIndex + 1;
                }
              });
            };

            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              _loop2();
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }, {
        key: "removeInteractions",
        value: function removeInteractions() {
          /**
           * Remove the interactions to draw, select or move
           */
          try {
            this.map.removeInteraction(this.draw);
            this.map.removeInteraction(this.select);
            this.map.removeInteraction(this.translate);
            this.map.removeInteraction(this.snap);
            this.map.removeInteraction(this.dragBox);
            /* this.draw.setActive(false);
             this.select.setActive(false);
             this.translate.setActive(false);
             this.snap.setActive(false);
             this.dragBox.setActive(false); */
          } catch (e) {
            console.log('Error removing interactions', e);
          }
        }
      }, {
        key: "findGeometryType",
        value: function findGeometryType(layerName) {
          /** Finds the geometry type of the layerName by looking in the dictionary filled when parsing the QGS project
           * @oaram layerName: the name of the layer to look for the geometry type
           */
          var geometryType = null;

          if (this.layersGeometryType[layerName]) {
            geometryType = this.layersGeometryType[layerName].layerGeom;
          } // console.log('geometryType', layerName, geometryType);


          return geometryType;
        }
      }, {
        key: "addDragPinchInteractions",
        value: function addDragPinchInteractions() {
          // console.log("aqui agregando dragpinch", this.map.getInteractions());
          try {
            var self = this;
            this.map.getInteractions().forEach(function (interaction) {
              if (interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragPan"] || interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragZoom"] || interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["DragRotate"] || interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["PinchZoom"] || interaction instanceof ol_interaction__WEBPACK_IMPORTED_MODULE_16__["PinchRotate"]) {
                interaction.setActive(true); // self.map.removeInteraction(interaction);
              }
            });

            if (!this.pinchZoom) {
              this.map.addInteraction(this.pinchZoom); // check if is there
            }

            if (!this.pinchRotate) {
              this.map.addInteraction(this.pinchRotate); // check if is there
            }
          } catch (e) {
            console.log('Error readding Drag/Pinch interactions', e);
          }
        }
      }, {
        key: "ngOnDestroy",
        value: function ngOnDestroy() {
          // prevent memory leak when component destroyed
          // unsubscribe all the subscriptions
          var subscriptions = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
          subscriptions.add(this.subsTocurrentSymbol).add(this.subsToShapeEdit);
          subscriptions.unsubscribe();
        }
      }]);

      return MapComponent;
    }();

    MapComponent.ɵfac = function MapComponent_Factory(t) {
      return new (t || MapComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_map_qgs_style_service__WEBPACK_IMPORTED_MODULE_28__["MapQgsStyleService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_open_layers_service__WEBPACK_IMPORTED_MODULE_29__["OpenLayersService"]));
    };

    MapComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: MapComponent,
      selectors: [["app-map"]],
      decls: 2,
      vars: 1,
      consts: [["id", "map", 1, "map"], [3, "editLayers", "layerVisClick", "editLayerClick", "layersOrder"]],
      template: function MapComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "app-layer-panel", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("layerVisClick", function MapComponent_Template_app_layer_panel_layerVisClick_1_listener($event) {
            return ctx.updateMapVisibleLayer($event);
          })("editLayerClick", function MapComponent_Template_app_layer_panel_editLayerClick_1_listener($event) {
            return ctx.updateEditingLayer($event);
          })("layersOrder", function MapComponent_Template_app_layer_panel_layersOrder_1_listener($event) {
            return ctx.updateOrderVisibleLayers($event);
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("editLayers", ctx.loadedWfsLayers);
        }
      },
      directives: [_layer_panel_layer_panel_component__WEBPACK_IMPORTED_MODULE_30__["LayerPanelComponent"]],
      styles: [".ol-box[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  border-radius: 2px;\n  border: 2px solid blue;\n}\n\n.ol-mouse-position[_ngcontent-%COMP%] {\n  top: 8px;\n  right: 8px;\n  position: absolute;\n}\n\n.ol-scale-line[_ngcontent-%COMP%] {\n  background: rgba(0,60,136,0.3);\n  border-radius: 4px;\n  bottom: 8px;\n  left: 8px;\n  padding: 2px;\n  position: absolute;\n}\n\n.ol-scale-line-inner[_ngcontent-%COMP%] {\n  border: 1px solid #eee;\n  border-top: none;\n  color: #eee;\n  font-size: 10px;\n  text-align: center;\n  margin: 1px;\n  will-change: contents, width;\n  transition: all 0.25s;\n}\n\n.ol-scale-bar[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 8px;\n  left: 8px;\n}\n\n.ol-scale-step-marker[_ngcontent-%COMP%] {\n  width: 1px;\n  height: 15px;\n  background-color: #000000;\n  float: right;\n  z-Index: 10;\n}\n\n.ol-scale-step-text[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: -5px;\n  font-size: 12px;\n  z-Index: 11;\n  color: #000000;\n  text-shadow: -2px 0 #FFFFFF, 0 2px #FFFFFF, 2px 0 #FFFFFF, 0 -2px #FFFFFF;\n}\n\n.ol-scale-text[_ngcontent-%COMP%] {\n  position: absolute;\n  font-size: 14px;\n  text-align: center;\n  bottom: 25px;\n  color: #000000;\n  text-shadow: -2px 0 #FFFFFF, 0 2px #FFFFFF, 2px 0 #FFFFFF, 0 -2px #FFFFFF;\n}\n\n.ol-scale-singlebar[_ngcontent-%COMP%] {\n  position: relative;\n  height: 10px;\n  z-Index: 9;\n  border: 1px solid black;\n}\n\n.ol-unsupported[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.ol-viewport[_ngcontent-%COMP%], .ol-unselectable[_ngcontent-%COMP%] {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: rgba(0,0,0,0);\n}\n\n.ol-overlaycontainer[_ngcontent-%COMP%], .ol-overlaycontainer-stopevent[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n\n.ol-overlaycontainer[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%], .ol-overlaycontainer-stopevent[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  pointer-events: auto;\n}\n\n.ol-selectable[_ngcontent-%COMP%] {\n  -webkit-touch-callout: default;\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n  user-select: text;\n}\n\n.ol-grabbing[_ngcontent-%COMP%] {\n  cursor: -webkit-grabbing;\n  cursor: grabbing;\n}\n\n.ol-grab[_ngcontent-%COMP%] {\n  cursor: move;\n  cursor: -webkit-grab;\n  cursor: grab;\n}\n\n.ol-control[_ngcontent-%COMP%] {\n  position: absolute;\n  background-color: rgba(255,255,255,0.4);\n  border-radius: 4px;\n  padding: 2px;\n}\n\n.ol-control[_ngcontent-%COMP%]:hover {\n  background-color: rgba(255,255,255,0.6);\n}\n\n.ol-zoom[_ngcontent-%COMP%] {\n  top: .5em;\n  left: .5em;\n}\n\n.ol-rotate[_ngcontent-%COMP%] {\n  top: .5em;\n  right: .5em;\n  transition: opacity .25s linear, visibility 0s linear;\n}\n\n.ol-rotate.ol-hidden[_ngcontent-%COMP%] {\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity .25s linear, visibility 0s linear .25s;\n}\n\n.ol-zoom-extent[_ngcontent-%COMP%] {\n  top: 4.643em;\n  left: .5em;\n}\n\n.ol-full-screen[_ngcontent-%COMP%] {\n  right: .5em;\n  top: .5em;\n}\n\n.ol-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: block;\n  margin: 1px;\n  padding: 0;\n  color: white;\n  font-size: 1.14em;\n  font-weight: bold;\n  text-decoration: none;\n  text-align: center;\n  height: 1.375em;\n  width: 1.375em;\n  line-height: .4em;\n  background-color: rgba(0,60,136,0.5);\n  border: none;\n  border-radius: 2px;\n}\n\n.ol-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]::-moz-focus-inner {\n  border: none;\n  padding: 0;\n}\n\n.ol-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n\n.ol-zoom-extent[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  line-height: 1.4em;\n}\n\n.ol-compass[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: normal;\n  font-size: 1.2em;\n  will-change: transform;\n}\n\n.ol-touch[_ngcontent-%COMP%]   .ol-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  font-size: 1.5em;\n}\n\n.ol-touch[_ngcontent-%COMP%]   .ol-zoom-extent[_ngcontent-%COMP%] {\n  top: 5.5em;\n}\n\n.ol-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover, .ol-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:focus {\n  text-decoration: none;\n  background-color: rgba(0,60,136,0.7);\n}\n\n.ol-zoom[_ngcontent-%COMP%]   .ol-zoom-in[_ngcontent-%COMP%] {\n  border-radius: 2px 2px 0 0;\n}\n\n.ol-zoom[_ngcontent-%COMP%]   .ol-zoom-out[_ngcontent-%COMP%] {\n  border-radius: 0 0 2px 2px;\n}\n\n.ol-attribution[_ngcontent-%COMP%] {\n  text-align: right;\n  bottom: .5em;\n  right: .5em;\n  max-width: calc(100% - 1.3em);\n}\n\n.ol-attribution[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0 .5em;\n  color: #000;\n  text-shadow: 0 0 2px #fff;\n}\n\n.ol-attribution[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: inline;\n  list-style: none;\n}\n\n.ol-attribution[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:not(:last-child):after {\n  content: \" \";\n}\n\n.ol-attribution[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-height: 2em;\n  max-width: inherit;\n  vertical-align: middle;\n}\n\n.ol-attribution[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .ol-attribution[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-block;\n}\n\n.ol-attribution.ol-collapsed[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.ol-attribution[_ngcontent-%COMP%]:not(.ol-collapsed) {\n  background: rgba(255,255,255,0.8);\n}\n\n.ol-attribution.ol-uncollapsible[_ngcontent-%COMP%] {\n  bottom: 0;\n  right: 0;\n  border-radius: 4px 0 0;\n}\n\n.ol-attribution.ol-uncollapsible[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  margin-top: -.2em;\n  max-height: 1.6em;\n}\n\n.ol-attribution.ol-uncollapsible[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.ol-zoomslider[_ngcontent-%COMP%] {\n  top: 4.5em;\n  left: .5em;\n  height: 200px;\n}\n\n.ol-zoomslider[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  position: relative;\n  height: 10px;\n}\n\n.ol-touch[_ngcontent-%COMP%]   .ol-zoomslider[_ngcontent-%COMP%] {\n  top: 5.5em;\n}\n\n.ol-overviewmap[_ngcontent-%COMP%] {\n  left: 0.5em;\n  bottom: 0.5em;\n}\n\n.ol-overviewmap.ol-uncollapsible[_ngcontent-%COMP%] {\n  bottom: 0;\n  left: 0;\n  border-radius: 0 4px 0 0;\n}\n\n.ol-overviewmap[_ngcontent-%COMP%]   .ol-overviewmap-map[_ngcontent-%COMP%], .ol-overviewmap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: inline-block;\n}\n\n.ol-overviewmap[_ngcontent-%COMP%]   .ol-overviewmap-map[_ngcontent-%COMP%] {\n  border: 1px solid #7b98bc;\n  height: 150px;\n  margin: 2px;\n  width: 150px;\n}\n\n.ol-overviewmap[_ngcontent-%COMP%]:not(.ol-collapsed)   button[_ngcontent-%COMP%]{\n  bottom: 1px;\n  left: 2px;\n  position: absolute;\n}\n\n.ol-overviewmap.ol-collapsed[_ngcontent-%COMP%]   .ol-overviewmap-map[_ngcontent-%COMP%], .ol-overviewmap.ol-uncollapsible[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.ol-overviewmap[_ngcontent-%COMP%]:not(.ol-collapsed) {\n  background: rgba(255,255,255,0.8);\n}\n\n.ol-overviewmap-box[_ngcontent-%COMP%] {\n  border: 2px dotted rgba(0,60,136,0.7);\n}\n\n.ol-overviewmap[_ngcontent-%COMP%]   .ol-overviewmap-box[_ngcontent-%COMP%]:hover {\n  cursor: move;\n}\n\n.map[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 93%;\n  z-index: 0;\n  position: absolute;\n}\n\n.tooltip[_ngcontent-%COMP%] {\n  position: relative;\n  background: rgba(0, 0, 0, 0.5);\n  border-radius: 4px !important;\n  color: white;\n  padding: 4px 8px;\n  opacity: 0.7;\n  white-space: nowrap;\n}\n\n.tooltip-measure[_ngcontent-%COMP%] {\n  opacity: 1;\n  font-weight: bold;\n}\n\n.tooltip-measure[_ngcontent-%COMP%]:before, .tooltip-static[_ngcontent-%COMP%]:before {\n  border-top: 6px solid rgba(0, 0, 0, 0.5);\n  border-right: 6px solid transparent;\n  border-left: 6px solid transparent;\n  content: \"\";\n  position: absolute;\n  bottom: -6px;\n  margin-left: -7px;\n  left: 50%;\n}\n\n.tooltip-static[_ngcontent-%COMP%]:before {\n  border-top-color: #ffcc33;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9vbC9vbC5jc3MiLCJzcmMvYXBwL21hcC9EOlxcUGhEXFxjb2RlXFxmcm9tU2NyYXRjaFxcbXlPZ2l0by9zcmNcXGFwcFxcbWFwXFxtYXAuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL21hcC9tYXAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLFFBQVE7RUFDUixVQUFVO0VBQ1Ysa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsOEJBQThCO0VBQzlCLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsU0FBUztFQUNULFlBQVk7RUFDWixrQkFBa0I7QUFDcEI7O0FBQ0E7RUFDRSxzQkFBc0I7RUFDdEIsZ0JBQWdCO0VBQ2hCLFdBQVc7RUFDWCxlQUFlO0VBQ2Ysa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCw0QkFBNEI7RUFDNUIscUJBQXFCO0FBQ3ZCOztBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLFdBQVc7RUFDWCxTQUFTO0FBQ1g7O0FBQ0E7RUFDRSxVQUFVO0VBQ1YsWUFBWTtFQUNaLHlCQUF5QjtFQUN6QixZQUFZO0VBQ1osV0FBVztBQUNiOztBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixlQUFlO0VBQ2YsV0FBVztFQUNYLGNBQWM7RUFDZCx5RUFBeUU7QUFDM0U7O0FBQ0E7RUFDRSxrQkFBa0I7RUFDbEIsZUFBZTtFQUNmLGtCQUFrQjtFQUNsQixZQUFZO0VBQ1osY0FBYztFQUNkLHlFQUF5RTtBQUMzRTs7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQixZQUFZO0VBQ1osVUFBVTtFQUNWLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFDQTtFQUNFLDJCQUEyQjtFQUMzQix5QkFBeUI7RUFDekIsc0JBQXNCO0VBQ3RCLHFCQUFxQjtFQUNyQixpQkFBaUI7RUFDakIsMENBQTBDO0FBQzVDOztBQUNBO0VBQ0Usb0JBQW9CO0FBQ3RCOztBQUNBO0VBQ0Usb0JBQW9CO0FBQ3RCOztBQUNBO0VBQ0UsOEJBQThCO0VBQzlCLHlCQUF5QjtFQUN6QixzQkFBc0I7RUFDdEIscUJBQXFCO0VBQ3JCLGlCQUFpQjtBQUNuQjs7QUFDQTtFQUNFLHdCQUF3QjtFQUV4QixnQkFBZ0I7QUFDbEI7O0FBQ0E7RUFDRSxZQUFZO0VBQ1osb0JBQW9CO0VBRXBCLFlBQVk7QUFDZDs7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQix1Q0FBdUM7RUFDdkMsa0JBQWtCO0VBQ2xCLFlBQVk7QUFDZDs7QUFDQTtFQUNFLHVDQUF1QztBQUN6Qzs7QUFDQTtFQUNFLFNBQVM7RUFDVCxVQUFVO0FBQ1o7O0FBQ0E7RUFDRSxTQUFTO0VBQ1QsV0FBVztFQUNYLHFEQUFxRDtBQUN2RDs7QUFDQTtFQUNFLFVBQVU7RUFDVixrQkFBa0I7RUFDbEIsMERBQTBEO0FBQzVEOztBQUNBO0VBQ0UsWUFBWTtFQUNaLFVBQVU7QUFDWjs7QUFDQTtFQUNFLFdBQVc7RUFDWCxTQUFTO0FBQ1g7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsV0FBVztFQUNYLFVBQVU7RUFDVixZQUFZO0VBQ1osaUJBQWlCO0VBQ2pCLGlCQUFpQjtFQUNqQixxQkFBcUI7RUFDckIsa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixjQUFjO0VBQ2QsaUJBQWlCO0VBQ2pCLG9DQUFvQztFQUNwQyxZQUFZO0VBQ1osa0JBQWtCO0FBQ3BCOztBQUNBO0VBQ0UsWUFBWTtFQUNaLFVBQVU7QUFDWjs7QUFDQTtFQUNFLG9CQUFvQjtBQUN0Qjs7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjs7QUFDQTtFQUNFLGNBQWM7RUFDZCxtQkFBbUI7RUFDbkIsZ0JBQWdCO0VBQ2hCLHNCQUFzQjtBQUN4Qjs7QUFDQTtFQUNFLGdCQUFnQjtBQUNsQjs7QUFDQTtFQUNFLFVBQVU7QUFDWjs7QUFDQTs7RUFFRSxxQkFBcUI7RUFDckIsb0NBQW9DO0FBQ3RDOztBQUNBO0VBQ0UsMEJBQTBCO0FBQzVCOztBQUNBO0VBQ0UsMEJBQTBCO0FBQzVCOztBQUdBO0VBQ0UsaUJBQWlCO0VBQ2pCLFlBQVk7RUFDWixXQUFXO0VBQ1gsNkJBQTZCO0FBQy9COztBQUVBO0VBQ0UsU0FBUztFQUNULGVBQWU7RUFDZixXQUFXO0VBQ1gseUJBQXlCO0FBQzNCOztBQUNBO0VBQ0UsZUFBZTtFQUNmLGdCQUFnQjtBQUNsQjs7QUFDQTtFQUNFLFlBQVk7QUFDZDs7QUFDQTtFQUNFLGVBQWU7RUFDZixrQkFBa0I7RUFDbEIsc0JBQXNCO0FBQ3hCOztBQUNBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUNBO0VBQ0UsYUFBYTtBQUNmOztBQUNBO0VBQ0UsaUNBQWlDO0FBQ25DOztBQUNBO0VBQ0UsU0FBUztFQUNULFFBQVE7RUFDUixzQkFBc0I7QUFDeEI7O0FBQ0E7RUFDRSxpQkFBaUI7RUFDakIsaUJBQWlCO0FBQ25COztBQUNBO0VBQ0UsYUFBYTtBQUNmOztBQUVBO0VBQ0UsVUFBVTtFQUNWLFVBQVU7RUFDVixhQUFhO0FBQ2Y7O0FBQ0E7RUFDRSxrQkFBa0I7RUFDbEIsWUFBWTtBQUNkOztBQUVBO0VBQ0UsVUFBVTtBQUNaOztBQUVBO0VBQ0UsV0FBVztFQUNYLGFBQWE7QUFDZjs7QUFDQTtFQUNFLFNBQVM7RUFDVCxPQUFPO0VBQ1Asd0JBQXdCO0FBQzFCOztBQUNBOztFQUVFLHFCQUFxQjtBQUN2Qjs7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixhQUFhO0VBQ2IsV0FBVztFQUNYLFlBQVk7QUFDZDs7QUFDQTtFQUNFLFdBQVc7RUFDWCxTQUFTO0VBQ1Qsa0JBQWtCO0FBQ3BCOztBQUNBOztFQUVFLGFBQWE7QUFDZjs7QUFDQTtFQUNFLGlDQUFpQztBQUNuQzs7QUFDQTtFQUNFLHFDQUFxQztBQUN2Qzs7QUFFQTtFQUNFLFlBQVk7QUFDZDs7QUN4UkE7RUFFRSxXQUFBO0VBQ0EsV0FBQTtFQUVBLFVBQUE7RUFDQSxrQkFBQTtBQ0RGOztBRElBO0VBQ0Usa0JBQUE7RUFDQSw4QkFBQTtFQUNBLDZCQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0FDREY7O0FER0E7RUFDRSxVQUFBO0VBQ0EsaUJBQUE7QUNBRjs7QURFQTs7RUFFRSx3Q0FBQTtFQUNBLG1DQUFBO0VBQ0Esa0NBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSxTQUFBO0FDQ0Y7O0FEQ0E7RUFDRSx5QkFBQTtBQ0VGIiwiZmlsZSI6InNyYy9hcHAvbWFwL21hcC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5vbC1ib3gge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsdWU7XG59XG5cbi5vbC1tb3VzZS1wb3NpdGlvbiB7XG4gIHRvcDogOHB4O1xuICByaWdodDogOHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5cbi5vbC1zY2FsZS1saW5lIHtcbiAgYmFja2dyb3VuZDogcmdiYSgwLDYwLDEzNiwwLjMpO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGJvdHRvbTogOHB4O1xuICBsZWZ0OiA4cHg7XG4gIHBhZGRpbmc6IDJweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xufVxuLm9sLXNjYWxlLWxpbmUtaW5uZXIge1xuICBib3JkZXI6IDFweCBzb2xpZCAjZWVlO1xuICBib3JkZXItdG9wOiBub25lO1xuICBjb2xvcjogI2VlZTtcbiAgZm9udC1zaXplOiAxMHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIG1hcmdpbjogMXB4O1xuICB3aWxsLWNoYW5nZTogY29udGVudHMsIHdpZHRoO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4yNXM7XG59XG4ub2wtc2NhbGUtYmFyIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDhweDtcbiAgbGVmdDogOHB4O1xufVxuLm9sLXNjYWxlLXN0ZXAtbWFya2VyIHtcbiAgd2lkdGg6IDFweDtcbiAgaGVpZ2h0OiAxNXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xuICBmbG9hdDogcmlnaHQ7XG4gIHotSW5kZXg6IDEwO1xufVxuLm9sLXNjYWxlLXN0ZXAtdGV4dCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAtNXB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIHotSW5kZXg6IDExO1xuICBjb2xvcjogIzAwMDAwMDtcbiAgdGV4dC1zaGFkb3c6IC0ycHggMCAjRkZGRkZGLCAwIDJweCAjRkZGRkZGLCAycHggMCAjRkZGRkZGLCAwIC0ycHggI0ZGRkZGRjtcbn1cbi5vbC1zY2FsZS10ZXh0IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBmb250LXNpemU6IDE0cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgYm90dG9tOiAyNXB4O1xuICBjb2xvcjogIzAwMDAwMDtcbiAgdGV4dC1zaGFkb3c6IC0ycHggMCAjRkZGRkZGLCAwIDJweCAjRkZGRkZGLCAycHggMCAjRkZGRkZGLCAwIC0ycHggI0ZGRkZGRjtcbn1cbi5vbC1zY2FsZS1zaW5nbGViYXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGhlaWdodDogMTBweDtcbiAgei1JbmRleDogOTtcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG59XG5cbi5vbC11bnN1cHBvcnRlZCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4ub2wtdmlld3BvcnQsIC5vbC11bnNlbGVjdGFibGUge1xuICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLDAsMCwwKTtcbn1cbi5vbC1vdmVybGF5Y29udGFpbmVyLCAub2wtb3ZlcmxheWNvbnRhaW5lci1zdG9wZXZlbnQge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5vbC1vdmVybGF5Y29udGFpbmVyID4gKiwgLm9sLW92ZXJsYXljb250YWluZXItc3RvcGV2ZW50ID4gKiB7XG4gIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xufVxuLm9sLXNlbGVjdGFibGUge1xuICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IGRlZmF1bHQ7XG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IHRleHQ7XG4gIC1tb3otdXNlci1zZWxlY3Q6IHRleHQ7XG4gIC1tcy11c2VyLXNlbGVjdDogdGV4dDtcbiAgdXNlci1zZWxlY3Q6IHRleHQ7XG59XG4ub2wtZ3JhYmJpbmcge1xuICBjdXJzb3I6IC13ZWJraXQtZ3JhYmJpbmc7XG4gIGN1cnNvcjogLW1vei1ncmFiYmluZztcbiAgY3Vyc29yOiBncmFiYmluZztcbn1cbi5vbC1ncmFiIHtcbiAgY3Vyc29yOiBtb3ZlO1xuICBjdXJzb3I6IC13ZWJraXQtZ3JhYjtcbiAgY3Vyc29yOiAtbW96LWdyYWI7XG4gIGN1cnNvcjogZ3JhYjtcbn1cbi5vbC1jb250cm9sIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwyNTUsMjU1LDAuNCk7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgcGFkZGluZzogMnB4O1xufVxuLm9sLWNvbnRyb2w6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwyNTUsMjU1LDAuNik7XG59XG4ub2wtem9vbSB7XG4gIHRvcDogLjVlbTtcbiAgbGVmdDogLjVlbTtcbn1cbi5vbC1yb3RhdGUge1xuICB0b3A6IC41ZW07XG4gIHJpZ2h0OiAuNWVtO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4yNXMgbGluZWFyLCB2aXNpYmlsaXR5IDBzIGxpbmVhcjtcbn1cbi5vbC1yb3RhdGUub2wtaGlkZGVuIHtcbiAgb3BhY2l0eTogMDtcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IC4yNXMgbGluZWFyLCB2aXNpYmlsaXR5IDBzIGxpbmVhciAuMjVzO1xufVxuLm9sLXpvb20tZXh0ZW50IHtcbiAgdG9wOiA0LjY0M2VtO1xuICBsZWZ0OiAuNWVtO1xufVxuLm9sLWZ1bGwtc2NyZWVuIHtcbiAgcmlnaHQ6IC41ZW07XG4gIHRvcDogLjVlbTtcbn1cblxuLm9sLWNvbnRyb2wgYnV0dG9uIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG1hcmdpbjogMXB4O1xuICBwYWRkaW5nOiAwO1xuICBjb2xvcjogd2hpdGU7XG4gIGZvbnQtc2l6ZTogMS4xNGVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGhlaWdodDogMS4zNzVlbTtcbiAgd2lkdGg6IDEuMzc1ZW07XG4gIGxpbmUtaGVpZ2h0OiAuNGVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsNjAsMTM2LDAuNSk7XG4gIGJvcmRlcjogbm9uZTtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xufVxuLm9sLWNvbnRyb2wgYnV0dG9uOjotbW96LWZvY3VzLWlubmVyIHtcbiAgYm9yZGVyOiBub25lO1xuICBwYWRkaW5nOiAwO1xufVxuLm9sLWNvbnRyb2wgYnV0dG9uIHNwYW4ge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cbi5vbC16b29tLWV4dGVudCBidXR0b24ge1xuICBsaW5lLWhlaWdodDogMS40ZW07XG59XG4ub2wtY29tcGFzcyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXNpemU6IDEuMmVtO1xuICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xufVxuLm9sLXRvdWNoIC5vbC1jb250cm9sIGJ1dHRvbiB7XG4gIGZvbnQtc2l6ZTogMS41ZW07XG59XG4ub2wtdG91Y2ggLm9sLXpvb20tZXh0ZW50IHtcbiAgdG9wOiA1LjVlbTtcbn1cbi5vbC1jb250cm9sIGJ1dHRvbjpob3Zlcixcbi5vbC1jb250cm9sIGJ1dHRvbjpmb2N1cyB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDYwLDEzNiwwLjcpO1xufVxuLm9sLXpvb20gLm9sLXpvb20taW4ge1xuICBib3JkZXItcmFkaXVzOiAycHggMnB4IDAgMDtcbn1cbi5vbC16b29tIC5vbC16b29tLW91dCB7XG4gIGJvcmRlci1yYWRpdXM6IDAgMCAycHggMnB4O1xufVxuXG5cbi5vbC1hdHRyaWJ1dGlvbiB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBib3R0b206IC41ZW07XG4gIHJpZ2h0OiAuNWVtO1xuICBtYXgtd2lkdGg6IGNhbGMoMTAwJSAtIDEuM2VtKTtcbn1cblxuLm9sLWF0dHJpYnV0aW9uIHVsIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwIC41ZW07XG4gIGNvbG9yOiAjMDAwO1xuICB0ZXh0LXNoYWRvdzogMCAwIDJweCAjZmZmO1xufVxuLm9sLWF0dHJpYnV0aW9uIGxpIHtcbiAgZGlzcGxheTogaW5saW5lO1xuICBsaXN0LXN0eWxlOiBub25lO1xufVxuLm9sLWF0dHJpYnV0aW9uIGxpOm5vdCg6bGFzdC1jaGlsZCk6YWZ0ZXIge1xuICBjb250ZW50OiBcIiBcIjtcbn1cbi5vbC1hdHRyaWJ1dGlvbiBpbWcge1xuICBtYXgtaGVpZ2h0OiAyZW07XG4gIG1heC13aWR0aDogaW5oZXJpdDtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cbi5vbC1hdHRyaWJ1dGlvbiB1bCwgLm9sLWF0dHJpYnV0aW9uIGJ1dHRvbiB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cbi5vbC1hdHRyaWJ1dGlvbi5vbC1jb2xsYXBzZWQgdWwge1xuICBkaXNwbGF5OiBub25lO1xufVxuLm9sLWF0dHJpYnV0aW9uOm5vdCgub2wtY29sbGFwc2VkKSB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC44KTtcbn1cbi5vbC1hdHRyaWJ1dGlvbi5vbC11bmNvbGxhcHNpYmxlIHtcbiAgYm90dG9tOiAwO1xuICByaWdodDogMDtcbiAgYm9yZGVyLXJhZGl1czogNHB4IDAgMDtcbn1cbi5vbC1hdHRyaWJ1dGlvbi5vbC11bmNvbGxhcHNpYmxlIGltZyB7XG4gIG1hcmdpbi10b3A6IC0uMmVtO1xuICBtYXgtaGVpZ2h0OiAxLjZlbTtcbn1cbi5vbC1hdHRyaWJ1dGlvbi5vbC11bmNvbGxhcHNpYmxlIGJ1dHRvbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5vbC16b29tc2xpZGVyIHtcbiAgdG9wOiA0LjVlbTtcbiAgbGVmdDogLjVlbTtcbiAgaGVpZ2h0OiAyMDBweDtcbn1cbi5vbC16b29tc2xpZGVyIGJ1dHRvbiB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaGVpZ2h0OiAxMHB4O1xufVxuXG4ub2wtdG91Y2ggLm9sLXpvb21zbGlkZXIge1xuICB0b3A6IDUuNWVtO1xufVxuXG4ub2wtb3ZlcnZpZXdtYXAge1xuICBsZWZ0OiAwLjVlbTtcbiAgYm90dG9tOiAwLjVlbTtcbn1cbi5vbC1vdmVydmlld21hcC5vbC11bmNvbGxhcHNpYmxlIHtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiAwO1xuICBib3JkZXItcmFkaXVzOiAwIDRweCAwIDA7XG59XG4ub2wtb3ZlcnZpZXdtYXAgLm9sLW92ZXJ2aWV3bWFwLW1hcCxcbi5vbC1vdmVydmlld21hcCBidXR0b24ge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG4ub2wtb3ZlcnZpZXdtYXAgLm9sLW92ZXJ2aWV3bWFwLW1hcCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICM3Yjk4YmM7XG4gIGhlaWdodDogMTUwcHg7XG4gIG1hcmdpbjogMnB4O1xuICB3aWR0aDogMTUwcHg7XG59XG4ub2wtb3ZlcnZpZXdtYXA6bm90KC5vbC1jb2xsYXBzZWQpIGJ1dHRvbntcbiAgYm90dG9tOiAxcHg7XG4gIGxlZnQ6IDJweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xufVxuLm9sLW92ZXJ2aWV3bWFwLm9sLWNvbGxhcHNlZCAub2wtb3ZlcnZpZXdtYXAtbWFwLFxuLm9sLW92ZXJ2aWV3bWFwLm9sLXVuY29sbGFwc2libGUgYnV0dG9uIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbi5vbC1vdmVydmlld21hcDpub3QoLm9sLWNvbGxhcHNlZCkge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LDAuOCk7XG59XG4ub2wtb3ZlcnZpZXdtYXAtYm94IHtcbiAgYm9yZGVyOiAycHggZG90dGVkIHJnYmEoMCw2MCwxMzYsMC43KTtcbn1cblxuLm9sLW92ZXJ2aWV3bWFwIC5vbC1vdmVydmlld21hcC1ib3g6aG92ZXIge1xuICBjdXJzb3I6IG1vdmU7XG59XG4iLCJAaW1wb3J0IFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29sL29sLmNzc1wiO1xyXG4ubWFwIHtcclxuIC8vIGRpc3BsYXk6IGZsZXg7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiA5MyUgO1xyXG4gLy8gYm9yZGVyOiBkYXNoZWQ7XHJcbiAgei1pbmRleDogMDtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbn1cclxuXHJcbi50b29sdGlwICB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTtcclxuICBib3JkZXItcmFkaXVzOiA0cHggIWltcG9ydGFudDtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgcGFkZGluZzogNHB4IDhweDtcclxuICBvcGFjaXR5OiAwLjc7XHJcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxufVxyXG4udG9vbHRpcC1tZWFzdXJlIHtcclxuICBvcGFjaXR5OiAxO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcbi50b29sdGlwLW1lYXN1cmU6YmVmb3JlLFxyXG4udG9vbHRpcC1zdGF0aWM6YmVmb3JlIHtcclxuICBib3JkZXItdG9wOiA2cHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjUpO1xyXG4gIGJvcmRlci1yaWdodDogNnB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG4gIGJvcmRlci1sZWZ0OiA2cHggc29saWQgdHJhbnNwYXJlbnQ7XHJcbiAgY29udGVudDogXCJcIjtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgYm90dG9tOiAtNnB4O1xyXG4gIG1hcmdpbi1sZWZ0OiAtN3B4O1xyXG4gIGxlZnQ6IDUwJTtcclxufVxyXG4udG9vbHRpcC1zdGF0aWM6YmVmb3JlIHtcclxuICBib3JkZXItdG9wLWNvbG9yOiAjZmZjYzMzO1xyXG59XHJcbiIsIkBpbXBvcnQgXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvb2wvb2wuY3NzXCI7XG4ubWFwIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogOTMlO1xuICB6LWluZGV4OiAwO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5cbi50b29sdGlwIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gIGJvcmRlci1yYWRpdXM6IDRweCAhaW1wb3J0YW50O1xuICBjb2xvcjogd2hpdGU7XG4gIHBhZGRpbmc6IDRweCA4cHg7XG4gIG9wYWNpdHk6IDAuNztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cblxuLnRvb2x0aXAtbWVhc3VyZSB7XG4gIG9wYWNpdHk6IDE7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4udG9vbHRpcC1tZWFzdXJlOmJlZm9yZSxcbi50b29sdGlwLXN0YXRpYzpiZWZvcmUge1xuICBib3JkZXItdG9wOiA2cHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjUpO1xuICBib3JkZXItcmlnaHQ6IDZweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWxlZnQ6IDZweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IC02cHg7XG4gIG1hcmdpbi1sZWZ0OiAtN3B4O1xuICBsZWZ0OiA1MCU7XG59XG5cbi50b29sdGlwLXN0YXRpYzpiZWZvcmUge1xuICBib3JkZXItdG9wLWNvbG9yOiAjZmZjYzMzO1xufSJdfQ== */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MapComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-map',
          templateUrl: './map.component.html',
          styleUrls: ['./map.component.scss']
        }]
      }], function () {
        return [{
          type: _map_qgs_style_service__WEBPACK_IMPORTED_MODULE_28__["MapQgsStyleService"]
        }, {
          type: _open_layers_service__WEBPACK_IMPORTED_MODULE_29__["OpenLayersService"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/material-module.ts":
  /*!************************************!*\
    !*** ./src/app/material-module.ts ***!
    \************************************/

  /*! exports provided: DemoMaterialModule */

  /***/
  function srcAppMaterialModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "DemoMaterialModule", function () {
      return DemoMaterialModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/cdk/a11y */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/a11y.js");
    /* harmony import */


    var _angular_cdk_clipboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/cdk/clipboard */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/clipboard.js");
    /* harmony import */


    var _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/cdk/drag-drop */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/drag-drop.js");
    /* harmony import */


    var _angular_cdk_portal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/cdk/portal */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/portal.js");
    /* harmony import */


    var _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/cdk/scrolling */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/scrolling.js");
    /* harmony import */


    var _angular_cdk_stepper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/cdk/stepper */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/stepper.js");
    /* harmony import */


    var _angular_cdk_table__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/cdk/table */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/table.js");
    /* harmony import */


    var _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! @angular/cdk/tree */
    "./node_modules/@angular/cdk/__ivy_ngcc__/fesm2015/tree.js");
    /* harmony import */


    var _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/material/autocomplete */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/autocomplete.js");
    /* harmony import */


    var _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! @angular/material/badge */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/badge.js");
    /* harmony import */


    var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! @angular/material/bottom-sheet */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/bottom-sheet.js");
    /* harmony import */


    var _angular_material_button__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! @angular/material/button */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
    /* harmony import */


    var _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! @angular/material/button-toggle */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button-toggle.js");
    /* harmony import */


    var _angular_material_card__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
    /*! @angular/material/card */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
    /* harmony import */


    var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
    /*! @angular/material/checkbox */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/checkbox.js");
    /* harmony import */


    var _angular_material_chips__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
    /*! @angular/material/chips */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/chips.js");
    /* harmony import */


    var _angular_material_stepper__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
    /*! @angular/material/stepper */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/stepper.js");
    /* harmony import */


    var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(
    /*! @angular/material/datepicker */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/datepicker.js");
    /* harmony import */


    var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(
    /*! @angular/material/dialog */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/dialog.js");
    /* harmony import */


    var _angular_material_divider__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(
    /*! @angular/material/divider */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
    /* harmony import */


    var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(
    /*! @angular/material/expansion */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/expansion.js");
    /* harmony import */


    var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(
    /*! @angular/material/grid-list */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/grid-list.js");
    /* harmony import */


    var _angular_material_icon__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(
    /*! @angular/material/icon */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
    /* harmony import */


    var _angular_material_input__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(
    /*! @angular/material/input */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/input.js");
    /* harmony import */


    var _angular_material_list__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(
    /*! @angular/material/list */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/list.js");
    /* harmony import */


    var _angular_material_menu__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(
    /*! @angular/material/menu */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/menu.js");
    /* harmony import */


    var _angular_material_core__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(
    /*! @angular/material/core */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(
    /*! @angular/material/paginator */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/paginator.js");
    /* harmony import */


    var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(
    /*! @angular/material/progress-bar */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/progress-bar.js");
    /* harmony import */


    var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(
    /*! @angular/material/progress-spinner */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/progress-spinner.js");
    /* harmony import */


    var _angular_material_radio__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(
    /*! @angular/material/radio */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/radio.js");
    /* harmony import */


    var _angular_material_select__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(
    /*! @angular/material/select */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/select.js");
    /* harmony import */


    var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(
    /*! @angular/material/sidenav */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/sidenav.js");
    /* harmony import */


    var _angular_material_slider__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(
    /*! @angular/material/slider */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/slider.js");
    /* harmony import */


    var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(
    /*! @angular/material/slide-toggle */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/slide-toggle.js");
    /* harmony import */


    var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(
    /*! @angular/material/snack-bar */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/snack-bar.js");
    /* harmony import */


    var _angular_material_sort__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(
    /*! @angular/material/sort */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/sort.js");
    /* harmony import */


    var _angular_material_table__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(
    /*! @angular/material/table */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/table.js");
    /* harmony import */


    var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(
    /*! @angular/material/tabs */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tabs.js");
    /* harmony import */


    var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(
    /*! @angular/material/toolbar */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/toolbar.js");
    /* harmony import */


    var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(
    /*! @angular/material/tooltip */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");
    /* harmony import */


    var _angular_material_tree__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(
    /*! @angular/material/tree */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tree.js");

    var DemoMaterialModule = function DemoMaterialModule() {
      _classCallCheck(this, DemoMaterialModule);
    };

    DemoMaterialModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: DemoMaterialModule
    });
    DemoMaterialModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function DemoMaterialModule_Factory(t) {
        return new (t || DemoMaterialModule)();
      },
      imports: [_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_1__["A11yModule"], _angular_cdk_clipboard__WEBPACK_IMPORTED_MODULE_2__["ClipboardModule"], _angular_cdk_stepper__WEBPACK_IMPORTED_MODULE_6__["CdkStepperModule"], _angular_cdk_table__WEBPACK_IMPORTED_MODULE_7__["CdkTableModule"], _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_8__["CdkTreeModule"], _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_3__["DragDropModule"], _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_9__["MatAutocompleteModule"], _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__["MatBadgeModule"], _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_11__["MatBottomSheetModule"], _angular_material_button__WEBPACK_IMPORTED_MODULE_12__["MatButtonModule"], _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_13__["MatButtonToggleModule"], _angular_material_card__WEBPACK_IMPORTED_MODULE_14__["MatCardModule"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_15__["MatCheckboxModule"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_16__["MatChipsModule"], _angular_material_stepper__WEBPACK_IMPORTED_MODULE_17__["MatStepperModule"], _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_18__["MatDatepickerModule"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_19__["MatDialogModule"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_20__["MatDividerModule"], _angular_material_expansion__WEBPACK_IMPORTED_MODULE_21__["MatExpansionModule"], _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__["MatGridListModule"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_23__["MatIconModule"], _angular_material_input__WEBPACK_IMPORTED_MODULE_24__["MatInputModule"], _angular_material_list__WEBPACK_IMPORTED_MODULE_25__["MatListModule"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_26__["MatMenuModule"], _angular_material_core__WEBPACK_IMPORTED_MODULE_27__["MatNativeDateModule"], _angular_material_paginator__WEBPACK_IMPORTED_MODULE_28__["MatPaginatorModule"], _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_29__["MatProgressBarModule"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_30__["MatProgressSpinnerModule"], _angular_material_radio__WEBPACK_IMPORTED_MODULE_31__["MatRadioModule"], _angular_material_core__WEBPACK_IMPORTED_MODULE_27__["MatRippleModule"], _angular_material_select__WEBPACK_IMPORTED_MODULE_32__["MatSelectModule"], _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_33__["MatSidenavModule"], _angular_material_slider__WEBPACK_IMPORTED_MODULE_34__["MatSliderModule"], _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_35__["MatSlideToggleModule"], _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_36__["MatSnackBarModule"], _angular_material_sort__WEBPACK_IMPORTED_MODULE_37__["MatSortModule"], _angular_material_table__WEBPACK_IMPORTED_MODULE_38__["MatTableModule"], _angular_material_tabs__WEBPACK_IMPORTED_MODULE_39__["MatTabsModule"], _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_40__["MatToolbarModule"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_41__["MatTooltipModule"], _angular_material_tree__WEBPACK_IMPORTED_MODULE_42__["MatTreeModule"], _angular_cdk_portal__WEBPACK_IMPORTED_MODULE_4__["PortalModule"], _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_5__["ScrollingModule"]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](DemoMaterialModule, {
        exports: [_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_1__["A11yModule"], _angular_cdk_clipboard__WEBPACK_IMPORTED_MODULE_2__["ClipboardModule"], _angular_cdk_stepper__WEBPACK_IMPORTED_MODULE_6__["CdkStepperModule"], _angular_cdk_table__WEBPACK_IMPORTED_MODULE_7__["CdkTableModule"], _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_8__["CdkTreeModule"], _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_3__["DragDropModule"], _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_9__["MatAutocompleteModule"], _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__["MatBadgeModule"], _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_11__["MatBottomSheetModule"], _angular_material_button__WEBPACK_IMPORTED_MODULE_12__["MatButtonModule"], _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_13__["MatButtonToggleModule"], _angular_material_card__WEBPACK_IMPORTED_MODULE_14__["MatCardModule"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_15__["MatCheckboxModule"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_16__["MatChipsModule"], _angular_material_stepper__WEBPACK_IMPORTED_MODULE_17__["MatStepperModule"], _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_18__["MatDatepickerModule"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_19__["MatDialogModule"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_20__["MatDividerModule"], _angular_material_expansion__WEBPACK_IMPORTED_MODULE_21__["MatExpansionModule"], _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__["MatGridListModule"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_23__["MatIconModule"], _angular_material_input__WEBPACK_IMPORTED_MODULE_24__["MatInputModule"], _angular_material_list__WEBPACK_IMPORTED_MODULE_25__["MatListModule"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_26__["MatMenuModule"], _angular_material_core__WEBPACK_IMPORTED_MODULE_27__["MatNativeDateModule"], _angular_material_paginator__WEBPACK_IMPORTED_MODULE_28__["MatPaginatorModule"], _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_29__["MatProgressBarModule"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_30__["MatProgressSpinnerModule"], _angular_material_radio__WEBPACK_IMPORTED_MODULE_31__["MatRadioModule"], _angular_material_core__WEBPACK_IMPORTED_MODULE_27__["MatRippleModule"], _angular_material_select__WEBPACK_IMPORTED_MODULE_32__["MatSelectModule"], _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_33__["MatSidenavModule"], _angular_material_slider__WEBPACK_IMPORTED_MODULE_34__["MatSliderModule"], _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_35__["MatSlideToggleModule"], _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_36__["MatSnackBarModule"], _angular_material_sort__WEBPACK_IMPORTED_MODULE_37__["MatSortModule"], _angular_material_table__WEBPACK_IMPORTED_MODULE_38__["MatTableModule"], _angular_material_tabs__WEBPACK_IMPORTED_MODULE_39__["MatTabsModule"], _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_40__["MatToolbarModule"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_41__["MatTooltipModule"], _angular_material_tree__WEBPACK_IMPORTED_MODULE_42__["MatTreeModule"], _angular_cdk_portal__WEBPACK_IMPORTED_MODULE_4__["PortalModule"], _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_5__["ScrollingModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DemoMaterialModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          exports: [_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_1__["A11yModule"], _angular_cdk_clipboard__WEBPACK_IMPORTED_MODULE_2__["ClipboardModule"], _angular_cdk_stepper__WEBPACK_IMPORTED_MODULE_6__["CdkStepperModule"], _angular_cdk_table__WEBPACK_IMPORTED_MODULE_7__["CdkTableModule"], _angular_cdk_tree__WEBPACK_IMPORTED_MODULE_8__["CdkTreeModule"], _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_3__["DragDropModule"], _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_9__["MatAutocompleteModule"], _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__["MatBadgeModule"], _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_11__["MatBottomSheetModule"], _angular_material_button__WEBPACK_IMPORTED_MODULE_12__["MatButtonModule"], _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_13__["MatButtonToggleModule"], _angular_material_card__WEBPACK_IMPORTED_MODULE_14__["MatCardModule"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_15__["MatCheckboxModule"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_16__["MatChipsModule"], _angular_material_stepper__WEBPACK_IMPORTED_MODULE_17__["MatStepperModule"], _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_18__["MatDatepickerModule"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_19__["MatDialogModule"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_20__["MatDividerModule"], _angular_material_expansion__WEBPACK_IMPORTED_MODULE_21__["MatExpansionModule"], _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__["MatGridListModule"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_23__["MatIconModule"], _angular_material_input__WEBPACK_IMPORTED_MODULE_24__["MatInputModule"], _angular_material_list__WEBPACK_IMPORTED_MODULE_25__["MatListModule"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_26__["MatMenuModule"], _angular_material_core__WEBPACK_IMPORTED_MODULE_27__["MatNativeDateModule"], _angular_material_paginator__WEBPACK_IMPORTED_MODULE_28__["MatPaginatorModule"], _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_29__["MatProgressBarModule"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_30__["MatProgressSpinnerModule"], _angular_material_radio__WEBPACK_IMPORTED_MODULE_31__["MatRadioModule"], _angular_material_core__WEBPACK_IMPORTED_MODULE_27__["MatRippleModule"], _angular_material_select__WEBPACK_IMPORTED_MODULE_32__["MatSelectModule"], _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_33__["MatSidenavModule"], _angular_material_slider__WEBPACK_IMPORTED_MODULE_34__["MatSliderModule"], _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_35__["MatSlideToggleModule"], _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_36__["MatSnackBarModule"], _angular_material_sort__WEBPACK_IMPORTED_MODULE_37__["MatSortModule"], _angular_material_table__WEBPACK_IMPORTED_MODULE_38__["MatTableModule"], _angular_material_tabs__WEBPACK_IMPORTED_MODULE_39__["MatTabsModule"], _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_40__["MatToolbarModule"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_41__["MatTooltipModule"], _angular_material_tree__WEBPACK_IMPORTED_MODULE_42__["MatTreeModule"], _angular_cdk_portal__WEBPACK_IMPORTED_MODULE_4__["PortalModule"], _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_5__["ScrollingModule"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/open-layers.service.ts":
  /*!****************************************!*\
    !*** ./src/app/open-layers.service.ts ***!
    \****************************************/

  /*! exports provided: OpenLayersService */

  /***/
  function srcAppOpenLayersServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "OpenLayersService", function () {
      return OpenLayersService;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");

    var OpenLayersService = /*#__PURE__*/function () {
      function OpenLayersService() {
        _classCallCheck(this, OpenLayersService);

        this.existingProject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.existingProject$ = this.existingProject.asObservable();
        this.showEditToolbarSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.showEditToolbar$ = this.showEditToolbarSource.asObservable(); // object: {[key: string]: string};

        this.layerEditingSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.layerEditing$ = this.layerEditingSource.asObservable();
        this.shapeEditTypeSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.shapeEditType$ = this.shapeEditTypeSource.asObservable();
        this.showSymbolPanelSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.showSymbolPanel$ = this.showSymbolPanelSource.asObservable();
        this.currentSymbolSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.currentSymbol$ = this.currentSymbolSource.asObservable();
        this.saveCurrentLayerSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.saveCurrentLayer$ = this.saveCurrentLayerSource.asObservable();
        this.deleteFeatsSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.deleteFeats$ = this.deleteFeatsSource.asObservable();
        this.editActionSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.editAction$ = this.editActionSource.asObservable();
        this.zoomHomeSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.zoomHome$ = this.zoomHomeSource.asObservable();
      }

      _createClass(OpenLayersService, [{
        key: "updateExistingProject",
        value: function updateExistingProject(projectOpened) {
          /**
           * @param projectOpened: indicates if there is a project opened (not a default view)
           */
          this.existingProject.next(projectOpened);
        }
      }, {
        key: "updateZoomHome",
        value: function updateZoomHome() {
          var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

          /**
           * sends a request to the map component to go to the Home
           */
          this.zoomHomeSource.next(value);
        }
      }, {
        key: "updateShapeEditType",
        value: function updateShapeEditType(shapeEdit) {
          this.shapeEditTypeSource.next(shapeEdit);
        }
      }, {
        key: "updateDeleteFeats",
        value: function updateDeleteFeats(active) {
          /** Updates the observable to the next value
           * active: boolean; true or false to allow delete features
           */
          this.deleteFeatsSource.next(active);
        }
      }, {
        key: "updateEditAction",
        value: function updateEditAction(action) {
          /** Updates the observable to the next value
           * @parama action: string indicating the action 'ModifyBox', 'Delete', 'Copy' , etc to perform in the map
           */
          this.editActionSource.next(action);
        }
      }, {
        key: "updateSaveCurrentLayer",
        value: function updateSaveCurrentLayer(save) {
          /** Updates the observable to the next value
           * visible: boolean; true or false to show/hide the editing toolbar
           */
          this.saveCurrentLayerSource.next(save);
        }
      }, {
        key: "updateShowEditToolbar",
        value: function updateShowEditToolbar(visible) {
          /** Updates the observable to the next value
           * visible: boolean; true or false to show/hide the editing toolbar
           */
          this.showEditToolbarSource.next(visible);
        }
      }, {
        key: "updateLayerEditing",
        value: function updateLayerEditing(layerName, layerGeom) {
          /** Updates the observable Geometry type for editing to the next value
           * geom: string; the geometry type: point, line, polygons..
           */
          this.layerEditingSource.next({
            layerName: layerName,
            layerGeom: layerGeom
          });
        }
      }, {
        key: "updateShowSymbolPanel",
        value: function updateShowSymbolPanel(visible) {
          /** Updates the observable ShowSymbolPanel to the next value
           * @param visible: boolean true or false to show/hide the editing toolbar
           */
          this.showSymbolPanelSource.next(visible);
        }
      }, {
        key: "updateCurrentSymbol",
        value: function updateCurrentSymbol(symbol) {
          /** Updates the observable ShowSymbolPanel to the next value
           * @param symbol: style to be used to draw current feature
           */
          this.currentSymbolSource.next(symbol);
        }
      }]);

      return OpenLayersService;
    }();

    OpenLayersService.ɵfac = function OpenLayersService_Factory(t) {
      return new (t || OpenLayersService)();
    };

    OpenLayersService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: OpenLayersService,
      factory: OpenLayersService.ɵfac,
      providedIn: 'root'
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](OpenLayersService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
          providedIn: 'root'
        }]
      }], function () {
        return [];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/symbol-list/symbol-list.component.ts":
  /*!******************************************************!*\
    !*** ./src/app/symbol-list/symbol-list.component.ts ***!
    \******************************************************/

  /*! exports provided: SymbolListComponent */

  /***/
  function srcAppSymbolListSymbolListComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SymbolListComponent", function () {
      return SymbolListComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var ol_render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ol/render */
    "./node_modules/ol/render.js");
    /* harmony import */


    var ol_Feature__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ol/Feature */
    "./node_modules/ol/Feature.js");
    /* harmony import */


    var ol_geom_Polygon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ol/geom/Polygon */
    "./node_modules/ol/geom/Polygon.js");
    /* harmony import */


    var ol_geom_Point__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ol/geom/Point */
    "./node_modules/ol/geom/Point.js");
    /* harmony import */


    var ol_geom_LineString__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ol/geom/LineString */
    "./node_modules/ol/geom/LineString.js");
    /* harmony import */


    var ol_style__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ol/style */
    "./node_modules/ol/style.js");
    /* harmony import */


    var _open_layers_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ../open-layers.service */
    "./src/app/open-layers.service.ts");
    /* harmony import */


    var _map_qgs_style_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ../map-qgs-style.service */
    "./src/app/map-qgs-style.service.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _angular_material_card__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! @angular/material/card */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
    /* harmony import */


    var _angular_material_button__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! @angular/material/button */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
    /* harmony import */


    var _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! @angular/material/icon */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
    /* harmony import */


    var _angular_material_divider__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
    /*! @angular/material/divider */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");

    var _c0 = ["symbolList"];
    var _c1 = ["cmp"];

    function SymbolListComponent_div_0_span_10_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " ..creating List of Symbols");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
    }

    function SymbolListComponent_div_0_div_13_Template(rf, ctx) {
      if (rf & 1) {
        var _r53 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 11);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SymbolListComponent_div_0_div_13_Template_div_click_1_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r53);

          var symbol_r50 = ctx.$implicit;

          var ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r52.updateActivesymbol(symbol_r50);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "canvas", 12, 13);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var symbol_r50 = ctx.$implicit;

        var ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("id", "+", symbol_r50.key, "");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r49.symbolActiveKey == symbol_r50.key ? "active" : "normal");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("id", symbol_r50.key);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", symbol_r50.key, " ");
      }
    }

    function SymbolListComponent_div_0_Template(rf, ctx) {
      if (rf & 1) {
        var _r55 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("panstart", function SymbolListComponent_div_0_Template_div_panstart_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r55);

          var ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r54.onPanStart($event);
        })("panmove", function SymbolListComponent_div_0_Template_div_panmove_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r55);

          var ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r56.onPan($event);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card", 2, 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-card-title-group");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "mat-card-title", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Symbols");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "button", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SymbolListComponent_div_0_Template_button_click_6_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r55);

          var ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r57.closeListSymbols();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "mat-icon", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "close");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "mat-divider", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, SymbolListComponent_div_0_span_10_Template, 2, 0, "span", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "span");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](13, SymbolListComponent_div_0_div_13_Template, 6, 4, "div", 9);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](14, "keyvalue");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("left", ctx_r46.x, "px")("top", ctx_r46.y, "px");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r46.symbolsLength == 0);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r46.variable);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](14, 7, ctx_r46.symbols$));
      }
    }

    var SymbolListComponent = /*#__PURE__*/function () {
      function SymbolListComponent(openLayersService, mapQgsStyleService) {
        var _this15 = this;

        _classCallCheck(this, SymbolListComponent);

        this.openLayersService = openLayersService;
        this.mapQgsStyleService = mapQgsStyleService;
        this.variable = '';
        this.symbolActiveKey = null;
        this.x = 0;
        this.y = 0;
        this.startX = 0;
        this.startY = 0;
        this.symbols$ = {};
        this.symbolsLength = 0;
        this.subscriptionToShowSymbols = this.openLayersService.showSymbolPanel$.subscribe(function (data) {
          _this15.displaySymbolList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(data);
        }, function (error) {
          console.log('Error in subscription to showSymbolPanel', error);
        });
        this.subscriptionToLayerEditing = this.openLayersService.layerEditing$.subscribe(function (data) {
          _this15.styles = _this15.mapQgsStyleService.getLayerStyle(data.layerName); // console.log('styles in symbolList.. pasito a pasito', this.styles);

          _this15.symbols$ = _this15.getSymbolList(_this15.styles);
          _this15.symbolsLength = Object.keys(_this15.symbols$).length;
          _this15.geometryTypeSymbols = data.layerGeom;
        }, function (error) {
          return console.log('Error in subscription to Layer Editing in SymbolList', error);
        });
      }

      _createClass(SymbolListComponent, [{
        key: "onPanStart",
        value: function onPanStart(event) {
          /** Sets the current coordinates of the layerPanel to use later when setting a new position
           * triggered when a pan event starts in the layerpanel card
           * @param event, type event
           */
          this.startX = this.x;
          this.startY = this.y;
        }
      }, {
        key: "onPan",
        value: function onPan(event) {
          /** Sets the new location of the layerPanel after a pan event was triggered in the layerPanel card
           * @param event, type event
           */
          event.preventDefault();
          this.x = this.startX + event.deltaX;
          this.y = this.startY + event.deltaY;
        }
      }, {
        key: "ngOnInit",
        value: function ngOnInit() {
          this.displaySymbolList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(true); // #Only for development purposes, #TODO put in fs
        }
      }, {
        key: "ngAfterViewInit",
        value: function ngAfterViewInit() {
          var _this16 = this;

          this.myCanvas.changes.subscribe(function (r) {
            // console.log('r', r);
            _this16.createSymbolsinCanvas();
          });
        }
      }, {
        key: "getSymbolList",
        value: function getSymbolList(styles) {
          /** Creates a dictionary with the styles per class when needed
           * @param styles: the array with the classes and styles
           */
          // console.log('que hay en styles', styles);
          var symbolDict = {};

          for (var _i3 = 0, _Object$keys = Object.keys(styles); _i3 < _Object$keys.length; _i3++) {
            var key = _Object$keys[_i3];
            // console.log(`${key} -> ${styles[key].value}`);
            symbolDict[styles[key].value] = styles[key].style;
          } // console.log('estilos en dict format', symbolDict);


          return symbolDict;
        }
      }, {
        key: "closeListSymbols",
        value: function closeListSymbols() {
          this.displaySymbolList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        }
      }, {
        key: "createSymbolsinCanvas",
        value: function createSymbolsinCanvas() {
          // to test layerGeom: string, styles: any

          /** Edita los canvas creados for each symbol by adding a feature with the styles on it
           * @param styles: array;
           * @param layerGeom: geometry of the layer as specified in the QGIS project ;
           */
          // let canvas = this.myCanvas.toArray()[i].nativeElement;
          var feature;
          var allCanvas = this.myCanvas.toArray();

          for (var i = 0; i < allCanvas.length; i++) {
            var factor = 10; // factor to use in scaling symbol in the canvas

            var canvas = allCanvas[i];

            if (canvas.nativeElement.getContext('2d')) {
              var key = canvas.nativeElement.id;
              var width = canvas.nativeElement.width * devicePixelRatio;
              var height = canvas.nativeElement.height * devicePixelRatio;
              canvas.nativeElement.width = width;
              canvas.nativeElement.height = height; // console.log('width and height', height, width, canvas.nativeElement.width , devicePixelRatio  );

              var render = Object(ol_render__WEBPACK_IMPORTED_MODULE_2__["toContext"])(canvas.nativeElement.getContext('2d'));
              var stylelayer = this.symbols$[key];
              var stylelayerClone = []; // clone the style hopefully deep copy

              switch (this.geometryTypeSymbols) {
                case 'Point':
                  {
                    var cx = width / 2;
                    var cy = height / 2;
                    feature = new ol_Feature__WEBPACK_IMPORTED_MODULE_3__["default"](new ol_geom_Point__WEBPACK_IMPORTED_MODULE_5__["default"]([cx, cy])); // possible solution or workaround for SVG
                    // https://stackoverflow.com/questions/54696758/how-do-i-draw-a-javascript-modified-svg-object-on-a-html5-canvas

                    var tempStyle = new ol_style__WEBPACK_IMPORTED_MODULE_7__["Style"]({
                      image: new ol_style__WEBPACK_IMPORTED_MODULE_7__["Icon"]({
                        color: '#8959A8',
                        crossOrigin: 'anonymous',
                        imgSize: [20, 20],
                        src: 'svg/religion/place_of_worship_christian3.svg'
                      })
                    });
                    render.drawFeature(feature, tempStyle);
                    feature = new ol_Feature__WEBPACK_IMPORTED_MODULE_3__["default"](new ol_geom_Point__WEBPACK_IMPORTED_MODULE_5__["default"]([cx + cx / 3, cy])); // only for testing

                    stylelayerClone.push(new ol_style__WEBPACK_IMPORTED_MODULE_7__["Style"]({
                      image: new ol_style__WEBPACK_IMPORTED_MODULE_7__["RegularShape"]({
                        fill: new ol_style__WEBPACK_IMPORTED_MODULE_7__["Fill"]({
                          color: 'yellow'
                        }),
                        stroke: new ol_style__WEBPACK_IMPORTED_MODULE_7__["Stroke"]({
                          color: 'red'
                        }),
                        points: 3,
                        radius: 30,
                        rotation: Math.PI / 4,
                        angle: 0
                      })
                    }));
                    /*  #TODO replace for the correct code
                     if ( img && img.getSize() != null) {
                            // #TODO Temporal to replace
                            const anchor = img.getAnchor();
                            const si = img.getSize();
                            console.log('anchor, size', anchor, si);
                          }
                          else {
                                         } */

                    break;
                  }

                case 'Line':
                  {
                    // calculate the start and end point and draw as styles are defined in the array
                    var heigthStroke = height / 2;
                    var cloneStyle = void 0;
                    var strokeClone = void 0;

                    var _iterator3 = _createForOfIteratorHelper(stylelayer),
                        _step3;

                    try {
                      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                        var style = _step3.value;
                        cloneStyle = style.clone();
                        strokeClone = cloneStyle.getStroke();
                        strokeClone.setWidth(strokeClone.getWidth() * factor); // 10 to mkae the line visible.

                        heigthStroke = (height - strokeClone.getWidth()) / 2;
                        cloneStyle.setStroke(strokeClone);
                        stylelayerClone.push(cloneStyle);
                      }
                    } catch (err) {
                      _iterator3.e(err);
                    } finally {
                      _iterator3.f();
                    }

                    feature = new ol_Feature__WEBPACK_IMPORTED_MODULE_3__["default"](new ol_geom_LineString__WEBPACK_IMPORTED_MODULE_6__["default"]([[10, heigthStroke], [width - width / 4, heigthStroke]])); // console.log('height, width and feature', heigthStroke, strokeClone.getWidth(), feature.getProperties());
                    //render.drawFeature(feature, testStyle);

                    break;
                  }

                case 'Polygon':
                  {
                    // en landuse 9 es muy interesante, pattern is not visible
                    render.lineWidth = 5;
                    var wide = width - width / 4;
                    var high = height - height / 4;
                    feature = new ol_Feature__WEBPACK_IMPORTED_MODULE_3__["default"](new ol_geom_Polygon__WEBPACK_IMPORTED_MODULE_4__["default"]([[[0, 0], [0, high], [wide, high], [wide, 0], [0, 0]]]));
                    break;
                  }
              } // if stylelayerClone has something it will be drawn


              if (stylelayerClone.length > 0) {
                var _iterator4 = _createForOfIteratorHelper(stylelayerClone),
                    _step4;

                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var _style = _step4.value;
                    render.drawFeature(feature, _style);
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }
              } else {
                var _iterator5 = _createForOfIteratorHelper(stylelayer),
                    _step5;

                try {
                  for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                    var _style2 = _step5.value;
                    // console.log('style', style );
                    render.drawFeature(feature, _style2);
                  }
                } catch (err) {
                  _iterator5.e(err);
                } finally {
                  _iterator5.f();
                }
              }
            }
          }
        }
      }, {
        key: "updateActivesymbol",
        value: function updateActivesymbol(symbol) {
          /**
           * update the activeSymbol
           * @param symbol: array of styles
           * @key: the key o the div
           *
           */
          //console.log('y ahora que sigue..activeKey, key, value.', this.symbolActiveKey, symbol.key, symbol );
          this.symbolActiveKey = symbol.key;
          var curDiv = document.getElementById('+' + symbol.key);
          curDiv.className += " active"; // console.log('symbol in symbollist',symbol);

          this.openLayersService.updateCurrentSymbol(symbol);
        }
      }]);

      return SymbolListComponent;
    }();

    SymbolListComponent.ɵfac = function SymbolListComponent_Factory(t) {
      return new (t || SymbolListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_open_layers_service__WEBPACK_IMPORTED_MODULE_8__["OpenLayersService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_map_qgs_style_service__WEBPACK_IMPORTED_MODULE_9__["MapQgsStyleService"]));
    };

    SymbolListComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: SymbolListComponent,
      selectors: [["app-symbol-list"]],
      viewQuery: function SymbolListComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, true);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c1, true);
        }

        if (rf & 2) {
          var _t;

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.symbolList = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.myCanvas = _t);
        }
      },
      decls: 2,
      vars: 3,
      consts: [["class", "example-list", 3, "left", "top", "panstart", "panmove", 4, "ngIf"], [1, "example-list", 3, "panstart", "panmove"], [1, "symbol-list"], ["symListCard", ""], [1, "panelTitle"], ["mat-mini-fab", "", 1, "matCloseWrapper", 3, "click"], [1, "closeIcon"], [1, "toolbarDivider"], [4, "ngIf"], ["class", "symbol", 4, "ngFor", "ngForOf"], [1, "symbol"], [3, "id", "ngClass", "click"], [1, "canvasSymbol", 3, "id"], ["cmp", ""]],
      template: function SymbolListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, SymbolListComponent_div_0_Template, 15, 9, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](1, "async");
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](1, 1, ctx.displaySymbolList$));
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_11__["MatCard"], _angular_material_card__WEBPACK_IMPORTED_MODULE_11__["MatCardTitleGroup"], _angular_material_card__WEBPACK_IMPORTED_MODULE_11__["MatCardTitle"], _angular_material_button__WEBPACK_IMPORTED_MODULE_12__["MatButton"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__["MatIcon"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_14__["MatDivider"], _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgClass"]],
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_10__["AsyncPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_10__["KeyValuePipe"]],
      styles: ["[_nghost-%COMP%]     .mat-list-item-content {\n  padding: 0 !important;\n}\n\n[_nghost-%COMP%]     .mat-list-text {\n  padding: 0 5px !important;\n}\n\n.example-list[_ngcontent-%COMP%] {\n  margin-left: 70% !important;\n  max-width: 20%;\n}\n\n.toolbarDivider[_ngcontent-%COMP%] {\n  padding-top: 5px !important;\n  color: darkred;\n}\n\n.closeIcon[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover {\n  background-color: #e35183;\n}\n\n.canvasSymbol[_ngcontent-%COMP%] {\n  border: 1px solid #fff2e1;\n  width: 2vw;\n  height: 1vw;\n}\n\n.symbol[_ngcontent-%COMP%]:hover {\n  background-color: #fff2e1;\n  border: 1px solid #fff2e1;\n}\n\n.active[_ngcontent-%COMP%] {\n  background: #fff2e1;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3ltYm9sLWxpc3QvRDpcXFBoRFxcY29kZVxcZnJvbVNjcmF0Y2hcXG15T2dpdG8vc3JjXFxhcHBcXHN5bWJvbC1saXN0XFxzeW1ib2wtbGlzdC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvc3ltYm9sLWxpc3Qvc3ltYm9sLWxpc3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDRSxxQkFBQTtBQ0FGOztBRElBO0VBQ0UseUJBQUE7QUNERjs7QURHQTtFQUNFLDJCQUFBO0VBQ0EsY0FBQTtBQ0FGOztBREdBO0VBQ0UsMkJBQUE7RUFFQSxjQUFBO0FDREY7O0FESUE7RUFDRSx5QkFBQTtBQ0RGOztBREdBO0VBRUUseUJBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtBQ0RGOztBREdBO0VBQ0UseUJBQUE7RUFDQSx5QkFBQTtBQ0FGOztBREVBO0VBQ0UsbUJBQUE7QUNDRiIsImZpbGUiOiJzcmMvYXBwL3N5bWJvbC1saXN0L3N5bWJvbC1saXN0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdG8gcmVtb3ZlIHRoZSBwYWRkaW5nIGluIG1hdC1saXN0XHJcbjpob3N0IDo6bmctZGVlcCAubWF0LWxpc3QtaXRlbS1jb250ZW50IHtcclxuICBwYWRkaW5nOiAwIWltcG9ydGFudDtcclxufVxyXG5cclxuLy8gdG8gcmVtb3ZlIHRoZSBwYWRkaW5nIG9uIHRoZSB0ZXh0IG9mIHRoZSBsaXN0XHJcbjpob3N0IDo6bmctZGVlcCAubWF0LWxpc3QtdGV4dCB7XHJcbiAgcGFkZGluZzogMCA1cHggIWltcG9ydGFudDtcclxufVxyXG4uZXhhbXBsZS1saXN0e1xyXG4gIG1hcmdpbi1sZWZ0OiA3MCUgIWltcG9ydGFudDtcclxuICBtYXgtd2lkdGg6IDIwJTtcclxufVxyXG5cclxuLnRvb2xiYXJEaXZpZGVyIHtcclxuICBwYWRkaW5nLXRvcDogNXB4ICFpbXBvcnRhbnQ7XHJcblxyXG4gIGNvbG9yOmRhcmtyZWQgO1xyXG59XHJcblxyXG4uY2xvc2VJY29uIDpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UzNTE4MzsgIC8vdG8gZm9jdXMgdGhlIGljb25zXHJcbn1cclxuLmNhbnZhc1N5bWJvbCB7XHJcbiAvLyBiYWNrZ3JvdW5kLWNvbG9yOiAgI2ZmZjJlMTtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjZmZmMmUxO1xyXG4gIHdpZHRoOiAydnc7ICAvLyByZXNwb25zaXZlIHRvIHRoZSBzaXplIG9mIHRoZSBWV1xyXG4gIGhlaWdodDogMXZ3O1xyXG59XHJcbi5zeW1ib2w6aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmYyZTE7ICAvL3RvIGZvY3VzIHRoZSBpY29uc1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNmZmYyZTE7XHJcbn1cclxuLmFjdGl2ZSB7XHJcbiAgYmFja2dyb3VuZDogI2ZmZjJlMTtcclxufVxyXG4iLCI6aG9zdCA6Om5nLWRlZXAgLm1hdC1saXN0LWl0ZW0tY29udGVudCB7XG4gIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC5tYXQtbGlzdC10ZXh0IHtcbiAgcGFkZGluZzogMCA1cHggIWltcG9ydGFudDtcbn1cblxuLmV4YW1wbGUtbGlzdCB7XG4gIG1hcmdpbi1sZWZ0OiA3MCUgIWltcG9ydGFudDtcbiAgbWF4LXdpZHRoOiAyMCU7XG59XG5cbi50b29sYmFyRGl2aWRlciB7XG4gIHBhZGRpbmctdG9wOiA1cHggIWltcG9ydGFudDtcbiAgY29sb3I6IGRhcmtyZWQ7XG59XG5cbi5jbG9zZUljb24gOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2UzNTE4Mztcbn1cblxuLmNhbnZhc1N5bWJvbCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNmZmYyZTE7XG4gIHdpZHRoOiAydnc7XG4gIGhlaWdodDogMXZ3O1xufVxuXG4uc3ltYm9sOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjJlMTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2ZmZjJlMTtcbn1cblxuLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6ICNmZmYyZTE7XG59Il19 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SymbolListComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-symbol-list',
          templateUrl: './symbol-list.component.html',
          styleUrls: ['./symbol-list.component.scss']
        }]
      }], function () {
        return [{
          type: _open_layers_service__WEBPACK_IMPORTED_MODULE_8__["OpenLayersService"]
        }, {
          type: _map_qgs_style_service__WEBPACK_IMPORTED_MODULE_9__["MapQgsStyleService"]
        }];
      }, {
        symbolList: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: ['symbolList', {
            "static": false
          }]
        }],
        myCanvas: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"],
          args: ['cmp']
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/toolbar/toolbar.component.ts":
  /*!**********************************************!*\
    !*** ./src/app/toolbar/toolbar.component.ts ***!
    \**********************************************/

  /*! exports provided: ToolbarComponent */

  /***/
  function srcAppToolbarToolbarComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ToolbarComponent", function () {
      return ToolbarComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_material_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/material/icon */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
    /* harmony import */


    var _open_layers_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../open-layers.service */
    "./src/app/open-layers.service.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _angular_material_card__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/material/card */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/card.js");
    /* harmony import */


    var _angular_material_divider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/material/divider */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/divider.js");
    /* harmony import */


    var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/material/toolbar */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/toolbar.js");
    /* harmony import */


    var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! @angular/material/button */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
    /* harmony import */


    var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/material/tooltip */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/tooltip.js");

    function ToolbarComponent_div_0_Template(rf, ctx) {
      if (rf & 1) {
        var _r60 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("panstart", function ToolbarComponent_div_0_Template_div_panstart_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r60);

          var ctx_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r59.onPanStart($event);
        })("panmove", function ToolbarComponent_div_0_Template_div_panmove_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r60);

          var ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r61.onPan($event);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-card", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "mat-divider", 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-toolbar", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ToolbarComponent_div_0_Template_button_click_4_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r60);

          var ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r62.zoomHome();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "mat-icon");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "home");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ToolbarComponent_div_0_Template_button_click_7_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r60);

          var ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r63.createScratchLayer();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "mat-icon", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "layers");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "button", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ToolbarComponent_div_0_Template_button_click_10_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r60);

          var ctx_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r64.createScratchLayer();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "mat-icon", 9);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("left", ctx_r58.x, "px")("top", ctx_r58.y, "px");
      }
    } //import {Indicator, IndicatorAnimations} from '../indicator';


    var ToolbarComponent = /*#__PURE__*/function () {
      function ToolbarComponent(iconRegistry, sanitizer, openLayersService) {
        _classCallCheck(this, ToolbarComponent);

        this.openLayersService = openLayersService;
        this.x = 0;
        this.y = 0;
        this.startX = 0;
        this.startY = 0;
        this.existingProject = true;
        iconRegistry.addSvgIcon('layerScratch', sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-layers-new-24px.svg'));
      }

      _createClass(ToolbarComponent, [{
        key: "onPanStart",
        value: function onPanStart(event) {
          this.startX = this.x;
          this.startY = this.y;
        }
      }, {
        key: "onPan",
        value: function onPan(event) {
          event.preventDefault();
          this.x = this.startX + event.deltaX;
          this.y = this.startY + event.deltaY;
        }
      }, {
        key: "zoomHome",
        value: function zoomHome() {
          this.openLayersService.updateZoomHome(true);
        }
      }, {
        key: "createScratchLayer",
        value: function createScratchLayer() {
          /**
           * #TODO  send a subscription? ...
           */
        }
      }, {
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this17 = this;

          this.subscriptionExistingProject = this.openLayersService.existingProject$.subscribe(function (data) {
            return _this17.existingProject = true;
          }, function (error) {
            alert('error retrieving existing project');
            console.log(error);
          });
        }
      }]);

      return ToolbarComponent;
    }();

    ToolbarComponent.ɵfac = function ToolbarComponent_Factory(t) {
      return new (t || ToolbarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_icon__WEBPACK_IMPORTED_MODULE_1__["MatIconRegistry"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_open_layers_service__WEBPACK_IMPORTED_MODULE_3__["OpenLayersService"]));
    };

    ToolbarComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: ToolbarComponent,
      selectors: [["app-toolbar"]],
      decls: 1,
      vars: 1,
      consts: [["class", "mapToolbar", 3, "left", "top", "panstart", "panmove", 4, "ngIf"], [1, "mapToolbar", 3, "panstart", "panmove"], ["color", "primary", 1, "spacetitle"], [1, "toolbarDivider"], ["color", "primary"], ["matTooltip", "Zoom to the study area", "aria-labelledby", "Zoom to the study area", "mat-icon-button", "", 3, "click"], ["mat-icon-button", "", "aria-labelledby", "Show Layer Panel", "matTooltip", "Show List of layers", 3, "click"], [1, "svgIconToolbar"], ["mat-icon-button", "", "aria-labelledby", "Add a scratch layer", "matTooltip", "Add a scratch layer", 3, "click"], ["svgIcon", "layerScratch", 1, "svgIconToolbar"]],
      template: function ToolbarComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, ToolbarComponent_div_0_Template, 12, 4, "div", 0);
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.existingProject);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_5__["MatCard"], _angular_material_divider__WEBPACK_IMPORTED_MODULE_6__["MatDivider"], _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_7__["MatToolbar"], _angular_material_button__WEBPACK_IMPORTED_MODULE_8__["MatButton"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_9__["MatTooltip"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_1__["MatIcon"]],
      styles: [".mapToolbar[_ngcontent-%COMP%] {\n  z-index: 2;\n  width: 3%;\n  max-height: 60%;\n  margin-left: 90%;\n  margin-top: 10%;\n  flex-direction: column;\n  position: absolute;\n  border-radius: 3px;\n  background-color: #ad1457;\n}\n\n.mapToolbar[_ngcontent-%COMP%]:hover {\n  cursor: pointer;\n}\n\n.mat-toolbar[_ngcontent-%COMP%] {\n  flex-direction: column;\n  height: 100%;\n}\n\n.mat-toolbar[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover {\n  background-color: #e35183;\n}\n\n.spacetitle[_ngcontent-%COMP%] {\n  padding-top: 15px;\n  padding-left: 0px;\n  padding-right: 0px;\n  margin: 0 0;\n  background-color: #ad1457 !important;\n}\n\n.toolbarTitle[_ngcontent-%COMP%]:hover {\n  background-color: aqua;\n}\n\n.toolbarDivider[_ngcontent-%COMP%] {\n  background-color: white;\n}\n\n.svgIconToolbar[_ngcontent-%COMP%] {\n  color: white;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdG9vbGJhci9EOlxcUGhEXFxjb2RlXFxmcm9tU2NyYXRjaFxcbXlPZ2l0by9zcmNcXGFwcFxcdG9vbGJhclxcdG9vbGJhci5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvdG9vbGJhci90b29sYmFyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsVUFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7QUNDRjs7QURDQTtFQUNFLGVBQUE7QUNFRjs7QURBQTtFQUNFLHNCQUFBO0VBQ0EsWUFBQTtBQ0dGOztBREFBO0VBQ0UseUJBQUE7QUNHRjs7QURBQTtFQUNFLGlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxvQ0FBQTtBQ0dGOztBRERBO0VBQ0Usc0JBQUE7QUNJRjs7QURGQTtFQUNFLHVCQUFBO0FDS0Y7O0FESEE7RUFDRSxZQUFBO0FDTUYiLCJmaWxlIjoic3JjL2FwcC90b29sYmFyL3Rvb2xiYXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubWFwVG9vbGJhcntcclxuICB6LWluZGV4OiAyO1xyXG4gIHdpZHRoOiAzJTsgIC8vMyVcclxuICBtYXgtaGVpZ2h0OiA2MCU7XHJcbiAgbWFyZ2luLWxlZnQ6IDkwJTsgIC8vOTUlXHJcbiAgbWFyZ2luLXRvcDoxMCU7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNhZDE0NTc7ICAgLy9zYW1lIHRoYXQgcHJpbWFyeSBjb2xvclxyXG59XHJcbi5tYXBUb29sYmFyOmhvdmVyIHtcclxuICBjdXJzb3I6cG9pbnRlcjtcclxuIH1cclxuLm1hdC10b29sYmFyIHtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGhlaWdodDogMTAwJTsgLy8xMDAlIG9mIHRoZSBwYXJlbnQgKGRpdilcclxuICAvLyB0aGUgcHJpbWFyeSBjb2xvciBvZiB0aGUgdGhlbWVcclxufVxyXG4ubWF0LXRvb2xiYXIgOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTM1MTgzOyAgLy90byBmb2N1cyB0aGUgaWNvbnNcclxufVxyXG5cclxuLnNwYWNldGl0bGUge1xyXG4gIHBhZGRpbmctdG9wOiAxNXB4OyAgLy8yMFxyXG4gIHBhZGRpbmctbGVmdDogMHB4O1xyXG4gIHBhZGRpbmctcmlnaHQ6IDBweDtcclxuICBtYXJnaW46IDAgMDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiNhZDE0NTcgIWltcG9ydGFudDtcclxufVxyXG4udG9vbGJhclRpdGxlOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xyXG59XHJcbi50b29sYmFyRGl2aWRlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7ICAvLyBmb3IgdGVzdGluZyAtLVxyXG59XHJcbi5zdmdJY29uVG9vbGJhciB7XHJcbiAgY29sb3I6d2hpdGU7XHJcbn1cclxuIiwiLm1hcFRvb2xiYXIge1xuICB6LWluZGV4OiAyO1xuICB3aWR0aDogMyU7XG4gIG1heC1oZWlnaHQ6IDYwJTtcbiAgbWFyZ2luLWxlZnQ6IDkwJTtcbiAgbWFyZ2luLXRvcDogMTAlO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2FkMTQ1Nztcbn1cblxuLm1hcFRvb2xiYXI6aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5tYXQtdG9vbGJhciB7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLm1hdC10b29sYmFyIDpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlMzUxODM7XG59XG5cbi5zcGFjZXRpdGxlIHtcbiAgcGFkZGluZy10b3A6IDE1cHg7XG4gIHBhZGRpbmctbGVmdDogMHB4O1xuICBwYWRkaW5nLXJpZ2h0OiAwcHg7XG4gIG1hcmdpbjogMCAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYWQxNDU3ICFpbXBvcnRhbnQ7XG59XG5cbi50b29sYmFyVGl0bGU6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xufVxuXG4udG9vbGJhckRpdmlkZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbn1cblxuLnN2Z0ljb25Ub29sYmFyIHtcbiAgY29sb3I6IHdoaXRlO1xufSJdfQ== */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ToolbarComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-toolbar',
          templateUrl: './toolbar.component.html',
          styleUrls: ['./toolbar.component.scss'] // animations: IndicatorAnimations

        }]
      }], function () {
        return [{
          type: _angular_material_icon__WEBPACK_IMPORTED_MODULE_1__["MatIconRegistry"]
        }, {
          type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"]
        }, {
          type: _open_layers_service__WEBPACK_IMPORTED_MODULE_3__["OpenLayersService"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/environments/environment.ts":
  /*!*****************************************!*\
    !*** ./src/environments/environment.ts ***!
    \*****************************************/

  /*! exports provided: environment */

  /***/
  function srcEnvironmentsEnvironmentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "environment", function () {
      return environment;
    }); // This file can be replaced during build by using the `fileReplacements` array.
    // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
    // The list of file replacements can be found in `angular.json`.


    var environment = {
      production: false
    };
    /*
     * For easier debugging in development mode, you can import the following file
     * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
     *
     * This import should be commented out in production mode because it will have a negative impact
     * on performance if an error is thrown.
     */
    // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

    /***/
  },

  /***/
  "./src/main.ts":
  /*!*********************!*\
    !*** ./src/main.ts ***!
    \*********************/

  /*! no exports provided */

  /***/
  function srcMainTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var hammerjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! hammerjs */
    "./node_modules/hammerjs/hammer.js");
    /* harmony import */


    var hammerjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_2__);
    /* harmony import */


    var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./app/app.module */
    "./src/app/app.module.ts");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js"); // make the gesture support globally available


    if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
      Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
    }

    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])["catch"](function (err) {
      return console.error(err);
    });
    /***/

  },

  /***/
  0:
  /*!***************************!*\
    !*** multi ./src/main.ts ***!
    \***************************/

  /*! no static exports found */

  /***/
  function _(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(
    /*! D:\PhD\code\fromScratch\myOgito\src\main.ts */
    "./src/main.ts");
    /***/
  }
}, [[0, "runtime", "vendor"]]]);
//# sourceMappingURL=main-es5.js.map