<template>
	<view>
		<view class="header-space"></view>
		<fixed-search :placeholder="'输入关键词搜索'" @search="tosearch"></fixed-search>

		<!-- #ifdef H5 -->
		<view class="category-list cont-mt" style="margin-top: 2rem;">
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="category-list cont-mt" style="margin-top: 4rem;">
				<!-- #endif -->
				<!-- 左侧分类导航 -->

				<scroll-view scroll-y="true" class="left">
					<view class="row" v-for="(category, index) in categoryList" :key="category.id"
						:class="[index == showCategoryIndex ? 'on' : '']" @tap="showCategory(index)">
						<view class="text">
							<view class="block"></view>
							{{ category.name }}
						</view>
					</view>

				</scroll-view>
				<!-- 右侧商品列表 -->
				<scroll-view scroll-y="true" class="right">
					<view class="product-list">
						<view class="product-item" v-for="items in productList" :key="items.id" @tap="toProduct(items)">
							<image :src="items.images[0]" mode="aspectFill" />
							<view class="info">
								<view class="name">{{ items.name }}</view>
								<view class="price-cart">
									<view class="price">
										<text class="current">¥{{ items.price }}</text>
										<text class="original" v-if="items.market_price">¥{{ items.market_price }}</text>
									</view>
									<!-- 添加购物车按钮,阻止冒泡避免触发商品详情 -->
									<view class="cart-icon" @tap.stop="addToCart(items)">
										<image src="/static/img/icons/shopping_cart.png" mode="aspectFit"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="loading" v-if="loading">加载中...</view>
					<view class="no-more" v-if="noMore">没有更多了</view>
				</scroll-view>
				<!-- #ifdef H5 -->
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
import fixedSearch from '../../components/fixed-search/fixed-search.vue';

export default {
	components: { fixedSearch },

	data() {
		return {
			showCategoryIndex: 0,

			//分类列表
			categoryList: [],
			productList: [],
			currentPage: 1,
			pageSize: 10,
			loading: false,
			noMore: false,
			platform: ''
		}
	},
	onNavigationBarSearchInputClicked: async function (e) {

		this.$navigateTo(`/pages/goods/HM-search`);
	},
	onLoad() {
		// 判断平台
		// #ifdef H5
		this.platform = 'H5'
		// #endif

		this.initCateList();
		//this.getBannerList();

	},
	methods: {

		initCateList() {
			this.$get('/mini_core/product-category', {
				page: 1,
				size: 100
			}, res => {
				if (res.code === 200 && res.data) {
					// 直接使用数据并排序
					this.categoryList = res.data.sort((a, b) => a.sort_order - b.sort_order)

					// 默认显示第一个分类
					if (this.categoryList.length > 0) {
						this.showCategory(0) // 这里会触发加载商品
					}
				}
			})
		},

		//分类切换显示
		showCategory(index) {
			this.showCategoryIndex = index
			this.currentPage = 1
			this.noMore = false
			this.productList = []
			this.loadProducts()
		},

		loadProducts() {
			if (this.loading || this.noMore) return

			this.loading = true
			const categoryId = this.categoryList[this.showCategoryIndex].id

			this.$get('/mini_core/shop-product', {
				page: this.currentPage,
				size: this.pageSize,
				need_total_count: true,
				category_id: categoryId
			}, res => {
				this.loading = false
				if (res.code === 200) {
					// 打印返回数据,方便调试
					this.productList = res.data
					if (this.productList.length == 0) {
						this.noMore = true
					}
				}
			})
		},

		loadMore() {
			if (!this.noMore) {
				this.currentPage++
				this.loadProducts()
			}
		},

		getFirstImage(images) {
			try {
				if (!images) {
					return ''
				}

				// 尝试解析JSON
				if (typeof images === 'string') {
					const imageArray = JSON.parse(images)
					return imageArray[0] || ''
				}

				return images[0] || ''
			} catch (e) {
				console.log('解析出错:', e)
				return ''
			}
		},
		// 点击分类跳转
		toProduct(item) {
			let id = item.id
			let url = `/pages/goods/detail?id=${id}`
			this.$navigateTo(url)
		},

		//搜索跳转
		tosearch(e) {
			uni.navigateTo({
				url: `/pages/goods/HM-search`
			})
		},

		imageError(e) {
			// 图片加载失败时使用默认图片
			const img = e.target
			if (img.defaultImg) {
				img.src = img.defaultImg
			}
		},

		addToCart(item) {
			// 这里添加加入购物车的逻辑
			var cart = {};
			cart.sku_id = item.id,
				cart.product_count = 1;
			this.$post("/wx_mini_app/shop-cart", cart, function (res) {
				console.log("res", res)
				uni.showToast({
					title: '操作成功'
				})
			})
			// this.$post('/wx_mini_app/shop-cart', {
			// 	product_id: item.id,
			// 	quantity: 1
			// }, res => {
			// 	if(res.code === 200) {
			// 		uni.showToast({
			// 			title: '已加入购物车',
			// 			icon: 'success'
			// 		})
			// 	}
			// })
		}
	}
}
</script>
<style lang="scss">
.category-list {
	//margin-top: 2.8rem;
	width: 100%;
	background-color: #fff;
	display: flex;

	.left,
	.right {
		//position: absolute;		
		//top: 100upx;
		//bottom: 0upx;
	}

	.left {
		width: 24%;
		left: 0upx;
		background-color: #f2f2f2;

		.row {
			width: 100%;
			height: 90upx;
			display: flex;
			align-items: center;

			.text {
				width: 100%;
				position: relative;
				font-size: 28upx;
				display: flex;
				justify-content: center;
				color: #3c3c3c;

				.block {
					position: absolute;
					width: 0upx;
					left: 0;
				}
			}

			&.on {
				height: 100upx;
				background-color: #fff;

				.text {
					font-size: 30upx;
					font-weight: 600;
					color: #2d2d2d;

					.block {
						width: 10upx;
						height: 80%;
						top: 10%;
						background-color: #f06c7a;
					}
				}
			}
		}
	}

	.right {
		width: 76%;
		left: 24%;

		.product-list {
			padding: 20rpx;

			.product-item {
				width: 100%;
				margin-bottom: 20rpx;
				background: #fff;
				border-radius: 12rpx;
				overflow: hidden;
				display: flex;

				image {
					width: 200rpx;
					height: 200rpx;
					background: #f5f5f5;
				}

				.info {
					flex: 1;
					padding: 16rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.name {
						font-size: 28rpx;
						color: #333;
						line-height: 1.4;
						height: 80rpx;
						overflow: hidden;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}

					.price-cart {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.price {
							.current {
								color: #f06c7a;
								font-size: 32rpx;
								font-weight: bold;
							}

							.original {
								color: #999;
								font-size: 24rpx;
								text-decoration: line-through;
								margin-left: 12rpx;
							}
						}

						.cart-icon {
							width: 50rpx;
							height: 50rpx;

							image {
								width: 100%;
								height: 100%;
								background: none;
							}
						}
					}
				}
			}
		}

		.loading,
		.no-more {
			text-align: center;
			color: #999;
			font-size: 24rpx;
			padding: 20rpx 0;
		}
	}
}
</style>
