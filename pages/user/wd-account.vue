<template>
	<view class="content">
		<view class="type-item b-b" >
			<!-- <text class="icon yticon icon-weixinzhifu"></text><text class="tit">微信</text>
			<label class="radio" @click="changePayType(1)">
				<radio value="" color="#fa436a" :checked='payType == 1' />
				</radio>
			</label> -->
			<text class="icon yticon icon-alipay"></text><text class="tit">支付宝</text>
			<!-- <view class="con"></view> -->
			<label class="radio" @click="changePayType(2)">
				<radio value="" color="#fa436a" :checked='payType == 2' />
				</radio>
			</label>
			
			<text class="icon yticon icon-bank"></text><text class="tit">银行卡</text>
			<label class="radio" @click="changePayType(3)">
				<radio value="" color="#fa436a" :checked='payType == 3' />
				</radio>
			</label>
		</view>
	
		
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="withdrawData.username" placeholder="开户行姓名,或者支付宝姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">账号</text>
			<input class="input" type="text" v-model="withdrawData.account" placeholder="银行卡号或者支付宝账号" placeholder-class="placeholder" />
		</view>

		<view class="row b-b" v-if="payType==3"> 
			<text class="tit">银行名称</text>
			<input class="input" type="text" v-model="withdrawData.bankname" placeholder="银行名称" placeholder-class="placeholder" />
		</view>
		
		
		
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payType:2,
				withdrawData: {
					username: '',
					account: '',
					bankname: '',
					channel: '',
					openid: ''
				},
				withdrawList:[],
			}
		},
		onLoad(option){
			this.loadAddress();
			let title = '新增提现账号';
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			changePayType(idx){
				if(idx==1){
					uni.showToast({
						title:"暂时不支持微信提现"
					})
					return;
				}
				this.payType=idx;
			},
			loadAddress(){
				this.withdrawList=this.$dataLocal("withdraw")||[];
				/* let _this=this;
				uni.getStorage({
					key: 'withdraw',
					success: function(res) {
						_this.withdrawList=res.data;
					}
				}); */
			},

			
			
			//提交
			confirm(){
				let li=this.withdrawList;
				let data = this.withdrawData;
				var type=this.payType;
				
				if(!data.username){
					this.$api.msg('请填开户行姓名,或者支付宝姓名');
					return;
				}
				if(!data.account){
					this.$api.msg('请填银行卡号或者支付宝账号');
					return;
				}
				if(!data.bankname&&type===3){
					this.$api.msg('请填银行名称');
					return;
				}
				data.channel=type;
				for(var i in li){li[i].picked=0}
				data.picked=1;
				li.push(data);
				for(let i in li){
				  var ite=li[i];
				  if(ite.name==='添加新账号'){
					  li.splice(i,1);
				  }
				}
				var o={value: 'add', name: '添加新账号',"picked":0};
			    li.push(o);
				this.$dataLocal("withdraw",li)
  		        /* uni.setStorage({
					key:'withdraw',
					data:li,
					success: () => {
						
					}
				}) */
				setTimeout(()=>{
					uni.navigateBack()
				}, 800)
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: #F1F1F1;
		padding-top: 16upx;
	}

.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: 32upx;
			color: #000000;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24upx;
			color: rgba(219, 63, 96, 0.4);
		}
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: #000000;
		}
		.input{
			margin-left: 1rem;
			flex: 1;
			font-size: 30upx;
			color: #000000;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: rgba(219, 63, 96, 0.4);
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: 32upx;
		color: #fff;
		background-color: #ffffff;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
