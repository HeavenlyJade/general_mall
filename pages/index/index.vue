<template>
	<view class="page">
		<!-- 顶部文字 -->
		<view class="brand-header">
			<view class="brand-title">
				<text class="brand-text">金酱</text>
			</view>
		</view>
		
		<!-- 顶部banner -->
		<view class="banner-container">
			<swiper class="banner-swiper" circular autoplay interval="3000" duration="1000" indicator-dots
				indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image :src="item.upload_image" mode="aspectFill" class="banner-image" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 产品类型轮播 -->
		<view class="category-scroll">
			<scroll-view scroll-x="true" class="category-scroll-view">
				<view class="category-item" v-for="(item, index) in categoryItems" :key="index" @click="toCategory(item, index)">
					<image :src="item.icon || item.image" mode="aspectFit" class="category-image" />
					<text class="category-name">{{item.name}}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 品牌介绍和产品系列组合 -->
		<view class="category-section" v-for="(item, index) in categoryList" :key="item.id">
			
			<!-- 对应的产品系列 -->
			<view class="product-grid">
				<view class="product-item" v-for="product in productList[item.id]" :key="product.id"
					@click="todetail(product)">
					<image :src="getFirstImage(product.images)" mode="aspectFill" />
					<view class="product-info">
						<view class="name">{{ product.name }}</view>
						<view class="sub-name">{{ product.alias }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 引入分享组件 -->
		<share-module
			ref="shareModule"
			:title="shareTitle"
			:image-url="shareImage"
			:path="sharePath"
			:content="shareContent"
			@scene-parsed="handleScene"
			@update:menuStyle="updateMenuStyle"
		/>

	</view>
</template>

<script>
import ShareModule from '@/components/share-module/share-module.vue'

export default {
	components: {
		ShareModule
	},
	data() {
		return {
			categoryList: [],
			productList: {},
			bannerList: [],
			navItems: [],
			categoryItems: [],
			shareTitle: '金酱小程序',
			shareImage: '', // 分享图片
			sharePath: '/pages/index/index', // 分享路径
			shareContent: '精选商品推荐', // 分享描述
			menuButtonInfoStyle: '',
			headerMarginTopStyle: ''
		}
	},
	onLoad(options) {
		// 处理小程序码场景值
		if (options && options.scene) {
			this.$refs.shareModule.handleSceneCode(options.scene)
		}
		
		this.loadBannerData()
		this.loadCategoryData()
	},
	onShow() {
		this.loadBannerData()
		this.loadCategoryData()
	},
	methods: {
		loadBannerData() {
			this.$get('/wx_mini_app/banners/by-type/index', {}, res => {
				if (res.items) {
					this.bannerList = res.items
				}
			})
		},
		loadCategoryData() {
			this.$get('/wx_mini_app/product-category', {
				page: 1,
				size: 10,
		
			}, res => {
				if (res.code === 200) {
					this.categoryList = res.data
					// 为每个分类加载产品
					this.categoryList.forEach(category => {
						this.loadProducts(category.id)
					})
					this.loadCategoryItems()
				}
			}, null, true)
		},
		loadProducts(categoryId) {
			// 初始化产品列表对象
			if (!this.productList[categoryId]) {
				this.$set(this.productList, categoryId, [])
			}
			
			this.$get('/wx_mini_app/shop-product', {
				page: 1,
				size: 4,
				need_total_count: true,
				category_id: categoryId
			}, res => {
				if(res.code === 200) {
					// 将产品数据存储到对应分类ID下
					this.$set(this.productList, categoryId, res.data)
				}
			})
		},
		getFirstImage(images) {
			try {
			
				return images[0] || ''
			} catch(e) {
				return ''
			}
		},
		todetail(item) {
			let id = item.id
			let url = `/pages/goods/detail?id=${id}`
			this.$navigateTo(url)
		},
		toWholesale() {
			this.$navigateTo('/pages/wholesale/index')
		},
		toCategory(item, index) {
			// 保存到本地存储
			uni.setStorageSync('current_category_id', item.id);
			// 跳转
			this.$navigateTo(`/pages/cate/cate`);
		},
		// 加载分类项目
		loadCategoryItems() {
			// 使用cate.vue中的接口获取分类数据
			this.$get('/wx_mini_app/product-category', {
				page: 1,
				size: 100
			}, res => {
				if (res.code === 200 && res.data) {
					// 获取排序后的分类列表
					let categories = res.data.sort((a, b) => a.sort_order - b.sort_order);
					// 筛选有图片的分类用于显示
					this.categoryItems = categories.filter(item => item.icon).slice(0, 5);
				}
			})
		},
		// 处理场景值解析结果
		handleScene(sceneData) {
			if (sceneData.referrer) {
				this.$u.vuex('referrer', sceneData.referrer)
				// 处理邀请逻辑
			}
		},
		
		// 更新菜单样式
		updateMenuStyle(styleInfo) {
			this.menuButtonInfoStyle = styleInfo.menuButtonInfoStyle
			this.headerMarginTopStyle = styleInfo.headerMarginTopStyle
		}
	},
	// 添加这两个方法将组件的分享能力传递到页面
	// #ifdef MP-WEIXIN
	onShareAppMessage() {
		return this.$refs.shareModule.onShareAppMessage()
	},
	
	onShareTimeline() {
		return this.$refs.shareModule.onShareTimeline()
	}
	// #endif
}
</script>

<style lang="scss">
.page {
	background: #ffffff;
	min-height: 100vh;
}

.banner-container {
	position: relative;
	width: 100%;
}

.banner-swiper {
	width: 100%;
	height: 400rpx;
}

.banner-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.brand-header {
	padding: 100rpx 0 0 0;
	background-color: transparent;
	border-bottom: none;
	margin-top: 0;
	position: relative;
}

.brand-title {
	display: flex;
	justify-content: flex-start;
	padding-left: 30rpx;
	margin-bottom: 20rpx;
}

.brand-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #000000;
	text-align: left;
	text-shadow: none;
}

.brand-subtitle {
	font-size: 26rpx;
	color: #666;
	text-align: center;
	line-height: 1.5;
}

.video-banner {
	position: relative;
	width: 100%;
	height: 400rpx;
	background: #fff;

	image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.brand-intro {
	margin: 20rpx;

	.brand-content {
		position: relative;
		width: 100%;
		height: 180rpx;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 20rpx;
		overflow: hidden;

		.content-overlay {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			.text-container {
				width: 70%;
				padding: 20rpx 30rpx;
				text-align: center;

				:deep(rich-text) {
					font-size: 24rpx;
					color: #333;
					line-height: 1.6;

					div {
						margin-bottom: 4rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;

						strong {
							display: block;
							font-size: 28rpx;
							margin-bottom: 8rpx;
						}
					}
				}
			}
		}
	}
}

.product-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 30rpx;
	padding: 20rpx 40rpx;

	.product-item {
		position: relative;
		height: 460rpx;
		width: 280rpx;
		margin: 0 auto;
		background: #f8f8f8;
		border-radius: 16rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		image {
			width: 220rpx;
			height: 380rpx;
			object-fit: contain;
			margin-bottom: 20rpx;
		}

		.product-info {
			position: relative;
			width: 100%;
			text-align: center;
			padding: 10rpx;
			bottom: auto;
			left: auto;
			transform: none;
			background: none;

			.name {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
				margin-bottom: 6rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.sub-name {
				font-size: 24rpx;
				color: #666;
			}
		}
	}
}

.collection-series {
	display: flex;
	padding: 20rpx;
	gap: 20rpx;

	.collection-item {
		flex: 1;
		height: 500rpx;
		position: relative;
		border-radius: 12rpx;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.collection-info {
			position: absolute;
			left: 20rpx;
			top: 20rpx;
			color: #0066cc;

			.name {
				font-size: 40rpx;
				font-weight: bold;
			}

			.sub-name {
				font-size: 28rpx;
			}
		}
	}
}

.wholesale-section {
	padding: 40rpx 30rpx;
	background: #fff;

	.title {
		font-size: 36rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.desc {
		font-size: 26rpx;
		color: #666;
		text-align: center;
		margin-bottom: 30rpx;
		line-height: 1.6;
	}

	.wholesale-banner {
		position: relative;
		height: 300rpx;
		border-radius: 12rpx;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.banner-text {
			position: absolute;
			left: 40rpx;
			top: 40rpx;
			color: #d81e06;
			font-size: 40rpx;
			font-weight: bold;
		}

		.sub-text {
			position: absolute;
			left: 40rpx;
			top: 100rpx;
			color: #333;
			font-size: 28rpx;
		}
	}
}

.category-section {
	margin-bottom: 40rpx;

	.brand-intro {
		margin: 20rpx;
	}
}

.category-scroll {
	background-color: #fff;
	padding: 20rpx;
	margin: 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	
	.category-scroll-view {
		white-space: nowrap;
		width: 100%;
	}
	
	.category-item {
		display: inline-block;
		width: 170rpx;
		text-align: center;
		padding: 20rpx 0;
		
		.category-image {
			width: 120rpx;
			height: 120rpx;
			object-fit: contain;
		}
		
		.category-name {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-top: 15rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
</style>
