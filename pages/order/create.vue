<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{ addressData.name }}</text>
						<text class="mobile">{{ addressData.mobile }}</text>
					</view>
					<text class="address">{{ addressData.pickerText }}{{ addressData.addressName }}
						{{ addressData.area }}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<image v-if="bgImagePath" class="a-bg" :src="bgImagePath"></image>
		</navigator>

		<view class="goods-section">
			<!-- 商品列表 -->
			<view class="g-item" v-for="(item, index) in goods_list" :key="index">
				<image :src="item.goods.image"></image>
				<view class="right">
					<text class="title clamp">{{ item.goods.name }}</text>
					<view class="price-box">
						<text class="price">￥{{ item.goods.price }}</text>
						<text class="number">x {{ item.number }}</text>
					</view>

					<view class="length">
						<view class="text">数量</view>
						<view class="number">
							<view class="sub" @tap.stop="sub(item)">
								<view class="icon jian">-</view>
							</view>
							<view class="input" @tap.stop="discard">
								<input type="number" disabled="true" v-model="item.number" />
							</view>
							<view class="add" @tap.stop="add(item)">
								<view class="icon jia">+</view>
							</view>
						</view>
					</view>


				</view>
			</view>
		</view>

		<!-- 优惠明细 -->
		<!-- <view class="yt-list">
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					选择优惠券
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
			<view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					减
				</view>
				<text class="cell-tit clamp">商家促销</text>
				<text class="cell-tip disabled">暂无可用优惠</text>
			</view>
		</view> -->
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品原价</text>
				<text class="cell-tip">￥{{ goodsTotal }}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">会员折扣</text>
				<text class="cell-tip">{{ memberDiscountText }}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">折扣后金额</text>
				<text class="cell-tip">￥{{ goodsTotalDiscount }}</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-￥{{cur_coupon.price}}</text>
			</view> -->
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">￥{{ postage }}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">积分抵扣</text>
				<view style="display:flex;align-items:center;">
					<switch :checked="usePoints" @change="onUsePointsChange"/>
					<input
						v-if="usePoints"
						type="number"
						v-model.number="pointsToUse"
						:max="maxPoints"
						:min="0"
						style="width:80rpx;margin-left:10rpx;"
						@input="onPointsInput"
					/>
					<text v-if="usePoints" style="margin-left:10rpx;">/ 可用{{maxPoints}}积分</text>
				</view>
				<text class="cell-tip" v-if="usePoints && pointsToUse > 0">-￥{{ pointsDeductAmount }}</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{ finalAmount }}</text>
			</view>
			<text class="submit" @click="submit()" :disabled="!canSubmitOrder">提交订单</text>
		</view>

	</view>
</template>

<script>
import CONFIG from '@/static/js/data/constant.js';



export default {
	data() {
		return {
			maskState: 0, //优惠券面板显示状态
			desc: '', //备注
			payType: 1, //1微信 2支付宝
		
			cur_coupon: {
				title: '',
				price: 0,
			},
			addressData: { "name": "点击添加收货地址", "pickerText": '', "addressName": "", "area": "" },
			addressList: [],
			postage: 0,

			goods: {},
			sku: {},

			goods_list: [],

			userInfo: {
				"id": -1
			},
			submit_lock: 0,
			goodsTotal: 0,
			goodsTotalDiscount: 0, // 新增：折扣后金额
			memberDiscountRate: 100, // 新增：会员折扣率
			memberDiscountText: '无折扣', // 新增：折扣显示文本
			finalAmount: 0, // 新增：最终应付金额
			secretKey: CONFIG.data_secret_key, // 直接从CONFIG中获取
			usePoints: false, // 是否使用积分抵扣
			pointsToUse: 0,   // 用户选择抵扣的积分数量
			maxPoints: 0,     // 当前用户可用最大积分
			pointsDeductAmount: 0, // 积分抵扣金额
			canSubmitOrder: true, // 新增：是否允许提交订单


		}
	},
	onLoad(option) {

	},
	onShow() {
		this.loadAddress();
		this.loadData()
	},
	watch: {
		goods_list: {
			handler(newValue, oldValue) {
				this.calcGoodsAmount();
			},
			deep: true
		}

	},
	methods: {
		round2pos(e) {
			return this.$round2pos(e);
		},
		locateAddress(_id) {
			var li = this.addressList;
			// 首先找出默认地址
			let foundDefault = false;
			for (var i in li) {
				var ite = li[i];
				// 使用is_default字段判断是否默认

				if (ite.is_default == 1) {
					// 数据格式转换
					this.addressData = {
						name: ite.receiver_name,
						mobile: ite.receiver_phone,
						pickerText: `${ite.province}-${ite.city}-${ite.district}`,
						addressName: ite.detail_address,
						area: ''
					};
					foundDefault = true;
					break;
				}
			}
			// 如果没有默认地址，使用第一个地址
			if (!foundDefault && li.length > 0) {
				const ite = li[0];
				this.addressData = {
					name: ite.receiver_name,
					mobile: ite.receiver_phone,
					pickerText: `${ite.province}-${ite.city}-${ite.district}`,
					addressName: ite.detail_address,
					area: ''
				};
			}


		},


		loadAddress() {
			const user = this.getUser() || {};
			if (!user.id) {
				uni.hideLoading();
				this.$toast('请先登录');
				return;
			}
			let _this = this
			// 调用地址列表接口
			this.$get(`/wx_mini_app/wx_auth/address/${user.id}`, {}, res => {
				uni.hideLoading();
				if (res && res.items) {
					_this.addressList = res.items;
					this.locateAddress();
				} else {
					_this.addressList = [];
				}
			}, err => {
				uni.hideLoading();
				_this.$toast('获取地址列表失败');
				_this.addressList = [];
			});

		},

		loadData() {
			this.goods_list = this.$dataLocal("buy_list");
			this.calcGoodsAmount();
			this.userInfo = this.getUser();
			console.log("this.userInfo ",this.userInfo )
			// 最大可用积分为用户积分和（商品实付款-1）的较小值
			let userPoints = this.userInfo.points || 0;
			let maxDeduct = Math.max(this.goodsTotalDiscount + (this.postage || 0) - 1, 0);
			this.maxPoints = Math.min(userPoints, maxDeduct);
		},
		getMemberDiscount() {
			const levelList = this.$getLocalMemberLevelConfig() || [];
			const userLevel = this.userInfo.member_level;
			const levelObj = levelList.find(item => item.level_code === userLevel || item.level_name === userLevel);
			return levelObj ? (levelObj.discount_rate || 100) : 100;
		},
		getMemberDiscountText(rate) {
			if (rate >= 100) return '无折扣';
			// 80 => 8折，85 => 8.5折
			return (rate % 10 === 0 ? (rate / 10) : (rate / 10).toFixed(1)) + '折';
		},
		calcGoodsAmount() {
			var li = this.goods_list;
			var sum = 0;
			for (var i in li) {
				var ite = li[i];
				var price = ite.goods.price;
				var sub_sum = parseFloat(price) * parseFloat(ite.number);
				sum = sum + sub_sum
			}
			this.goodsTotal = this.$round2pos(sum);

			// 计算会员折扣
			const discountRate = this.getMemberDiscount();
			this.memberDiscountRate = discountRate;
			this.goodsTotalDiscount = this.$round2pos(sum * (discountRate / 100));
			this.memberDiscountText = this.getMemberDiscountText(discountRate);

			// 最大可用积分为用户积分和（商品实付款-1）的较小值
			let userPoints = this.userInfo.points || 0;
			let maxDeduct = Math.max(this.goodsTotalDiscount + (this.postage || 0) - 1, 0);
			this.maxPoints = Math.min(userPoints, maxDeduct);

			// 计算最终应付金额（折扣后金额 + 运费 - 积分抵扣）
			let postage = this.postage || 0;
			let pointsDeduct = this.usePoints ? (this.pointsToUse || 0) : 0;
			if (pointsDeduct > this.maxPoints) pointsDeduct = this.maxPoints;
			if (pointsDeduct > userPoints) pointsDeduct = userPoints;
			this.pointsDeductAmount = pointsDeduct;
			this.finalAmount = this.$round2pos(this.goodsTotalDiscount + postage - pointsDeduct);
			if (this.finalAmount < 1) this.finalAmount = 1;

			// 校验积分合法性，决定是否允许提交
			this.canSubmitOrder = true;
			if (this.usePoints) {
				if (this.pointsToUse > this.maxPoints || this.pointsToUse > (this.userInfo.points || 0)) {
					this.canSubmitOrder = false;
				}
			}
		},

		discard() {
			//丢弃
			//this.fullReduce();
		},
		//减少数量
		sub(item) {
			//console.log(item);			
			if (item.number <= 1) {
				return;
			}
			/* if(item.number<=2&&this.goods.type==1){
				return;
			} */
			let p = 1;
			if (item.goods.type == 1) {
				p = 1;
			}

			item.number = item.number - p;

		},
		//增加数量
		add(item) {
			let p = 1;
			if (item.goods.type == 1) {
				p = 1;
			}

			item.number = parseFloat(item.number) + parseFloat(p);

		},
		choseCoupon(item) {
			this.cur_coupon = item;
			this.toggleMask();
		},
		//显示优惠券面板
		toggleMask(type) {
			let timer = type === 'show' ? 10 : 300;
			let state = type === 'show' ? 1 : 0;
			this.maskState = 2;
			setTimeout(() => {
				this.maskState = state;
			}, timer)
		},
		numberChange(data) {
			this.number = data.number;
		},
		changePayType(type) {
			this.payType = type;
		},
		submit() {
			// 获取分销用户信息
			const distributionUser = this.$dataLocal ? this.$dataLocal('distributionUser') : null;
			if (!distributionUser || !distributionUser.user_father_invite_code) {
				this.$toast('非邀请用户不能下单,请前往我的页面-->邀请码 填写注册邀请码');
				return;
			}

			this._submit();
			/* let dp=this.$getDateParam();
			
			this.isbreaklimitf(this.userInfo.id,dp.monthbegin,dp.monthend,1,2); */
		},


		_submit() {
			if (this.addressData.name == "点击添加收货地址") {
				this.$toast("请填写地址");
				return;
			}
			if (!this.addressData.pickerText) {
				this.$toast("请选择邮寄区域");
				return;
			}
			var orderInfo = {};
			orderInfo.benefit = this.cur_coupon.price;
			orderInfo.postage = this.postage;
			var goodsDetail = [];

			for (var i in this.goods_list) {
				var param = {};
				var ite = this.goods_list[i];
				console.log(ite);
				param.product_id = ite.goods.product_id || ite.goods.id
				param.number = ite.number
				param.name = ite.goods.name
				param.price = ite.goods.price
				param.cart_id = ite.goods.cart_id
				goodsDetail.push(param)
			}

			orderInfo.address = JSON.stringify(this.addressData);
			orderInfo.goodsDetail = JSON.stringify(goodsDetail);
			orderInfo.memo = this.desc

			// 新增：传递折扣前金额、会员折扣、会员等级
			orderInfo.original_amount = this.goodsTotal;
			orderInfo.member_discount = this.goodsTotalDiscount; 
			orderInfo.member_level = this.userInfo.member_level;
			orderInfo.final_amount = this.finalAmount;

			let single_user_info = {};
			if (this.$isNull(this.userInfo.id)) {
				this.$toast("请先登陆");
				return;
			}
			const timestamp = new Date().getTime();
			single_user_info.id = this.userInfo.id;
			if (!!this.userInfo.headimage) single_user_info.headimage = this.userInfo.headimage;
			if (!!this.userInfo.mobile) single_user_info.mobile = this.userInfo.mobile;
			if (!!this.userInfo.nickname) single_user_info.nickname = this.userInfo.nickname;
			orderInfo.userDetail = JSON.stringify(single_user_info);
			orderInfo.userId = this.userInfo.id;
			orderInfo.timestamp = timestamp;
			if (1 == this.submit_lock) {
				return;
			}
			this.submit_lock = 1;
			let _this = this;
			// 创建一个简单的签名字符串
			const signStr = this.$hexHash({secretKey: this.secretKey, timestamp: orderInfo.timestamp});
			orderInfo.signStr = signStr;
			
			orderInfo.points_used = this.usePoints ? this.pointsToUse : 0;
			orderInfo.points_deduct_amount = this.pointsDeductAmount;
			
			if (this.usePoints && (this.pointsToUse > this.maxPoints || this.pointsToUse > (this.userInfo.points || 0))) {
				this.$toast('积分超出可用范围，无法提交订单');
				return;
			}
			
			this.$post("/wx_mini_app/shop-order", orderInfo, function (res) {
				// 成功回调
				if (res && res.code==200 ) {
					let order_id = res.data.id;
					let money = _this.finalAmount;
					// 新增：下单成功后更新本地用户积分
					if (_this.usePoints && _this.pointsToUse > 0) {
						let userInfo = _this.getUser();
						userInfo.points = Math.max((userInfo.points || 0) - _this.pointsToUse, 0);
						_this.setUser(userInfo);
						_this.userInfo = userInfo;
					}
					if (_this.isH5()) {
						_this.$naviExter('./external/wxpay.html?order_id=' + order_id + '&money=' + money)
					} else {
						_this.$redirectTo('/pages/pay/pay?order_id=' + order_id + '&money=' + money);
					}
				
				} 
				else if(res && res.code==400 )  {
					_this.$toast(res.message);
					_this.submit_lock = 0; // 允许用户重新提交
				}
				else {
					_this.submit_lock = 0; // 重置锁
					_this.$toast('订单提交失败，请重试');
				}
			}, function(err) {
				// 添加错误回调
				console.error('订单提交失败', err);
				_this.submit_lock = 0; // 重置锁
				_this.$toast('订单提交失败，请重试');
			});
		},
		stopPrevent() { },
		onUsePointsChange(e) {
			this.usePoints = e.detail ? e.detail.value : e;
			if (!this.usePoints) {
				this.pointsToUse = 0;
				this.pointsDeductAmount = 0;
			} else {
				// 默认全用
				this.pointsToUse = this.maxPoints;
				this.pointsDeductAmount = this.pointsToUse;
			}
			this.calcGoodsAmount();
		},
		onPointsInput(e) {
			let val = Number(e.detail ? e.detail.value : e.target.value || 0);
			let userPoints = this.userInfo.points || 0;
			if (val > this.maxPoints) {
				this.$toast('不能超过最大可用积分');
				val = this.maxPoints;
			}
			if (val > userPoints) {
				this.$toast('不能超过您拥有的积分');
				val = userPoints;
			}
			if (val < 0) val = 0;
			this.pointsToUse = val;
			this.pointsDeductAmount = val;
			this.calcGoodsAmount();
		}
	}
}
</script>

<style lang="scss">
page {
	background: #f8f8f8;
	padding-bottom: 100upx;
}

.length {
	margin-top: 30upx;
	// border-top: solid 1upx #aaa;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20upx;

	.text {
		font-size: 30upx;
	}

	.number {
		display: flex;
		justify-content: center;
		align-items: center;

		.input {
			width: 80upx;
			height: 60upx;
			margin: 0 10upx;
			background-color: #f3f3f3;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;

			input {
				width: 80upx;
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				font-size: 26upx;
			}
		}

		.sub,
		.add {
			width: 60upx;
			height: 60upx;
			background-color: #f3f3f3;
			border-radius: 5upx;

			.icon {
				font-size: 30upx;
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				/* &.jia {
						&:before {
							content: "\e641";
						}
					}
									 
					&.jian {
						&:before {
							content: "\e643";
						}
					} */
			}

		}
	}
}



.address-section {
	padding: 30upx 0;
	background: #fff;
	position: relative;

	.order-content {
		display: flex;
		align-items: center;
	}

	.icon-shouhuodizhi {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90upx;
		color: #888;
		font-size: 44upx;
	}

	.cen {
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: 28upx;
		color: #303133;
	}

	.name {
		font-size: 34upx;
		margin-right: 24upx;
	}

	.address {
		margin-top: 16upx;
		margin-right: 20upx;
		color: #909399;
	}

	.icon-you {
		font-size: 32upx;
		color: #909399;
		margin-right: 30upx;
	}

	.a-bg {
		position: absolute;
		left: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 5upx;
	}
}

.goods-section {
	margin-top: 16upx;
	background: #fff;
	padding-bottom: 1px;

	.g-header {
		display: flex;
		align-items: center;
		height: 84upx;
		padding: 0 30upx;
		position: relative;
	}

	.logo {
		display: block;
		width: 50upx;
		height: 50upx;
		border-radius: 100px;
	}

	.name {
		font-size: 30upx;
		color: #606266;
		margin-left: 24upx;
	}

	.g-item {
		display: flex;
		margin: 20upx 30upx;

		image {
			flex-shrink: 0;
			display: block;
			width: 140upx;
			height: 140upx;
			border-radius: 4upx;
		}

		.right {
			flex: 1;
			padding-left: 24upx;
			overflow: hidden;
		}

		.title {
			font-size: 30upx;
			color: #303133;
		}

		.spec {
			font-size: 26upx;
			color: #909399;
		}

		.price-box {
			display: flex;
			align-items: center;
			font-size: 32upx;
			color: #303133;
			padding-top: 10upx;

			.price {
				margin-bottom: 4upx;
			}

			.number {
				font-size: 26upx;
				color: #606266;
				margin-left: 20upx;
			}
		}

		.step-box {
			position: relative;
		}
	}
}

.yt-list {
	margin-top: 16upx;
	background: #fff;
}

.yt-list-cell {
	display: flex;
	align-items: center;
	padding: 10upx 30upx 10upx 40upx;
	line-height: 70upx;
	position: relative;

	&.cell-hover {
		background: #fafafa;
	}

	&.b-b:after {
		left: 30upx;
	}

	.cell-icon {
		height: 32upx;
		width: 32upx;
		font-size: 22upx;
		color: #fff;
		text-align: center;
		line-height: 32upx;
		background: #f85e52;
		border-radius: 4upx;
		margin-right: 12upx;

		&.hb {
			background: #ffaa0e;
		}

		&.lpk {
			background: #3ab54a;
		}

	}

	.cell-more {
		align-self: center;
		font-size: 24upx;
		color: #909399;
		margin-left: 8upx;
		margin-right: -10upx;
	}

	.cell-tit {
		flex: 1;
		font-size: 26upx;
		color: #909399;
		margin-right: 10upx;
	}

	.cell-tip {
		font-size: 26upx;
		color: #303133;

		&.disabled {
			color: #909399;
		}

		&.active {
			color: #fa436a;
		}

		&.red {
			color: #fa436a;
		}
	}

	&.desc-cell {
		.cell-tit {
			max-width: 90upx;
		}
	}

	.desc {
		flex: 1;
		font-size: 28upx;
		color: #303133;
	}
}

/* 支付列表 */
.pay-list {
	padding-left: 40upx;
	margin-top: 16upx;
	background: #fff;

	.pay-item {
		display: flex;
		align-items: center;
		padding-right: 20upx;
		line-height: 1;
		height: 110upx;
		position: relative;
	}

	.icon-weixinzhifu {
		width: 80upx;
		font-size: 40upx;
		color: #6BCC03;
	}

	.icon-alipay {
		width: 80upx;
		font-size: 40upx;
		color: #06B4FD;
	}

	.icon-xuanzhong2 {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60upx;
		height: 60upx;
		font-size: 40upx;
		color: #fa436a;
	}

	.tit {
		font-size: 32upx;
		color: #303133;
		flex: 1;
	}
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 995;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	z-index: 998;
	color: #606266;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

	.price-content {
		padding-left: 30upx;
	}

	.price-tip {
		color: #fa436a;
		margin-left: 8upx;
	}

	.price {
		font-size: 36upx;
		color: #fa436a;
	}

	.submit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 280upx;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: #fa436a;
	}
}

/* 优惠券面板 */
.mask {
	display: flex;
	align-items: flex-end;
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0);
	z-index: 9995;
	transition: .3s;

	.mask-content {
		width: 100%;
		min-height: 30vh;
		max-height: 70vh;
		background: #f3f3f3;
		transform: translateY(100%);
		transition: .3s;
		overflow-y: scroll;
	}

	&.none {
		display: none;
	}

	&.show {
		background: rgba(0, 0, 0, .4);

		.mask-content {
			transform: translateY(0);
		}
	}
}

/* 优惠券列表 */
.coupon-item {
	display: flex;
	flex-direction: column;
	margin: 20upx 24upx;
	background: #fff;

	.con {
		display: flex;
		align-items: center;
		position: relative;
		height: 120upx;
		padding: 0 30upx;

		&:after {
			position: absolute;
			left: 0;
			bottom: 0;
			content: '';
			width: 100%;
			height: 0;
			border-bottom: 1px dashed #f3f3f3;
			transform: scaleY(50%);
		}
	}

	.left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		overflow: hidden;
		height: 100upx;
	}

	.title {
		font-size: 32upx;
		color: #303133;
		margin-bottom: 10upx;
	}

	.time {
		font-size: 24upx;
		color: #909399;
	}

	.right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: #606266;
		height: 100upx;
	}

	.price {
		font-size: 44upx;
		color: #fa436a;

		&:before {
			content: '￥';
			font-size: 34upx;
		}
	}

	.tips {
		font-size: 24upx;
		color: #909399;
		line-height: 60upx;
		padding-left: 30upx;
	}

	.circle {
		position: absolute;
		left: -6upx;
		bottom: -10upx;
		z-index: 10;
		width: 20upx;
		height: 20upx;
		background: #f3f3f3;
		border-radius: 100px;

		&.r {
			left: auto;
			right: -6upx;
		}
	}
}
</style>
