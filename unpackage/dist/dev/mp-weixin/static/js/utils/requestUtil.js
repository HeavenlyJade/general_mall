import {data_local} from "./cacheUtil.js"


import CONFIG from "../data/constant.js"

function Core() {

}


Core.prototype.choose_image_upload = function(imgNum, callback) {
	let img_list = [];

	uni.chooseImage({
		sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album'], //从相册选择
		count: imgNum,
		success: (res) => {
			img_list = img_list.concat(res.tempFilePaths);
			requestUtil.upload_img(img_list, callback)
		}
	})

}
Core.prototype.upload_img = function(img_list, callback) {
		let LIST = img_list;
		let images = [];
		for (var i = 0, len = LIST.length; i < len; i++) {
			var image_obj = {
				name: 'image-' + i,
				uri: LIST[i]
			};
			images.push(image_obj);
		}
		var uploadNum = 0;
		var imgList = [];
		console.log(images.length + "===上传文件的个数");
		uni.showLoading({
			"title": "上传中"
		});
		for (let i in images) {
			let file = images[i].uri;
			requestUtil.upLoad(file, (uploadFileRes) => {
				let obj = JSON.parse(uploadFileRes);
				let img = obj.data[0].url
				imgList.push(img);
				uploadNum++;
			}, (err) => {

			})
		}
		var i = setInterval(() => {
			if (uploadNum == images.length) {
				uni.hideLoading()
				callback(imgList);
				clearInterval(i);
			}
		}, 2000)
	},
	Core.prototype.upLoad = function(file, onSuccess, onError) { //用于base64图片的上传
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: CONFIG.uploadUrl, //仅为示例，非真实的接口地址
				filePath: file,
				name: 'file',
				formData: {
					'user': 'test'
				},
				success: (res) => {
					if (typeof onSuccess == "function") {
						onSuccess(res.data)
					}
					resolve(res.data)
				},
				fail: (res) => {
					if (typeof onError == "function") {
						onError(res.data)
					}
					onError(res.data)
				}
			});
		})
	}





Core.prototype.post = function(url, data, onSuccess, onError,is_local_cache=false,is_mem_cache=false) {
	return new Promise((resolve, reject) => {
		
		
		var gena_key=function(a,b){
			let r="";
			let a_li=a.split("/");let a_key=a_li[0]+"_"+a_li[1];

			let b_key="";let havaB=false;

			Object.keys(b).sort().forEach(i=>{
				havaB=true;
				let b_ite=i+"_"+b[i]+"_";
				b_key=b_key+b_ite;
			});

			if(havaB){
				r= a_key+"__"+b_key;
			}else{
				r=a_key;
			}
			return r;
		}
		
		
		
		var isOk=function(o){
			if(typeof o=="undefined"){	return false;}
			if(null==o){	return false;}
			
			if(typeof o=="object"){				
				if(o.code==200){
					return true;
				}else{
					return false;
				}		
			}else {
				return false;
			}
		}
		
		let local_key=gena_key(url,data);
		let local_obj=data_local(local_key);
		
		
		if(is_local_cache){
					
			if(isOk(local_obj)){ console.log("get_data_from_data_local");
				if (typeof onSuccess == "function") {onSuccess(local_obj);		}
				resolve(local_obj);			
				//return;
			}
		}
		
		
		var conf = {};
		if (url.indexOf("http") == -1) {
			url = CONFIG.API + url;
		}
		conf.url = url
		if (data) {
			conf.data = data
		}
		conf.success = (res) => {
			if(is_local_cache){
				data_local(local_key, res.data);
				if(!!local_obj){
					return;
				}       	
			}	
			
			console.log("getdata_by_ajax")
			
			if (typeof onSuccess == "function") {
				onSuccess(res.data);
			}
			resolve(res.data);
		};
		conf.fail = (res) => {
			if (typeof onError == "function") {onError(res.data);}
			reject(res.data)
		};

		conf.header = {
			"Content-Type": "application/json",
			"clientplatform": "xapp"
		}

		let token = data_local("token");
		if (!!token) {
			conf.header["Authorization"] = token;
		}

		conf.method = "POST";
		return uni.request(conf)
	})

};

Core.prototype.get = function(url, data, onSuccess, onError, is_local_cache=false, is_mem_cache=false) {
	return new Promise((resolve, reject) => {
		
		var gena_key = function(a,b){
			let r = "";
			let a_li = a.split("/");
			let a_key = a_li[0]+"_"+a_li[1];

			let b_key = "";
			let havaB = false;

			Object.keys(b || {}).sort().forEach(i => {
				havaB = true;
				let b_ite = i+"_"+b[i]+"_";
				b_key = b_key+b_ite;
			});

			if(havaB){
				r = a_key+"__"+b_key;
			}else{
				r = a_key;
			}
			return r;
		}
		
		var isOk = function(o){
			if(typeof o == "undefined"){ return false; }
			if(null == o){ return false; }
			
			if(typeof o == "object"){				
				if(o.code == 200){
					return true;
				}else{
					return false;
				}		
			}else {
				return false;
			}
		}
		
		let local_key = gena_key(url, data);
		let local_obj = data_local(local_key);
		
		if(is_local_cache){
			if(isOk(local_obj)){ 
				console.log("get_data_from_data_local");
				if (typeof onSuccess == "function") { onSuccess(local_obj); }
				resolve(local_obj);
			}
		}
		
		var conf = {};
		if (url.indexOf("http") == -1) {
			url = CONFIG.API + url;
		}
		
		conf.url = url;
		if (data) {
			conf.data = data;
		}
		conf.success = (res) => {
			if(is_local_cache){
				data_local(local_key, res.data);
				if(!!local_obj){
					return;
				}       	
			}	
			
			console.log("getdata_by_ajax");
			
			if (typeof onSuccess == "function") {
				onSuccess(res.data);
			}
			resolve(res.data);
		};
		conf.fail = (res) => {
			if (typeof onError == "function") { onError(res.data); }
			reject(res.data);
		};

		conf.header = {
			"Content-Type": "application/json",
			"clientplatform": "xapp"
		}

		let token = data_local("token");
		console.log("token",token)

		if (!!token) {
			conf.header["Authorization"] = "Bearer " +token;
		}

		conf.method = "GET";
		return uni.request(conf);
	});
};

Core.prototype.put = function(url, data, onSuccess, onError) {
	return new Promise((resolve, reject) => {
		var conf = {};
		if (url.indexOf("http") == -1) {
			url = CONFIG.API + url;
		}
		conf.url = url;
		if (data) {
			conf.data = data;
		}
		conf.success = (res) => {
			console.log("put_data_by_ajax");
			
			if (typeof onSuccess == "function") {
				onSuccess(res.data);
			}
			resolve(res.data);
		};
		conf.fail = (res) => {
			if (typeof onError == "function") { onError(res.data); }
			reject(res.data);
		};

		conf.header = {
			"Content-Type": "application/json",
			"clientplatform": "xapp"
		}

		let token = data_local("token");
		if (!!token) {
			conf.header["Authorization"] = token;
		}

		conf.method = "PUT";
		return uni.request(conf);
	});
};

Core.prototype.delete = function(url, data, onSuccess, onError) {
	return new Promise((resolve, reject) => {
		var conf = {};
		if (url.indexOf("http") == -1) {
			url = CONFIG.API + url;
		}
		conf.url = url;
		if (data) {
			conf.data = data;
		}
		conf.success = (res) => {
			console.log("delete_data_by_ajax");
			
			if (typeof onSuccess == "function") {
				onSuccess(res.data);
			}
			resolve(res.data);
		};
		conf.fail = (res) => {
			if (typeof onError == "function") { onError(res.data); }
			reject(res.data);
		};

		conf.header = {
			"Content-Type": "application/json",
			"clientplatform": "xapp"
		}

		let token = data_local("token");
		if (!!token) {
			conf.header["Authorization"] = token;
		}

		conf.method = "DELETE";
		return uni.request(conf);
	});
};

// 导出方法
export function get(a,b,c,d,e,f) { return requestUtil.get(a,b,c,d,e,f); }
export function put(a,b,c,d) { return requestUtil.put(a,b,c,d); }
export function del(a,b,c,d) { return requestUtil.delete(a,b,c,d); }
export function post(a,b,c,d,e,f) {return requestUtil.post(a,b,c,d,e,f);}

var requestUtil = new Core();
export default requestUtil
