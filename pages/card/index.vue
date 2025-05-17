<template>
  <div class="container">
    <div class="max-width">
      <img class="userinfo-avatar" :src="cardUserInfo.base.avatarUrl" mode="widthFix" />
    </div>
    <div class="profile-box">
      <div class="user-name">{{ cardData.name }}</div>

      <div class="profile2">
        <div class="name">手机</div>
        <div class="position">{{ cardData.phone }}</div>
        <div class="action">
          <button class="action-btn" @click="callPhone(cardData.phone)">拨打</button>
        </div>
      </div>

      <div class="profile2">
        <div class="name">职业</div>
        <div class="position">{{ cardData.position }}</div>
        <div class="action">
          <button class="action-btn" @click="copyData(cardData.position)">复制</button>
        </div>
      </div>

      <div class="profile2">
        <div class="name">微信</div>
        <div class="position">{{ cardData.weixing }}</div>
        <div class="action">
          <button class="action-btn" @click="copyData(cardData.weixing)">复制</button>
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
        <div class="button" @click="cardposter">
          <div class="button-circle">
            <img class="img" src="/static/images/posters.png">
          </div>
          <div class="txt">生成海报</div>
        </div>

        <div class="button" @click="addPhoneContact">
          <div class="button-circle">
            <img class="img" src="/static/images/txl.png">
          </div>
          <div class="txt">保存电话</div>
        </div>

        <div class="button">
          <div class="button-circle">
            <img class="img" src="/static/images/share.png">
          </div>
          <div class="txt">分享好友</div>
        </div>
      </div>

      <div class="button-row">
        <div class="button" @click="openWebsite">
          <div class="button-circle">
            <img class="img" src="/static/images/jingjianglogo.png">
          </div>
          <div class="txt">金酱官网</div>
        </div>
        <!-- Additional buttons can be added here -->
        <div class="button">
          <div class="button-circle">
            <img class="img" src="/static/images/wx.png">
          </div>
          <div class="txt">微信公众号</div>
        </div>
      </div>
    </div>

    <!-- <div class="tab-bar">
      <div class="tab-item active">
        <img class="tab-icon" src="/static/images/card.png">
        <div class="tab-text">名片</div>
      </div>
      <div class="tab-item">
        <img class="tab-icon" src="/static/images/project.png">
        <div class="tab-text">项目</div>
      </div>
      <div class="tab-item">
        <img class="tab-icon" src="/static/images/resume.png">
        <div class="tab-text">简历</div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMpjbutton: false,
      openShare: false,
      userInfo: undefined,
      cardUserInfo: undefined,
      kActionType: {},
      content: '...',
      qrcode: undefined,
      version: undefined,
      cardMyList: undefined,
      apiUserInfoMap: undefined,
      openid: undefined,
      apiUrl:getApp().globalData.apiUrl,
      cardData: {
        name: '陈启华',
        position: '视觉设计',
        phone: '13235813122',
        weixing: 'designer_pan@163.com'
      }
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
    async _userDetail() {
      // https://www.yuque.com/apifm/nu0f75/zgf8pu
      const res = await this.$wxapi.userDetail(this.token)
      if (res.code == 2000) {
        this.needLogin = true
      }
      if (res.code == 0) {
        if (!res.data.base.avatarUrl) {
          res.data.base.avatarUrl = '/static/images/Sn22.png'
        }
        this.cardUserInfo = res.data
        uni.setStorageSync('cardUid', this.cardUserInfo)
      }
    },
    callPhone(phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    copyData(d) {
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
    cardposter() {
      // 生成海报逻辑
      wx.showToast({
        title: '正在生成...',
        icon: 'loading'
      })
      // 实际生成海报的代码
    },
    async getCardMsg() {
      console.log(this.apiUrl)
      await wx.request({
        url: this.apiUrl+ '/api/v1/wx_mini_app/card',
        method: 'GET',
        data: {
          openid: this.openid
        },
        success: (response) => {
          console.log("response.data222", response)
          if (response.data) {
            this.cardData = response.data.data
            console.log("data type2:", typeof response.data);
          }
        }
      })
    },
    async getWxInfo() {
      const res = await this.$wxapi.userWxinfo(this.token);
      this.openid = res.data.openid
      this.getCardMsg()
    },
  },

  created() {
    // 调用应用实例的方法获取全局数据
  },
  onShow() {
    this._userDetail()
    const cardUid = uni.getStorageSync('cardUid')
    this.getWxInfo()
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
      title: '您好，我是 ' + process.env.APP_NAME + ' 的' + this.cardUserInfo.base.nick + '，请惠存我的名片。',
      path: '/pages/card/main?cardUid=' + this.cardUserInfo.base.id,
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
</style>