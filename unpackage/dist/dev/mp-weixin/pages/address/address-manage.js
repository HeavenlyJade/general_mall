(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/address/address-manage"],{

/***/ 250:
/*!**************************************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/main.js?{"page":"pages%2Faddress%2Faddress-manage"} ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _addressManage = _interopRequireDefault(__webpack_require__(/*! ./pages/address/address-manage.vue */ 251));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_addressManage.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 251:
/*!*******************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/pages/address/address-manage.vue ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./address-manage.vue?vue&type=template&id=6cc50c12& */ 252);
/* harmony import */ var _address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./address-manage.vue?vue&type=script&lang=js& */ 254);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _address_manage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./address-manage.vue?vue&type=style&index=0&lang=scss& */ 256);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__["render"],
  _address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/address/address-manage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 252:
/*!**************************************************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/pages/address/address-manage.vue?vue&type=template&id=6cc50c12& ***!
  \**************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./address-manage.vue?vue&type=template&id=6cc50c12& */ 253);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_template_id_6cc50c12___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 253:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/code/company/mini_app/general_mall/general_mall/pages/address/address-manage.vue?vue&type=template&id=6cc50c12& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 254:
/*!********************************************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/pages/address/address-manage.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./address-manage.vue?vue&type=script&lang=js& */ 255);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 255:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/code/company/mini_app/general_mall/general_mall/pages/address/address-manage.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var mpvueCityPicker = function mpvueCityPicker() {
  Promise.all(/*! require.ensure | components/mpvue-citypicker/mpvueCityPicker */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/mpvue-citypicker/mpvueCityPicker")]).then((function () {
    return resolve(__webpack_require__(/*! @/components/mpvue-citypicker/mpvueCityPicker.vue */ 415));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
/* 	import cityData from '@/components/city.data.js';
	import cityData3 from '@/components/city.data-3.js'; */
var _default = {
  components: {
    mpvueCityPicker: mpvueCityPicker
  },
  data: function data() {
    return {
      edit_city_picker: true,
      cityPickerValueDefault: [0, 0, 1],
      themeColor: '#007AFF',
      addressData: {
        pickerText: '',
        name: '',
        mobile: '',
        addressName: '',
        address: '',
        area: '',
        default: false
      },
      addressList: []
    };
  },
  onLoad: function onLoad(option) {
    this.loadAddress();
    var title = '新增收货地址';
    if (option.type === 'edit') {}
    if (!!option.id) {
      title = '编辑收货地址';
      this.locateAddress(option.id);
    }
    uni.setNavigationBarTitle({
      title: title
    });
  },
  methods: {
    onConfirm: function onConfirm(e) {
      this.addressData.pickerText = e.label;
    },
    showMulLinkageThreePicker: function showMulLinkageThreePicker() {
      this.$refs.mpvueCityPicker.show();
    },
    locateAddress: function locateAddress(_id) {
      var _this2 = this;
      // 显示加载提示
      uni.showLoading({
        title: '加载中'
      });

      // 获取用户ID
      var user = this.getUser() || {};
      if (!user.id) {
        uni.hideLoading();
        this.$toast('请先登录');
        return;
      }

      // 调用获取单个地址详情接口
      this.$get("/wx_mini_app/wx_auth/address/".concat(user.id, "/").concat(_id), {}, function (res) {
        uni.hideLoading();
        console.log("res", res);
        if (res && res.code === 200 && res.data) {
          // 转换API返回的数据格式为表单使用的格式
          var item = res.data;
          _this2.addressData = {
            id: item.id,
            name: item.receiver_name,
            mobile: item.receiver_phone,
            pickerText: "".concat(item.province, " ").concat(item.city, " ").concat(item.district).trim(),
            addressName: item.detail_address,
            default: item.is_default === 1
          };
        }
      }, function (err) {
        uni.hideLoading();
        console.error('获取地址详情失败:', err);
        _this2.$toast('获取地址详情失败');
      });
    },
    loadAddress: function loadAddress() {
      var _this3 = this;
      var _this = this;
      // 显示加载提示
      uni.showLoading({
        title: '加载中'
      });

      // 获取用户ID
      var user = this.getUser() || {};
      if (!user.id) {
        uni.hideLoading();
        this.$toast('请先登录');
        return;
      }

      // 调用地址列表接口
      this.$get("/wx_mini_app/wx_auth/address/".concat(user.id), {}, function (res) {
        uni.hideLoading();
        if (res && res.code === 200 && res.items) {
          _this3.addressList = res.items;
        } else {
          _this3.addressList = [];
        }
      }, function (err) {
        uni.hideLoading();
        console.error('获取地址列表失败:', err);
        _this3.$toast('获取地址列表失败');
        _this3.addressList = [];
      });
    },
    switchChange: function switchChange(e) {
      var li = this.addressList;
      console.log(true === e.detail.value);
      if (true === e.detail.value) {
        for (var i in li) {
          var ite = li[i];
          ite.default = false;
        }
      }
      console.log(li);
      this.addressData.default = e.detail.value;
    },
    //地图选择地址
    chooseLocation: function chooseLocation() {
      var _this4 = this;
      uni.chooseLocation({
        success: function success(data) {
          _this4.addressData.addressName = data.name;
          _this4.addressData.address = data.name;
        }
      });
    },
    //提交
    confirm: function confirm() {
      var _this5 = this;
      var data = this.addressData;
      if (!data.name) {
        this.$toast('请填写收货人姓名');
        return;
      }
      if (!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(data.mobile)) {
        this.$toast('请输入正确的手机号码');
        return;
      }
      if (!data.pickerText) {
        this.$toast('请选择所在区域');
        return;
      }
      if (!data.addressName) {
        this.$toast('请填写详细地址');
        return;
      }

      // 显示加载提示
      uni.showLoading({
        title: '保存中'
      });

      // 获取用户ID
      var user = this.getUser() || {};
      if (!user.id) {
        uni.hideLoading();
        this.$toast('请先登录');
        return;
      }

      // 准备提交的数据，完全符合接口格式
      var data_list = data.pickerText.split('-');
      var province = data_list[0];
      var city = data_list[1];
      var district = data_list[2];
      var requestData = {
        user_id: String(user.id),
        receiver_name: data.name || null,
        receiver_phone: data.mobile || null,
        province: province,
        city: city,
        district: district,
        detail_address: data.addressName || null,
        postal_code: null,
        is_default: data.default ? 1 : 0
      };
      if (data.id) {
        // 编辑地址 - PUT请求
        var apiUrl = "/wx_mini_app/wx_auth/address/".concat(user.id, "/").concat(data.id);
        this.$put(apiUrl, requestData, function (result) {
          uni.hideLoading();
          if (result.code === 200) {
            _this5.$toast('修改成功');
            setTimeout(function () {
              uni.navigateBack();
            }, 800);
          } else {
            _this5.$toast(result.message || '修改失败');
          }
        }, function (err) {
          uni.hideLoading();
          console.error('修改地址失败:', err);
          _this5.$toast('修改失败');
        });
      } else {
        // 新增地址 - POST请求
        var _apiUrl = "/wx_mini_app/wx_auth/address/".concat(user.id);
        this.$post(_apiUrl, requestData, function (result) {
          uni.hideLoading();
          console.log("result", result);
          if (result.code === 200) {
            _this5.$toast('添加成功');
            setTimeout(function () {
              uni.navigateBack();
            }, 800);
          } else {
            _this5.$toast(result.message || '添加失败');
          }
        }, function (err) {
          uni.hideLoading();
          console.error('添加地址失败:', err);
          _this5.$toast('添加失败');
        });
      }
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 256:
/*!*****************************************************************************************************************************!*\
  !*** D:/code/company/mini_app/general_mall/general_mall/pages/address/address-manage.vue?vue&type=style&index=0&lang=scss& ***!
  \*****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../dev_soft/HBuilderX.4.29.2024093009/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./address-manage.vue?vue&type=style&index=0&lang=scss& */ 257);
/* harmony import */ var _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_dev_soft_HBuilderX_4_29_2024093009_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_address_manage_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 257:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/code/company/mini_app/general_mall/general_mall/pages/address/address-manage.vue?vue&type=style&index=0&lang=scss& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[250,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/address-manage.js.map