<template>
	<view class="container" style="width: 100%;">
		<!-- 加载中提示 -->
		<view v-if="loading" class="loading-container">
			<text>加载中...</text>
		</view>

		<!-- 数据加载完成后显示表单 -->
		<block v-else>
			<view class="list-cell b-b m-t flex c-center" style="align-items: center;" @click="choseimg()"
				hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit w50p flex c-center">头像</text>
				<view class="w50p flex m-end">
					<image style="width: 2.6rem;height: 2.6rem; border-radius: 50%;" class="input"
						:src="user.avatar || getConst().defaultAvatar"></image>
				</view>

			</view>

			<view class="list-cell b-b" style="margin-top: 1rem;" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">手机号码</text>
				<input class="input" type="number" style="text-align: right;" v-model="user.phone" 
					placeholder="请输入手机号码" placeholder-class="placeholder" maxlength="11" />
			</view>
			<view class="list-cell b-b " hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">姓名</text>
				<input class="input" type="text" style="text-align: right;" v-model="user.username" placeholder="请输入姓名"
					placeholder-class="placeholder" />
			</view>

			<view class="list-cell b-b " hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">昵称</text>
				<input class="input" type="text" style="text-align: right;" v-model="user.nickname" placeholder="请输入昵称"
					placeholder-class="placeholder" />
			</view>


			<picker :value="parseInt(user.gender || 0)" :range="getConst().pickerObj.gender.list"
				@change="bindPickerChange">
				<view class="list-cell b-b " hover-class="cell-hover" :hover-stay-time="50">
					<text class="cell-tit">性别</text>
					<view class="uni-input">{{ getConst().pickerObj.gender.map[parseInt(user.gender || 0)].name }}</view>
				</view>
			</picker>

			<button class="save-btn" @click="confirm()">
				<text>保存</text>
			</button>

		</block>
	</view>
</template>

<script>

export default {
	components: {


	},
	data() {

		return {
			loading: true,  // 添加加载状态标志
			user: {
				"id": null,
				"user_id": null,
				"gender": 0,
				"phone": "",
				"address": null,
				"avatar": "",
				"nickname": "",
				"username": "",
				"member_level": "无会员",
				"points": 0,
				"balance": 0.0,
				"avatarurl":null
			},

		};
	},
	onLoad(options) {
		this.loadData();
	},
	onShow() {
		this.$toast(this.getConst().version_code);

	},

	methods: {
		bindPickerChange(e) {

			this.user.gender = e.detail.value;
			this.user = JSON.parse(JSON.stringify(this.user));
			console.log(this.user);
		},

		refreshwx() {
			this.updateWxLogin();

		},

		choseimg() {
			this.$chooseImageUpload(1, res => {
				console.log("上传结果:", res);
				if (res && res.length > 0) {
					// 确保URL是绝对路径
					let imgUrl = res[0];
					// 确保以http开头
					if (imgUrl && !imgUrl.startsWith('http')) {
						imgUrl = imgUrl.startsWith('//') ? 'http:' + imgUrl : 'http://' + imgUrl;
					}
					// 同时更新avatar和avatarurl，确保数据一致性
					this.user.avatar = imgUrl;
					this.user.avatarurl = imgUrl;
			
					// 强制刷新对象，确保Vue检测到变化
					this.user = JSON.parse(JSON.stringify(this.user));
					console.log("更新后的用户头像:", this.user.avatar);
				}
			})
		},

		updatePwd() {

			this.$navigateTo('login/forget');

		},

		loadData() {
			this.loading = true;  // 开始加载
			
			// 显示加载提示
			uni.showLoading({
				title: '加载中...'
			});
			
			this.$refreshUser(this.getUser().id, res => {
				console.log("res",res)
				if (res ) {
					// 使用解构赋值和默认值，确保即使API返回null或undefined也能正常工作
					const { 
						id, user_id, gender = 0, phone = "", address = null,
						avatar = "", nickname = "", username = "", 
						member_level = "无会员", points = 0, balance = 0.0 
					} = res;
					
					// 创建一个全新的对象，而不是修改现有对象的属性
					this.user = {
						id, 
						user_id,
						gender: gender,
						phone: phone,
						address: address,
						avatar: avatar,
						nickname: nickname || '微信用户',  // 确保有默认值
						username: username || '',      // 确保有默认值
						member_level: member_level,
						points: points,
						balance: balance
					};
					
					console.log('用户数据加载完成:', this.user);
				} else {
					console.error('获取用户数据失败或数据为空');
				}
				
				this.loading = false;  // 结束加载
				uni.hideLoading();  // 隐藏加载提示
			}, error => {
				console.error('加载用户数据出错:', error);
				this.loading = false;
				uni.hideLoading();
				uni.showToast({
					title: '获取用户信息失败',
					icon: 'none'
				});
			});
		},

		confirm() {
			// 验证手机号
			if (!this.validatePhone()) {
				return;
			}
			
			var o = {
				id: this.user.id,
				username: this.user.username,
				nickname: this.user.nickname,
				gender: this.user.gender,
				avatar: this.user.avatar, // 优先使用新上传的头像
				phone: this.user.phone // 添加手机号到更新字段
			};
			
			let _this = this;
			// 修改URL，加上用户ID
			const userId = this.user.id;
			const url = `/wx_mini_app/shop_users/${userId}`;
			
			this.$put(url, o, function (res) {
				if (res) {
					_this.setUser(res);
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					// setTimeout(() => {
					// 	uni.navigateBack()
					// }, 800);
				} else {
					uni.showToast({
						title: res.msg || '保存失败',
						icon: 'none'
					});
				}
			})
		},

		toreg() {
			if (this.$isNull(this.user.id) || this.$isNull(this.user.phone)) {
				this.$dataLocal("pre_reg_page", "/pages/user/set");
				this.$redirectTo("login/register");

			} else {

			}
		},

		toLogout() {
			uni.showModal({
				title: '确定要退出登录么？',
				success: (e) => {
					if (e.confirm) {
						this.$rmLoginMsg();
						this.$reLaunch('login/login');

					}
				}
			})
		},

		switchChange(e) {
			console.log(e.detail)
			let statusTip = e.detai ? '打开' : '关闭';
			this.$api.msg(`${statusTip}消息推送`);
		},

		validatePhone() {
			// 中国大陆手机号正则表达式
			const phoneRegex = /^1[3-9]\d{9}$/;
			
			if (!this.user.phone) {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none'
				});
				return false;
			}
			
			if (!phoneRegex.test(this.user.phone)) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
				});
				return false;
			}
			
			return true;
		}



	}
}
</script>

<style lang='scss'>
page {
	overflow-x: hidden;
	background: #ffffff;
}

.row {
	display: flex;
	align-items: center;
	position: relative;
	padding: 0 30upx;
	height: 110upx;
	background: #fff;

	.tit {
		flex-shrink: 0;
		width: 120upx;
		font-size: 30upx;
		color: #303133;
	}

	.input {
		flex: 1;
		font-size: 30upx;
		color: #303133;
	}

	.icon-shouhuodizhi {
		font-size: 36upx;
		color: #909399;
	}
}

.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20upx 0.9rem;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;

	&.log-out-btn {
		margin-top: 40upx;

		.cell-tit {
			color: $uni-color-primary;
			text-align: center;
			margin-right: 0;
		}
	}

	&.cell-hover {
		background: #fafafa;
	}

	&.b-b:after {
		left: 30upx;
	}

	&.m-t {
		margin-top: 16upx;
	}

	.cell-more {
		align-self: baseline;
		font-size: 0.8rem;
		color: #909399;
		margin-left: 10upx;
	}

	.cell-tit {
		flex: 1;
		font-size: 0.72rem;
		color: #303133;
		margin-right: 10upx;
	}

	.cell-tip {
		font-size: 0.9rem;
		color: #909399;
	}

	switch {
		transform: translateX(16upx) scale(.84);
	}
}

.save-btn {
	width: 90%;
	height: 90rpx;
	margin: 40rpx auto;
	border-radius: 45rpx;
	background: linear-gradient(to right, #FF9800, #F57C00);
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32rpx;
	font-weight: bold;
	border: none;
	box-shadow: 0 4rpx 10rpx rgba(245, 124, 0, 0.3);
}

.phone-btn {
	font-size: 28rpx;
	background-color: #FF9800;
	color: #fff;
	padding: 8rpx 24rpx;
	border-radius: 30rpx;
	margin: 0;
	line-height: 1.5;
	height: auto;
}

.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 300rpx;
}
</style>
