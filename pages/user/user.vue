<template>
	<view class="user">
		<!-- 头部 -->
		<view class="user-wrap" @click="tologin()">
			<view class="setting iconfont icon31shezhi"></view>
			<view class="info">

				<image class="avatar" mode="aspectFill"
					:src="storeUser.wxHeadImg || userInfo.headImg || userInfo.wxHeadImg || getConst().defaultAvatar">
				</image>

				<!-- 未授权用户显示按钮 -->
				<view v-if="!hasWxAuth" class="auth-buttons">
					<button class="auth-btn" @click="getUserProfile" v-if="!hasWxAuth">
						点击授权微信登录
					</button>
				</view>

				<view v-else class="nickname">{{ storeUser.wxNickName || userInfo.wxNickName || userInfo.nickName }}
					<text v-if="userInfo.level == 100" style="color: red;"></text>
					<text v-if="userInfo.level == 101" style="color: red;">·会员</text>
				</view>

			</view>
		</view>

		<!-- 订单状态 -->
		<view class="order-status">
			<view class="status-wrap">
				<!-- 单元格 -->
				<view class="cell" @click="$navigateTo('/pages/order/order')">
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-order.png" mode="aspectFill"></image>
						<view class="cell-text">全部订单</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>

				<!-- 订单状态 -->
				<view class="status-list">
					<view class="status-item" hover-class="btn-hover" v-for="(item, index) in orderStatusList"
						:key="index" @click="$navigateTo(item.uri)">
						<view class="item-icon" :class="item.icon"></view>
						<view class="item-text">{{ item.name }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 滑动导航 -->
		<!-- <view style="border-radius: 20rpx; overflow: hidden; margin: 0 20rpx;">
			<com-nav :list="list" :col="4"></com-nav>
		</view> -->

		<!-- 用户功能 -->
		<view class="com-item">
			<view class="com-wrap">



				<view class="cell" @click="tuiguang()" v-if="userInfo.level > 100">
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-foot.png" mode="aspectFill"></image>
						<view class="cell-text">我的推荐码</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>


				<view class="cell" @click="$navigateTo('/pages/user/subordinate')" v-if="userInfo.level > 100">
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-collect.png" mode="aspectFill"></image>
						<view class="cell-text">推荐记录</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>


				<view class="cell" @click="$navigateTo('/pages/user/fumou-center-template')"
					v-if="userInfo.level > 100">
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-about.png" mode="aspectFill"></image>
						<view class="cell-text">我的奖金</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>
				<view class="cell" @click="$navigateTo('/pages/user/commission')" v-if="userInfo.level > 100">
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-foot.png" mode="aspectFill"></image>
						<view class="cell-text">奖金记录</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>

			</view>
		</view>

		<!-- 用户服务 -->
		<view class="com-item">
			<view class="com-wrap">
				<view class="cell" @click="$navigateTo('/pages/order/order-refund')">
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-kefu.png" mode="aspectFill"></image>
						<view class="cell-text">售后记录</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>




				<view class="cell" @click="$navigateTo('/pages/address/address')">
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-address.png" mode="aspectFill"></image>
						<view class="cell-text">收货地址</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>


				<!-- <view class="cell" >
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-kefu.png" mode="aspectFill"></image>
						<view class="cell-text">客服中心</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view> -->

				<!-- <view class="cell" @click="$navigateTo('/pages/user/collect')">
					<view class="cell-left" >
						<image class="cell-icon" src="/static/img/user/icon-collect.png" mode="aspectFill"></image>
						<view class="cell-text">我的收藏</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view> -->

				<!-- <view class="cell" >
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-help.png" mode="aspectFill"></image>
						<view class="cell-text">帮助中心</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view> -->
				<!-- <view class="cell" @click="$navigateTo('/pages/user/html?key=cfg_rej_pocy')">
					<view class="cell-left" >
						<image class="cell-icon" src="/static/img/user/icon-help.png" mode="aspectFill"></image>
						<view class="cell-text">退货政策</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>
				
				<view class="cell" @click="$navigateTo('/pages/user/html?key=cfg_call_us')">
					<view class="cell-left" >
						<image class="cell-icon" src="/static/img/user/icon-about.png" mode="aspectFill"></image>
						<view class="cell-text">联系我们</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>
				
				<view class="cell" @click="$navigateTo('/pages/user/html?key=cfg_how_tobuy')">
					<view class="cell-left" >
						<image class="cell-icon" src="/static/img/user/icon-collect.png" mode="aspectFill"></image>
						<view class="cell-text">如何购买</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view> -->

				<view class="cell" @click="$navigateTo('/pages/user/html?key=cfg_com_help')">
					<view class="cell-left">
						<image class="cell-icon" src="/static/img/user/icon-about.png" mode="aspectFill"></image>
						<view class="cell-text">帮助中心</view>
					</view>
					<view class="iconfont iconmore1"></view>
				</view>


			</view>
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<!-- 移除mp-wxauth组件，改为显式按钮 -->
		<!-- #endif -->

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
				this.$toast("请先点击授权微信登录");
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
//@import "../../static/css/iconfont/iconfont.css";

page {
	background: #f2f2f2;
}

.btn-hover {
	background: #f2f2f2 !important;
}

.user {
	.user-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50vw;
		padding: 30rpx;
		z-index: 9;
		border-radius: 0 0 20% 20%;
		background: url('https://handsel.oss-cn-shenzhen.aliyuncs.com/1588938371592.jpg') no-repeat;
		background-size: cover;

		.setting {
			color: #fff;
			position: absolute;
			top: 60rpx;
			left: 60rpx;
			font-size: 50rpx;
		}

		.info {
			position: absolute;
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 80%;

			/* #ifndef H5 */
			top: 10%;

			/* #endif */

			.avatar {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				margin-bottom: 15rpx;
			}

			.nickname {
				color: #fff;
				font-size: 28rpx;
			}

			.auth-buttons {
				margin-top: 10rpx;
				width: 100%;
				text-align: center;

				.auth-btn {
					background-color: #07c160;
					color: #fff;
					font-size: 24rpx;
					padding: 8rpx 30rpx;
					border-radius: 30rpx;
					border: none;
					line-height: 1.5;
					height: auto;
				}
			}
		}
	}

	.order-status {
		padding: 0 20rpx;
		margin-top: -10vw;

		.status-wrap {
			border-radius: 25rpx;
			overflow: hidden;

			.status-list {
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				background: #fff;
				padding-top: 30rpx;
				padding-bottom: 30rpx;

				.status-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.item-icon {
						line-height: 1;
						font-size: 65rpx;
						color: #bbb;
					}

					.item-text {
						font-size: 28rpx;
						color: #666;
						margin-top: 5rpx;
					}
				}
			}
		}
	}

	.com-item {
		padding-left: 20rpx;
		padding-right: 20rpx;
		margin-top: 20rpx;

		.com-wrap {
			border-radius: 25rpx;
			overflow: hidden;
		}
	}

	.cell {
		height: 80rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-bottom: 1px solid #f8f8f8;

		&:active {
			background: #f2f2f2;
		}

		&:last-child {
			border-bottom: none !important;
		}

		.cell-left {
			display: flex;
			align-items: center;

			.cell-icon {
				width: 50rpx;
				height: 50rpx;
			}

			.cell-text {
				color: #666;
				font-size: 28rpx;
				margin-left: 20rpx;
			}
		}

		.iconfont {
			font-size: 40rpx;
			color: #999;
		}
	}
}
</style>
