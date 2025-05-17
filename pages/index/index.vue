<template>
	<view class="page">
		<!-- 顶部banner -->
		<view class="video-banner">
			<image :src="bannerImage" mode="aspectFill" class="w100p h100p"/>
		</view>

		<!-- 品牌介绍和产品系列组合 -->
		<view class="category-section" v-for="(item, index) in categoryList" :key="item.id">
			<!-- 品牌介绍 -->
			<view class="brand-intro">
				<view class="brand-content" :style="{'background-image': `url(${item.icon})`}">
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
				<view class="product-item" 
					  v-for="product in productList[item.id]" 
					  :key="product.id" 
					  @click="todetail(product)">
					<image :src="getFirstImage(product.images)" mode="aspectFill"/>
					<view class="product-info">
						<view class="name">{{product.name}}</view>
						<view class="sub-name">{{product.alias}}</view>
					</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
export default {
	data() {
		return {
			categoryList: [],
			productList: {},
			bannerImage: ''
		}
	},
	onLoad() {
		this.loadBannerData()
		this.loadCategoryData()
	},
	onShow() {
		this.loadBannerData()
		this.loadCategoryData()
	},
	methods: {
		loadBannerData() {
			this.$get('/wx_mini_app/banners/by-type/index_bg', {}, res => {
				if(  res.items) {
					this.bannerImage = res.items[0].upload_image
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
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);

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
</style>
