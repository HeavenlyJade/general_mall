<template>

	<view class="content">
		<view style="background-color: #E4E7ED; text-align: left;height: 2.4rem; width: 100%; margin-top: 0.2rem;box-shadow: 0px 0px 12px #DD524D;  border-radius: 7px; font-size: 15px;">
			<view><text style="margin-left: 1rem;">快递公司:{{logiInfo.logistics_company || getConst().logisterMap[logiInfo.type]}}</text></view>
			<view class="tracking-number">
				<text style="margin-left: 1rem;">运单号:{{logiInfo.logistics_no || logiInfo.order}}</text>
				<text class="copy-btn" @click="copyTrackingNumber">复制</text>
			</view>
		</view>
		
		<ali :state="alidata2.state" :datas="alidata2.data" :ways="alidata2.information"></ali>
		
		<!-- <view class="action-box">
			<button class="confirm-btn" @click="confirmReceipt">确认收货</button>
		</view> -->
	</view>
</template>

<script>
import ali from '@/components/wuliu/WuLiu-step.vue'; 

 
export default {
	components: {
		ali
	},
	data() {
		
		
		return {
			alidata2: {
				state: 3,
				uptime: '2019-05-24 10:58:24',
				data: [
					{
						time: '',
						remark: ''
					}],
				information: {
					no: '70939995911523',
					sName: 'HTKY',
					expName: '百世快递(原汇通)',
					url: 'http:www.htky365.com',
					tel: '021-62963636',
					img: 'https:oss-cn2.apistore.cnexpHTKY.png'
				}
				
		
			},

			
			logiInfo:{},
			orderId: '',
			
		};
	},
	onLoad(e) {
		this.logiInfo=e;
		this.view_logi(e);
		// 如果有传入订单ID，则保存起来用于确认收货
		if (e.order_id) {
			this.orderId = e.order_id;
		}
	},
	methods: {
		copyTrackingNumber() {
			const trackingNumber = this.logiInfo.logistics_no || this.logiInfo.order;
			if (trackingNumber) {
				// 使用uni-app的复制API
				uni.setClipboardData({
					data: trackingNumber,
					success: () => {
						uni.showToast({
							title: '运单号已复制',
							icon: 'success',
							duration: 2000
						});
					}
				});
			}
		},
		confirmReceipt() {
			if (!this.orderId) {
				uni.showToast({
					title: '无法获取订单信息',
					icon: 'none'
				});
				return;
			}
			
			uni.showModal({
				title: '确认收货',
				content: '确定已收到商品吗？',
				success: (res) => {
					if (res.confirm) {
						this.$put(`/mini_core/shop-order/${this.orderId}/confirm`, {}, res => {
							uni.showToast({
								title: '确认收货成功',
								icon: 'success'
							});
							// 返回上一页并刷新
							setTimeout(() => {
								const pages = getCurrentPages();
								const prevPage = pages[pages.length - 2];
								if (prevPage && prevPage.reload_list) {
									prevPage.reload_list();
								}
								uni.navigateBack();
							}, 1500);
						});
					}
				}
			});
		},
		view_logi(item){
			console.log("item",item);
			var pdata={};			
			pdata.order_no=item.order;
			
			var _this =this;
			this.$post("/wx_mini_app/logistics/by-order-no", pdata,function(r) {
				console.log("r",r)
				if ( r.code == 200) {
					var obj = r.data;
					var list = [];
					
					// 使用新结构的数据
					if (obj.logistics_route && Array.isArray(obj.logistics_route)) {
						list = obj.logistics_route.map(function(item) {
							return {
								time: item.time,
								remark: item.remark
							};
						});
					}
					
					// 更新物流信息
					if (obj.logistics_company) {
						_this.logiInfo.logistics_company = obj.logistics_company;
					}
					
					if (obj.logistics_no) {
						_this.logiInfo.logistics_no = obj.logistics_no;
					}
					
					// 确保有默认项作为占位
					if (list.length === 0) {
						list.push({"remark":"暂无物流信息"});
					} else {
						let df_obj = {"remark":"__"};
						list.push(df_obj);
					}
					
					_this.alidata2.data = list;
					
					// 更新物流信息组件
					if (obj.logistics_no) {
						_this.alidata2.information.no = obj.logistics_no;
					}
					
					if (obj.logistics_company) {
						_this.alidata2.information.expName = obj.logistics_company;
					}
				}
			})
				
		},
	}
};
</script>

<style>
.content {
}
.tracking-number {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-right: 1rem;
}
.copy-btn {
	font-size: 12px;
	color: #007AFF;
	background-color: #f0f0f0;
	padding: 3px 10px;
	border-radius: 4px;
	box-shadow: 0 1px 2px rgba(0,0,0,0.1);
	margin-left: 10px;
	height: 20px;
	line-height: 20px;
	text-align: center;
}
.action-box {
	margin-top: 20px;
	padding: 10px 20px;
	display: flex;
	justify-content: center;
}
.confirm-btn {
	background: linear-gradient(to right, #ff8a65, #ff5252);
	color: #fff;
	border-radius: 50px;
	width: 80%;
	height: 40px;
	line-height: 40px;
	font-size: 16px;
	box-shadow: 0 2px 6px rgba(255, 82, 82, 0.3);
	text-align: center;
}
</style>
