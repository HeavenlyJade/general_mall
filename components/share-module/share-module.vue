<template>
  <view class="share-module">
    <!-- 组件内容，如分享按钮等UI元素可放这里 -->
  </view>
</template>

<script>
export default {
  name: 'ShareModule',
  
  props: {
    // 页面标题，用于分享
    title: {
      type: String,
      default: ''
    },
    // 分享图片
    imageUrl: {
      type: String,
      default: ''
    },
    // 分享路径
    path: {
      type: String,
      default: ''
    },
    // 分享描述
    content: {
      type: String,
      default: ''
    },
    // 是否自动初始化分享
    autoInit: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      menuButtonInfoStyle: '',
      headerMarginTopStyle: '',
      shareOptions: {}
    }
  },
  
  created() {
    if (this.autoInit) {
      this.initShare()
    }
  },
  
  methods: {
    // 初始化分享功能
    initShare(options = {}) {
      // 合并传入的配置和props
      this.shareOptions = {
        title: options.title || this.title,
        imageUrl: options.imageUrl || this.imageUrl,
        path: options.path || this.path,
        content: options.content || this.content
      }
      
      // 小程序分享设置
      // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
      uni.showShareMenu({
        withShareTicket: true,
      })
      // #endif
      
      // 获取菜单按钮位置信息（用于自定义导航栏）
      // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
      this.setupMenuButtonInfo()
      // #endif
      
      // 设置页面标题
      if (this.shareOptions.title) {
        uni.setNavigationBarTitle({
          title: this.shareOptions.title
        })
      }
      
      // 微信H5 JSSDK配置
      // #ifdef H5
      this.initWechatJSSDK()
      // #endif
    },
    
    // 设置菜单按钮相关样式
    setupMenuButtonInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
        this.menuButtonInfoStyle = `width: ${systemInfo.screenWidth - menuButtonInfo.left}px;height: ${menuButtonInfo.height}px`
        this.headerMarginTopStyle = `margin-top:${menuButtonInfo.top}px`
        this.$emit('update:menuStyle', {
          menuButtonInfoStyle: this.menuButtonInfoStyle,
          headerMarginTopStyle: this.headerMarginTopStyle
        })
      } catch (e) {
        console.error('获取菜单按钮信息失败', e)
      }
    },
    
    // 处理小程序码中的场景值
    handleSceneCode(scene) {
      if (!scene) return
      
      try {
        const decodedScene = decodeURIComponent(scene)
        // 提取邀请人ID或其他参数
        if (decodedScene.includes('referrer=')) {
          const referrer = decodedScene.substring(decodedScene.indexOf('referrer=') + 9)
          this.$emit('scene-parsed', { referrer })
          return { referrer }
        }
      } catch (e) {
        console.error('解析场景值失败', e)
      }
      
      return null
    },
    
    // 初始化微信H5 JSSDK
    initWechatJSSDK() {
      // #ifdef H5
      const ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        // 调用JSSDK配置接口
        this.configJSSDK()
      }
      // #endif
    },
    
    // 配置微信JSSDK
    configJSSDK() {
      // 这里调用后端接口获取签名配置
      // 示例代码，实际实现需要根据项目后端接口调整
      this.$http.get('/api/wechat/jssdkconfig', {
        url: window.location.href
      }).then(res => {
        if (res.code === 0) {
          const config = res.data
          // 配置wx.config
          wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: [
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'chooseWXPay'
            ]
          })
          
          // 注册分享事件
          wx.ready(() => {
            this.registerWechatShare()
          })
        }
      }).catch(err => {
        console.error('获取微信JSSDK配置失败', err)
      })
    },
    
    // 注册微信分享事件
    registerWechatShare() {
      // #ifdef H5
      const shareData = {
        title: this.shareOptions.title,
        desc: this.shareOptions.content,
        link: window.location.href,
        imgUrl: this.shareOptions.imageUrl
      }
      
      // 兼容新旧接口
      if (wx.updateAppMessageShareData) {
        wx.updateAppMessageShareData(shareData)
      }
      if (wx.updateTimelineShareData) {
        wx.updateTimelineShareData(shareData)
      }
      // 兼容旧版本
      wx.onMenuShareTimeline(shareData)
      wx.onMenuShareAppMessage(shareData)
      // #endif
    }
  },
  
  // 小程序分享方法
  // #ifdef MP
  onShareAppMessage() {
    return {
      title: this.shareOptions.title,
      path: this.shareOptions.path,
      imageUrl: this.shareOptions.imageUrl,
      success: function() {
        uni.showToast({
          title: '分享成功'
        })
      },
      fail: function() {
        uni.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    }
  },
  
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.shareOptions.title,
      query: this.shareOptions.path.split('?')[1] || '',
      imageUrl: this.shareOptions.imageUrl
    }
  }
  // #endif
}
</script>

<style lang="scss">
.share-module {
  /* 组件样式 */
}
</style> 