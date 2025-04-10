<template>
	<view class="mask" @click="dispatch" v-if="showit">
		
	</view>
</template>

<script>
	
	export default {
		computed:{
			showit(){
				//return false;
				return !(this.$store.state.config.tplreq)
			}
		},
		data() {
			return {
				
			};
		},
		created() {
			
		},
		methods:{
			dispatch(){
				
				uni.requestSubscribeMessage({
				    tmplIds: ['CI6GjycV_gwrblnMTaNCJfvUeFUes9a-YTuE3L1tJyE'],
					success:(res)=>{
						//this.$store.dispatch("config/tplreq")
						//this.$post("user/sentplmsg")
					},
					complete:(res)=>{
						this.$store.dispatch("config/tplreq")
						console.log("complete")
					},
				})
				
				
			}
		}
	}
</script>

<style lang="scss">
.mask{
	z-index: 100000;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top:30%;
	opacity: 0;
}
</style>
