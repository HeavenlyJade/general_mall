<template>
	<view class="page">
		<!-- 顶部安全区域 -->
		<view class="status-bar-height"></view>
		
		<!-- 顶部搜索栏 -->
		<view class="search-header">
			<view class="store-logo" v-if="logoUrl">
				<image :src="logoUrl" mode="aspectFit" class="logo-image"></image>
				<text v-if="logoName" class="logo-name">{{logoName}}</text>
			</view>
			<view class="store-name" v-else>金酱酒业</view>
			<!-- <view class="search-box" @click="toSearch">
				<input 
					class="search-input" 
					type="text" 
					placeholder="输入关键词搜索" 
					placeholder-class="placeholder-style"
					confirm-type="search"
					v-model="searchKeyword"
					@confirm="handleSearch"
				/>
				<image src="/static/icons/search.png" mode="aspectFit" class="search-icon" @click.stop="handleSearch"></image>
			</view> -->
			<view class="header-icons">
				<image src="/static/icons/menu.png" mode="aspectFit" class="menu-icon"></image>
			</view>
		</view>

		<!-- 分享模块组件 -->
		<share-module :title="shareTitle" :imageUrl="shareImage" :path="sharePath" :content="shareContent"
			@scene-parsed="handleSceneParsed">
		</share-module>

		<!-- 顶部banner -->
		<view class="banner-container">
			<swiper class="banner-swiper" circular :current="currentSwiper" @change="swiperChange" indicator-dots
				indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<video v-if="item.upload_video" :src="item.upload_video" autoplay loop muted controls="false"
						class="banner-video" show-play-btn="false" show-progress="false"
						show-fullscreen-btn="false"></video>
					<image v-else :src="item.upload_image" mode="aspectFill" class="banner-image" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 产品类型导航 -->
		<view class="category-nav">
			<view class="category-item" v-for="(item, index) in categoryItems" :key="index" @click="toCategory(item, index)">
				<image :src="item.icon || item.image" mode="aspectFit" class="category-image" />
				<text class="category-name">{{item.name}}</text>
			</view>
		</view>

		<!-- 滚动公告栏 -->
<!-- 		<view class="notice-bar">
			<image src="/static/icons/notice.png" class="notice-icon"></image>
			<swiper class="notice-swiper" vertical autoplay circular interval="3000">
				<swiper-item v-for="(item, index) in noticeList" :key="index">
					<text class="notice-text">{{item.content}}</text>
				</swiper-item>
			</swiper>
			<view class="notice-more">更多</view>
		</view> -->

		<!-- 爆款推荐 -->
		<view class="hot-recommend">
			<view class="section-title">
				<image src="/static/icons/fire.png" class="title-icon"></image>
				<text>爆款推荐</text>
			</view>
			
			<view class="product-list">
				<view class="product-card" v-for="(product, index) in hotProducts" :key="index" @click="todetail(product)">
					<image :src="getFirstImage(product.images)" mode="aspectFill" class="product-image" />
					<view class="product-info">
						<view class="product-name">{{product.name}}</view>
						<view class="product-desc">{{product.alias}}</view>
						<view class="product-price">¥ {{product.price}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 品牌介绍和产品系列组合 -->
		<!-- <view class="category-section" v-for="(item, index) in categoryList" :key="item.id">
			<view class="brand-intro">
				<view class="brand-content" :style="{ 'background-image': `url(${item.icon})` }">
					<view class="content-overlay">
						<view class="text-container">
							<rich-text :nodes="item.content"></rich-text>
						</view>
					</view>
				</view>
			</view>

			<view class="product-grid">
				<view class="product-item" v-for="product in productList[item.id]" :key="product.id"
					@click="todetail(product)">
					<image :src="getFirstImage(product.images)" mode="aspectFill" />
					<view class="product-info">
						<view class="name">{{ product.name }}</view>
						<view class="sub-name">{{ product.alias }}</view>
						<view class="price">¥ {{ product.price || '198' }}</view>
					</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
import ShareModule from '@/components/share-module/share-module.vue'

export default {
	components: {
		ShareModule
	},
	// 添加小程序分享方法 - 分享给朋友
	onShareAppMessage() {
		return {
			title: this.shareTitle,
			path: this.sharePath,
			imageUrl: this.shareImage,
			success: function () {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail: function () {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	},

	// 分享到朋友圈
	onShareTimeline() {
		return {
			title: this.shareTitle,
			query: this.sharePath.split('?')[1] || '',
			imageUrl: this.shareImage
		}
	},

	data() {
		return {
			searchKeyword: '',
			categoryList: [],
			productList: {},
			bannerImage: '',
			logoUrl: '',
			logoName: '',
			
			// 分类导航
			categoryItems: [],
			
			// 爆款推荐产品
			hotProducts: [],
			
			// 通知公告
			noticeList: [
				{ content: '最新促销活动：购买满888元送精美礼品' },
				{ content: '新品上市：十大酱香味已上线' }
			],

			// 分享相关数据
			shareTitle: '金酱酒业 - 传统美酒',
			shareImage: '',
			sharePath: '/pages/index/index',
			shareContent: '精选金酱传统美酒，品味非凡',

			// 统计分析数据
			pageViews: 0,
			sourceChannel: '',
			referrer: '',
			bannerList: [],
			currentSwiper: 0,
			swiperTimer: null,
		}
	},
	onLoad(options) {
		this.loadBannerData()
		this.loadLogoData()
		this.loadCategoryItems()
		this.loadCategoryData()
		this.loadHotProducts()

		// 处理场景值和统计
		if (options.scene) {
			this.parseScene(options.scene)
		}

		// 记录来源渠道
		if (options.channel) {
			this.sourceChannel = options.channel
			// 可以调用API记录渠道数据
		}

		// 记录页面访问
		this.recordPageView()
	},
	onShow() {
		this.loadBannerData()
		this.loadLogoData()
		this.loadCategoryItems()
		this.loadCategoryData()
		this.loadHotProducts()
	},
	methods: {
		// 搜索相关方法
		toSearch() {
			uni.navigateTo({
				url: `/pages/goods/HM-search`
			})
		},
		
		handleSearch() {
			uni.navigateTo({
				url: `/pages/goods/HM-search?keyword=${this.searchKeyword}`
			})
		},
		
		loadBannerData() {
			this.$get('/wx_mini_app/banners/by-type/index_bg', {}, res => {
				if (res.items) {
					this.bannerList = res.items
					if (this.bannerList.length > 0) {
						this.bannerImage = this.bannerList[0].upload_image || ''
					}
				}
			})
		},
		
		loadLogoData() {
			this.$get('/wx_mini_app/banners/by-type/logo', {}, res => {
				if (res.items && res.items.length > 0) {
					this.logoUrl = res.items[0].upload_image || ''
					this.logoName = res.items[0].name || ''
				}
			})
		},
		
		loadCategoryItems() {
			this.$get('/wx_mini_app/product-category', {
				page: 1,
				size: 100
			}, res => {
				if (res.code === 200 && res.data) {
					// 获取所有分类并排序
					const sortedCategories = res.data.sort((a, b) => a.sort_order - b.sort_order);
					// 只取前4个分类用于导航
					this.categoryItems = sortedCategories.slice(0, 4).map(item => {
						return {
							id: item.id,
							name: item.name,
							icon: item.icon || item.image
						}
					})
				}
			})
		},
		loadCategoryData() {
			this.$get('/wx_mini_app/product-category', {
				page: 1,
				size: 10,
				type: 'index'
			}, res => {
				if(res.code === 200) {
					this.categoryList = res.data
					// 为每个分类加载产品
					this.categoryList.forEach(category => {
						this.loadProducts(category.id)
					})
				}
			}, null, true)
		},
		loadProducts(categoryId) {
			// 初始化产品列表对象
			if(!this.productList[categoryId]) {
				this.$set(this.productList, categoryId, [])
			}

			this.$get('/wx_mini_app/shop-product', {
				page: 1,
				size: 4,
				need_total_count: true,
				category_id: categoryId
			}, res => {
				if (res.code === 200) {
					// 将产品数据存储到对应分类ID下
					this.$set(this.productList, categoryId, res.data)
				}
			})
		},
		loadHotProducts() {
			this.$get('/wx_mini_app/shop-product', {
				page: 1,
				size: 4,
				need_total_count: true,
				is_hot: 1
			}, res => {
				if (res.code === 200) {
					this.hotProducts = res.data
				}
			})
		},
		getFirstImage(images) {
			try {
				return images[0] || ''
			} catch (e) {
				return ''
			}
		},
		todetail(item) {
			let id = item.id
			let url = `/pages/goods/detail?id=${id}`
			this.$navigateTo(url)
		},
		toCategory(item, index) {
			// 保存当前分类ID，以便分类页面加载时能选中正确的分类
			console.log("点击了事件",index)
			uni.setStorageSync('current_category_id', item.id);
			// 跳转到分类页面
			console.log("开始跳转",index)
			this.$navigateTo('/pages/cate/cate')

		
		},
		toWholesale() {
			this.$navigateTo('/pages/wholesale/index')
		},
		// 解析场景值
		parseScene(scene) {
			try {
				const decodedScene = decodeURIComponent(scene)
				console.log('解析场景值:', decodedScene)
				// 后续处理场景值逻辑
			} catch (e) {
				console.error('解析场景值失败', e)
			}
		},

		// 处理分享模块返回的场景解析结果
		handleSceneParsed(data) {
			if (data.referrer) {
				this.referrer = data.referrer
				// 可以调用API记录推荐人数据
			}
		},

		// 记录页面访问
		recordPageView() {
			this.pageViews++
			// 可以调用API记录访问数据
			console.log('页面访问次数:', this.pageViews)
		},
		// 切换到下一个轮播项
		goNextSwiper() {
			let next = this.currentSwiper + 1;
			if (next >= this.bannerList.length) {
				next = 0;
			}
			this.currentSwiper = next;
		},

		// 轮播变化事件处理
		swiperChange(e) {
			this.currentSwiper = e.detail.current;

			// 清除之前的计时器
			if (this.swiperTimer) clearTimeout(this.swiperTimer);

			// 设置新的计时器，视频10秒，图片3秒
			const currentItem = this.bannerList[this.currentSwiper];
			const interval = currentItem.upload_video ? 10000 : 3000;
			this.swiperTimer = setTimeout(() => {
				this.goNextSwiper();
			}, interval);
		},

		// 获取分享图片
		initShareInfo() {
			// 使用第一个分类的第一个产品图作为分享图
			if (this.categoryList.length > 0) {
				const firstCat = this.categoryList[0]
				if (this.productList[firstCat.id] && this.productList[firstCat.id].length > 0) {
					const firstProduct = this.productList[firstCat.id][0]
					this.shareImage = this.getFirstImage(firstProduct.images)
				}
			}
		}
	},
	watch: {
		'productList': {
			handler() {
				this.initShareInfo()
			},
			deep: true
		}
	}
}
</script>

<style lang="scss">
.page {
	background: #f8f8f8;
	min-height: 100vh;
}

/* 顶部安全区域 */
.status-bar-height {
	height: var(--status-bar-height);
	width: 100%;
	background-color: #fff;
}

/* 顶部搜索栏 */
.search-header {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background: #fff;
	z-index: 100;
}

.store-logo {
	height: 60rpx;
	margin-right: 20rpx;
	margin-left: -10rpx;
	display: flex;
	align-items: center;
}

.logo-image {
	height: 100rpx;
	width: 100rpx;
	margin-right: 10rpx;
	flex-shrink: 0;
}

.logo-name {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
}

.store-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-right: 20rpx;
}

.search-box {
	flex: 1;
	height: 64rpx;
	background: #f5f5f5;
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
}

.search-input {
	flex: 1;
	height: 60rpx;
	font-size: 28rpx;
	color: #333;
	background: transparent;
}

.placeholder-style {
	color: #999;
	font-size: 28rpx;
	margin-left: 10rpx;
}

.search-icon {
	width: 40rpx;
	height: 40rpx;
	margin-left: auto;
}

.header-icons {
	margin-left: 20rpx;
}

.menu-icon {
	width: 48rpx;
	height: 48rpx;
}

/* Banner样式 */
.banner-container {
	width: 100%;
	height: 400rpx;
	position: relative;
}

.banner-swiper {
	width: 100%;
	height: 100%;
}

.banner-image,
.banner-video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* 分类导航 */
.category-nav {
	display: flex;
	justify-content: space-between;
	background: #fff;
	padding: 30rpx 20rpx;
	margin: 20rpx;
	border-radius: 16rpx;
}

.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25%;
}

.category-image {
	width: 100rpx;
	height: 100rpx;
	margin-bottom: 15rpx;
}

.category-name {
	font-size: 26rpx;
	color: #333;
}

/* 公告栏 */
.notice-bar {
	display: flex;
	align-items: center;
	height: 70rpx;
	background: #fff9f0;
	margin: 0 20rpx 20rpx;
	padding: 0 20rpx;
	border-radius: 10rpx;
}

.notice-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 10rpx;
}

.notice-swiper {
	flex: 1;
	height: 100%;
}

.notice-text {
	font-size: 24rpx;
	color: #ff6633;
	line-height: 70rpx;
}

.notice-more {
	font-size: 24rpx;
	color: #999;
	margin-left: 20rpx;
}

/* 爆款推荐 */
.hot-recommend {
	background: #fff;
	margin: 0 20rpx 20rpx;
	padding: 20rpx;
	border-radius: 16rpx;
}

.section-title {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.title-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.section-title text {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.product-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.product-card {
	width: 48%;
	margin-bottom: 20rpx;
	background: #fff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.product-image {
	width: 100%;
	height: 320rpx;
	object-fit: cover;
}

.product-info {
	padding: 15rpx;
}

.product-name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.product-desc {
	font-size: 24rpx;
	color: #666;
	margin-top: 5rpx;
}

.product-price {
	font-size: 30rpx;
	color: #e60012;
	font-weight: bold;
	margin-top: 10rpx;
}

/* 品牌介绍 */
.brand-intro {
	margin: 20rpx;
}

.brand-content {
	position: relative;
	width: 100%;
	height: 180rpx;
	background-size: cover;
	background-position: center;
	border-radius: 16rpx;
	overflow: hidden;
}

.content-overlay {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.text-container {
	width: 70%;
	padding: 20rpx;
	text-align: center;
}

:deep(rich-text) {
	font-size: 24rpx;
	color: #333;
	line-height: 1.6;
}

/* 产品网格 */
.product-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
	padding: 0 20rpx 20rpx;
}

.product-item {
	background: #fff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.product-item image {
	width: 100%;
	height: 320rpx;
	object-fit: cover;
}

.product-item .product-info {
	padding: 15rpx;
}

.product-item .name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.product-item .sub-name {
	font-size: 24rpx;
	color: #666;
	margin-top: 5rpx;
}

.product-item .price {
	font-size: 30rpx;
	color: #e60012;
	font-weight: bold;
	margin-top: 10rpx;
}

</style>
