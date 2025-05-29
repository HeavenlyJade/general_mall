<template>
  <div class="distribution-center">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="title">分销中心</div>
      <div class="menu-icon">
        <i class="icon-more"></i>
      </div>
    </div>

    <!-- 用户信息区域 -->
    <div class="user-info-container">
      <div class="avatar">
        <image class="avatar-img" mode="aspectFill" 
          :src="userInfo.avatar || storeUser.wxHeadImg || getConst().defaultAvatar" 
          :class="{'avatar-logged': !!userInfo.id}">
        </image>
      </div>
      <div class="user-details">
        <div class="username">{{ storeUser.wxNickName || userData.real_name || '未设置姓名' }}</div>
        <div class="tag-container">
          <span class="tag">分销等级:LV{{ userData.grade_id || 0 }}</span>
        </div>
        <div class="referrer">上级分销：{{ userData.father_name || '无' }}</div>
      </div>
    </div>

    <!-- 佣金信息卡片 -->
    <div class="commission-card">
      <div class="available-commission">
        <div class="commission-info">
          <div class="label">可提现佣金：</div>
          <div class="amount">¥{{ incomeData.pending_money || 0 }}</div>
        </div>
        <div class="withdraw-button" @click="navigateTo('withdraw')">提现</div>
      </div>
      <div class="available-commission">
        <div class="label">已提现佣金：</div>
        <div class="amount">¥{{ incomeData.settled_money || 0 }}</div>
      </div>
      <div class="available-commission">
        <div class="label">冻结佣金：</div>
        <div class="amount">¥{{ incomeData.frozen_money || 0 }}</div>
      </div>
      <div class="available-commission">
        <div class="label">总佣金：</div>
        <div class="amount">¥{{ incomeData.total_money || 0 }}</div>
      </div>

      <div class="commission-stats">
        <div class="stat-item">
          <div class="stat-label">今日预估收益</div>
          <div class="stat-value">¥{{ incomeDMA.today_income || 0 }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">本月预估收益</div>
          <div class="stat-value">¥{{ incomeDMA.month_income || 0 }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">累计预估收益</div>
          <div class="stat-value">¥{{ incomeDMA.total_income || 0 }}</div>
        </div>
      </div>
    </div>


    <!-- 工具区域 -->
    <div class="tools-section">
      <div class="section-title">常用工具</div>
      <div class="tools-grid">
        <div class="tool-item" @click="navigateTo('withdrawal_records')">
          <div class="tool-icon order-icon">
          </div>
          <div class="tool-name">提现记录</div>
        </div>
        <div class="tool-item" @click="navigateTo('distribution_order')">
          <div class="tool-icon commission-icon"></div>
          <div class="tool-name">佣金明细</div>
        </div>
        <!-- <div class="tool-item" @click="navigateTo('statement')">
          <div class="tool-icon statement-icon"></div>
          <div class="tool-name">月度账单</div>
        </div> -->
        <div class="tool-item" @click="navigateTo('distribution_rule')">
          <div class="tool-icon rules-icon"></div>
          <div class="tool-name">分销规则</div>
        </div>
        <div class="tool-item" @click="navigateTo('distribution_num')">
          <div class="tool-icon rules-icon"></div>
          <div class="tool-name">分销成员</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  computed: {
    storeUser() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      userInfo: {},
      userData: {
        real_name: '',
        grade_id: 0,
        status: 0
      },
      incomeData: {
        frozen_money: 0,
        pending_money: 0,
        settled_money: 0,
        total_money: 0
      },
      incomeDMA: {
        today_income: 0,
        month_income: 0,
        total_income: 0
      },
    }
  },
  methods: {
    getuser() {
      // 获取用户信息，与user.vue页面保持一致
      let user = this.getUser() || { avatar: '/static/img/user/default-head.png', nickName: 'noname' };
      this.userInfo = user;
    },
    fetchDistributionData() {
      // 首先确认用户是否已登录
      if (!this.userInfo.id) {
        console.log('用户未登录，不获取分销数据');
        return;
      }
      
      const that = this; // 保存this引用
      this.$get("/wx_mini_app/wx/distribution_wx", {}, function(response) {
        console.log(response);
        
        // 首先检查响应是否成功且含有data
        if (response && response.code === 200 ) {
          // 检查data.data是否存在
          const responseData = response.data || {};
          
          // 使用that而不是this，添加额外的空对象判断防止undefined错误
          if (responseData && responseData.distribution) {
            that.userData = responseData.distribution;
          }

          // 更新收入数据，添加额外的检查
          if (responseData && responseData.income ) {
            that.incomeData = responseData.income;
          }

          // 更新每日/月度/总收入，添加额外的检查
          if (responseData && responseData.income_d_m_a ) {
            that.incomeDMA = responseData.income_d_m_a;
          }
        } else {
          // 处理错误情况
          console.error('获取分销数据失败:', response);
          // 可以添加用户提示
          uni.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
        }
      }, function(error) {
        // 添加错误回调处理
        console.error('请求出错:', error);
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      });
    },
    navigateTo(page) {
      console.log(`Navigate to ${page}`);
      this.$navigateTo(`/pages/distribution/${page}`);
    },
    generatePoster() {
      console.log('Generating poster');
      // 生成海报的逻辑
    },
  },
  onShow() {
    this.getuser();
    this.fetchDistributionData();
  },
  onLoad() {
    this.getuser();
    this.fetchDistributionData();
  },
}
</script>

<style scoped>
.distribution-center {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  background-color: #1ea875;
  color: white;
  position: relative;
}

.title {
  font-size: 18px;
  font-weight: 500;
}

.menu-icon {
  position: absolute;
  right: 15px;
  font-size: 20px;
}

/* 用户信息区域 */
.user-info-container {
  background-color: #1ea875;
  padding: 15px;
  display: flex;
  align-items: center;
  color: white;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: white;
  margin-right: 15px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.username {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
}

.tag-container {
  margin-bottom: 5px;
}

.tag {
  background-color: #ff9c38;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
}

.referrer {
  font-size: 12px;
  opacity: 0.9;
}

/* 佣金信息卡片 */
.commission-card {
  margin: -10px 15px 0;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.available-commission {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 15px;
}

.commission-info {
  display: flex;
  align-items: baseline;
}

.withdraw-button {
  background-color: #ff0000;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.label {
  font-size: 14px;
  color: #666;
}

.amount {
  font-size: 20px;
  color: #ff6b6b;
  font-weight: bold;
}

.commission-stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 14px;
  color: #ff6b6b;
}

/* 粉丝和海报区域 */
.distribution-stats {
  margin: 15px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  overflow: hidden;
}

.stat-column {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  position: relative;
}

.stat-column:first-child::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background-color: #eee;
}

.stat-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.stat-count {
  font-size: 16px;
  font-weight: bold;
}

.poster-button {
  display: inline-block;
  background-color: #1ea875;
  color: white;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 15px;
}

/* 工具区域 */
.tools-section {
  margin: 15px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tool-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  background-size: cover;
}

.order-icon {
  background-color: #ff9c38;
  border-radius: 50%;
  background-image: url('/static/img/distribution/dindan.png');
  /* 实际项目中替换为实际图标: background-image: url('@/assets/icons/order.png'); */
}

.commission-icon {
  background-color: #ff6b6b;
  border-radius: 50%;
  background-image: url('/static/img/distribution/yongj.png');
  /* 实际项目中替换为实际图标: background-image: url('@/assets/icons/commission.png'); */
}

.statement-icon {
  background-color: #4a90e2;
  border-radius: 50%;
  background-image: url('/static/img/distribution/zhangdan.png');
  /* 实际项目中替换为实际图标: background-image: url('@/assets/icons/statement.png'); */
}

.rules-icon {
  background-color: #1ea875;
  border-radius: 50%;
  background-image: url('/static/img/distribution/fenxguiz.png');

  /* 实际项目中替换为实际图标: background-image: url('@/assets/icons/rules.png'); */
}

.tool-name {
  font-size: 12px;
  color: #666;
}
</style>