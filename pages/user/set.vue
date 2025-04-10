<template>
	<view class="container " style="width: 100%;">

		
		<view class="list-cell b-b m-t flex c-center" style="align-items: center;" @click="choseimg()" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit w50p flex c-center">头像</text>
			<view class="w50p flex m-end">
				<image style="width: 2.6rem;height: 2.6rem; border-radius: 50%;" class="input" :src="user.headImg||user.wxHeadImg||getConst().defaultAvatar" ></image>
			</view>
			
		</view>
		
		<view class="list-cell b-b " style="margin-top: 1rem;"  hover-class="cell-hover" :hover-stay-time="50" @click="toreg()">
			<text class="cell-tit">手机号码</text>
			<input class="input" type="number" style="text-align: right;"  v-model="user.mobile" disabled="true"  placeholder="真实手机号码" placeholder-class="placeholder" />
		</view>
		
		<view class="list-cell b-b "  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<input class="input" type="text" style="text-align: right;" v-model="user.nickName"  placeholder="" placeholder-class="placeholder" />
		</view>
		
		
		<picker  :value="parseInt(user.gender||0)" :range="getConst().pickerObj.gender.list" @change="bindPickerChange">
			<view class="list-cell b-b "  hover-class="cell-hover" :hover-stay-time="50" >		
				<text class="cell-tit">性别</text>
			    <view class="uni-input">{{getConst().pickerObj.gender.map[parseInt(user.gender||0)].name}}</view>
		    </view>
		 </picker>


		
	     <view class="list-cell b-b" @tap="updatePwd()" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改密码</text>
			
		</view> 
		<view class="list-cell" @tap="toLogout()"  style="margin-top: 0.4rem;">
			<text class="cell-tit">退出登录</text>
			
		</view>
		
		<button open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxmpGetUser" 
		class="list-cell log-out-btn center90 " style="background-color: #F0AD4E; color: #ffffff;" @click="refreshwx()">
			<text class="cell-tit ">刷新微信信息</text>
		</button>
		
		<button class="list-cell log-out-btn center90" style="background-color: #F0AD4E; color: #ffffff;" @click="confirm()">
			<text class="cell-tit ">保存</text>
		</button>

	</view>
</template>

<script>

	 

	

	
	export default {
		components: {
		    
		    
		},
		data() {

			return {
		
				user:{
					"id":"",
					"guiderId":"",
					"sex":"",
					"mobile":"",
					"province":'',
					"city":'',
					"district":'',

					"headImg":"",
					
					"gender":"0",
				},

				
				
				
			};
		},
		onLoad(options) {			
			this.loadData();
		},
		onShow() {
			this.$toast(this.getConst().version_code);
			
		},
		
		methods:{
			bindPickerChange(e){
				
				this.user.gender=e.detail.value;
				this.user=JSON.parse(JSON.stringify(this.user));
				console.log(this.user);
			},
			
			refreshwx(){
				this.updateWxLogin();
			
			},
			
			choseimg(){
				this.$chooseImageUpload(1,res=>{
					
					this.user.headImg=res[0];
					this.user=JSON.parse(JSON.stringify(this.user));
				})
				
			},
			
			updatePwd(){
			
				this.$navigateTo('login/forget');
				
			},
		
			loadData(){
				this.$refreshUser(this.getUser().id,res=>{
					this.user=res.data;
					if(!this.user.nickName)this.user.nickName=this.user.wxNickName||'';
				})			
			},
			
			confirm(){
				var o=this.user;			
				let _this=this;
				this.$post("user/update",o,function(res){
					_this.setUser(res.data);
					setTimeout(()=>{
						uni.navigateBack()
					}, 800)
				})			
			},
			
			toreg(){
				if(this.$isNull(this.user.id)||this.$isNull(this.user.mobile)){					
					this.$dataLocal("pre_reg_page","/pages/user/set");
					this.$redirectTo("login/register");
					
				}else{
					
				}				
			},

			toLogout(){
				uni.showModal({
					title: '确定要退出登录么？',
					success: (e)=>{
						if(e.confirm){
							this.$rmLoginMsg();
							this.$reLaunch('login/login');

						}
					}
				})
			},
			
			switchChange(e){
				console.log(e.detail)
				let statusTip = e.detai ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'> 
	
	page{
		overflow-x: hidden;
		background: #ffffff;
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
			color: #303133;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: #303133;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: #909399;
		}
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx 0.9rem;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:0.8rem;
			color:#909399;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: 0.72rem;
			color: #303133;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: 0.9rem;
			color: #909399;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
