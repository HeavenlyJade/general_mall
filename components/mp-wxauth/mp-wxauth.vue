<template>
	<view style=" ">
		<!-- <slot></slot> -->
		
		<button
			style="position: fixed; top: 0;left:0; bottom:0;right:0; opacity: 0;"
		
			 open-type="getUserInfo" withCredentials="true" lang="zh_CN" 
			 
			 v-if="'getUserInfo'!=ignore&&!stoUser.wxHeadImg"
			 @getuserinfo="wxmpGetUser" 
			
			
			>
		</button>
		<button
			style="position: fixed; top: 0;left:0; bottom:0;right:0; opacity: 0;"
			open-type="getPhoneNumber"
			withCredentials="true"
			lang="zh_CN"
			v-if="'getPhoneNumber'!=ignore&&!stoUser.mobile"
			@getphonenumber="getphonenumber"
			>
		</button>
		
		
		
	</view>
</template>

<script>
	import store from "@/store/index.js"
	export default {
		computed:{
			stoUser(){
				return store.state.user
			}
		},
		props:{
			ignore:{
				Type:String,
				default:"none"
			}
		},
		data() {
			return {
				user:this.getUser()
			};
		},
		methods:{
			wxmpGetUser(e){
				//let o=e.detail.rawData;
				let o=JSON.parse(e.detail.rawData);
				let data=this.getUser();
				data.wxHeadImg=o.avatarUrl;
				data.wxNickName=o.nickName;
				this.$post("user/update",data,res2=>{
					this.$toast("操作成功")
					this.setUser(res2.data);
					store.dispatch("user/update",res2.data);
					this.user=res2.data;
										
				},(err)=>{
					this.$toast("请重试")
				})
				
			},
			
			updatemobile(data){
				data.id=this.getUser().id;
				this.$post("wxapi/updatemobilebywx",data,res2=>{
					this.$toast("操作成功")
					this.setUser(res2.data);
					store.dispatch("user/update",res2.data);
					this.user=res2.data;
										
				},(err)=>{
					this.$toast("请重试")
				})	
			},
			getphonenumber(e){			
				if(e.detail.errMsg.indexOf("fail")>-1){
					//this.$navigateTo("/pages/user/set");
					return;
				}
				//如果有效就直接用以前的sessionKey
				uni.checkSession({
					success: (res) => {
						let data=JSON.parse(JSON.stringify(e.detail))
						this.updatemobile(data)
					},
					fail: () => {
						//如果无效那么需要重新登录
						uni.login({
						  provider: 'weixin',
						  success:  (loginRes)=> {
							  console.log(e.detail,loginRes)
							  let data=JSON.parse(JSON.stringify(e.detail));//iv,encryptedData
							  data.code=loginRes.code;
							  this.updatemobile(data)
						  }
						});	
					}
				})
				
				

			}
		}
	}
</script>

<style>

</style>
