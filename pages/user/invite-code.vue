<template>
  <view class="invite-code-page">
    <view
      v-if="headerBgImage"
      class="header-bg"
      :style="'background-image:url(' + headerBgImage + ');'"
    ></view>
    <view class="content">
      <view class="title">填写邀请码</view>
      <view v-if="canInputInviteCode">
        <input v-model="inviteCode" class="input" placeholder="请输入邀请码" />
        <button class="submit-btn" @click="submitInviteCode">提交</button>
      </view>
      <view v-else style="text-align:center;color:#999;margin-top:40rpx;">
        您已绑定的邀请码：<text style="color:#333;">{{bindedInviteCode}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inviteCode: '',
      headerBgImage: '',
      canInputInviteCode: true,
      bindedInviteCode: ''
    };
  },
  methods: {
    getHeaderBgImage() {
      this.$get('/wx_mini_app/banners/by-type/invite_page', {}, res => {
        if (res && res.items && res.items.length > 0) {
          this.headerBgImage = res.items[0].upload_image;
        }
      }, err => {
        console.error('获取背景图片失败:', err);
      });
    },
    submitInviteCode() {
      if (!this.inviteCode) {
        this.$toast('请输入邀请码');
        return;
      }
      this.$post('/wx_mini_app/wx/distributionInviteCode', { user_father_invite_code: this.inviteCode }, res => {
        if (res.code === 200) {
          this.$toast('邀请码绑定成功');
          this.$dataLocal('distributionUser', res.data);

          setTimeout(() => {
            uni.navigateBack();
          }, 1000);
        } else {
          this.$toast(res.msg || '绑定失败');
        }
      }, err => {
        this.$toast('网络错误，绑定失败');
      });
    }
  },
  onLoad() {
    this.getHeaderBgImage();
    let distributionUser = this.$dataLocal('distributionUser');
    if (distributionUser && distributionUser.user_father_invite_code) {
      this.canInputInviteCode = false;
      this.bindedInviteCode = distributionUser.user_father_invite_code;
    } else {
      this.canInputInviteCode = true;
      this.bindedInviteCode = '';
    }
  }
};
</script>

<style scoped>
.invite-code-page {
  position: relative;
  min-height: 100vh;
  background: #fff;
}
.header-bg {
  width: 100%;
  height: 320rpx;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.content {
  position: relative;
  z-index: 1;
  margin-top: -80rpx;
  padding: 0 40rpx 40rpx 40rpx;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  box-shadow: 0 -8rpx 24rpx rgba(0,0,0,0.03);
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  text-align: center;
  margin-top: 40rpx;
}
.input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #eee;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  margin-bottom: 40rpx;
  box-sizing: border-box;
}
.submit-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(to right, #ff7043, #ff5722);
  color: #fff;
  font-size: 32rpx;
  border: none;
  border-radius: 12rpx;
}
</style> 