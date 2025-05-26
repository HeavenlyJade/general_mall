<template>
    <div class="share-container">
      <!-- 顶部导航 -->
      <!-- 如需保留返回和更多按钮可只保留按钮，否则可直接移除整个header -->
  
      <!-- 集成分享分析模块 -->
      <share-module :title="shareTitle" :imageUrl="currentShareImage" :path="sharePath" :content="shareContent" />
  
      <!-- 海报内容区域 -->
      <div class="poster-container">
        <div class="poster-wrapper">
          <!-- 背景图片 -->
          <div class="poster-bg">
            <img
              v-if="loadedImages.length"
              :src="loadedImages[currentIndex]"
              class="poster-main-img"
            />
            <div class="user-name-bottom">{{ userInfo.nickname || userInfo.wxNickName || '推广员' }}</div>
            <div class="carousel-btn left" @click="prevBanner" v-if="bannerList.length > 1">
              <text>‹</text>
            </div>
            <div class="carousel-btn right" @click="nextBanner" v-if="bannerList.length > 1">
              <text>›</text>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 底部操作按钮 -->
      <div class="action-buttons">
        <!-- <button class="share-btn" @click="shareToFriend">分享好友</button> -->
        <button class="save-btn" @click="savePoster">保存相册</button>
      </div>
  
      <!-- 页面指示器 -->
      <div class="page-indicators">
        <div 
          v-for="(item, index) in bannerList" 
          :key="index"
          class="indicator" 
          :class="{ active: index === currentIndex }"
        ></div>
      </div>
    </div>
  </template>
  
  <script>
  import ShareModule from '@/components/share-module/share-module.vue'
  let QR = null
  try {
    QR = require('@/components/qrcode/wxqrcode.js')
  } catch (e) {
    console.warn('二维码组件加载失败:', e)
  }
  
  export default {
    components: {
      ShareModule
    },
    data() {
      return {
        bannerList: [],      // 原始图片url
        loadedImages: [],    // 已加载图片的本地url
        currentIndex: 0,
        userInfo: {},
        loading: false,
        shareUrl: '',
        qrCodeGenerated: false,
        shareTitle: '推广海报',
        shareContent: '扫码查看我的专属推广海报',
        sharePath: '',
      }
    },
    
    computed: {
      // 当前分享图片URL
      currentShareImage() {
        return this.loadedImages[this.currentIndex] || '/static/img/share-default.jpg'
      }
    },
    
    watch: {
      userInfo: {
        handler() {
          this.updateSharePath()
        },
        immediate: true,
        deep: true
      },
      currentIndex() {
        this.updateSharePath()
      }
    },
    
    methods: {
      // 获取推广海报背景图（不做本地缓存和预加载）
      getBannerImage() {
        this.$get('/wx_mini_app/banners/by-type/share', {}, res => {
          let list = []
          if (res.items && res.items.length > 0) {
            list = res.items.map(item => item.upload_image).filter(Boolean)
          } else if (res.data && res.data.length > 0) {
            list = res.data.map(item => item.upload_image || item.image_url).filter(Boolean)
          }
          if (list.length === 0) {
            list = ['/static/img/default.jpg']
          }
          this.bannerList = list
          this.loadedImages = list
          this.currentIndex = 0
        }, err => {
          this.bannerList = ['/static/img/default.jpg']
          this.loadedImages = ['/static/img/default.jpg']
          this.currentIndex = 0
        })
      },
      
      // 获取用户信息
      getUserInfo() {
        const userData = this.getUser()
        this.userInfo = userData || {}
        // console.log('用户信息:', this.userInfo)
      },
      
      // 生成二维码
      generateQRCode() {
        if (this.qrCodeGenerated) return
        
        try {
          // 构建分享链接，包含用户ID
          const userId = this.userInfo.id || this.userInfo.user_id
          const userName = this.userInfo.nickname || this.userInfo.wxNickName || 'User'
        //   this.shareUrl = `https://example.com/share?user_id=${userId}&name=${encodeURIComponent(userName)}`
          
        //   console.log('生成二维码内容:', this.shareUrl)
          
          const ctx = uni.createCanvasContext('qrCanvas', this)
          
          // 检查QR组件是否可用
          if (typeof QR !== 'undefined' && QR.createQrCodeImg) {
            const qrImg = QR.createQrCodeImg(this.shareUrl, { size: 240 })
            ctx.clearRect(0, 0, 120, 120)
            ctx.drawImage(qrImg, 0, 0, 120, 120)
            ctx.draw()
          } else {
            // 如果QR组件不可用，显示占位符
            this.drawQRPlaceholder(ctx)
          }
          
          this.qrCodeGenerated = true
        } catch (error) {
          console.error('二维码生成失败:', error)
          // 显示占位符
          const ctx = uni.createCanvasContext('qrCanvas', this)
          this.drawQRPlaceholder(ctx)
        }
      },
      
      // 绘制二维码占位符
      drawQRPlaceholder(ctx) {
        ctx.setFillStyle('#f5f5f5')
        ctx.fillRect(0, 0, 120, 120)
        ctx.setFillStyle('#999999')
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('二维码', 60, 60)
        ctx.draw()
      },
      
      // 返回上一页
      goBack() {
        uni.navigateBack()
      },
      
      // 分享给朋友
      shareToFriend() {
        uni.showActionSheet({
          itemList: ['分享给微信好友', '分享到朋友圈'],
          success: (res) => {
            if (res.tapIndex === 0) {
              console.log('分享给微信好友')
              this.shareToWeChat()
            } else if (res.tapIndex === 1) {
              console.log('分享到朋友圈')
              this.shareToMoments()
            }
          }
        })
      },
      
      // 分享到微信
      shareToWeChat() {
        // 微信小程序分享逻辑
        uni.showToast({
          title: '请使用右上角分享功能',
          icon: 'none'
        })
      },
      
      // 分享到朋友圈
      shareToMoments() {
        // 先保存海报，然后提示用户手动分享
        this.savePoster().then(() => {
          uni.showModal({
            title: '提示',
            content: '海报已保存到相册，请手动分享到朋友圈',
            showCancel: false
          })
        })
      },
      
      // 保存海报到相册
      savePoster() {
        const imgUrl = this.loadedImages[this.currentIndex]
        if (!imgUrl) {
          uni.showToast({ title: '图片未加载', icon: 'none' })
          return
        }
        // 判断是否为本地路径（简单判断）
        if (!imgUrl.startsWith('http')) {
          // 已经是本地路径，直接保存
          this.saveToAlbum(imgUrl)
        } else {
          // 先下载图片
          uni.downloadFile({
            url: imgUrl,
            success: (res) => {
              if (res.statusCode === 200) {
                this.saveToAlbum(res.tempFilePath)
              } else {
                uni.showToast({ title: '图片下载失败', icon: 'none' })
              }
            },
            fail: () => {
              uni.showToast({ title: '图片下载失败', icon: 'none' })
            }
          })
        }
      },
      saveToAlbum(filePath) {
        uni.saveImageToPhotosAlbum({
          filePath,
          success: () => {
            uni.showToast({ title: '保存成功', icon: 'success' })
          },
          fail: (error) => {
            if (error.errMsg && error.errMsg.includes('auth')) {
              uni.showModal({
                title: '提示',
                content: '需要授权访问相册才能保存图片',
                showCancel: false,
                success: () => {
                  uni.openSetting()
                }
              })
            } else {
              uni.showToast({ title: '保存失败', icon: 'none' })
            }
          }
        })
      },
      
      // 上一张海报
      prevBanner() {
        if (this.bannerList.length > 1) {
          this.currentIndex = (this.currentIndex - 1 + this.bannerList.length) % this.bannerList.length
        }
      },
      
      // 下一张海报
      nextBanner() {
        if (this.bannerList.length > 1) {
          this.currentIndex = (this.currentIndex + 1) % this.bannerList.length
        }
      },
      
      updateSharePath() {
        // 分享路径自动携带user_id
        const userId = this.userInfo.id || this.userInfo.user_id || ''
        this.sharePath = `/pages/share/index?user_id=${userId}`
      },
    },
    
    onLoad() {
      this.getUserInfo()
      this.getBannerImage()
    },
    
    onReady() {
      // 页面渲染完成后再生成二维码，避免 canvas 报错
      this.generateQRCode()
    },
    
    // 微信小程序分享配置 - 使用当前显示的推广海报作为分享图
    onShareAppMessage() {
      const userName = this.userInfo.nickname || this.userInfo.wxNickName || '推广员'
      const shareImage = this.currentShareImage
      
      console.log('分享配置:', {
        title: `${userName}邀请您品鉴优质酱香酒`,
        imageUrl: shareImage,
        currentIndex: this.currentIndex
      })
      
      return {
        title: `${userName}邀请您品鉴优质酱香酒`,
        path: `/pages/index/index?share_user_id=${this.userInfo.user_id}`,
        imageUrl: shareImage
      }
    },
    
    // 分享到朋友圈配置 - 同样使用当前显示的推广海报
    onShareTimeline() {
      const userName = this.userInfo.nickname 
      const shareImage = this.currentShareImage
      
      return {
        title: `${userName}邀请您品鉴优质酱香酒`,
        query: `share_user_id=${this.userInfo.user_id }`,
        imageUrl: shareImage
      }
    },
    
    mounted() {
      this.updateSharePath()
    },
  }
  </script>
  
  <style scoped>
  .share-container {
    width: 100%;
    min-height: 100vh;
    background-color: #fff;
    position: relative;
    overflow: hidden;
  }
  
  /* 顶部导航 */
  /* 如需保留返回和更多按钮可只保留按钮，否则可直接移除整个header */
  
  /* 海报容器 */
  .poster-container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 88rpx 0 200rpx 0;
    box-sizing: border-box;
  }
  
  .poster-wrapper {
    width: 90%;
    max-width: 600rpx;
    aspect-ratio: 3/4;
    position: relative;
  }
  
  .poster-bg {
    position: relative;
    width: 100%;
    height: 120vw;
    border-radius: 20rpx;
    overflow: hidden;
    background: #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .poster-main-img {
    width: 100%;
    height: 120vw;
    object-fit: cover;
    display: block;
  }
  
  /* 用户名字底部样式 */
  .user-name-bottom {
    position: absolute;
    left: 50%;
    bottom: 30rpx;
    transform: translateX(-50%);
    color: #fff;
    font-size: 24rpx;
    font-weight: normal;
    text-align: center;
    z-index: 3;
  }
  
  /* 二维码区域 */
  .qr-section {
    margin-top: 40rpx;
    margin-bottom: 30rpx;
  }
  
  .qr-code {
    width: 120rpx;
    height: 120rpx;
    background-color: #fff;
    border-radius: 12rpx;
    padding: 10rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
  }
  
  /* 底部操作按钮 */
  .action-buttons {
    position: fixed;
    bottom: 120rpx;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 40rpx;
    padding: 0 60rpx;
  }
  
  .share-btn, .save-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    border: none;
    font-size: 28rpx;
    font-weight: 500;
    color: #fff;
  }
  
  .share-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
  }
  
  .save-btn {
    background: linear-gradient(135deg, #2196F3, #1976D2);
  }
  
  /* 页面指示器 */
  .page-indicators {
    position: fixed;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12rpx;
  }
  
  .indicator {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
  }
  
  .indicator.active {
    background-color: #fff;
    width: 24rpx;
    border-radius: 6rpx;
  }
  
  /* 轮播按钮 */
  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 40rpx;
    color: #fff;
    background: rgba(0,0,0,0.3);
    border-radius: 50%;
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    cursor: pointer;
  }
  
  .carousel-btn.left { 
    left: 10rpx; 
  }
  
  .carousel-btn.right { 
    right: 10rpx; 
  }
  
  /* 响应式调整 */
  @media (max-width: 750rpx) {
    .poster-wrapper {
      width: 95%;
    }
    
    .user-name-bottom {
      font-size: 42rpx;
    }
    
    .action-buttons {
      padding: 0 40rpx;
    }
  }
  </style>