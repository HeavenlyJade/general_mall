<template>
	<view class="user">
		<!-- 头部 -->
		<view class="user-header">
			<view class="avatar-container">
				<image class="avatar" mode="aspectFill"
					:src="storeUser.wxHeadImg || userInfo.avatar || userInfo.wxHeadImg || getConst().defaultAvatar">
				</image>
			</view>
			<view class="user-info">
				<view class="nickname">{{storeUser.wxNickName || userInfo.nickname || userInfo.wxNickName || '未登录'}}</view>
				<view class="user-id" v-if="userInfo.user_id">ID: {{userInfo.user_id}}</view>
			</view>
			
			<!-- 未授权用户显示按钮 -->
			<view v-if="!hasWxAuth" class="auth-buttons">
				<button class="auth-btn" @click="getUserProfile">授权微信登录</button>
			</view>
			
			<!-- 右上角操作按钮 -->
			<view class="header-actions">
				<view class="action-btn">•••</view>
				<view class="action-btn">◯</view>
			</view>
		</view>
		
		<!-- 统计数据 -->
		<view class="stats-container">
			<view class="stat-item">
				<view class="stat-value">0</view>
				<view class="stat-label">酒豆</view>
			</view>
			<view class="stat-item">
				<view class="stat-value">0</view>
				<view class="stat-label">收益</view>
			</view>
			<view class="stat-item">
				<view class="stat-value">0</view>
				<view class="stat-label">优惠券</view>
			</view>
		</view>
		
		<!-- 可用收益卡片 -->
		<view class="income-card">
			<view class="income-title">可用收益</view>
			<view class="income-content">
				<view class="income-value">0</view>
				<button class="withdraw-btn">去提现</button>
			</view>
		</view>
		
		<!-- 我的订单 -->
		<view class="section-card">
			<view class="section-header">
				<text class="section-title">我的订单</text>
				<view class="section-more" @click="$navigateTo('/pages/order/order')">
					全部 <text class="arrow-right">›</text>
				</view>
			</view>
			<view class="order-icons">
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order?stat=1')">
					<view class="icon-container waiting-payment">
						<text class="icon">󰡷</text>
					</view>
					<text class="icon-text">待付款</text>
				</view>
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order?stat=2')">
					<view class="icon-container waiting-delivery">
						<text class="icon">󰡸</text>
					</view>
					<text class="icon-text">待发货</text>
				</view>
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order?stat=3')">
					<view class="icon-container completed">
						<text class="icon">󰡹</text>
					</view>
					<text class="icon-text">已完成</text>
				</view>
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order-refund')">
					<view class="icon-container refund">
						<text class="icon">󰡺</text>
					</view>
					<text class="icon-text">退换货</text>
				</view>
			</view>
		</view>
		
		<!-- 我的工具 -->
		<view class="section-card">
			<view class="section-header">
				<text class="section-title">我的工具</text>
			</view>
			<view class="tools-grid">
				<view class="tool-item" @click="$navigateTo('/pages/index/guider')">
					<view class="tool-icon store-icon">
						<text class="tool-icon-text">󰀵</text>
					</view>
					<text class="tool-text">全国门店</text>
				</view>
				<view class="tool-item" @click="$navigateTo('/pages/user/collect')">
					<view class="tool-icon coupon-icon">
						<text class="tool-icon-text">󰀶</text>
					</view>
					<text class="tool-text">优惠券</text>
				</view>
				<view class="tool-item" @click="$navigateTo('/pages/address/address')">
					<view class="tool-icon address-icon">
						<text class="tool-icon-text">󰀷</text>
					</view>
					<text class="tool-text">地址管理</text>
				</view>
				<view class="tool-item" @click="$navigateTo('/pages/user/html?key=cfg_com_help')">
					<view class="tool-icon card-icon">
						<text class="tool-icon-text">󰀸</text>
					</view>
					<text class="tool-text">充值绑卡</text>
				</view>
				
				<view class="tool-item">
					<view class="tool-icon gift-icon">
						<text class="tool-icon-text">󰀹</text>
					</view>
					<text class="tool-text">我的奖品</text>
				</view>
				<view class="tool-item">
					<view class="tool-icon withdraw-icon">
						<text class="tool-icon-text">󰀺</text>
					</view>
					<text class="tool-text">提现绑卡</text>
				</view>
				<view class="tool-item">
					<view class="tool-icon performance-icon">
						<text class="tool-icon-text">󰀻</text>
					</view>
					<text class="tool-text">我的业绩</text>
				</view>
				<view class="tool-item">
					<view class="tool-icon activity-icon">
						<text class="tool-icon-text">󰀼</text>
					</view>
					<text class="tool-text">我的活动</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
export default {
	computed: {
		storeUser() {
			return this.$store.state.user;
		},
		// 添加计算属性判断是否已授权微信
		hasWxAuth() {
			return !!(this.storeUser.wxHeadImg || this.userInfo.wxHeadImg);
		}
	},

	data() {
		return {
			userInfo: {
				//headImg: '/static/img/user/avatar.jpg',
				headImg: '/static/img/user/default-head.png',
				nickName: 'noname'
			},
			orderStatusList: [
				{ name: '待付款', icon: 'iconfont icon31daifukuan', status: 10, "uri": "/pages/order/order?stat=1" },
				{ name: '待发货', icon: 'iconfont icon31daifahuo', status: 30, "uri": "/pages/order/order?stat=2" },
				{ name: '待收货', icon: 'iconfont icon31daishouhuo', status: 40, "uri": "/pages/order/order?stat=3" },
				{ name: '待评价', icon: 'iconfont icon31daipingjia', status: 50, "uri": "/pages/order/order?stat=4" },
				{ name: '全部', icon: 'iconfont icon31yiguanzhudianpu', status: 55, "uri": "/pages/order/order" }
			],
			currentIndex: 0,
		};
	},
	methods: {
		// 添加到methods中
		getUserProfile() {
			// 直接调用getUserProfile，必须在用户点击事件中直接调用
			wx.getUserInfo({
				provider: 'weixin', // 指定微信登录
				desc: '用于完善用戶资料', // 声明获取用户个人信息后的用途
				success: (res) => {
					// 获取用户信息成功后，再进行登录操作
					console.log('用户信息:', res);
					this.loginWithUserInfo(res.userInfo);
				},
				fail: (err) => {
					console.error('获取用户信息失败:', err);
					this.$toast("获取用户信息失败: " + (err.errMsg || JSON.stringify(err)));
				}
			});
		},

		// 新增方法，在获取用户信息后调用登录
		loginWithUserInfo(userInfo) {
			// 先获取登录凭证
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					if (loginRes.code) {
						// 准备API请求数据
						console.log('登录凭证:', loginRes);
						let requestData = {
							code: loginRes.code,
							avatarUrl: userInfo.avatarUrl,
							nickName: userInfo.nickName
						};

						console.log('准备发送的数据:', requestData);
					
						// 发送请求到后端API
						this.$post("/wx_mini_app/wx_auth/wechat_login", requestData, result => {
							console.log('用戶登陸數據成功:', result);
							
							// 检查返回的数据结构
							if (result.code === 200) {
								// 更新本地用户信息
								let userData = result.user_info ;
								userData.wxHeadImg = userData.avatar || userInfo.avatarUrl;
								userData.wxNickName = userData.nickname || userInfo.nickName;
								
								// 保存token
								this.$dataLocal("token", result.access_token);
								
								// 保存用户信息
								this.setUser(userData);
								this.$store.dispatch("user/update", userData);
								this.userInfo = userData;
								
								this.$toast("登录成功");
							} else {
								console.error('返回数据格式不正确:', result);
								this.$toast("登录失败");
							}
						}, err => {
							console.error('更新用户信息失败:', err);
						});
					}
				},
				fail: (err) => {
					console.error('登录失败:', err);
					this.$toast("登录失败: " + (err.errMsg || JSON.stringify(err)));
				}
			});
		},
		tuiguang() {
			var user = this.getUser() || {};
			var _url = "./external/guider.html?guider=" + user.id;
			if (this.isWeixin()) {
				location.href = _url
			} else {
				this.$navigateTo(`/pages/user/zhiwen-share`);
			}
		},
		tologin() {
			// 如果没有微信授权，提示用户先授权
			if (!this.hasWxAuth) {
				return;
			}

			if (this.$isNull(this.userInfo.id) || this.$isNull(this.userInfo.mobile)) {
				this.$dataLocal("pre_reg_page", "/pages/user/user");
				this.$navigateTo("/pages/login/register");
			} else {
				this.$navigateTo("/pages/user/set")
			}
		},
		getuser() {
			// 获取用户信息，但不自动登录
			let user = this.getUser() || { headImg: '/static/img/user/default-head.png', nickName: 'noname' };
			this.userInfo = user;
		},
		// 清除登录状态
		clearLoginStatus() {
			if (!this.hasWxAuth) {
				// 如果没有微信授权，则不自动登录
				let user = this.getUser() || {};
				if (!user.wxHeadImg && !user.wxNickName) {
					// 只在开发者工具中重置授权信息，实际环境中会由按钮触发授权
					const newUser = {
						...user,
						wxHeadImg: '',
						wxNickName: '',
						wxMpOpenId: ''
					};
					this.setUser(newUser);
					this.$store.dispatch("user/update", newUser);
				}
			}
		}
	},
	onLoad() {
		this.clearLoginStatus();
	},
	onShow() {
		this.getuser();
		this.clearLoginStatus();
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
	color: #333;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.user {
	position: relative;
	padding-bottom: 120rpx; /* 留出底部导航栏的空间 */
}

/* 头部样式 */
.user-header {
	position: relative;
	padding: 40rpx 30rpx;
	background: linear-gradient(to bottom, #f2f2f2, #f8f8f8);
	display: flex;
	align-items: center;
}

.header-actions {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	display: flex;
	gap: 20rpx;
}

.action-btn {
	font-size: 36rpx;
	color: #333;
}

.avatar-container {
	margin-right: 20rpx;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	border: 2rpx solid #e0e0e0;
	background-color: #f5f5f5;
}

.user-info {
	flex: 1;
}

.nickname {
	font-size: 34rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.user-id {
	font-size: 24rpx;
	color: #999;
}

.auth-buttons {
	margin-top: 10rpx;
}

.auth-btn {
	background-color: #4a4a4a;
	color: #fff;
	font-size: 24rpx;
	padding: 8rpx 24rpx;
	border-radius: 30rpx;
	border: none;
	line-height: 1.5;
	height: auto;
}

/* 统计数据样式 */
.stats-container {
	display: flex;
	justify-content: space-around;
	padding: 30rpx 0;
	background-color: #fff;
	margin-top: 4rpx;
}

.stat-item {
	text-align: center;
	flex: 1;
	position: relative;
}

.stat-item:not(:last-child):after {
	content: '';
	position: absolute;
	right: 0;
	top: 20%;
	height: 60%;
	width: 1px;
	background-color: #eee;
}

.stat-value {
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
	color: #333;
}

.stat-label {
	font-size: 26rpx;
	color: #666;
}

/* 收益卡片样式 */
.income-card {
	margin: 20rpx;
	background-color: #333;
	border-radius: 12rpx;
	padding: 30rpx;
	color: #fff;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	position: relative;
	overflow: hidden;
}

.income-card:before {
	content: '';
	position: absolute;
	bottom: -100rpx;
	right: -100rpx;
	width: 300rpx;
	height: 300rpx;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 50%;
}

.income-title {
	font-size: 30rpx;
	margin-bottom: 30rpx;
	font-weight: 500;
}

.income-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.income-value {
	font-size: 48rpx;
	font-weight: bold;
}

.withdraw-btn {
	background-color: #f7e8c6;
	color: #333;
	font-size: 26rpx;
	padding: 10rpx 30rpx;
	border-radius: 30rpx;
	border: none;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

/* 卡片通用样式 */
.section-card {
	margin: 20rpx;
	background-color: #fff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 26rpx 30rpx;
	border-bottom: 1px solid #f0f0f0;
}

.section-title {
	font-size: 30rpx;
	font-weight: 500;
	color: #333;
}

.section-more {
	font-size: 24rpx;
	color: #999;
	display: flex;
	align-items: center;
}

.arrow-right {
	font-size: 28rpx;
	margin-left: 4rpx;
}

/* 订单图标样式 */
.order-icons {
	display: flex;
	padding: 30rpx 0;
}

.order-icon-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.icon-container {
	width: 70rpx;
	height: 70rpx;
	margin-bottom: 10rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 16rpx;
	background: #f9f9f9;
}

.waiting-payment {
	color: #ff9800;
}

.waiting-delivery {
	color: #4caf50;
}

.completed {
	color: #2196f3;
}

.refund {
	color: #f44336;
}

.icon {
	font-size: 36rpx;
}

.icon-text {
	font-size: 24rpx;
	color: #666;
	margin-top: 6rpx;
}

/* 工具网格样式 */
.tools-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 15rpx 0;
}

.tool-item {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 0;
}

.tool-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-bottom: 10rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #f5f5f5;
	color: #333;
}

.store-icon { color: #FF9800; }
.coupon-icon { color: #E91E63; }
.address-icon { color: #FF5722; }
.card-icon { color: #4CAF50; }
.gift-icon { color: #9C27B0; }
.withdraw-icon { color: #F44336; }
.performance-icon { color: #2196F3; }
.activity-icon { color: #3F51B5; }

.tool-icon-text {
	font-size: 36rpx;
}

.tool-text {
	font-size: 24rpx;
	color: #666;
}

/* 底部导航栏 */
.bottom-navbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 110rpx;
	background: #fff;
	display: flex;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
}

.navbar-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10rpx 0;
}

.navbar-icon {
	font-size: 24rpx;
	color: #888;
	margin-bottom: 4rpx;
}

.navbar-icon-text {
	font-size: 40rpx;
}

.navbar-text {
	font-size: 24rpx;
	color: #888;
}

.navbar-item.active .navbar-icon,
.navbar-item.active .navbar-text {
	color: #E91E63;
}
</style>
