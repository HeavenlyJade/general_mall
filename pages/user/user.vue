<template>
	<view class="user">
		<!-- 头部 -->
		<view class="user-header" :style="{'background-image': headerBgImage ? `url(${headerBgImage})` : ''}">
			<view class="avatar-container" @click="userInfo.id && $navigateTo('/pages/user/set')">
				<image class="avatar" mode="aspectFill"
					:src="userInfo.avatar  || getConst().defaultAvatar"
					:class="{'avatar-logged': !!userInfo.id}">
				</image>
			</view>
			<view class="user-info">
				<view class="nickname">{{storeUser.wxNickName || userInfo.nickname || userInfo.wxNickName || '未登录'}}</view>
				<view class="user-id" v-if="userInfo.id">ID: {{userInfo.id}}</view>
			</view>
			
			<!-- 未授权用户显示按钮  v-if="!hasWxAuth" --> 
			<view  v-if="!hasWxAuth"  class="auth-buttons">
				<button class="auth-btn" @click="getUserProfile">授权微信登录</button>
			</view>
			
		
			<view v-if="userInfo.id" class="logout-container">
				<button class="logout-btn" @click="logout">退出登录</button>
			</view>
	
		</view>
		
		<!-- 统计数据 -->
		<view class="stats-container">
			<view class="stat-item">
				<view class="stat-value">{{userInfo.points || 0}}</view>
				<view class="stat-label">积分</view>
			</view>
			<view class="stat-item">
				<view class="stat-value">{{userInfo.member_level || '无会员'}}</view>
				<view class="stat-label">会员等级</view>
			</view>
			<view class="stat-item">
				<view class="stat-value">{{userInfo.balance || 0}}</view>
				<view class="stat-label">余额</view>
			</view>
		</view>
		
				<!-- 可用收益卡片 -->
		<view class="income-card">
			<view class="income-title">可用收益</view>
			<view class="income-content">
				<view class="income-value">{{availableIncome}}</view>
				<button class="withdraw-btn" @click="navigateToWithdraw">去提现</button>
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
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order?status=待支付')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/pendi_pay.png" class="tool-icon-image"></image>
					</view>
					<text class="icon-text">待付款</text>
				</view>
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order?status=待发货')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/pending_ship.png" class="tool-icon-image"></image>
					</view>
					<text class="icon-text">待发货</text>
				</view>
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order?status=已发货')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/completed.png" class="tool-icon-image"></image>
					</view>
					<text class="icon-text">已发货</text>
				</view>
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order?status=已完成')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/completed.png" class="tool-icon-image"></image>
					</view>
					<text class="icon-text">已完成</text>
				</view>
				<view class="order-icon-item" @click="$navigateTo('/pages/order/order-refund?status=退款中')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/refund_after_sales.png" class="tool-icon-image"></image>
					</view>
					<text class="icon-text">退换货</text>
				</view>
			</view>
		</view>
		<view class="section-card">
			<view class="section-header">
				<text class="section-title">我的工具</text>
			</view>
			<view class="tools-grid">
				<view class="tool-item" @click="$navigateTo('/pages/store/store')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/store.png" class="tool-icon-image"></image>
					</view>
					<text class="tool-text">全国门店</text>
				</view>
				<!-- <view class="tool-item" @click="$navigateTo('/pages/user/collect')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/coupon.png" class="tool-icon-image"></image>
					</view>
					<text class="tool-text">优惠券</text>
				</view> -->
				<view class="tool-item" @click="$navigateTo('/pages/address/address')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/address.png" class="tool-icon-image"></image>
					</view>
					<text class="tool-text">地址管理</text>
				</view>
	
				
				<view class="tool-item" @click="$navigateTo('/pages/card/index')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/business_card.png" class="tool-icon-image"></image>
					</view>
					<text class="tool-text">名片分享</text>
				</view>
		
				<view class="tool-item" @click="$navigateTo('/pages/distribution/index')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/distribution.png" class="tool-icon-image"></image>
					</view>
					<text class="tool-text">分销中心</text>
				</view>
				<view class="tool-item" @click="$navigateTo('/pages/user/set')">
					<view class="tool-icon store-icon">
						<image src="/static/img/icons/personal_Information.png" class="tool-icon-image"></image>
					</view>
					<text class="tool-text">个人信息</text>
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
		// 改进授权判断逻辑
		hasWxAuth() {
			return !!(this.userInfo.id || this.userInfo.wxHeadImg);
		}
	},

	data() {
		return {
			userInfo: {
				//headImg: '/static/img/user/avatar.jpg',
				headImg: '/static/img/user/default-head.png',
				nickName: 'noname',
				avatar: '/static/img/user/default-head.png',
				wxHeadImg: ''
			},
			headerBgImage: '',
			orderStatusList: [
				{ name: '待付款', icon: 'iconfont icon31daifukuan', status: 10, "uri": "/pages/order/order?stat=1" },
				{ name: '待发货', icon: 'iconfont icon31daifahuo', status: 30, "uri": "/pages/order/order?stat=2" },
				{ name: '已发货', icon: 'iconfont icon31daishouhuo', status: 40, "uri": "/pages/order/order?stat=3" },
				{ name: '待评价', icon: 'iconfont icon31daipingjia', status: 50, "uri": "/pages/order/order?stat=4" },
				{ name: '全部', icon: 'iconfont icon31yiguanzhudianpu', status: 55, "uri": "/pages/order/order" }
			],
			currentIndex: 0,
			availableIncome: 0,
			
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
						
						// 添加分享者信息到请求中
						const share_user_id = uni.getStorageSync("share_user_id")
						const share_openid = uni.getStorageSync("share_openid")
						if (share_user_id) {
							requestData.share_user_id = share_user_id
						}
						if (share_openid) {
							requestData.share_openid = share_openid
						}
						
						// 打印完整的请求参数，便于调试
						console.log('登录请求参数，包含分享信息:', requestData);
						
						// 发送请求到后端API
						this.$post("/wx_mini_app/wx_auth/wechat_login", requestData, result => {
			
							
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
								
								// 登录成功后获取分销数据
								this.fetchDistributionWithdrawInfo();
								if(share_user_id){
									uni.removeStorage("share_user_id")
								}
								if(share_openid){
									uni.removeStorage("share_openid")
								}
							
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
		},
		getHeaderBgImage() {
			this.$get('/wx_mini_app/banners/by-type/user_bg', {}, res => {
				if (res && res.items && res.items.length > 0) {
					this.headerBgImage = res.items[0].upload_image;
				}
			}, err => {
				console.error('获取背景图片失败:', err);
			});
		},
		fetchDistributionWithdrawInfo() {
			// 先判断用户是否已登录，没有登录则不请求
			if (!this.userInfo.id) {
				console.log('用户未登录，不获取分销数据');
				return;
			}
			
			// 获取分销数据，主要关注可提现金额
			this.$get("/wx_mini_app/wx/distribution_wx", {}, response => {
				
				if (response && response.code === 200) {
					const responseData = response.data || {};
					
					// 如果有收入数据，更新可提现金额显示
					if (responseData && responseData.income && responseData.income.pending_money) {
						// 更新页面上的收益显示
						this.updateWithdrawAmount(responseData.income.pending_money);
					}
				}
			}, error => {
				console.error('获取分销数据失败:', error);
			});
		},
		updateWithdrawAmount(amount) {
			// 更新页面上的可用收益显示 - 使用数据绑定而不是DOM操作
			this.availableIncome = amount || 0;
		},
		navigateTo(url) {
			this.$navigateTo(url);
		},
		navigateToWithdraw() {
			// 跳转到分销中心的提现页面
			this.$navigateTo('/pages/distribution/index');
		},
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除用户数据和token
						this.$dataLocal("token", "");
						
						// 创建空用户数据，清空所有用户相关信息
						const emptyUser = {
							headImg: '/static/img/user/default-head.png',
							nickName: 'noname',
							avatar: '/static/img/user/default-head.png',
							wxHeadImg: '',
							wxNickName: '',
							wxMpOpenId: '',
							id: 0,
							points: 0,
							member_level: '',
							balance: 0,
							mobile: '',
							nickname: ''
						};
						
						// 更新用户数据
						this.setUser(emptyUser);
						this.$store.dispatch("user/update", emptyUser);
						this.userInfo = emptyUser;
						
						// 清空可用收益
						this.availableIncome = 0;
						
						// 清除所有本地存储的用户相关数据
						uni.removeStorage({
							key: "share_user_id",
							success: () => console.log('清除share_user_id成功')
						});
						uni.removeStorage({
							key: "share_openid",
							success: () => console.log('清除share_openid成功')
						});
						uni.removeStorage({
							key: "cardUid",
							success: () => console.log('清除cardUid成功')
						});
						uni.removeStorage({
							key: "referrer",
							success: () => console.log('清除referrer成功')
						});
						
						// 清除其他可能的用户数据缓存
						const userDataKeys = ['userInfo', 'user_id', 'openid', 'unionid'];
						userDataKeys.forEach(key => {
							uni.removeStorage({
								key: key,
								success: () => console.log(`清除${key}成功`)
							});
						});
						
						this.$toast("已退出登录");
						
						// 刷新页面数据
						this.getHeaderBgImage();
					}
				}
			});
		},
	},
	onLoad(options) {
		// 获取分享来源信息
		
		this.getuser();
		this.clearLoginStatus();
	},
	onShow() {
	
		
		// 获取用户信息和其他数据
		this.getuser();
		this.getHeaderBgImage();
		this.clearLoginStatus();
		this.fetchDistributionWithdrawInfo();
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
}

/* 头部样式 */
.user-header {
	position: relative;
	padding: 40px 20px 30px;
	background-size: cover;
	background-position: center;
	display: flex;
	align-items: center;
	margin-bottom: 0;
	height: 220px;
	width: 100%;
	box-sizing: border-box;
	border-bottom-left-radius: 30rpx;
	border-bottom-right-radius: 30rpx;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.avatar-container {
	margin-right: 30rpx;
	position: relative;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.8);
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.user-info {
	flex: 1;
}

.nickname {
	font-size: 36rpx;
	color: #fff;
	font-weight: bold;
	margin-bottom: 10rpx;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-id {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
	background: rgba(0, 0, 0, 0.2);
	display: inline-block;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.auth-buttons {
	margin-top: 20rpx;
}

.auth-btn {
	background: linear-gradient(to right, #ff7043, #ff5722);
	color: #fff;
	font-size: 28rpx;
	padding: 12rpx 32rpx;
	border-radius: 40rpx;
	border: none;
	line-height: 1.5;
	height: auto;
	box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
	transition: all 0.3s ease;
}

.auth-btn:active {
	transform: scale(0.95);
	box-shadow: 0 2px 5px rgba(255, 87, 34, 0.3);
}

/* 统计数据样式 */
.stats-container {
	display: flex;
	justify-content: space-around;
	padding: 20rpx 0;
	background-color: #fff;
	border-bottom: 1px solid #eee;
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
  position: relative;
  overflow: hidden;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.05)" d="M0,224L60,197.3C120,171,240,117,360,112C480,107,600,149,720,186.7C840,224,960,256,1080,261.3C1200,267,1320,245,1380,234.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 100%;
}
.income-title {
  font-size: 30rpx;
  margin-bottom: 30rpx;
  font-weight: normal;
}
.income-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.income-value {
  font-size: 48rpx;
  font-weight: bold;
  flex: 1;
}


.withdraw-btn {
  background-color: #f7e8c6;
  color: #333;
  font-size: 26rpx;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  border: none;
  margin-left: auto;
}

.income-title, .income-content {
	position: relative;
	z-index: 2;
}

/* 卡片通用样式 */
.section-card {
	margin: 20rpx 0 0 0;
	background-color: #fff;
	border-radius: 0;
	box-shadow: none;
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
	border-radius: 0;
	background: transparent;
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
	border-radius: 0;
	margin-bottom: 10rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: transparent;
	color: #333;
}

.tool-icon-image {
	width: 40rpx;
	height: 40rpx;
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

.avatar-logged {
	cursor: pointer;
	position: relative;
}

.avatar-logged:after {
	content: '';
	position: absolute;
	right: 0;
	bottom: 0;
	width: 30rpx;
	height: 30rpx;
	background-color: #4CAF50;
	border-radius: 50%;
	border: 3rpx solid #fff;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 退出登录按钮样式 */
.logout-container {
	margin-top: 20rpx;
}

.logout-btn {
	background: rgba(255, 255, 255, 0.25);
	color: #fff;
	font-size: 24rpx;
	padding: 8rpx 24rpx;
	border-radius: 30rpx;
	border: 1px solid rgba(255, 255, 255, 0.5);
	line-height: 1.5;
	height: auto;
}

.logout-btn:active {
	transform: scale(0.95);
	background: rgba(255, 255, 255, 0.35);
}
</style>
