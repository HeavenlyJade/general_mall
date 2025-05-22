<template>
	<view class="page">
		<!-- 分享模块组件 -->
		<share-module :title="shareTitle" :imageUrl="shareImage" :path="sharePath" :content="shareContent"
			@scene-parsed="handleSceneParsed">
		</share-module>

		<!-- 顶部banner -->
		<view class="banner-container">
			<swiper class="banner-swiper" circular :current="currentSwiper" @change="swiperChange" indicator-dots
				indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<video v-if="item.upload_video" :src="item.upload_video" :id="'video-' + index"
						:autoplay="index === currentSwiper" loop controls="false" class="banner-video"
						show-play-btn="false" show-progress="false" show-fullscreen-btn="false"></video>
					<image v-else :src="item.upload_image" mode="aspectFill" class="banner-image" />
				</swiper-item>
			</swiper>
		</view>
		<!-- 品牌介绍和产品系列组合 -->
		<view class="category-section" v-for="(item, index) in categoryList" :key="item.id">
			<!-- 品牌介绍 -->
			<view class="brand-intro">
				<view class="brand-content" :style="{ 'background-image': `url(${item.icon})` }">
					<view class="content-overlay">
						<view class="text-container">
							<!-- <view class="title">{{item.name}}</view> -->
							<rich-text :nodes="item.content"></rich-text>
						</view>
					</view>
				</view>
			</view>

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
			categoryList: [],
			productList: {},
			bannerImage: '',

			// 分享相关数据
			shareTitle: '东翁酿酒 老派酱香',
			shareImage: '',
			sharePath: '/pages/index/index',
			shareContent: '精选东翁传统美酒，品味非凡',

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
		this.loadCategoryData()

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
		
		// 设置初始视频播放
		setTimeout(() => {
			if(this.bannerList.length > 0 && this.bannerList[0].upload_video) {
				const currentVideo = uni.createVideoContext('video-0');
				if(currentVideo) {
					currentVideo.play();
				}
			}
		}, 1000);
	},
	onShow() {
		this.loadBannerData()
		this.loadCategoryData()
	},
	methods: {

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
		loadCategoryData() {
			this.$get('/wx_mini_app/product-category', {
				page: 1,
				size: 10,
				type: 'index'
			}, res => {
				if (res.code === 200) {
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
			if (!this.productList[categoryId]) {
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
		// 轮播变化事件处理
		swiperChange(e) {
			const oldIndex = this.currentSwiper;
			this.currentSwiper = e.detail.current;

			// 暂停上一个视频
			if (this.bannerList[oldIndex] && this.bannerList[oldIndex].upload_video) {
				const oldVideo = uni.createVideoContext('video-' + oldIndex);
				if (oldVideo) {
					oldVideo.pause();
				}
			}

			// 播放当前视频
			if (this.bannerList[this.currentSwiper] && this.bannerList[this.currentSwiper].upload_video) {
				const currentVideo = uni.createVideoContext('video-' + this.currentSwiper);
				if (currentVideo) {
					currentVideo.play();
				}
			}

			// 清除之前的计时器
			if (this.swiperTimer) clearTimeout(this.swiperTimer);

			// 设置新的计时器，视频10秒，图片3秒
			const currentItem = this.bannerList[this.currentSwiper];
			const interval = currentItem.upload_video ? 10000 : 3000;
			this.swiperTimer = setTimeout(() => {
				this.goNextSwiper();
			}, interval);
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

		// 轮播变化事件处

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
	background: #f5f5f5;
	min-height: 100vh;
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
	gap: 20rpx;
	padding: 20rpx;

	.product-item {
		position: relative;
		height: 460rpx;
		width: 320rpx;
		margin: 0 auto;
		background: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0;
		box-shadow: none;

		image {
			width: 100%;
			height: 380rpx;
			object-fit: contain;
			margin-bottom: 0;
		}

		.product-info {
			position: absolute;
			width: 100%;
			text-align: center;
			padding: 10rpx;
			bottom: 0;
			background: rgba(255, 255, 255, 0.9);

			.name {
				font-size: 28rpx;
				color: #8B0000;
				font-weight: 600;
				margin-bottom: 6rpx;
			}

			.sub-name {
				font-size: 24rpx;
				color: #996633;
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

.banner-container {
	width: 100%;
	height: 400rpx;
	position: relative;

	.banner-swiper {
		width: 100%;
		height: 100%;
	}

	.safe-area-container {
		width: 100%;
		height: 100%;
		padding: 60rpx 30rpx 20rpx 30rpx;
		/* 增加顶部和两侧安全距离 */
		box-sizing: border-box;
	}

	.banner-image,
	.banner-video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 12rpx;
		/* 增加圆角效果 */
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
</style>
