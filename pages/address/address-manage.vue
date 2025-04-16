<template>
	<view class="content">
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
			@onConfirm="onConfirm"></mpvue-city-picker>

		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.mobile" placeholder="收货人手机号码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b" @click="showMulLinkageThreePicker">
			<text class="tit">区域</text>
			<input class="input" type="text" v-model="addressData.pickerText" disabled="true"
				placeholder-class="placeholder" />
		</view>
		<!-- <view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			 
			 <text class="cell-tit"  >注册区域</text>
			 
			 <input class="input" type="text" v-model="pickerText" @click="showMulLinkageThreePicker"  placeholder-class="placeholder" />
		</view> -->

		<view class="row b-b">
			<text class="tit">地址</text>
			<input class="input" type="text" v-model="addressData.addressName" placeholder="详细地址"
				placeholder-class="placeholder" />
			<!-- <text @click="chooseLocation" class="input">
				{{addressData.addressName}}
			</text>
			<text class="yticon icon-shouhuodizhi"></text> -->
		</view>
		<!-- <view class="row b-b">
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.area" placeholder="楼号、门牌(选填)"
				placeholder-class="placeholder" />
		</view> -->

		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.default" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>


import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
/* 	import cityData from '@/components/city.data.js';
	import cityData3 from '@/components/city.data-3.js'; */

export default {
	components: {
		mpvueCityPicker,
	},
	data() {
		return {
			edit_city_picker: true,
			cityPickerValueDefault: [0, 0, 1],
			themeColor: '#007AFF',

			addressData: {
				pickerText: '',
				name: '',
				mobile: '',
				addressName: '',
				address: '',
				area: '',
				default: false
			},
			addressList: [],
		}
	},
	onLoad(option) {
		this.loadAddress();
		let title = '新增收货地址';
		if (option.type === 'edit') {

		}

		if (!!option.id) {
			title = '编辑收货地址';
			this.locateAddress(option.id)

		}
		uni.setNavigationBarTitle({
			title
		})
	},
	methods: {
		onConfirm(e) {
			this.addressData.pickerText = e.label;
		},

		showMulLinkageThreePicker() {
			this.$refs.mpvueCityPicker.show()
		},
		locateAddress(_id) {
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
			
			// 调用获取单个地址详情接口
			this.$get(`/wx_mini_app/wx_auth/address/${user.id}/${_id}`, {}, res => {
				uni.hideLoading();
				console.log("res", res)
				if (res && res.code === 200 && res.data) {
					// 转换API返回的数据格式为表单使用的格式
					const item = res.data;
					this.addressData = {
						id: item.id,
						name: item.receiver_name,
						mobile: item.receiver_phone,
						pickerText: `${item.province} ${item.city} ${item.district}`.trim(),
						addressName: item.detail_address,
						default: item.is_default === 1
					};
				}
			}, err => {
				uni.hideLoading();
				console.error('获取地址详情失败:', err);
				this.$toast('获取地址详情失败');
			});
		},
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
				if (res && res.code === 200 && res.items) {
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

		switchChange(e) {
			var li = this.addressList;
			console.log(true === e.detail.value)
			if (true === e.detail.value) {

				for (let i in li) {
					let ite = li[i];
					ite.default = false;
				}
			}
			console.log(li);
			this.addressData.default = e.detail.value;
		},

		//地图选择地址
		chooseLocation() {
			uni.chooseLocation({
				success: (data) => {
					this.addressData.addressName = data.name;
					this.addressData.address = data.name;
				}
			})
		},

		//提交
		confirm() {
			let data = this.addressData;
			if (!data.name) {
				this.$toast('请填写收货人姓名');
				return;
			}
			if (!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(data.mobile)) {
				this.$toast('请输入正确的手机号码');
				return;
			}

			if (!data.pickerText) {
				this.$toast('请选择所在区域');
				return;
			}
			if (!data.addressName) {
				this.$toast('请填写详细地址');
				return;
			}

			// 显示加载提示
			uni.showLoading({
				title: '保存中'
			});

			// 获取用户ID
			const user = this.getUser() || {};
			if (!user.id) {
				uni.hideLoading();
				this.$toast('请先登录');
				return;
			}

			// 准备提交的数据，完全符合接口格式
			const data_list = data.pickerText.split('-');
			const province = data_list[0];
			const city = data_list[1];
			const district = data_list[2];
			
			const requestData = {
				user_id: String(user.id),
				receiver_name: data.name || null,
				receiver_phone: data.mobile || null,
				province: province,
				city: city,
				district: district,
				detail_address: data.addressName || null,
				postal_code: null,
				is_default: data.default ? 1 : 0
			};

			if (data.id) {
				// 编辑地址 - PUT请求
				const apiUrl = `/wx_mini_app/wx_auth/address/${user.id}/${data.id}`;
				this.$put(apiUrl, requestData, result => {
					uni.hideLoading();
					if (result.code === 200) {
						this.$toast('修改成功');
						setTimeout(() => {
							uni.navigateBack();
						}, 800);
					} else {
						this.$toast(result.message || '修改失败');
					}
				}, err => {
					uni.hideLoading();
					console.error('修改地址失败:', err);
					this.$toast('修改失败');
				});
			} else {
				// 新增地址 - POST请求
				const apiUrl = `/wx_mini_app/wx_auth/address/${user.id}`;
				this.$post(apiUrl, requestData, result => {
					uni.hideLoading();
					console.log("result", result)
					if (result.code === 200) {
						this.$toast('添加成功');
						setTimeout(() => {
							uni.navigateBack();
						}, 800);
					} else {
						this.$toast(result.message || '添加失败');
					}
				}, err => {
					uni.hideLoading();
					console.error('添加地址失败:', err);
					this.$toast('添加失败');
				});
			}
		}
	}
}
</script>

<style lang="scss">
page {
	background: #f1f1f1;
	padding-top: 16upx;
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

.default-row {
	margin-top: 16upx;

	.tit {
		flex: 1;
	}

	switch {
		transform: translateX(16upx) scale(.9);
	}
}

.add-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690upx;
	height: 80upx;
	margin: 60upx auto;
	font-size: 32upx;
	color: #fff;
	background-color: #fa436a;
	border-radius: 10upx;
	box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
