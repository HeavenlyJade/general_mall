<template>
	<view>
	<form>  
				<!-- 订单商品列表 -->
				<view class="product-list">
			<view class="list-title">请选择需要退货的商品：</view>
			<checkbox-group @change="checkboxChange">
				<view class="product-item" v-for="(item, index) in productList" :key="index">
					<view class="checkbox-wrapper">
						<checkbox :value="index.toString()" />
					</view>
					<image class="product-img" :src="item.product_img" mode="aspectFill"></image>
					<view class="product-info">
						<view class="product-name">{{item.product_name}}</view>
						<view class="product-spec" v-if="item.product_spec">{{item.product_spec}}</view>
						<view class="product-price">¥{{item.actual_price}} × {{item.num}}</view>
					</view>
				</view>
			</checkbox-group>
		</view>

			<swiper :current="subjectIndex" class="swiper-box" @change="SwiperChange" :style="{'height':swiperHeight}">
				<swiper-item v-for="(subject,index) in subjectList" :key="index">
					
					<view v-if="index-subjectIndex>=-1&&index-subjectIndex<=1">
										
					<view class="cu-bar bg-white solid-bottom">
						<view class="action text-black">
							<text class="cuIcon-title text-red"></text>{{subject.title}}
						</view>
					</view>
					<view>

						<radio-group class="block" @change="RadioboxChange" v-if="subject.type===1||subject.type===3">
							<view class="cu-form-group flex " style="margin-top: 1rem;" v-for="(option,index) in subject.optionList" :key="index">
								<radio :value="option.id"></radio>
								<view class="title text-black">{{option.id}}.{{option.content}}</view>
							</view>
						</radio-group>

						<view class="cu-form-group" v-if="showCustomReason">
							<view class="title">请输入原因：</view>
							<input v-model="customReason" placeholder="请输入退货原因" />
						</view>
					</view>
					</view>
				</swiper-item>
			</swiper>
		</form>
		
        <view class="commit_bt">
        	<button type="primary" @click="withdraw()">申请退货</button>
        </view>
	</view>
</template>

<script>


	export default {
		data() {
			return {
				userFavor:false,//是否已收藏
				currentType: 0, //当前题型
				subjectIndex: 0,//跳转索引
				autoShowAnswer: false,//答错是否显答案
				autoRadioNext:true,//判断题、单项题，自动移下一题
				swiperHeight: '800px',//
				title: '退货申请',
				subjectList:[
				    {"title":"请选择一个退货的理由？","type":3,"optionList":[
						{"id":"A","content":"尺寸不合适"},
						{"id":"B","content":"颜色不喜欢"},
						{"id":"C","content":"与商品描述不符合"},
						{"id":"D","content":"拍错了"}]},
					
				   ],			
				reason:"",
				order_no:"",
				wx:"",
				tel:"",
				order_data:{},
				productList: [],        // 订单商品列表
				selectedProducts: [],    // 已选择的商品
				showCustomReason: false,
				customReason: '',
			}
		},
		onReady() {

			var tempHeight = 800;
			var _me = this;
			uni.getSystemInfo({
				//获取手机屏幕高度信息，让swiper的高度和手机屏幕一样高                
				success: function(res) {                 
					tempHeight = res.windowHeight;

					uni.createSelectorQuery().select("#top-box").fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						let h=0;
						if(!!data&&!!data.height){h=data.height}
						tempHeight -=h;

						uni.createSelectorQuery().select("#foot-box").fields({
							size: true,
							scrollOffset: true
						}, (data) => {
							let h=0;
							if(!!data&&!!data.height){h=data.height}
							tempHeight -=h;
							_me.swiperHeight = tempHeight + 'px';
						}).exec();

					}).exec();
				}
			});

		},
		onLoad(option) {
			this.order_no = option.order_no;
			this.order_data = uni.getStorageSync('temp_order_data');
			uni.removeStorageSync('temp_order_data');
			console.log("this.order_data", this.order_data);
			// 初始化商品列表
			if (this.order_data && this.order_data.order_details) {
				this.productList = this.order_data.order_details;
			}
			
			uni.setNavigationBarTitle({
				title: this.title
			});			
			
			this.load_sale_after();
			
		},
		methods: {
			load_sale_after(){
				var _this=this;
				var args ={"page":1,"size":20,  "is_enabled": 1}
				this.$post("/wx_mini_app/shop-return-reason/",args,function(res){		
					console.log(res);
					var data =  res.data;
					_this.wx=data.wx;
					_this.tel=data.tel;
					
					if(data && data.length > 0) {
						var options = [];
						data.forEach(item => {
							options.push({"id": item.id.toString(), "content": item.reason_type});
						});
						_this.subjectList[0].optionList = options;
					}
				})
				
			},
			withdraw(){
				if (this.selectedProducts.length === 0) {
					uni.showToast({ title: '请选择商品', icon: 'none' });
					return;
				}
				
				// 如果是自定义原因，则使用用户输入的内容
				if (this.showCustomReason) {
					if (!this.customReason.trim()) {
						uni.showToast({ title: '请输入退货原因', icon: 'none' });
						return;
					}
					this.reason = this.customReason;
				} else if (!this.reason) {
					uni.showToast({ title: '请选择退货理由', icon: 'none' });
					return;
				}
				
				// 收集已选商品的关键信息
				var selectedItems = [];
				for(let i = 0; i < this.selectedProducts.length; i++) {
					let item = this.selectedProducts[i];
					selectedItems.push({
						id: item.id,
						order_no: item.order_no,
						order_item_id: item.order_item_id
					});
				}
				
				
				var o = {};
				o.order_no = this.order_no;
				
				var refundp_detail = {};
				o.return_detail =selectedItems;
				o.reason = this.reason;

				console.log("退货商品信息:", o);

				this.$post("/wx_mini_app/shop-order/shop-order-return", o, function(res) {
					if (res.code==200) {
						uni.showToast({ title: '申请成功' });
						uni.redirectTo({
							"url":"/pages/order/order-refund?state='退款中,已退款'"
						})
					}else{
						uni.showToast({ title: '申请失败' });
					}
				})
			},
			SwiperChange: function(e) { //滑动事件
			
				let index = e.target.current;
				if (index != undefined) {
					this.subjectIndex = index;
					this.currentType = this.subjectList[index].type;
					this.userFavor = this.subjectList[index].userFavor;
				}
								
			},
			checkboxChange(e) {
				// 获取选中的商品
				this.selectedProducts = [];
				const values = e.detail.value;
				for (let i = 0; i < values.length; i++) {
					const index = parseInt(values[i]);
					if (index >= 0 && index < this.productList.length) {
						this.selectedProducts.push(this.productList[index]);
					}
				}
			},
			RadioboxChange: function(e) {
				var items = this.subjectList[this.subjectIndex].optionList;
				var values = e.detail.value;
				
				for(let i in items){
					var item = items[i];
					if(item.id === values){
						// 判断是否是"其他原因"
						if(item.content === "其它原因"){
							this.showCustomReason = true;
							// 先设置为空，等用户输入后再更新
							this.reason = "";
						} else {
							this.showCustomReason = false;
							this.reason = item.content;
						}
					}
				}
			},
			
		}
	}
</script>

<style>
	/*
	  Animation 微动画  
	  基于ColorUI组建库的动画模块 by 文晓港 2019年3月26日19:52:28
	 */
	
	/* css 滤镜 控制黑白底色gif的 */
	.gif-black{  
	  mix-blend-mode: screen;  
	}
	.gif-white{  
	  mix-blend-mode: multiply; 
	}
	
	
	/* Animation css */
	[class*=animation-] {
	    animation-duration: .5s;
	    animation-timing-function: ease-out;
	    animation-fill-mode: both
	}
	
	.animation-fade {
	    animation-name: fade;
	    animation-duration: .8s;
	    animation-timing-function: linear
	}
	
	.animation-scale-up {
	    animation-name: scale-up
	}
	
	.animation-scale-down {
	    animation-name: scale-down
	}
	
	.animation-slide-top {
	    animation-name: slide-top
	}
	
	.animation-slide-bottom {
	    animation-name: slide-bottom
	}
	
	.animation-slide-left {
	    animation-name: slide-left
	}
	
	.animation-slide-right {
	    animation-name: slide-right
	}
	
	.animation-shake {
	    animation-name: shake
	}
	
	.animation-reverse {
	    animation-direction: reverse
	}
	.product-list {
		padding: 10rpx 30rpx;
		margin-bottom: 120rpx;
	}
	
	.list-title {
		font-size: 32rpx;
		font-weight: bold;
		padding: 20rpx 0;
		border-bottom: 1px solid #eee;
	}
	
	.product-item {
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1px solid #f5f5f5;
	}
	
	.checkbox-wrapper {
		display: flex;
		align-items: center;
		margin-right: 20rpx;
	}
	
	.product-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}
	
	.product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.product-name {
		font-size: 28rpx;
		line-height: 1.4;
	}
	
	.product-spec {
		font-size: 24rpx;
		color: #999;
		margin: 10rpx 0;
	}
	
	.product-price {
		font-size: 28rpx;
		color: #fa436a;
	}
	
	@keyframes fade {
	    0% {
	        opacity: 0
	    }
	
	    100% {
	        opacity: 1
	    }
	}
	
	@keyframes scale-up {
	    0% {
	        opacity: 0;
	        transform: scale(.2)
	    }
	
	    100% {
	        opacity: 1;
	        transform: scale(1)
	    }
	}
	
	@keyframes scale-down {
	    0% {
	        opacity: 0;
	        transform: scale(1.8)
	    }
	
	    100% {
	        opacity: 1;
	        transform: scale(1)
	    }
	}
	
	@keyframes slide-top {
	    0% {
	        opacity: 0;
	        transform: translateY(-100%)
	    }
	
	    100% {
	        opacity: 1;
	        transform: translateY(0)
	    }
	}
	
	@keyframes slide-bottom {
	    0% {
	        opacity: 0;
	        transform: translateY(100%)
	    }
	
	    100% {
	        opacity: 1;
	        transform: translateY(0)
	    }
	}
	
	@keyframes shake {
	
	    0%,
	    100% {
	        transform: translateX(0)
	    }
	
	    10% {
	        transform: translateX(-9px)
	    }
	
	    20% {
	        transform: translateX(8px)
	    }
	
	    30% {
	        transform: translateX(-7px)
	    }
	
	    40% {
	        transform: translateX(6px)
	    }
	
	    50% {
	        transform: translateX(-5px)
	    }
	
	    60% {
	        transform: translateX(4px)
	    }
	
	    70% {
	        transform: translateX(-3px)
	    }
	
	    80% {
	        transform: translateX(2px)
	    }
	
	    90% {
	        transform: translateX(-1px)
	    }
	}
	
	@keyframes slide-left {
	    0% {
	        opacity: 0;
	        transform: translateX(-100%)
	    }
	
	    100% {
	        opacity: 1;
	        transform: translateX(0)
	    }
	}
	
	@keyframes slide-right {
	    0% {
	        opacity: 0;
	        transform: translateX(100%)
	    }
	
	    100% {
	        opacity: 1;
	        transform: translateX(0)
	    }
	}
	
	
	
	
	
	.notice{
		position:absolute;
			   left: 0%;
				bottom: 10%;
				width: 100%;
		display: inline-block;
	}
	
	.commit_bt{
		position:absolute;
			   left: 0%;
				bottom: 0%;
				width: 100%
	}
	page {
		background-color: #FFFFFF;
	}

	.cu-form-group {
		justify-content: flex-start
	}

	.cu-form-group .title {
		padding-left: 30upx;
		padding-right: 0upx;
	}

	.cu-form-group+.cu-form-group {
		border-top: none;
	}

	.cu-bar-title {
		min-height: 50upx;
	}
	
	.cu-list.menu>.cu-item-error{justify-content: flex-start;}
</style>
