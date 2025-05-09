<template>
  <view class="container">
    <view class="header">
      <image class="header-bg" src="/static/img/distribution/empty.jpg"></image>
      <view class="title">分销规则</view>
    </view>

    <view class="content">
      <view class="user-info" v-if="isDistributor">
        <view class="user-level">当前等级：{{ userInfo.level }}</view>
        <view class="progress-container">
          <view class="progress-text">距离下一等级还需消费：{{ nextLevelNeed }}元</view>
          <view class="progress-bar">
            <view class="progress-inner" :style="{ width: progressPercent + '%' }"></view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">等级体系</view>
        <view class="section-content">
          我们的分销系统共设置7个等级，从LV0到LV6，每个等级对应不同的分销权益。
        </view>
      </view>

      <view class="section">
        <view class="section-title">升级条件</view>
        <view class="section-content">
          <view class="condition-item">• 初始注册用户为LV0级别</view>
          <view class="condition-item">• 每提升一个等级需要累计消费10,000元</view>
          <view class="condition-item">• LV6为最高等级，需累计消费60,000元</view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">佣金比例</view>
        <view class="section-content">
          <view class="table-wrapper">
            <view class="table-header">
              <view class="th">等级</view>
              <view class="th">升级条件</view>
              <view class="th">自购返佣</view>
              <view class="th">一级分销</view>
            </view>
            <view 
              class="table-row" 
              v-for="(item, index) in distributionRules" 
              :key="index"
              :class="{ 'current-level': userInfo.levelIndex === index }"
            >
              <view class="td">{{ item.level }}</view>
              <view class="td">{{ item.requirement }}</view>
              <view class="td">{{ item.selfRatio }}</view>
              <view class="td">{{ item.firstRatio }}</view>
            </view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">特别说明</view>
        <view class="section-content">
          <view class="note-item">• LV0级别不享有分销权益</view>
          <view class="note-item">• 消费金额计算包括所有有效订单</view>
          <view class="note-item">• 分销佣金将在订单完成后自动结算到账户</view>
          <view class="note-item">• 分销等级会根据累计消费额自动调整</view>
        </view>
      </view>

      <view class="action-buttons">
        <button 
          class="action-btn apply-btn" 
          v-if="!isDistributor"
          @tap="applyForDistributor"
        >申请成为分销商</button>
        <button 
          class="action-btn share-btn" 
          v-if="isDistributor"
          open-type="share"
        >分享赚佣金</button>
        <button class="action-btn contact-btn" open-type="contact">联系客服</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isDistributor: true, // 是否已经是分销商
      userInfo: {
        levelIndex: 1, // 对应数组索引
        level: 'LV1',
        totalSpent: 12500, // 已消费金额
      },
      distributionRules: [
        { level: 'LV0', requirement: '初始等级', selfRatio: '0%', firstRatio: '0%' },
        { level: 'LV1', requirement: '消费10,000元', selfRatio: '12%', firstRatio: '20%' },
        { level: 'LV2', requirement: '消费20,000元', selfRatio: '12%', firstRatio: '30%' },
        { level: 'LV3', requirement: '消费30,000元', selfRatio: '12%', firstRatio: '40%' },
        { level: 'LV4', requirement: '消费40,000元', selfRatio: '12%', firstRatio: '50%' },
        { level: 'LV5', requirement: '消费50,000元', selfRatio: '12%', firstRatio: '60%' },
        { level: 'LV6', requirement: '消费60,000元', selfRatio: '12%', firstRatio: '60%' }
      ]
    }
  },
  computed: {
    // 下一级所需金额
    nextLevelNeed() {
      if (this.userInfo.levelIndex >= 6) return 0; // 已是最高等级
      const nextLevelThreshold = (this.userInfo.levelIndex + 1) * 10000;
      return Math.max(0, nextLevelThreshold - this.userInfo.totalSpent);
    },
    // 进度百分比
    progressPercent() {
      if (this.userInfo.levelIndex >= 6) return 100; // 已是最高等级
      const currentLevelThreshold = this.userInfo.levelIndex * 10000;
      const nextLevelThreshold = (this.userInfo.levelIndex + 1) * 10000;
      const levelDiff = nextLevelThreshold - currentLevelThreshold;
      const currentProgress = this.userInfo.totalSpent - currentLevelThreshold;
      return Math.min(100, (currentProgress / levelDiff) * 100);
    }
  },
  onLoad() {
    this.getUserDistributionInfo();
  },
  methods: {
    // 获取用户分销信息
    getUserDistributionInfo() {
      // 实际开发中应该调用API获取用户信息
      // 此处为模拟数据
      wx.showLoading({
        title: '加载中'
      });
      
      setTimeout(() => {
        this.isDistributor = true;
        this.userInfo = {
          levelIndex: 1,
          level: 'LV1',
          totalSpent: 12500
        };
        wx.hideLoading();
      }, 500);
    },
    
    // 申请成为分销商
    applyForDistributor() {
      wx.navigateTo({
        url: '/pages/distribution/apply'
      });
    },
    
    // 用户点击右上角分享
    onShareAppMessage() {
      return {
        title: '分销规则-加入我们的分销计划赚取佣金',
        path: '/pages/distribution/rules'
      }
    }
  }
}
</script>

<style>
.container {
  padding-bottom: 40rpx;
  /* background-color: #f8f8f8; */
  min-height: 100vh;
}

.header {
  position: relative;
  height: 180rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
}

.content {
  padding: 30rpx;
}

.user-info {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.user-level {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.progress-container {
  margin-top: 10rpx;
}

.progress-text {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 10rpx;
}

.progress-bar {
  height: 16rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background-color: #ff6b6b;
  border-radius: 8rpx;
}

.section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8rpx;
  width: 8rpx;
  height: 32rpx;
  background-color: #ff6b6b;
  border-radius: 4rpx;
}

.section-content {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.condition-item, .note-item {
  margin-bottom: 10rpx;
}

.table-wrapper {
  border: 1rpx solid #eeeeee;
  border-radius: 8rpx;
  overflow: hidden;
  margin-top: 20rpx;
}

.table-header {
  display: flex;
  background-color: #f7f7f7;
}

.table-row {
  display: flex;
  border-top: 1rpx solid #eeeeee;
}

.current-level {
  background-color: #fff9f9;
}

.th, .td {
  flex: 1;
  padding: 20rpx 10rpx;
  text-align: center;
  font-size: 26rpx;
}

.th {
  font-weight: 600;
  color: #333333;
}

.td {
  color: #666666;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50rpx;
}

.action-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 30rpx;
  border-radius: 44rpx;
  margin-bottom: 30rpx;
}

.apply-btn, .share-btn {
  background-color: #ff6b6b;
  color: #ffffff;
}

.contact-btn {
  background-color: #ffffff;
  color: #666666;
  border: 1rpx solid #dddddd;
}
</style>