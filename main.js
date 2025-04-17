import Vue from 'vue'
import App from './App'

App.mpType = 'app'

//isXX getXX setXX initXX

/* import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"; 
Vue.component('uniLoadMore',uniLoadMore) */


// import perparUtil from './static/js/idea-parse/index.js'
// Vue.prototype.$prepareHtml = perparUtil.prepareHtml;


import util from "./static/js/utils/util.js"

Vue.prototype.getPlat = util.getPlat;
Vue.prototype.isWeixin = util.isWeixin;
Vue.prototype.isApp = util.isApp;
Vue.prototype.isH5 = util.isH5;
Vue.prototype.getSysInfo = util.getSysInfo;

Vue.prototype.getQuery = util.getQuery;
Vue.prototype.$naviExter = util.jump_to_exter_page;

Vue.prototype.$openImage = util.openImage;
Vue.prototype.$navigateTo = util.navigateTo;
Vue.prototype.$redirectTo = util.redirectTo;
Vue.prototype.$switchTab = util.switchTab;
Vue.prototype.$reLaunch = util.reLaunch;

Vue.prototype.$toast = util.toast;
Vue.prototype.$comfirm = util.comfirm;

Vue.prototype.initConfig =util.initConfig
Vue.prototype.getConfig=util.getConfig;
Vue.prototype.getConst=util.getConst;
Vue.prototype.getUser = util.getUser;
Vue.prototype.setUser = util.setUser;
Vue.prototype.$refreshUser = util.refreshUser

Vue.prototype.getImgPath = util.getImgPath;
Vue.prototype.$rmLoginMsg = util.rmLoginMsg;

Vue.prototype.$updateAppVersion=util.updateAppVersion;

Vue.prototype.isChecking=function(k,type){
	let cf=util.getConfig();
	if(1==cf.mp_check_stat){
		return true;
	}else{
		return false;
	}
}



import numUtil from "./static/js/utils/numUtil.js"
Vue.prototype.$getRandom = numUtil.getRandom;
Vue.prototype.$round2pos = numUtil.round2pos;

import strUtil from "./static/js/utils/strUtil.js"
Vue.prototype.$isNull = strUtil.isNull;
Vue.prototype.$notNull = strUtil.notNull;
Vue.prototype.$endwith = strUtil.endwith;
Vue.prototype.$copyTxt = function(ct){ if(util.isH5()){ strUtil.copyTxtByH5(ct);}else{strUtil.copyTxtByApp(ct); }}


import objUtil from "./static/js/utils/objUtil.js"
Vue.prototype.$pushNoRepeat = objUtil.pushNoRepeat;
Vue.prototype.$delArrItem = objUtil.delArrItem;
Vue.prototype.$delArrItemByKv = objUtil.delArrItemByKv;
Vue.prototype.getLi = objUtil.getLi;
Vue.prototype.getMap = objUtil.getMap;
Vue.prototype.$copyObj = objUtil.copyObj;
Vue.prototype.$combineObjectInList = objUtil.combineObjectInList;

import cacheUtil from "./static/js/utils/cacheUtil.js"
Vue.prototype.$dataLocal = cacheUtil.data_local;
Vue.prototype.$dataSession = cacheUtil.data_session;

import dateUtil from "./static/js/utils/dateUtil.js"
Vue.prototype.$getDateStr = dateUtil.getDateStr;
Vue.prototype.$getYmd = dateUtil.getYmd;
Vue.prototype.$getDateParam = dateUtil.getDateParam;

import requestUtil from "./static/js/utils/requestUtil.js"
Vue.prototype.$post = requestUtil.post;
Vue.prototype.$get = requestUtil.get;
Vue.prototype.$put = requestUtil.put;
Vue.prototype.$delete = requestUtil.delete;
Vue.prototype.$upload = requestUtil.upLoad;
Vue.prototype.$chooseImageUpload = requestUtil.choose_image_upload;

import wxUtil from "./static/js/utils/wxUtil.js"
Vue.prototype.wxLogin = wxUtil.wxLogin;
Vue.prototype.updateWxLogin = wxUtil.updateWxLogin;
Vue.prototype.wxmpGetUser= wxUtil.wxmpGetUser;//已经弃用,使用mp-auth获取微信头像
 


import wsUtil from "./static/js/utils/wsUtil.js"
Vue.prototype.INIT_WS = wsUtil.INIT_WS;
Vue.prototype.SEND_WS_MSG = wsUtil.SEND_WS_MSG;
Vue.prototype.CLOSE_WS= wsUtil.CLOSE_WS;


/* ================================================================== */



import store from "./store/index.js";
const app = new Vue({
    ...App,store
})
app.$mount()