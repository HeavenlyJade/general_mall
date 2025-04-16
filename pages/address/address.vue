<template>
	<view class="content b-t">
		<text
			style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #999;background: #f8f8f8;font-size: 24upx;">收货地址请认真填写与核对,我们将按照您所填写的地址快递产品,如因地址填写错误导致您无法收到产品,责任由您承担。</text>

		<view class="address-container">
			<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
				<view class="delete-btn" @click.stop="confirmDelete(item)">×</view>
				<view class="wrapper">
					<view class="address-box">
						<view class="user-info">
							<text class="receiver_name">{{ item.receiver_name || '' }}</text>
							<text class="receiver_phone">{{ item.receiver_phone || '' }}</text>
						</view>
						<text class="address">{{ item.province || '' }} {{ item.city || '' }} {{ item.district || '' }}
							{{ item.detail_address || '' }}</text>
						<text class="address-store"
							v-if="item.detail_address && item.detail_address.includes('号店')">({{ item.detail_address.substring(item.detail_address.indexOf('号') - 2) }})</text>
					</view>
				</view>
				<view class="action-box">
					<view class="default-selector" @click.stop="toggleDefault(item)">
						<view class="default-circle" :class="{ 'is-default': item.is_default == 1 }">
							<view class="default-check" v-if="item.is_default == 1"></view>
						</view>
						<text class="default-text" :class="{ 'is-default': item.is_default == 1 }">默认</text>
					</view>
					<view class="btn-box">
						<text class="btn copy-btn" @click.stop="copyAddress(item)">复制</text>
						<text class="btn edit-btn" @click.stop="editAddress(item)">修改</text>
					</view>
				</view>
			</view>
		</view>

		<button class="add-btn" @click="addAddress()">
			<text class="add-icon">+</text>
			添加收货地址
		</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			source: 0,
			addressList: [],
			isSettingDefault: false // 是否正在设置默认地址
		}
	},
	onLoad(option) {
		this.source = option.source;

	},
	onShow() {
		this.loadAddress();
	},
	methods: {
		loadAddress() {
			let _this = this;
			// 显示加载提示
			uni.showLoading({
				title: '加载中'
			});

			// 获取用户ID
			const user = this.getUser() || {};
			if (!user.id) {
				uni.hideLoading();
				this.$toast('请先登录');
				return;
			}

			// 调用地址列表接口
			this.$get(`/wx_mini_app/wx_auth/address/${user.id}`, {}, res => {
				uni.hideLoading();
				if (res && res.items) {
					console.log("res.items", res.items)
					this.addressList = res.items;
				} else {
					this.addressList = [];
				}
			}, err => {
				uni.hideLoading();
				console.error('获取地址列表失败:', err);
				this.$toast('获取地址列表失败');
				this.addressList = [];
			});
		},

		editAddress(item) {
			uni.navigateTo({
				url: `/pages/address/address-manage?id=${item.id}`
			})
		},

		//选择地址
		checkAddress(item) {
			if (this.source == 1) {
				// 如果从其他页面进入，选择地址后返回
				uni.navigateBack({
					success: () => {
						// 返回上一页并传递选中的地址
						const pages = getCurrentPages();
						const prevPage = pages[pages.length - 2];
						if (prevPage && prevPage.$vm) {
							prevPage.$vm.selectedAddress = item;
						}
					}
				})
			}
		},

		// 切换默认地址
		toggleDefault(item) {
			// 如果已经是默认地址或者正在设置中，不做操作
			if (item.is_default == 1 || this.isSettingDefault) return;

			uni.showModal({
				title: '设置默认地址',
				content: '确定要将此地址设为默认地址吗？',
				success: (res) => {
					if (res.confirm) {
						this.setDefault(item);
					}
				}
			});
		},

		setDefault(item) {
			// 防止重复点击
			if (this.isSettingDefault) return;
			this.isSettingDefault = true;

			// 显示加载中
			uni.showLoading({
				title: '设置中...'
			});

			// 更新本地选中状态
			this.addressList.forEach(address => {
				address.is_default = address.id === item.id ? 1 : 0;
			});
			// 更新到服务器
			this.$post(`/wx_mini_app/wx_auth/address/set_default`, {
				address_id: item.id,
			}, res => {
				console.log("res", res)
				if (res.message) {
					uni.hideLoading();
					this.isSettingDefault = false;
					console.error('设置默认地址失败:', res.message);
					this.$toast('设置默认地址失败');
					// 设置失败，恢复之前的状态
					this.loadAddress();

				}
				else {
					uni.hideLoading();
					this.isSettingDefault = false;
					this.$toast('设置默认地址成功');
				}

			}, err => {
				uni.hideLoading();
				this.isSettingDefault = false;
				console.error('设置默认地址失败:', err);
				this.$toast('设置默认地址失败');
				// 设置失败，恢复之前的状态
				this.loadAddress();
			});
		},

		addAddress() {
			uni.navigateTo({
				url: `/pages/address/address-manage`
			})
		},

		// 复制地址
		copyAddress(item) {
			const fullAddress = `${item.receiver_name || ''}, ${item.receiver_phone || ''}, ${item.province || ''} ${item.city || ''} ${item.district || ''} ${item.detail_address || ''}`;
			uni.setClipboardData({
				data: fullAddress,
				success: () => {
					this.$toast('地址已复制到剪贴板');
				}
			});
		},

		//添加或修改成功之后回调
		refreshList(data, type) {
			this.loadAddress(); // 重新加载地址列表
		},

		// 确认删除地址
		confirmDelete(item) {
			uni.showModal({
				title: '删除地址',
				content: '确定要删除此地址吗？',
				success: (res) => {
					if (res.confirm) {
						this.deleteAddress(item);
					}
				}
			});
		},
		
		// 删除地址
		deleteAddress(item) {
			// 显示加载中
			uni.showLoading({
				title: '删除中...'
			});
			
			// 获取用户ID
			const user = this.getUser() || {};
			if (!user.id) {
				uni.hideLoading();
				this.$toast('请先登录');
				return;
			}
			
			// 调用删除地址接口
			this.$delete(`/wx_mini_app/wx_auth/address/${user.id}`, {
				address_id: item.id
			}, res => {
				uni.hideLoading();
				if (res && res.code === 200) {
					this.$toast('删除地址成功');
					// 删除成功后刷新列表
					this.loadAddress();
				} else {
					console.error('删除地址失败:', res.message);
					this.$toast('删除地址失败');
				}
			}, err => {
				uni.hideLoading();
				console.error('删除地址失败:', err);
				this.$toast('删除地址失败');
			});
		}
	}
}
</script>

<style lang='scss'>
page {
	padding-bottom: 120upx;
	background-color: #f8f8f8;
}

.content {
	position: relative;
}

.address-container {
	padding: 0 20upx;
}

.list {
	display: flex;
	flex-direction: column;
	padding: 30upx;
	background: #fff;
	position: relative;
	margin: 20upx 0;
	border-radius: 12upx;
	box-shadow: 0 2upx 6upx rgba(0, 0, 0, 0.03);
	
	.delete-btn {
		position: absolute;
		top: 16upx;
		right: 16upx;
		width: 40upx;
		height: 40upx;
		line-height: 36upx;
		text-align: center;
		font-size: 36upx;
		color: #999;
		z-index: 10;
		border-radius: 50%;
		background-color: #f5f5f5;
		
		&:active {
			background-color: #eee;
		}
	}
}

.wrapper {
	display: flex;
	flex-direction: column;
	flex: 1;
}

.address-box {
	display: flex;
	flex-direction: column;

	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 16upx;

		.receiver_name {
			font-size: 30upx;
			font-weight: bold;
			color: #333;
			margin-right: 20upx;
		}

		.receiver_phone {
			font-size: 30upx;
			color: #333;
		}
	}

	.address {
		font-size: 28upx;
		color: #666;
		line-height: 1.4;
	}

	.address-store {
		font-size: 28upx;
		color: #666;
		line-height: 1.4;
		margin-top: 4upx;
	}
}

.action-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 24upx;
	padding-top: 20upx;
	border-top: 1px solid #f1f1f1;

	.default-selector {
		display: flex;
		align-items: center;
		padding: 4upx 8upx;
		border-radius: 4upx;

		&:active {
			background-color: #f8f8f8;
		}

		.default-circle {
			width: 36upx;
			height: 36upx;
			border-radius: 50%;
			border: 1px solid #ddd;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 8upx;
			position: relative;
			background-color: #fff;
			transition: all 0.2s;

			&.is-default {
				border-color: #E84339;
				background-color: #fff;
			}

			.default-check {
				width: 24upx;
				height: 24upx;
				border-radius: 50%;
				background-color: #E84339;
				transition: transform 0.2s;
				transform: scale(0);

				&:active {
					transform: scale(0.8);
				}
			}

			&.is-default .default-check {
				transform: scale(1);
			}
		}

		.default-text {
			color: #666;
			font-size: 26upx;
			transition: color 0.2s;

			&.is-default {
				color: #E84339;
			}
		}
	}

	.btn-box {
		display: flex;
		align-items: center;

		.btn {
			font-size: 26upx;
			padding: 8upx 24upx;
			border-radius: 4upx;
			margin-left: 16upx;
			transition: all 0.2s;

			&:active {
				opacity: 0.8;
				transform: translateY(2upx);
			}
		}

		.copy-btn {
			color: #333;
			border: 1px solid #eee;
			background-color: #fff;
		}

		.edit-btn {
			color: #333;
			border: 1px solid #eee;
			background-color: #fff;
		}
	}
}

.add-btn {
	position: fixed;
	left: 30upx;
	right: 30upx;
	bottom: 16upx;
	z-index: 95;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690upx;
	height: 80upx;
	font-size: 32upx;
	color: #fff;
	background-color: #E84339;
	border-radius: 10upx;
	box-shadow: 1px 2px 5px rgba(232, 67, 57, 0.4);
	transition: all 0.2s;

	&:active {
		transform: translateY(2upx);
		opacity: 0.9;
	}

	.add-icon {
		font-size: 30upx;
		margin-right: 8upx;
	}
}
</style>
