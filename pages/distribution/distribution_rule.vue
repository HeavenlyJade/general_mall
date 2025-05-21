<template>
  <view class="container">
    <view class="header">
      <image class="header-bg" src="/static/img/distribution/empty.jpg"></image>
      <view class="title">分销规则</view>
    </view>

    <view class="loading-container" v-if="loading">
      <view class="loading-text">加载中...</view>
    </view>

    <view class="content" v-if="!loading">
      <view class="user-info" v-if="isDistributor">
        <view class="user-level">当前等级：{{ userInfo.level }}</view>
        <view class="progress-container">
          <view class="progress-text">距离下一等级还需消费：{{ nextLevelNeed }}元</view>
          <view class="progress-bar">
            <view class="progress-inner" :style="{ width: progressPercent + '%' }"></view>
          </view>
        </view>
      </view>

      <view class="section" v-for="(section, index) in configSections" :key="index" v-if="section.title">
        <view class="section-title">{{ section.content }}</view>
        <view class="section-content" v-if="!section.isHtml">
          {{ section.title }}
        </view>
        <view class="section-content" v-else v-html="formatText(section.title)">
        </view>
      </view>

      <view class="section">
        <view class="section-title">佣金比例</view>
        <view class="section-content">
          <view class="table-wrapper">
            <view class="table-header">
              <view class="th">等级</view>
              <view class="th">升级条件</view>
              <!-- <view class="th">自购返佣</view> -->
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
              <!-- <view class="td">{{ item.selfRatio }}</view> -->
              <view class="td">{{ item.firstRatio }}</view>
            </view>
          </view>
        </view>
      </view>

      <view class="action-buttons">
        <!-- <button 
          class="action-btn apply-btn" 
          v-if="!isDistributor"
          @tap="applyForDistributor"
        >申请成为分销商</button> -->
        <button  class="action-btn share-btn" open-type="share">分享赚佣金</button>
        <!-- <button class="action-btn contact-btn" open-type="contact">联系客服</button> -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: true, // 新增加载状态
      isDistributor: false, // 是否已经是分销商
      userInfo: {
        levelIndex: 0, // 对应数组索引
        level: '',
        totalSpent: 0, // 已消费金额
      },
      distributionRules: [],
      configData: {
        levelSystem: '',
        upgradeConditions: '',
        specialNotes: ''
      },
      configSections: [] // 配置部分数组
    }
  },
  computed: {
    // 下一级所需金额
    nextLevelNeed() {
      if (!this.userInfo || this.userInfo.levelIndex >= 3) return 0; // 已是最高等级 (LV3)
      
      // 找到下一级别所需的消费金额
      if (this.distributionRules && this.distributionRules.length > 0) {
        const nextLevelIndex = this.userInfo.levelIndex + 1;
        if (nextLevelIndex < this.distributionRules.length) {
          const nextLevelRule = this.distributionRules[nextLevelIndex];
          if (nextLevelRule) {
            // 从条件中提取数字部分
            const match = nextLevelRule.requirement.match(/(\d+)/);
            if (match && match[1]) {
              const nextLevelThreshold = parseFloat(match[1]);
              return Math.max(0, nextLevelThreshold - this.userInfo.totalSpent);
            }
          }
        }
      }
      return 0;
    },
    
    // 进度百分比
    progressPercent() {
      if (!this.userInfo || this.userInfo.levelIndex >= 3) return 100; // 已是最高等级 (LV3)
      
      if (this.distributionRules && this.distributionRules.length > 0) {
        const currentLevelIndex = this.userInfo.levelIndex;
        const nextLevelIndex = currentLevelIndex + 1;
        
        if (nextLevelIndex < this.distributionRules.length) {
          const currentRule = this.distributionRules[currentLevelIndex];
          const nextRule = this.distributionRules[nextLevelIndex];
          
          if (currentRule && nextRule) {
            // 从条件中提取数字部分
            const currentMatch = currentRule.requirement.match(/(\d+)/);
            const nextMatch = nextRule.requirement.match(/(\d+)/);
            
            if (currentMatch && nextMatch) {
              const currentThreshold = parseFloat(currentMatch[1]) || 0;
              const nextThreshold = parseFloat(nextMatch[1]) || 0;
              const levelDiff = nextThreshold - currentThreshold;
              
              if (levelDiff > 0) {
                const currentProgress = this.userInfo.totalSpent - currentThreshold;
                return Math.min(100, (currentProgress / levelDiff) * 100);
              }
            }
          }
        }
      }
      return 0;
    }
  },

  onShow(){
    this.getUserDistributionInfo();
  },
  onLoad() {
    // this.getUserDistributionInfo();
  },
  methods: {
    // 获取用户分销信息
    getUserDistributionInfo() {
      this.loading = true; // 开始加载
      wx.showLoading({
        title: '加载中'
      });
      
      this.$post('/wx_mini_app/wx/wx_distribution_data', {}, res => {
        console.log("res ", res)
        if (res.grade_data) {
          // 设置分销规则数据
          this.distributionRules = res.grade_data.map(item => ({
            level: item.name,
            requirement: item.remark,
            selfRatio: item.self_ratio + '%',
            firstRatio: item.first_ratio + '%'
          }));
          console.log("this.distributionRules ", this.distributionRules)
          
          // 处理配置数据
          if (res.config_data && res.config_data.length > 0) {
            this.configSections = res.config_data.map(item => {
              // 决定是否需要HTML渲染（包含换行符的内容）
              const needHtml = item.title.includes('\n');
              return {
                content: item.content,
                title: item.title,
                isHtml: needHtml
              };
            });
          }
          
          // 设置用户分销信息
          const userData = res.distribution_user_data;
          if (userData) {
            this.isDistributor = userData.status === 1;
            
            // 使用lv_id代替grade_id
            const userGradeId = userData.lv_id;
            const userGradeInfo = res.grade_data.find(item => item.id === userGradeId);
            
            if (userGradeInfo) {
              // 找到等级在数组中的索引
              const levelIndex = res.grade_data.findIndex(item => item.id === userGradeId);
              
              this.userInfo = {
                levelIndex: levelIndex >= 0 ? levelIndex : 0,
                level: userGradeInfo.name,
                totalSpent: userData.total_amount || 0  // 使用total_amount作为消费金额
              };
            }
          } else {
            this.isDistributor = false;
          }
        }
        this.loading = false; // 数据加载完成
        wx.hideLoading();
      }, err => {
        console.error('获取分销数据失败', err);
        uni.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
        this.loading = false; // 即使出错也要设置加载完成
        wx.hideLoading();
      });
    },
    
    // 格式化文本，将\n转换为<br>
    formatText(text) {
      return text ? text.replace(/\n/g, '<br>') : '';
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}
</style>