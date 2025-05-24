<template>
  <div class="container">
    <div class="max-width">
      <img class="userinfo-avatar" :src="cardData.image_url || '/static/img/user/default-head.png'" mode="widthFix" />
    </div>
    <div class="profile-box">
      <div class="user-name">{{ cardData.name || '暂无姓名' }}</div>

      <div class="profile2">
        <div class="name">手机</div>
        <div class="position">{{ cardData.phone || '暂无手机号' }}</div>
        <div class="action">
          <button class="action-btn" @click="callPhone(cardData.phone)" :disabled="!cardData.phone">拨打</button>
        </div>
      </div>

      <div class="profile2">
        <div class="name">职业</div>
        <div class="position">{{ cardData.position || '暂无职业' }}</div>
        <div class="action">
          <button class="action-btn" @click="copyData(cardData.position)" :disabled="!cardData.position">复制</button>
        </div>
      </div>

      <div class="profile2">
        <div class="name">公司</div>
        <div class="position">{{ cardData.company || '暂无公司' }}</div>
        <div class="action">
          <button class="action-btn" @click="copyData(cardData.company)" :disabled="!cardData.company">复制</button>
        </div>
      </div>

      <div class="profile2">
        <div class="name">微信</div>
        <div class="position">{{ cardData.weixing || '暂无微信' }}</div>
        <div class="action">
          <button class="action-btn" @click="copyData(cardData.weixing)" :disabled="!cardData.weixing">复制</button>
        </div>
      </div>

      <div v-for="(v, k) in cardUserInfo.ext" :key="k" class="profile2">
        <div class="name">{{ k }}</div>
        <div class="position">{{ v }}</div>
        <div class="action">
          <button class="action-btn" @click="copyData(v)">复制</button>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <div class="button-row">
        <div class="button" @click="generatePoster">
          <div class="button-circle">
            <img class="img" src="/static/img/icons/posters.png">
          </div>
          <div class="txt">生成海报</div>
        </div>

        <div class="button">
          <div class="button-circle">
            <img class="img" src="/static/img/icons/wx.png">
          </div>
          <div class="txt">微信公众号</div>
        </div>
        <div class="button">
          <div class="button-circle">
            <img class="img" src="/static/img/icons/share.png">
          </div>
          <div class="txt">分享好友</div>
        </div>
      </div>
    </div>

    <!-- Canvas用于绘制海报 -->
    <canvas 
      canvas-id="posterCanvas" 
      id="posterCanvas"
      :style="{ width: '750rpx', height: '1334rpx', position: 'fixed', left: '-9999rpx', top: '-9999rpx' }"
    ></canvas>

    <!-- 海报预览弹窗 -->
    <div v-if="showPosterModal" class="poster-modal" @click="closePosterModal">
      <div class="poster-content" @click.stop>
        <div class="poster-header">
          <text class="poster-title">名片海报</text>
          <text class="close-btn" @click="closePosterModal">×</text>
        </div>
        <div class="poster-image-container">
          <img :src="posterImageUrl" class="poster-image" mode="widthFix" />
        </div>
        <div class="poster-actions">
          <button class="save-btn" @click="savePosterToAlbum">保存到相册</button>
          <button class="share-btn" @click="sharePoster">分享</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import QR from '@/components/qrcode/wxqrcode.js'

export default {
  data() {
    return {
      showMpjbutton: false,
      openShare: false,
      userInfo: undefined,
      cardUserInfo: {
        base: {
          avatarUrl: '/static/img/user/default-head.png'
        },
        ext: {}
      },
      kActionType: {},
      content: '...',
      qrcode: undefined,
      version: undefined,
      cardMyList: undefined,
      apiUserInfoMap: undefined,
      userId: null,
      apiUrl: getApp().globalData.apiUrl,
      cardData: {
   
      },
      loading: false,
      // 海报相关
      showPosterModal: false,
      posterImageUrl: '',
      isGeneratingPoster: false
    }
  },
  components: {
  },
  methods: {
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    },
    goIndex() {
      wx.reLaunch({
        url: '/pages/index/main'
      })
    },
    openWebsite() {
      // 打开金酱官网
      wx.navigateTo({
        url: '/pages/web_view/index?url=' + encodeURIComponent('http://www.mtzjjjy.com/')
      })
    },
    // async _userDetail() {
    //   // https://www.yuque.com/apifm/nu0f75/zgf8pu
    //   const res = await this.$wxapi.userDetail(this.token)
    //   if (res.code == 2000) {
    //     this.needLogin = true
    //   }
    //   if (res.code == 0) {
    //     if (!res.data.base.avatarUrl) {
    //       res.data.base.avatarUrl = '/static/img/user/default-head.png'
    //     }
    //     this.cardUserInfo = res.data
    //     uni.setStorageSync('cardUid', this.cardUserInfo)
    //   }
    // },
    callPhone(phone) {
      if (!phone) {
        uni.showToast({
          title: '暂无手机号',
          icon: 'none'
        })
        return
      }
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    copyData(d) {
      if (!d) {
        uni.showToast({
          title: '暂无数据',
          icon: 'none'
        })
        return
      }
      wx.setClipboardData({
        data: d,
        success: (res) => {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    addPhoneContact() {
      // 添加到手机联系人
      wx.addPhoneContact({
        firstName: this.cardData.name,
        mobilePhoneNumber: this.cardData.phone,
        organization: this.cardData.company || '',
        title: this.cardData.position || '',
        email: this.cardData.email || '',
        success: () => {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          })
        }
      })
    },
    generatePoster() {
      if (this.isGeneratingPoster) return
      
      // 验证数据完整性
      console.log('当前用户数据:', this.cardData)
      console.log('当前用户ID:', this.userId)
      
      if (!this.userId) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      
      // 检查是否有基本的名片数据
      if (!this.cardData || Object.keys(this.cardData).length === 0) {
        uni.showToast({
          title: '正在获取名片数据，请稍后重试',
          icon: 'none'
        })
        // 重新获取数据
        this.getCardData()
        return
      }
      
      this.isGeneratingPoster = true
      uni.showLoading({
        title: '正在生成海报...'
      })
      
      // 延迟一点时间确保界面更新
      setTimeout(() => {
        this.drawPoster()
      }, 100)
    },
    // 绘制海报 - 重新设计
    async drawPoster() {
      const ctx = uni.createCanvasContext('posterCanvas', this)
      
      // 设置画布尺寸 (px为单位)
      const canvasWidth = 375
      const canvasHeight = 667
      
      console.log('开始绘制海报，画布尺寸:', canvasWidth, 'x', canvasHeight)
      console.log('用户数据:', this.cardData)
      
      try {
        // 1. 清空画布并设置白色背景
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        
        // 2. 绘制顶部渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, 180)
        gradient.addColorStop(0, '#4ECDC4')
        gradient.addColorStop(1, '#44A08D')
        ctx.setFillStyle(gradient)
        ctx.fillRect(0, 0, canvasWidth, 180)
        
        // 3. 绘制头像区域
        await this.drawUserAvatar(ctx, canvasWidth / 2 - 35, 50, 70)
        
        // 4. 绘制用户名 - 使用固定的白色
        ctx.setFillStyle('#FFFFFF')
        ctx.font = 'bold 24px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        const userName = (this.cardData.name || '测试用户名').toString()
        console.log('绘制用户名:', userName)
        ctx.fillText(userName, canvasWidth / 2, 140)
        
        // 5. 绘制信息卡片区域
        this.drawCardBackground(ctx, 20, 200, canvasWidth - 40, 220)
        
        // 6. 绘制详细信息
        this.drawUserInfo(ctx, 40, 230)
        
        // 7. 绘制二维码
        await this.drawSimpleQR(ctx, canvasWidth / 2 - 50, 450, 100)
        
        // 8. 绘制底部提示
        ctx.setFillStyle('#666666')
        ctx.font = '16px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText('扫描二维码查看完整名片', canvasWidth / 2, 570)
        
        // 9. 执行绘制
        ctx.draw(false, () => {
          console.log('Canvas绘制完成，准备转换为图片')
          setTimeout(() => {
            this.convertToImage()
          }, 1500)
        })
        
      } catch (error) {
        console.error('绘制海报失败:', error)
        this.handleDrawError()
      }
    },

    // 绘制用户头像
    drawUserAvatar(ctx, x, y, size) {
      return new Promise((resolve) => {
        const avatarUrl = this.cardData.image_url || '/static/img/user/default-head.png'
        console.log('绘制头像:', avatarUrl)
        
        // 绘制圆形头像背景
        ctx.save()
        ctx.beginPath()
        ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI)
        ctx.clip()
        
        if (avatarUrl.startsWith('http')) {
          uni.downloadFile({
            url: avatarUrl,
            success: (res) => {
              ctx.drawImage(res.tempFilePath, x, y, size, size)
              ctx.restore()
              resolve()
            },
            fail: () => {
              ctx.drawImage('/static/img/user/default-head.png', x, y, size, size)
              ctx.restore()
              resolve()
            }
          })
        } else {
          ctx.drawImage(avatarUrl, x, y, size, size)
          ctx.restore()
          resolve()
        }
      })
    },

    // 绘制卡片背景
    drawCardBackground(ctx, x, y, width, height) {
      ctx.setFillStyle('#ffffff')
      ctx.setShadow(2, 2, 10, 'rgba(0,0,0,0.1)')
      ctx.fillRect(x, y, width, height)
      ctx.setShadow(0, 0, 0, 'transparent')
    },

    // 绘制用户信息
    drawUserInfo(ctx, startX, startY) {
      const lineHeight = 35
      let currentY = startY
      
      // 准备数据
      const infoList = [
        { label: '职位', value: this.cardData.position || '暂无' },
        { label: '公司', value: this.cardData.company || '暂无' },
        { label: '手机', value: this.cardData.phone || '暂无' },
        { label: '微信', value: this.cardData.weixing || '暂无' }
      ]
      
      console.log('绘制用户信息列表:', infoList)
      
      infoList.forEach((item, index) => {
        // 绘制标签
        ctx.setFillStyle('#888888')
        ctx.font = '16px sans-serif'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(item.label + ':', startX, currentY)
        
        // 绘制值
        ctx.setFillStyle('#333333')
        ctx.font = '16px sans-serif'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        
        let displayValue = item.value
        if (displayValue.length > 20) {
          displayValue = displayValue.substring(0, 20) + '...'
        }
        
        ctx.fillText(displayValue, startX + 80, currentY)
        currentY += lineHeight
      })
    },

    // 简化的二维码绘制
    drawSimpleQR(ctx, x, y, size) {
      return new Promise((resolve) => {
        try {
          const qrText = `名片分享-${this.cardData.name || 'User'}-${this.userId || 'ID'}`
          console.log('生成二维码文本:', qrText)
          
          // 绘制二维码背景
          ctx.setFillStyle('#ffffff')
          ctx.fillRect(x - 2, y - 2, size + 4, size + 4)
          
          // 绘制二维码边框
          ctx.setStrokeStyle('#cccccc')
          ctx.strokeRect(x - 2, y - 2, size + 4, size + 4)
          
          const qrImg = QR.createQrCodeImg(qrText, { size: size * 2 })
          ctx.drawImage(qrImg, x, y, size, size)
          
          resolve()
        } catch (error) {
          console.error('二维码生成失败:', error)
          // 绘制占位符
          ctx.setFillStyle('#f5f5f5')
          ctx.fillRect(x, y, size, size)
          ctx.setFillStyle('#999999')
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('二维码', x + size/2, y + size/2)
          resolve()
        }
      })
    },

    // 转换为图片
    convertToImage() {
      console.log('开始将Canvas转换为图片')
      uni.canvasToTempFilePath({
        canvasId: 'posterCanvas',
        quality: 1,
        success: (res) => {
          console.log('海报生成成功:', res.tempFilePath)
          this.posterImageUrl = res.tempFilePath
          this.showPosterModal = true
          uni.hideLoading()
          this.isGeneratingPoster = false
          
          uni.showToast({
            title: '海报生成成功！',
            icon: 'success'
          })
        },
        fail: (error) => {
          console.error('Canvas转图片失败:', error)
          this.handleDrawError()
        }
      }, this)
    },

    // 处理绘制错误
    handleDrawError() {
      uni.hideLoading()
      this.isGeneratingPoster = false
      uni.showToast({
        title: '海报生成失败，请重试',
        icon: 'none'
      })
    },

    // 获取名片数据 - 使用新接口
    getCardData() {
      // 获取用户数据
      const userData = this.getUser() 
      console.log('获取到的用户数据:', userData)
      
      // 尝试从不同字段获取用户ID
      const userId = userData.user_id
      
      if (!userId) {
        console.log('userId 为空，无法获取名片数据')
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      
      this.userId = userId
      this.userInfo = userData
      console.log('成功获取userId:', this.userId)
      
      this.loading = true
      console.log('开始获取名片数据，userId:', this.userId)
      
      // 使用项目通用请求方式
      this.$get('/wx_mini_app/card/', {
        user_id: this.userId
      }, res => {
        this.loading = false
        console.log('名片数据响应:', res)
        
        if (res.code === 200 && res.data) {
          const cardInfo = res.data
          this.cardData = {
            id: cardInfo.id,
            name: cardInfo.name ,
            position: cardInfo.position ,
            phone: cardInfo.phone ,
            weixing: cardInfo.weixing ,
            company: cardInfo.company ,
            image_url: cardInfo.image_url 
          }
          console.log('名片数据设置成功:', this.cardData)
        } else {
          console.error('获取名片数据失败:', res)
          uni.showToast({
            title: '获取名片数据失败',
            icon: 'none'
          })
        }
      }, err => {
        this.loading = false
        console.error('请求名片数据出错:', err)
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
      })
    },
  
    // 关闭海报弹窗
    closePosterModal() {
      this.showPosterModal = false
      this.posterImageUrl = ''
    },

    // 保存海报到相册
    savePosterToAlbum() {
      if (!this.posterImageUrl) return
      
      uni.saveImageToPhotosAlbum({
        filePath: this.posterImageUrl,
        success: () => {
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
        },
        fail: (error) => {
          console.error('保存失败:', error)
          if (error.errMsg.includes('auth')) {
            uni.showModal({
              title: '提示',
              content: '需要授权访问相册才能保存图片',
              showCancel: false
            })
          } else {
            uni.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        }
      })
    },

    // 分享海报
    sharePoster() {
      uni.showActionSheet({
        itemList: ['分享给朋友', '分享到朋友圈'],
        success: (res) => {
          if (res.tapIndex === 0) {
            console.log('分享给朋友')
          } else if (res.tapIndex === 1) {
            console.log('分享到朋友圈')
          }
        }
      })
    },
  },

  created() {
    // 调用应用实例的方法获取全局数据
  },
  onShow() {
    this.getCardData()
  },

  onLoad(e) {
    this.version = getApp().globalData.version
    if (e && e.cardUid) { // 转发
      uni.setStorageSync('referrer', e.cardUid)
      uni.setStorageSync('cardUid', e.cardUid)
    }
    if (e.scene) { // 扫码
      const scene = decodeURIComponent(e.scene)
      uni.setStorageSync('referrer', scene)
      uni.setStorageSync('cardUid', scene)
    }
  },

  onShareAppMessage: function () {
    return {
      title: '您好，我是 ' + (this.cardData.name || '未知') + '，请惠存我的名片。',
      path: '/pages/card/index?cardUid=' + (this.userId || ''),
      imageUrl: this.cardUserInfo.base.avatarUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 750rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.max-width {
  width: 750rpx;
  height: 400rpx;
  background-color: #ffffff;
  overflow: hidden;
}

.userinfo-avatar {
  width: 750rpx;
  height: 400rpx;
  object-fit: cover;
}

.profile-box {
  position: relative;
  margin-top: -60rpx;
  width: 700rpx;
  margin-left: 25rpx;
  background-color: #ffffff;
  border-radius: 15rpx;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.user-name {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

.profile2 {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.profile2:last-child {
  border-bottom: none;
}

.profile2 .name {
  width: 120rpx;
  font-size: 28rpx;
  color: #666;
}

.profile2 .position {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  margin-left: 20rpx;
}

.profile2 .action {
  width: 120rpx;
  text-align: right;
}

.action-btn {
  background-color: #f8f8f8;
  color: #666;
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  border: none;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  margin-top: 40rpx;
  margin-bottom: 60rpx;
}

.button-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;
}

.button {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33.3%;
}

.button-circle {
  /* width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #5ee7df, #4ECDC4);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx; */
}

.button .img {
  width: 100rpx;
  height: 150rpx;
}

.button .txt {
  font-size: 24rpx;
  color: #666;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-item.active {
  color: #4ECDC4;
}

.tab-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 5rpx;
}

.tab-text {
  font-size: 24rpx;
}

/* 海报弹窗样式 */
.poster-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.poster-content {
  width: 90%;
  max-width: 500rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.poster-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.poster-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f5f5f5;
}

.poster-image-container {
  padding: 30rpx;
  display: flex;
  justify-content: center;
}

.poster-image {
  width: 100%;
  max-width: 400rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.poster-actions {
  padding: 30rpx;
  display: flex;
  justify-content: space-around;
  gap: 20rpx;
}

.save-btn, .share-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 500;
}

.save-btn {
  background-color: #4ECDC4;
  color: #fff;
}

.share-btn {
  background-color: #f0f0f0;
  color: #333;
}
</style>