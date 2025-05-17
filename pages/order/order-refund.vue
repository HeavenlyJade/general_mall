<template>
	<view class="content">
		<swiper  class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in orderList" :key="index"
						class="order-item"
					>
						<!-- 订单时间和状态 -->
						<view class="order-header">
							<text class="order-time">{{item.transaction_time || '暂无交易时间'}}</text>
							<text class="status-tag" :style="{color: getStatusColor(item)}">{{getStatusText(item)}}</text>
						</view>
						
						<!-- 商品列表循环 -->
						<view 
							v-for="(detail, detailIndex) in item.orderItems" 
							:key="detailIndex"
							class="goods-item-row"
						>
							<view class="goods-content">
								<!-- 商品图片 -->
								<image class="goods-image" :src="detail.image_url" mode="aspectFill"></image>
								
								<!-- 商品信息重新布局 -->
								<view class="goods-info">
									<!-- 将商品名称放在最右侧 -->
									<view class="goods-title-container">
										<text class="goods-title">{{detail.product_name}}</text>
									</view>
									
									<!-- 规格信息 -->
									<text class="goods-attr" v-if="detail.sku_properties_name">{{detail.sku_properties_name}}</text>
									
									<!-- 价格信息 -->
									<!-- <text class="goods-price">¥ {{detail.price || 0}}X{{detail.quantity || 1}}</text> -->
								</view>
							</view>
						</view>
						
						<!-- 退款金额信息 -->
						<view class="order-footer">
							<text class="total-info">共 {{item.product_count || 0}} 件商品 实付款</text>
							<text class="total-price">¥ {{item.actual_amount || 0}}</text>
						</view>
						
			
						<!-- <view class="refund-button-area">
							<button class="refund-btn" :class="{'success': item.status === '已退款'}">
								{{item.status === '已退款' ? '退款成功' : '退款中···'}}
							</button>
						</view> -->
					</view>
					
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
		
		
		<view class='layer' v-if="layer===true">
  <view class='window column'>
    <image src='/static/cancel.png' class='close' @click="powerDrawer" data-statu="close"></image>
    <view class='header'>
      <!-- <image src='{{chosenOne.goodsMsg[0].imgs[0]}}' mode='aspectFill'></image> -->
      <view class='header-right column'>
        <view class='pname'>物流公司：{{logi_corp}}</view>
        <view>运单号码:{{logi_no}}</view>
      </view>
    </view>
    <view class='log-data column'>
      <view class='log-item' v-for="(item,index) in logistics" :key="index">
        <view class='time'>
          {{item.time}}
        </view>
        <view class='log-info'>
          {{item.context}}
        </view>
      </view>
      <view class='no-data' v-if="!logistics.length">暂无物流信息</view>
    </view>
  </view>
</view>
		
		
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty/empty";

	
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				layer:false,
				logi_corp:"",
				logi_no:"",
				logistics:[],
				logisterMap:{
					"shentong":"申通",
					"zhongtong":"中通",
					"shunfeng":"顺风",
					"yunda":"韵达",
					"ziti":"自提",
	            },
				
				tabCurrentIndex: 1,
				navList: [
					{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
							state: 2,
							text: '待发货',
							loadingType: 'more',
							orderList: []
						},
					{
						state: 3,
						text: '已发货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					},
					/* {
						state: 5,
						text: '售后',
						loadingType: 'more',
						orderList: []
					} */
				],
				userInfo:{
					"id":-1
				},
				cond:{
					pagesize:10,
					pagefrom:1,
					stat:""
				},
				orderList:[],
			};
		},
		
		onLoad(options){
			this.loadUserInfo();
			this.tabCurrentIndex = +options.status;
			this.cond.stat=options.status;
			
		},
		
		watch:{
			"tabCurrentIndex":function(n,o){
				console.log(n,o);
				var s='';
				if(n!=0){s=n;}
				this.cond.stat=s;
				this.reloadList();
			}
		},
		 
		methods: {
			// 获取状态文字
			getStatusText(item) {
				if (item.status === '退款中') {
					return '退款中';
				} else if (item.refund_status && item.refund_status !== '无退款') {
					return item.refund_status;
				}
				return '处理中';
			},
			
			// 获取状态颜色
			getStatusColor(item) {
				if (item.status === '退款中') {
					return '#fa436a'; // 红色
				} else if (item.refund_status === '已退款') {
					return '#4CAF50'; // 绿色
				}
				return '#fa436a'; // 默认红色
			},
			
			getAmount(e){
				if (e.actual_amount) {
					return e.actual_amount;
				}
				return 0;
			},
			getCount(e){
				if (e.product_count) {
					return e.product_count;
				}
				return 0;
			},
			
			getGlistData(e){
				if (e.actual_amount && e.product_count) {
					return {
						"amount": e.actual_amount,
						"count": e.product_count
					};
				}
				
				let sum=0,n=0;
				// 兼容处理
				if (e.orderItems && e.orderItems.length > 0) {
					for(let i in e.orderItems){
						let ite = e.orderItems[i];				
						let m = parseFloat(ite.quantity || 0) * parseFloat(ite.price || 0);
						sum += m;
						n = n + parseFloat(ite.quantity || 0);				
					}
				} else if (e.goods && e.goods.length > 0) {
					for(let i in e.goods){
						let ite = e.goods[i];				
						let m = parseFloat(ite.buyNum || 0) * parseFloat(ite.price || 0);
						sum += m;
						n = n + parseFloat(ite.buyNum || 0);				
					}
				}
				
				return {"amount":sum,"count":n};
			},
			
			reject_product(item){
				uni.navigateTo({
					"url":"../order/return"
				})
			},
			reject_money(item){
				uni.showModal({
					title: '提示',
					content: '亲，确定要发起退款嘛',
					success: function (res) {
						    if(res.confirm) {
								var o={};
								o.id=item.id;
								o.refundStat=1;  //申请中
								var _this=this;
								this.$post("/order/update",o,function(res){
									item.refundStat=1;
										uni.showToast({ title: '申请成功' });
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						
						
					}
				});
				
			},
			urge(item){
				uni.showToast({
					"title":"已经发送催货信息给卖家，请耐心等待"
				})
			},
			toComment(item){
				uni.navigateTo({
					url: `/pages/order/comment?id=`+item.id
				})
			},
			powerDrawer(){this.layer=false},
			
			view_logi(item){
				
				var post_detail={};
		        if(!!item.postDetail){post_detail=JSON.parse(item.postDetail)}
				console.log(post_detail);
				var url="https://www.kuaidi100.com/query";
				url="https://m.kuaidi100.com/query";
	    var pdata={};
	    pdata.url=url;
	    pdata.type=post_detail.type;
	    pdata.postid=post_detail.order;
	    if(pdata.type=="ziti"){
	    	alert("该订单的商品已经自提");
	    	return;
	    }
	    this.logi_no=pdata.postid;
	this.logi_corp=pdata.type;
	var logisterMap=this.logisterMap;
    var logister_title="运单号码："+pdata.postid+",物流公司："+logisterMap[pdata.type];
    console.log(logister_title);
var _this =this;
this.$post("order/getlogimsg", pdata,function(r) {
	if (r.status == 200) {
		var obj=JSON.parse(r.msg)
		var list=obj.data;
		console.log(list)
        _this.logistics=list;
		_this.layer=true;
	}
})
				
			},
			loadUserInfo(){

				this.userInfo=this.$dataLocal("user_info");
			},
			
			reloadList(){
				this.cond.pagefrom=1;
				this.orderList=[],
				this.loadList();
			},
			loadList(){
				let o={};
				o.pagefrom=this.cond.pagefrom;
				o.pagesize=this.cond.pagesize;
				o.status="退款中,已退款";
				o.userId=this.userInfo.id;
				let _this=this;
				this.$post("/wx_mini_app/shop-order/order_status_data",o,function(res){
					if (res.code === 200 && res.data) {
						let orderData = Array.isArray(res.data) ? res.data : [res.data];
						
						// 处理新的数据结构
						let processedOrders = [];
						for(let i in orderData){
							let item = orderData[i];
							
							// 将订单信息作为主要数据
							let orderInfo = item.order_info || {};
							
							// 将order_details直接作为orderItems
							orderInfo.orderItems = item.order_details || [];
							
							// 确保每个订单项都有正确的图片URL
							if(orderInfo.orderItems && orderInfo.orderItems.length > 0) {
								orderInfo.orderItems.forEach(detail => {
									// 设置图片路径
									detail.image_url = detail.product_img;
								});
							}
							
							processedOrders.push(orderInfo);
						}
						
						var old_li = _this.orderList;
						var new_li = old_li.concat(processedOrders);
						_this.orderList = new_li;
						
						if(processedOrders.length > 0){
							_this.cond.pagefrom = _this.cond.pagefrom + 1;
						}
					} else {
						console.error("获取订单数据失败", res);
						uni.showToast({
							title: '获取订单数据失败',
							icon: 'none'
						});
					}
				})
			},
			
			//获取订单列表
			loadData(source){
				this.loadList();
			}, 

			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(item,index){
				console.log(item);

				this.tabCurrentIndex = index;
			},
			
			update_stat(id,stat){
				var o={};
				o.id=id;
				o.stat=stat;
				var _this=this;
				this.$post("/order/update",o,function(res){
						uni.showToast({ title: '操作成功' });
				})
			},
			
			pay_success(item){
				item.stat=2;
				this.update_stat(item.id,2)
			},
			receive(item){
				item.stat=4;
				this.update_stat(item.id,4)
			},
			pay(item){
				let order_id=item.id;
				let money=item.actual_amount || 0;
				uni.redirectTo({
					url: '/pages/money/pay?order_id='+order_id+'&money='+money
				})
			},
			
			//删除订单
			deleteOrder(item){
				return;
				var o={};
				o.id=item.id;
				o.isValid=0;
				var _this=this;
				this.$post("order/update",o,function(res){
					_this.deleteItem(item);
						uni.showToast({ title: '操作成功' });
				})
			},
			cancelOrder(item){
				var o={};
				o.id=item.id;
				o.isValid=0;
				var _this=this;
				this.$post("order/update",o,function(res){
					_this.deleteItem(item);
						uni.showToast({ title: '操作成功' });
				})
			},
			deleteItem(item){
				var li=this.orderList;
				for(let i in li){
					var ite=li[i];
					if(ite.id===item.id){
						li.splice(i,1);
					}
				}
			},
			//取消订单
			

			//订单状态文字和颜色
			orderStateExp(state){
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch(+state){
					case 1:
						stateTip = '待付款'; break;
					case 2:
						stateTip = '待发货'; break;
					case 9:
						stateTip = '订单已关闭'; 
						stateTipColor = '#909399';
						break;
						
					//更多自定义
				}
				return {stateTip, stateTipColor};
			}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: #f1f1f1;
		height: 100%;
	}
	
	.layer{
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    top: 4.8rem;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
}.window{
    width: 680upx;
    position: relative;
}
	
	.window .header{
    background: #ff9933;
    color: #fff;
    padding: 30upx 20upx;
    border-top-left-radius: 20upx;
    border-top-right-radius: 20upx;
}
.header>image{
    width: 160upx;
    height: 160upx;
    border:1upx solid #fff;
    margin-right: 30upx;
}
.header .header-right{
    line-height: 55upx;
    justify-content: center;
    font-size: 28upx;
}
.log-data{
    padding: 30upx 20upx;
    justify-content: space-between;
    color: #565656;
    font-size: 28upx;
    height: 600upx;
    overflow: scroll;
    width: 100%;
    background: #fff;
    border-bottom-left-radius: 20upx;
    border-bottom-right-radius: 20upx;
    display: block;
}
.log-item{
    margin-bottom: 20upx;
    padding: 10upx 0;
    border-bottom: 1upx solid #f7f7f7;
}
.log-item .time{
    margin-right: 25upx;
}
.log-item .log-info{
    width: 630upx;
}
.header-right .pname{
    width: 400upx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.close{
    position: absolute;
    right: -15upx;
    top: -15upx;
    width: 50upx;
    height: 50upx;
}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: #303133;
			position: relative;
			&.current{
				color: #fa436a;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #fa436a;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item {
		background: #fff;
		margin: 20rpx;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.order-time {
		font-size: 28rpx;
		color: #333;
	}

	.status-tag {
		font-size: 28rpx;
		color: #fa436a;
	}

	.goods-item-row {
		padding: 20rpx 30rpx;
	}

	.goods-content {
		display: flex;
		padding: 16rpx 0;
		align-items: flex-start;
	}

	.goods-image {
		width: 160rpx;
		height: 160rpx;
		margin-right: 24rpx;
		flex-shrink: 0;
	}

	.goods-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.goods-title-container {
		width: 100%;
		text-align: right;
		margin-bottom: 10rpx;
	}

	.goods-title {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		display: inline-block;
		text-align: right;
	}

	.goods-attr {
		font-size: 24rpx;
		color: #909399;
		margin-bottom: 8rpx;
		align-self: flex-end;
	}

	.goods-price {
		font-size: 26rpx;
		color: #333;
		align-self: flex-end;
	}

	.order-footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 20rpx 30rpx;
		border-top: 1px solid #f5f5f5;
	}

	.total-info {
		font-size: 26rpx;
		color: #909399;
		margin-right: 10rpx;
	}

	.total-price {
		font-size: 32rpx;
		color: #333;
	}

	.refund-button-area {
		display: flex;
		justify-content: flex-end;
		padding: 20rpx 30rpx;
		border-top: 1px solid #f5f5f5;
	}

	.refund-btn {
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 26rpx;
		color: #fa436a;
		background: #fff9f9;
		border-radius: 30rpx;
		border: 1px solid #f7bcc8;
	}

	.refund-btn.success {
		color: #4CAF50;
		background: #f0fff0;
		border: 1px solid #b7e4b7;
	}
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
