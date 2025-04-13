(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/user/user"],{

/***/ 121:
/*!*************************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/main.js?{"page":"pages%2Fuser%2Fuser"} ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _user = _interopRequireDefault(__webpack_require__(/*! ./pages/user/user.vue */ 122));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_user.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 122:
/*!******************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/pages/user/user.vue ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user.vue?vue&type=template&id=80842834& */ 123);
/* harmony import */ var _user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user.vue?vue&type=script&lang=js& */ 125);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _user_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user.vue?vue&type=style&index=0&lang=scss& */ 127);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__["render"],
  _user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/user/user.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 123:
/*!*************************************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/pages/user/user.vue?vue&type=template&id=80842834& ***!
  \*************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./user.vue?vue&type=template&id=80842834& */ 124);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_template_id_80842834___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 124:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/code/company/mini_app/general_mall/general_mall/pages/user/user.vue?vue&type=template&id=80842834& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var m0 =
    _vm.storeUser.wxHeadImg ||
    _vm.userInfo.userInfo ||
    _vm.userInfo.wxHeadImg ||
    _vm.getConst().defaultAvatar
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        m0: m0,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 125:
/*!*******************************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/pages/user/user.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./user.vue?vue&type=script&lang=js& */ 126);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 126:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/code/company/mini_app/general_mall/general_mall/pages/user/user.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  computed: {
    storeUser: function storeUser() {
      return this.$store.state.user;
    },
    // 添加计算属性判断是否已授权微信
    hasWxAuth: function hasWxAuth() {
      return !!(this.storeUser.wxHeadImg || this.userInfo.wxHeadImg);
    }
  },
  data: function data() {
    return {
      userInfo: {
        //headImg: '/static/img/user/avatar.jpg',
        headImg: '/static/img/user/default-head.png',
        nickName: 'noname',
        avatar: '/static/img/user/default-head.png',
        wxHeadImg: ''
      },
      headerBgImage: '',
      orderStatusList: [{
        name: '待付款',
        icon: 'iconfont icon31daifukuan',
        status: 10,
        "uri": "/pages/order/order?stat=1"
      }, {
        name: '待发货',
        icon: 'iconfont icon31daifahuo',
        status: 30,
        "uri": "/pages/order/order?stat=2"
      }, {
        name: '待收货',
        icon: 'iconfont icon31daishouhuo',
        status: 40,
        "uri": "/pages/order/order?stat=3"
      }, {
        name: '待评价',
        icon: 'iconfont icon31daipingjia',
        status: 50,
        "uri": "/pages/order/order?stat=4"
      }, {
        name: '全部',
        icon: 'iconfont icon31yiguanzhudianpu',
        status: 55,
        "uri": "/pages/order/order"
      }],
      currentIndex: 0
    };
  },
  methods: {
    // 添加到methods中
    getUserProfile: function getUserProfile() {
      var _this = this;
      // 直接调用getUserProfile，必须在用户点击事件中直接调用
      wx.getUserInfo({
        provider: 'weixin',
        // 指定微信登录
        desc: '用于完善用戶资料',
        // 声明获取用户个人信息后的用途
        success: function success(res) {
          // 获取用户信息成功后，再进行登录操作
          console.log('用户信息:', res);
          _this.loginWithUserInfo(res.userInfo);
        },
        fail: function fail(err) {
          console.error('获取用户信息失败:', err);
          _this.$toast("获取用户信息失败: " + (err.errMsg || JSON.stringify(err)));
        }
      });
    },
    // 新增方法，在获取用户信息后调用登录
    loginWithUserInfo: function loginWithUserInfo(userInfo) {
      var _this2 = this;
      // 先获取登录凭证
      uni.login({
        provider: 'weixin',
        success: function success(loginRes) {
          if (loginRes.code) {
            // 准备API请求数据
            console.log('登录凭证:', loginRes);
            var requestData = {
              code: loginRes.code,
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName
            };
            console.log('准备发送的数据:', requestData);

            // 发送请求到后端API
            _this2.$post("/wx_mini_app/wx_auth/wechat_login", requestData, function (result) {
              console.log('用戶登陸數據成功:', result);

              // 检查返回的数据结构
              if (result.code === 200) {
                // 更新本地用户信息
                var userData = result.user_info;
                userData.wxHeadImg = userData.avatar || userInfo.avatarUrl;
                userData.wxNickName = userData.nickname || userInfo.nickName;
                console.log("userData", userData);
                // 保存token
                _this2.$dataLocal("token", result.access_token);

                // 保存用户信息
                _this2.setUser(userData);
                _this2.$store.dispatch("user/update", userData);
                _this2.userInfo = userData;
                _this2.$toast("登录成功");
              } else {
                console.error('返回数据格式不正确:', result);
                _this2.$toast("登录失败");
              }
            }, function (err) {
              console.error('更新用户信息失败:', err);
            });
          }
        },
        fail: function fail(err) {
          console.error('登录失败:', err);
          _this2.$toast("登录失败: " + (err.errMsg || JSON.stringify(err)));
        }
      });
    },
    tuiguang: function tuiguang() {
      var user = this.getUser() || {};
      var _url = "./external/guider.html?guider=" + user.id;
      if (this.isWeixin()) {
        location.href = _url;
      } else {
        this.$navigateTo("/pages/user/zhiwen-share");
      }
    },
    tologin: function tologin() {
      // 如果没有微信授权，提示用户先授权
      if (!this.hasWxAuth) {
        return;
      }
      if (this.$isNull(this.userInfo.id) || this.$isNull(this.userInfo.mobile)) {
        this.$dataLocal("pre_reg_page", "/pages/user/user");
        this.$navigateTo("/pages/login/register");
      } else {
        this.$navigateTo("/pages/user/set");
      }
    },
    getuser: function getuser() {
      // 获取用户信息，但不自动登录
      var user = this.getUser() || {
        headImg: '/static/img/user/default-head.png',
        nickName: 'noname'
      };
      this.userInfo = user;
    },
    // 清除登录状态
    clearLoginStatus: function clearLoginStatus() {
      if (!this.hasWxAuth) {
        // 如果没有微信授权，则不自动登录
        var user = this.getUser() || {};
        if (!user.wxHeadImg && !user.wxNickName) {
          // 只在开发者工具中重置授权信息，实际环境中会由按钮触发授权
          var newUser = _objectSpread(_objectSpread({}, user), {}, {
            wxHeadImg: '',
            wxNickName: '',
            wxMpOpenId: ''
          });
          this.setUser(newUser);
          this.$store.dispatch("user/update", newUser);
        }
      }
    },
    getHeaderBgImage: function getHeaderBgImage() {
      var _this3 = this;
      this.$get('/mini_core/banners/by-type/user_bg', {}, function (res) {
        if (res && res.items && res.items.length > 0) {
          _this3.headerBgImage = res.items[0].upload_image;
        }
      }, function (err) {
        console.error('获取背景图片失败:', err);
      });
    }
  },
  onLoad: function onLoad() {
    this.getuser();
    this.clearLoginStatus();
  },
  onShow: function onShow() {
    this.getuser();
    this.getHeaderBgImage();
    this.clearLoginStatus();
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 127:
/*!****************************************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/pages/user/user.vue?vue&type=style&index=0&lang=scss& ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./user.vue?vue&type=style&index=0&lang=scss& */ 128);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_user_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 128:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/code/company/mini_app/general_mall/general_mall/pages/user/user.vue?vue&type=style&index=0&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[121,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map