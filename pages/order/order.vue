<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item"
				:class="{ current: tabCurrentIndex === item.state }" @click="tabClick(item.state)">
				{{ item.text }}
			</view>
		</view>
		<!-- 订单列表 -->
		<view v-for="(item, index) in orderList" :key="index" class="order-item">
			<view class="i-top b-b">
				<text class="time">{{ $getDateStr(item.order_info.create_time) }}</text>
				<text class="state" style="color:#aaaaff">{{ item.order_info.status }}</text>
				<text v-if="item.order_info.status === '待付款'" class="del-btn iconfont iconicon_delete_fill" 
					style="color: #aaaaff;" @click="cancelOrder(item)"></text>
			</view>

			<!-- 多个商品时的展示 -->
			<scroll-view v-if="item.order_details.length > 1" class="goods-box" scroll-x>
				<view v-for="(goodsItem, goodsIndex) in item.order_details" :key="goodsIndex" class="goods-item">
					<image class="goods-img" :src="goodsItem.product_img" mode="aspectFill"></image>
				</view>
			</scroll-view>

			<!-- 单个商品时的展示 -->
			<view v-if="item.order_details.length == 1" class="goods-box-single" 
				v-for="(goodsItem, idx) in item.order_details" :key="idx" 
				@click="$navigateTo('goods/detail?id=' + goodsItem.product_id)">
				<image class="goods-img" :src="goodsItem.product_img" mode="aspectFill"></image>
				<view class="right">
					<text class="title clamp">{{ goodsItem.product_name }}</text>
					<text class="attr-box">{{ goodsItem.product_spec }}</text>
					<text class="price">{{ goodsItem.actual_price }}</text>
				</view>
			</view>

			<view class="price-box">
				共
				<text class="num">{{ item.order_info.product_count }}</text>
				件商品 实付款
				<text class="price">{{ item.order_info.actual_amount }}</text>
			</view>

			<!-- 根据订单状态显示不同的按钮 -->
			<view class="action-box b-t" v-if="item.order_info.status === '待付款'">
				<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
				<button class="action-btn recom" @click="topay(item)">立即支付</button>
			</view>

			<view class="action-box b-t" v-if="item.order_info.status === '待发货'">
				<button class="action-btn" @click="tuikuan(item)">退款</button>
				<button class="action-btn" @click="$toast('已经向商家推送消息啦')">催发货</button>
			</view>

			<view class="action-box b-t" v-if="item.order_info.delivery_status === '待收货'">
				<button class="action-btn" @click="showLogistics(item)">查看物流</button>
				<button class="action-btn" @click="comfirm(item)">确认收货</button>
			</view>

			<view class="action-box b-t" v-if="item.order_info.status === '已完成'">
				<button class="action-btn" @click="to_comment(item)">评价</button>
				<button class="action-btn" @click="to_return(item)">申请售后</button>
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content"> <!-- v-for="(tabItem,tabIndex) in navList" :key="tabIndex" -->
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="orderList.length == 0"></empty>
					<uni-load-more :status="'nomore'"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from "@/components/empty/empty";


export default {
	components: {
		uniLoadMore,
		empty
	},
	data() {
		let _conf = this.getConst();
		let _user = this.getUser();

		return {
			conf: _conf,
			tabCurrentIndex: 0,
			navList: [
				{
					state: "",
					text: '全部',
				},
				{
					state: '待付款',
					text: '待付款',
				},
				{
					state: '待发货',
					text: '待发货',
				},
				{
					state: '待收货',
					text: '待收货',
				},
				{
					state: '已完成',
					text: '已完成',
				}
			],
			userInfo: _user,

			cond: {
				page: 1,
				pageSize: 10,
				status: "" // 订单状态
			},
			orderList: [],
		};
	},

	onLoad(options) {
		// 处理从user页面传递过来的status参数
		if (options.status) {
			// 根据status找到对应的索引
			const index = this.navList.findIndex(item => item.state === options.status);
			if (index !== -1) {
				this.tabClick(index);
				return;
			}
		}
		
		// 处理原有的stat参数逻辑
		let _stat = parseInt(options.stat);
		if (this.$isNull(_stat)) {
			_stat = 0;
		}
		this.tabClick(_stat);
	},

	watch: {

	},
	onReachBottom() {
		this.load_list();
	},
	onPullDownRefresh() {

	},
	methods: {
		cancelOrder(e) {
			this.$comfirm("订单还没有支付,确定要删除吗?", cf => {
				this.$put(`/mini_core/shop-order/${e.id}/cancel`, {}, res => {
					this.$toast("取消成功");
					this.reload_list();
				});
			});
		},
		comfirm(e) {
			this.$put(`/mini_core/shop-order/${e.id}/confirm`, {}, res => {
				this.$toast("确认收货成功");
				this.reload_list();
			});
		},
		topay(item) {
			let order_id = item.order_info.id;
			let money = item.order_info.actual_amount;
			if (this.isWeixin()) {
				this.$post("order/hpj_unifield", { "order_id": order_id }, (res2) => {
					if (res2.status != 200) {
						alert(res2.msg)
						return;
					}
					var obj = JSON.parse(res2.data);
					var url = obj.url;
					this.$jumpExter(url);
				})
			} else {
				this.$redirectTo('/pages/pay/pay?order_id=' + order_id + '&money=' + money);
			}
		},

		to_comment(e) {
			this.$navigateTo("/pages/order/comment?id=" + e.id);
		},

		showLogistics(item) {
			if (item.order_info.delivery_platform === "自提") {
				this.$toast("该订单的商品已经自提");
				return;
			}
			let uri = "/pages/order/logister?order=" + item.order_info.express_no + 
				"&type=" + item.order_info.delivery_platform;
			this.$navigateTo(uri);
		},

		tuikuan(item) {
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '亲，确定要发起退款嘛',
				success: function (res) {
					if (res.confirm) {
						var o = {};
						o.id = item.id;
						o.refundStat = 1;  //申请中
						o.stat = 5;
						_this.$post("order/update", o, function (res) {
							uni.showToast({ title: '申请成功' });
							setTimeout(function () {
								uni.navigateTo({
									"url": "/pages/order/order-refund?state=5"
								})
							}, 1000)
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});

		},

		to_return(e) {

			this.$navigateTo("/pages/order/return?order_id=" + e.id);

		},

		getAmount(e) {
			return e.order_info.actual_amount;
		},
		getCount(e) {
			return e.order_info.product_count;
		},

		getBillStat(stat) {
			switch (stat) {
				case '待支付':
					return '待付款';
				case '待发货':
					return '待发货';
				case '待收货':
					return '待收货';
				case '已完成':
					return '已完成';
				case '已取消':
					return '已取消';
				default:
					return stat || '无状态';
			}
		},
		set_stat() {
			// 如果是数字索引，转换为对应的状态值
			if (typeof this.tabCurrentIndex === 'number') {
				this.cond.status = this.navList[this.tabCurrentIndex].state;
			} else {
				// 如果直接是状态值，就直接使用
				this.cond.status = this.tabCurrentIndex;
			}
			
			// 如果是全部订单，则置空状态
			if (this.cond.status === "") {
				this.cond.status = "";
			}
		},
		reload_list() {
			this.orderList = [];
			this.cond.page = 1;
			this.load_list();
		},
		load_list() {
			this.$get("/wx_mini_app/shop-order", this.cond, res => {
				if (res && res.data) {
					this.orderList = this.orderList.concat(res.data);
					this.cond.page++;
				}
			}, err => {
				console.error('获取订单列表失败:', err);
			});
		},


		tabClick(e) {
			this.tabCurrentIndex = e;
			this.set_stat();
			this.reload_list();

		},
		changeTab(e) {
			let idx = e.detail.current;

			/* this.tabCurrentIndex=idx;			
			this.set_stat();
			this.reload_list(); */


		},



	},
}
</script>

<style lang="scss">
page,
.content {
	background: #f8f8f8;
	height: 100%;
}

.swiper-box {
	height: calc(100% - 40px);
}

.list-scroll-content {
	height: 100%;
}

.navbar {
	display: flex;
	height: 40px;
	padding: 0 5px;
	background: #fff;
	box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
	position: relative;
	z-index: 10;

	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 15px;
		color: #333333;
		position: relative;

		&.current {
			color: #fa436a;

			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 44px;
				height: 0;
				border-bottom: 2px solid #fa436a;
			}
		}
	}
}

.uni-swiper-item {
	height: auto;
}

.order-item {
	display: flex;
	flex-direction: column;
	padding-left: 30upx;
	background: #fff;
	margin-top: 16upx;

	.i-top {
		display: flex;
		align-items: center;
		height: 80upx;
		padding-right: 30upx;
		font-size: 28upx;
		color: #333333;
		position: relative;

		.time {
			flex: 1;
		}

		.state {
			color: #fa436a;
		}

		.del-btn {
			padding: 10upx 0 10upx 36upx;
			font-size: 32upx;
			color: #f8f6fc;
			position: relative;

			&:after {
				content: '';
				width: 0;
				height: 30upx;
				border-left: 1px solid #a6a9b0;
				position: absolute;
				left: 20upx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}

	/* 多条商品 */
	.goods-box {
		height: 160upx;
		padding: 20upx 0;
		white-space: nowrap;

		.goods-item {
			width: 120upx;
			height: 120upx;
			display: inline-block;
			margin-right: 24upx;
		}

		.goods-img {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	/* 单条商品 */
	.goods-box-single {
		display: flex;
		padding: 20upx 0;

		.goods-img {
			display: block;
			width: 120upx;
			height: 120upx;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30upx 0 24upx;
			overflow: hidden;

			.title {
				font-size: 28upx + 2upx;
				color: #333333;
				line-height: 1;
			}

			.attr-box {
				font-size: 24upx + 2upx;
				color: #f8f6fc;
				padding: 10upx 12upx;
			}

			.price {
				font-size: 28upx + 2upx;
				color: #333333;

				&:before {
					content: '￥';
					font-size: 24upx;
					margin: 0 2upx 0 8upx;
				}
			}
		}
	}

	.price-box {
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
		padding: 20upx 30upx;
		font-size: 24upx + 2upx;
		color: #000000;

		.num {
			margin: 0 8upx;
			color: #333333;
		}

		.price {
			font-size: 32upx;
			color: #333333;

			&:before {
				content: '￥';
				font-size: 24upx;
				margin: 0 2upx 0 8upx;
			}
		}
	}

	.action-box {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100upx;
		position: relative;
		padding-right: 30upx;
	}

	.action-btn {
		width: 160upx;
		height: 60upx;
		margin: 0;
		margin-left: 24upx;
		padding: 0;
		text-align: center;
		line-height: 60upx;
		font-size: 26upx;
		color: #333333;
		background: #fff;
		border-radius: 100px;

		&:after {
			border-radius: 100px;
		}

		&.recom {
			background: #fff9f9;
			color: #fa436a;

			&:after {
				border-color: #f7bcc8;
			}
		}
	}
}


/* load-more */
.uni-load-more {
	display: flex;
	flex-direction: row;
	height: 80upx;
	align-items: center;
	justify-content: center
}

.uni-load-more__text {
	font-size: 28upx;
	color: #999
}

.uni-load-more__img {
	height: 24px;
	width: 24px;
	margin-right: 10px
}

.uni-load-more__img>view {
	position: absolute
}

.uni-load-more__img>view view {
	width: 6px;
	height: 2px;
	border-top-left-radius: 1px;
	border-bottom-left-radius: 1px;
	background: #999;
	position: absolute;
	opacity: .2;
	transform-origin: 50%;
	animation: load 1.56s ease infinite
}

.uni-load-more__img>view view:nth-child(1) {
	transform: rotate(90deg);
	top: 2px;
	left: 9px
}

.uni-load-more__img>view view:nth-child(2) {
	transform: rotate(180deg);
	top: 11px;
	right: 0
}

.uni-load-more__img>view view:nth-child(3) {
	transform: rotate(270deg);
	bottom: 2px;
	left: 9px
}

.uni-load-more__img>view view:nth-child(4) {
	top: 11px;
	left: 0
}

.load1,
.load2,
.load3 {
	height: 24px;
	width: 24px
}

.load2 {
	transform: rotate(30deg)
}

.load3 {
	transform: rotate(60deg)
}

.load1 view:nth-child(1) {
	animation-delay: 0s
}

.load2 view:nth-child(1) {
	animation-delay: .13s
}

.load3 view:nth-child(1) {
	animation-delay: .26s
}

.load1 view:nth-child(2) {
	animation-delay: .39s
}

.load2 view:nth-child(2) {
	animation-delay: .52s
}

.load3 view:nth-child(2) {
	animation-delay: .65s
}

.load1 view:nth-child(3) {
	animation-delay: .78s
}

.load2 view:nth-child(3) {
	animation-delay: .91s
}

.load3 view:nth-child(3) {
	animation-delay: 1.04s
}

.load1 view:nth-child(4) {
	animation-delay: 1.17s
}

.load2 view:nth-child(4) {
	animation-delay: 1.3s
}

.load3 view:nth-child(4) {
	animation-delay: 1.43s
}

@-webkit-keyframes load {
	0% {
		opacity: 1
	}

	100% {
		opacity: .2
	}
}
</style>
