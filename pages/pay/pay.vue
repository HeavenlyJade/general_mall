<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{money}}</text>
		</view>

		<view class="pay-type-list">

			<view class="type-item b-b" @click="changePayType(1)">
				<text class="iconfont iconweixinzhifu3" style="color: green; font-size: 2rem;"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
				</label>
			</view>
			<!-- <view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit" >支付宝支付</text>
					<text>推荐使用支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view> -->
			
		</view>

		<text class="mix-btn" @click="confirm()">立即支付</text>
			
	</view>
</template>

<script>

	export default {
		data() {
			return {
				payType: 1,
				order_id: -1,
				money: 0,
				 providerList: []
			};
		},
		computed: {

		},
		onLoad(options) {
			this.loadData(options)
			//this.initapppay()
		},

		methods: {
		  initapppay(){
			uni.getProvider({
			    service: "payment",
			    success: (e) => {
			        //this.$toast("payment success:" + JSON.stringify(e));
			        let providerList = [];
			        e.provider.map((value) => {
			            switch (value) {
			                case 'alipay':
			                    providerList.push({
			                        name: '支付宝',
			                        id: value,
			                        loading: false
			                    });
			                    break;
			                case 'wxpay':
			                    providerList.push({
			                        name: '微信',
			                        id: value,
			                        loading: false
			                    });
			                    break;
			                default:
			                    break;
			            }
			        })
			        this.providerList = providerList;
			    },
			    fail: (e) => {
			        console.log("获取支付通道失败：", e);
			    }
			});
			},
			loadData(o) {
				this.money = o.money;
				this.order_id = o.order_id
			},
			
			changePayType(type) {
				this.payType = type;
			},
			

			confirm(){
				if(this.payType==1){
					this.confirmweixin()
				}else{
					this.confirmalipay()
				}
			},
			confirmalipay(){
				this.$post("aliapi/unifiedorder_app", {
					id: this.order_id
				}, (res) =>{
					if(res.status!=200){
						this.$msg(res.msg)
						return 
					}
					var orderInfo={
						"appid":res.data.appid,
						"noncestr":res.data.noncestr,
						"package":res.data.package,
						"partnerid":res.data.partnerid,
						"prepayid":res.data.prepayid,
						"timestamp":res.data.timestamp,
						"sign":res.data.sign
					}
					var reqdata={}
					reqdata.provider="alipay";
					reqdata.orderInfo = res.data;
					reqdata.success =  (res) =>{
							
							this.$msg("支付成功")
							uni.redirectTo({
								url: '/pages/order/order?state=2'
							})
						}
					reqdata.fail	=(err) =>{
						console.log(err)
							this.$msg("支付失败"+err.errMsg)
						}
					uni.requestPayment(reqdata);
					
				},res=>{
					console.log(reqdata)
					this.$msg(res.msg)
				})
			},
			//确认支付
			confirmweixin() {
				let that = this
				if(this.isApp()){
					this.$post("/wx_mini_app/shop_pay/wx_shop_pay", {
						order_id: this.order_id
					}, (res) =>{
						if(res.code!=200){
							this.$toast(res.msg)
							return 
						}
						var orderInfo={
							"timeStamp":res.data.time_stamp,
							"nonceStr":res.data.nonce_str,
							"package":res.data.package,
							"signType":res.data.sign_type,
							"paySign":res.data.pay_sign,
			
						}
						console.log("orderInfo",orderInfo)
						var reqdata={}
						reqdata.provider="wxpay";
						reqdata.orderInfo = orderInfo;
						
						reqdata.success =  (res) =>{
								this.$toast("支付成功")
								
								// 添加支付成功后的请求
								this.$post("/wx_mini_app/shop-order/payment/" + this.order_id, {}, (response) => {
									console.log("支付状态更新结果", response)
									// 支付状态更新成功后跳转
									this.$redirectTo('/pages/order/order?stat=待发货');
								}, (err) => {
									console.error("支付状态更新失败", err)
									// 即使状态更新失败，也跳转到订单页面
									this.$redirectTo('/pages/order/order?stat=待发货');
								});
							}
						reqdata.fail	=(err) =>{
							console.log(err)
							// 替换Toast为模态框
							uni.showModal({
								title: '支付失败',
								content: err,
								showCancel: true,
								cancelText: '取消',
								confirmText: '返回订单',
								success: function (res) {
									if (res.confirm) {
										// 用户点击确定，返回订单页面
										that.$redirectTo('/pages/order/order');
									}
								}
							});
						}
						
						
						uni.requestPayment(reqdata);
						
					},res=>{
						console.log(reqdata)
						this.$msg(res.msg)
					})
				}else{
					this.$post("/wx_mini_app/shop_pay/wx_shop_pay", {
						order_id: this.order_id
					}, (res) =>{
						console.log("wxunifiedorder_app",res)
						if(res.code!=200){
							this.$toast(res.error)
							return 
						}						
						var reqdata = {
							"timeStamp":res.data.time_stamp,
							"nonceStr":res.data.nonce_str,
							"package":res.data.package,
							"signType":res.data.sign_type,
							"paySign":res.data.pay_sign,
						};
						console.log("reqdata",reqdata)
						reqdata.success = (res) =>{
							console.log("支付成功的结果",res)
							this.$toast("支付成功")
							
							// 添加支付成功后的请求
							this.$post("/wx_mini_app/shop-order/payment/" + this.order_id, {}, (response) => {
								console.log("支付状态更新结果", response)
								// 支付状态更新成功后跳转
								this.$redirectTo('/pages/order/order?stat=待发货');
							}, (err) => {
								console.error("支付状态更新失败", err)
								// 即使状态更新失败，也跳转到订单页面
								this.$redirectTo('/pages/order/order?stat=待发货');
							});
						}
						
						reqdata.fail = (err) => {
							console.log(err)
							// 替换Toast为模态框
							uni.showModal({
								title: '支付失败',
								content: err.errMsg || '未知错误',
								showCancel: true,
								cancelText: '取消',
								confirmText: '返回订单',
								success: function (res) {
									if (res.confirm) {
										// 用户点击确定，返回订单页面
										that.$redirectTo('/pages/order/order');
									}
								}
							});
						}
						
						uni.requestPayment(reqdata);
						
					},res=>{
						console.log("res",res)
						this.$msg(res.msg)
					})
						
				}
				
				
					
			
			
			}
			
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: 32upx;
			color: #303133;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24upx;
			color: #f8f6fc;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: 32upx;
		color: #fff;
		background-color: #fa436a;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
