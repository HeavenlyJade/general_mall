<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="cartList.length === 0" class="empty">
			<!-- <image src="/static/emptyCart.jpg" mode="aspectFit"></image> -->
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛>
				</navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.id">
					<view class="cart-item" :class="{ 'b-b': index !== cartList.length - 1 }">
						<view class="image-wrapper" style="display: block; opacity: 1;">
							<image style="width: 6.5rem;height: 6.5rem;" :src="item.images[0]" :class="[item.loaded]"
								mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
								@error="onImageError('cartList', index)"></image>
							<view class="iconfont iconyouhuiquan-xuanzhong checkbox" :class="{ checked: item.checked }"
								@click="check('item', index)" :style="item.checked ? 'color: #ff557f;' : ''"></view>
						</view>
						<view class="item-right">
							<view class=" title">{{ $endwith(item.product_name, 20) }}</view>
							<text class="attr"> <text v-if="',' != item.sku">{{ item.sku }}</text> </text>
							<text class="price">¥{{ item.price }}</text>

							<uni-number-box class="step" :min="1" :max="999" :value="item.product_count"
								:isMax="item.product_count > 999" :isMin="item.product_count === 1" :index="index"
								@eventChange="numberChange" :disabled="false"></uni-number-box>
						</view>
						<text class="del-btn iconfont iconicon_delete_fill" style="color: #aaaaff;"
							@click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section flex c-center m-center">
				<view class="checkbox">
					<image :src="allChecked ? '/static/img/cart/selected.png' : '/static/img/cart/select.png'"
						mode="aspectFit" @click="check('all')"></image>
					<!-- <view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view> -->
				</view>
				<view class="total-box">
					<text class="price">¥{{ goodsAmount }}</text>
					<!-- <text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text> -->
				</view>
				<button type="primary" style="background-color: #ff557f;" class="no-border confirm-btn"
					@click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>

import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
export default {
	components: { uniNumberBox },
	data() {
		return {
			allChecked: false, //全选状态  true|false
			empty: false, //空白页现实  true|false
			cartList: [],
			userInfo: {
				"id": -1
			},
			goodsAmount: 0,
			hasLogin: 1,
		}
	},


	onLoad() {
		//this.loadData();
		// this.getCartList();

		this.loadUserInfo();

	},
	onShow() {
		this.getCartList();
		//this.tips1();
		
		// 解决切换页面后图片不渲染问题
		setTimeout(() => {
			if (this.cartList && this.cartList.length > 0) {
				this.cartList.forEach((item, index) => {
					this.$set(this.cartList[index], 'loaded', 'loaded');
					// 设置商品为未勾选状态
					this.$set(this.cartList[index], 'checked', false);
				});
				// 设置底部全选按钮为未勾选状态
				this.allChecked = false;
				// 重新计算总价
				this.count();
			}
		}, 200);
	},
	watch: {
		cartList: {
			handler(newValue, oldValue) {
				let empty = this.cartList.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}

				this.count();
			},
			deep: true
		}
	},
	/* computed:{
		...mapState(['hasLogin'])
	}, */
	methods: {


		loadUserInfo() {
			this.userInfo = this.getUser();
		},
		getCartList() {
			let o = {};
			o.userId = this.userInfo.id 
			let _this = this;
			// 使用wx_mini_app/shop-cart接口获取购物车数据
			this.$get("/wx_mini_app/shop-cart", {}, function (res) {
				if (res.code === 200) {
					_this.cartList = res.data;
					_this.count();
				} else {
					// 请求失败处理
					uni.showToast({
						title: res.msg || '购物车数据加载失败',
						icon: 'none'
					});
				}
			}, function (error) {
				// 请求失败处理
				uni.showToast({
					title: '购物车数据加载失败',
					icon: 'none'
				});
			}, false) // 开启本地缓存
		},

		count() {
			var li = this.cartList;
			var sum = 0;
			for (let i in li) {
				var ite = li[i];
				var price = ite.price;
				var sub_sum = parseFloat(price) * parseFloat(ite.product_count);
				if (ite.checked === true) {
					sum = sum + sub_sum
				}
			}
			this.goodsAmount = this.$round2pos(sum);

		},

		//监听image加载完成
		onImageLoad(key, index) {
			console.log("onImageLoad", key, index)
			this.$set(this[key][index], 'loaded', 'loaded');
		},
		//监听image加载失败
		onImageError(key, index) {
			// 如果图片加载失败，设置默认图片
			if (this[key] && this[key][index] && this[key][index].goods) {
				this[key][index].goods.image = '/static/errorImage.jpg';
			}
			// 标记为已加载，避免闪烁
			this.$set(this[key][index], 'loaded', 'loaded');
		},
		navToLogin() {
			this.$navigateTo("pages/login/login")
		},
		//选中状态处理
		check(type, index) {
			if (type === 'item') {
				this.cartList[index].checked = !this.cartList[index].checked;
			} else {
				const checked = !this.allChecked
				const list = this.cartList;
				list.forEach(item => {
					item.checked = checked;
				})
				this.allChecked = checked;
			}
			this.count();
		},
		//数量
		numberChange(data) {
			// 获取当前购物车项
			const cartItem = this.cartList[data.index];
			// 更新购物车中商品数量
			this.cartList[data.index].product_count = data.number;
			console.log("cartItem", cartItem)
			// 调用API更新购物车商品数量
			this.$post("/wx_mini_app/shop-cart/update", {
				id: cartItem.cart_id, // 购物车项id，必须传递
				sku_id: cartItem.product_id,
				product_count: data.number
			}, (res) => {
				if (res.code === 200) {
					console.log("购物车数量更新成功");
				} else {
					uni.showToast({
						title: res.msg || '数量更新失败',
						icon: 'none'
					});
				}
			});
			
			this.count();
		},
		//删除
		deleteCartItem(index) {
			let list = this.cartList;
			let row = list[index];
			let product_id = row.product_id;


			// 使用新的API删除购物车商品
			this.$post("/wx_mini_app/shop-cart/delete", {
				sku_id: product_id
			}, (res) => {
				if (res.code === 200) {
					this.cartList.splice(index, 1);
					this.count();
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
				} else {
					uni.showToast({
						title: res.msg || '删除失败',
						icon: 'none'
					});
				}
				uni.hideLoading();
			}, (error) => {
				uni.showToast({
					title: '删除失败',
					icon: 'none'
				});
				uni.hideLoading();
			});
		},
		//清空
		clearCart() {
			uni.showModal({
				content: '清空购物车？',
				success: (e) => {
					if (e.confirm) {
						// 收集所有购物车项目ID
						var ids = [];
						for (let i in this.cartList) {
							var ite = this.cartList[i];
							ids.push(ite.id);
						}

						if (ids.length === 0) {
							return;
						}

						uni.showLoading({
							title: '清空中...'
						});

						// 使用新的API清空购物车
						this.$post("/api/v1/wx_mini_app/shop-cart/clear", {
							"ids": ids
						}, (res) => {
							if (res.code === 200) {
								this.cartList = [];
								this.count();
								uni.showToast({
									title: '购物车已清空',
									icon: 'success'
								});
							} else {
								uni.showToast({
									title: res.msg || '清空失败',
									icon: 'none'
								});
							}
							uni.hideLoading();
						}, (error) => {
							uni.showToast({
								title: '清空失败',
								icon: 'none'
							});
							uni.hideLoading();
						});
					}
				}
			})
		},

		//创建订单
		createOrder() {
			let list = this.cartList;

			var goods_list = [];
			for (let i in list) {
				var ite = list[i];
				if (ite.checked === true) {	
					let param = {};
					param.goods = ite;
					param.goods.image = ite.images[0];
					param.number = ite.product_count;
					goods_list.push(param);
				}
			}

			if (goods_list.length === 0) {
				uni.showToast({
					"title": '没有选中商品进行结算'
				})
				return;
			}

			this.$dataLocal("buy_list", goods_list);
			this.$dataLocal("buy_type", "cart");
			this.$navigateTo(`/pages/order/create`);
		}
	}
}
</script>

<style lang='scss'>
.container {
	padding-bottom: 134upx;

	/* 空白页 */
	.empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		image {
			width: 240upx;
			height: 160upx;
			margin-bottom: 30upx;
		}

		.empty-tips {
			display: flex;
			font-size: 0.8rem;
			color: #C0C4CC;

			.navigator {
				color: $uni-color-primary;
				margin-left: 16upx;
			}
		}
	}
}

/* 购物车列表项 */
.cart-item {
	opacity: 1;
	display: flex;
	position: relative;
	padding: 30upx 40upx;

	.image-wrapper {
		opacity: 1;
		width: 230upx;
		height: 230upx;
		flex-shrink: 0;
		position: relative;

		image {
			border-radius: 8upx;

		}
	}

	.checkbox {
		position: absolute;
		left: -16upx;
		top: -16upx;
		z-index: 8;
		font-size: 44upx;
		line-height: 1;
		padding: 4upx;
		color: #C0C4CC;
		background: #fff;
		border-radius: 50px;
	}

	.item-right {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		position: relative;
		padding-left: 30upx;

		.title,
		.price {
			font-size: 0.76rem;
			color: #303133;
			height: 80upx;
			line-height: 40upx;
		}

		.attr {
			font-size: 0.72rem;
			color: 909399;
			height: 40upx;
			line-height: 50upx;
		}

		.price {
			height: 50upx;
			line-height: 50upx;
		}
	}

	.del-btn {
		padding: 4upx 10upx;
		font-size: 34upx;
		height: 50upx;
		color: 909399;
	}
}

/* 底部栏 */
.action-section {
	/* #ifdef H5 */
	margin-bottom: 100upx;
	/* #endif */
	position: fixed;
	//left: 30upx;
	bottom: 30upx;
	z-index: 95;
	display: flex;
	align-items: center;
	width: 690upx;
	height: 100upx;
	padding: 0 30upx;
	background: rgba(255, 255, 255, .9);
	box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
	border-radius: 16upx;

	.checkbox {
		height: 52upx;
		position: relative;

		image {
			width: 52upx;
			height: 100%;
			position: relative;
			z-index: 5;
		}
	}

	.clear-btn {
		position: absolute;
		left: 22upx;
		top: 0;
		z-index: 4;
		width: 0;
		height: 52upx;
		line-height: 52upx;
		padding-left: 38upx;
		font-size: 0.8rem;
		color: #fff;
		background: #C0C4CC;
		border-radius: 0 50px 50px 0;
		opacity: 0;
		transition: .2s;

		&.show {
			opacity: 1;
			width: 120upx;
		}
	}

	.total-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		text-align: right;
		padding-right: 40upx;

		.price {
			font-size: 0.86rem;
			color: #303133;
		}

		.coupon {
			font-size: 0.7rem;
			;
			color: 909399;

			text {
				color: #303133;
			}
		}
	}

	.confirm-btn {
		padding: 0 38upx;
		margin: 0;
		border-radius: 100px;
		height: 76upx;
		line-height: 76upx;
		font-size: 0.76rem;
		background: $uni-color-primary;
		box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
	}
}

/* 复选框选中状态 */
.action-section .checkbox.checked,
.cart-item .checkbox.checked {
	color: $uni-color-primary;
}

.image-wrapper uni-image {
	width: 100%;
	height: 100%;
	-webkit-transition: .6s;
	-o-transition: .6s;
	transition: .6s;
	opacity: 1;
}

/* 图片加载状态样式 */
.image-wrapper image {
	opacity: 0;
}

.image-wrapper image.loaded {
	opacity: 1;
}

/* 图片占位符样式 */
.image-wrapper::before {
	content: "";
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: #f8f8f8;
	z-index: -1;
}
</style>
