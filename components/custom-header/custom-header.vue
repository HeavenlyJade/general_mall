<template>
	<view class="custom-header">
		<view class="store-logo" v-if="displayLogoUrl">
			<image :src="displayLogoUrl" mode="aspectFit" class="logo-image"></image>
			<text v-if="displayLogoName" class="logo-name">{{displayLogoName}}</text>
		</view>
		<view class="store-name" v-else>{{title}}</view>
		<!-- <view class="search-box" v-if="showSearch" @click="$emit('search-click')">
			<input 
				class="search-input" 
				type="text" 
				:placeholder="searchPlaceholder" 
				placeholder-class="placeholder-style"
				confirm-type="search"
				v-model="searchKeyword"
				@confirm="$emit('search-confirm', searchKeyword)"
			/>
			<image src="/static/icons/search.png" mode="aspectFit" class="search-icon" @click.stop="$emit('search-confirm', searchKeyword)"></image>
		</view> -->
		<!-- <view class="header-icons" v-if="showMenu">
			<image src="/static/icons/menu.png" mode="aspectFit" class="menu-icon" @click="$emit('menu-click')"></image>
		</view> -->
	</view>
</template>

<script>
export default {
	props: {
		logoUrl: {
			type: String,
			default: ''
		},
		logoName: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: '金酱酒业'
		},
		showSearch: {
			type: Boolean,
			default: true
		},
		showMenu: {
			type: Boolean,
			default: true
		},
		searchPlaceholder: {
			type: String,
			default: '输入关键词搜索'
		}
	},
	data() {
		return {
			searchKeyword: '',
			localLogoUrl: '',
			localLogoName: ''
		}
	},
	created() {
		// 如果没有传入logo信息，尝试从缓存获取
		if (!this.logoUrl) {
			this.getLogoFromCache()
		}
	},
	methods: {
		getLogoFromCache() {
			// 从本地缓存获取logo信息
			const cachedLogo = uni.getStorageSync('store_logo_info')
			if (cachedLogo) {
				const logoInfo = JSON.parse(cachedLogo)
				this.localLogoUrl = logoInfo.logoUrl
				this.localLogoName = logoInfo.logoName
			} else {
				// 如果缓存中没有，则从接口获取
				this.getLogoFromApi()
			}
		},
		getLogoFromApi() {
			this.$get('/wx_mini_app/banners/by-type/logo', {}, res => {
				if (res.items && res.items.length > 0) {
					const logoInfo = {
						logoUrl: res.items[0].upload_image || '',
						logoName: res.items[0].name || ''
					}
					// 保存到本地缓存
					uni.setStorageSync('store_logo_info', JSON.stringify(logoInfo))
					this.localLogoUrl = logoInfo.logoUrl
					this.localLogoName = logoInfo.logoName
				}
			})
		}
	},
	computed: {
		// 计算属性，优先使用props传入的值，其次使用本地缓存的值
		displayLogoUrl() {
			return this.logoUrl || this.localLogoUrl
		},
		displayLogoName() {
			return this.logoName || this.localLogoName
		}
	}
}
</script>

<style scoped>
.status-bar-height {
	height: var(--status-bar-height);
	width: 100%;
	background-color: #fff;
}
.custom-header {
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
</style> 