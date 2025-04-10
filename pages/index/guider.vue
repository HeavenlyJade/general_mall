<template>
    <view class="main">
        <code-elf-guide ></code-elf-guide>
        <policy ></policy>
    </view>
</template>
<script>
   import codeElfGuide from '@/components/code-elf-guide/code-elf-guide.vue'
   import policy from '@/components/code-elf-guide/policy.vue'
   
    export default {
        components: {
            codeElfGuide,policy
        },
        data() {
            return {
            }
        },
		onLoad() {
			
		},
		onShow(){
			
		},

        methods: {

        }
    }
</script>

<style>
 page,.main{
 	width: 100%;
 	height: 100%;
 }
  
</style>
