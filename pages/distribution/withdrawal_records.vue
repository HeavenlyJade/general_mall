<template>
  <div class="withdrawal-records">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="back-icon" @click="navigateBack">
        <i class="icon-back"></i>
      </div>
      <div class="title">提现明细</div>
      <div class="more-icon">
        <i class="icon-more"></i>
      </div>
    </div>

    <!-- 月份筛选栏 -->
    <div class="month-filter" @click="toggleMonthPicker">
      <div class="selected-month">{{ currentMonth }} <i class="icon-down"></i></div>
      <div class="summary">
        <span>收入 ¥{{ totalIncome.toFixed(2) }}</span>
        <span class="expense">支出 ¥{{ totalExpense.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 月份选择器弹窗 -->
    <div class="month-picker-modal" v-if="showMonthPicker">
      <div class="month-picker-container">
        <div class="month-picker-header">
          <div class="month-picker-title">选择月份</div>
          <div class="month-picker-close" @click="showMonthPicker = false">×</div>
        </div>
        <div class="month-list">
          <div 
            v-for="month in availableMonths" 
            :key="month"
            class="month-item"
            :class="{ 'active': month === currentMonth }"
            @click="selectMonth(month)"
          >
            {{ month }}
          </div>
        </div>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="records-list">
      <div class="record-item" v-for="(record, index) in filteredRecords" :key="index">
        <div class="record-left">
          <div class="record-type">{{ record.type }}</div>
          <div class="record-time">{{ record.date }} {{ record.time }}</div>
        </div>
        <div class="record-right">
          <div class="record-amount" :class="{ 'income': record.amount > 0, 'expense': record.amount < 0 }">
            {{ record.amount > 0 ? '+' : '' }}{{ record.amount.toFixed(2) }}
          </div>
          <div class="record-balance">余额: {{ record.balance.toFixed(2) }}</div>
        </div>
      </div>
    </div>
    
    <!-- 底部提示 -->
    <div class="bottom-hint" v-if="records.length > 0">
      —— 没有更多记录了 ——
    </div>
    <div class="empty-state" v-else>
      暂无提现记录
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMonth: '2023年11月',
      showMonthPicker: false,
      availableMonths: [
        '2023年11月',
        '2023年10月',
        '2023年9月',
        '2023年8月',
        '2023年7月',
        '2023年6月'
      ],
      records: [
        {
          type: '直播场次收入',
          date: '11月02日',
          time: '20:56',
          amount: 4.95,
          balance: 4.99
        },
        {
          type: '收入免换抖币',
          date: '11月02日',
          time: '20:07',
          amount: -0.20,
          balance: 0.04
        },
        {
          type: '直播场次收入',
          date: '11月02日',
          time: '19:54',
          amount: 0.15,
          balance: 0.24
        },
        {
          type: '收入免换抖币',
          date: '11月01日',
          time: '22:11',
          amount: -1.60,
          balance: 0.09
        },
        {
          type: '直播场次收入',
          date: '11月01日',
          time: '21:38',
          amount: 1.20,
          balance: 1.69
        },
        {
          type: '直播场次收入',
          date: '11月01日',
          time: '19:59',
          amount: 0.05,
          balance: 0.49
        }
      ]
    };
  },
  computed: {
    filteredRecords() {
      // 根据当前选择的月份筛选记录
      const month = this.currentMonth.replace('年', '月').split('月')[0];
      return this.records.filter(record => {
        const recordMonth = record.date.split('月')[0];
        return recordMonth === month.slice(-2);
      });
    },
    totalIncome() {
      return this.filteredRecords
        .filter(record => record.amount > 0)
        .reduce((sum, record) => sum + record.amount, 0);
    },
    totalExpense() {
      return Math.abs(this.filteredRecords
        .filter(record => record.amount < 0)
        .reduce((sum, record) => sum + record.amount, 0));
    }
  },
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    toggleMonthPicker() {
      this.showMonthPicker = !this.showMonthPicker;
    },
    selectMonth(month) {
      this.currentMonth = month;
      this.showMonthPicker = false;
      this.fetchWithdrawalRecords();
    },
    fetchWithdrawalRecords() {
      // 这里应该是调用API获取数据
      console.log(`Fetching records for ${this.currentMonth}`);
      
      // 实际项目中，这里应该是向后端发送请求
      // wx.request({
      //   url: this.apiUrl + '/api/v1/mini_core/withdrawal_records',
      //   method: 'GET',
      //   data: {
      //     month: this.currentMonth
      //   },
      //   success: (response) => {
      //     if (response.data && response.data.code === 0) {
      //       this.records = response.data.data;
      //     }
      //   },
      //   fail: (error) => {
      //     console.error('Failed to fetch records:', error);
      //     wx.showToast({
      //       title: '获取数据失败',
      //       icon: 'none'
      //     });
      //   }
      // });
    }
  },
  onLoad() {
    // 设置当前月份为系统当前月份
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    this.currentMonth = `${year}年${month}月`;
    
    // 初始化时获取数据
    this.fetchWithdrawalRecords();
  }
};
</script>

<style scoped>
.withdrawal-records {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333333;
  min-height: 100vh;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: relative;
  padding: 0 15px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.title {
  font-size: 17px;
  font-weight: 500;
}

.back-icon, .more-icon {
  position: absolute;
  font-size: 20px;
}

.back-icon {
  left: 15px;
}

.more-icon {
  right: 15px;
}

/* 月份筛选栏 */
.month-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.selected-month {
  font-size: 16px;
  display: flex;
  align-items: center;
}

.icon-down {
  margin-left: 5px;
  font-size: 12px;
  color: #999999;
}

.summary {
  font-size: 14px;
  color: #666666;
}

.expense {
  margin-left: 15px;
}

/* 月份选择器弹窗 */
.month-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.month-picker-container {
  width: 80%;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.month-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
}

.month-picker-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.month-picker-close {
  font-size: 22px;
  color: #999999;
}

.month-list {
  padding: 10px 0;
  max-height: 300px;
  overflow-y: auto;
}

.month-item {
  padding: 12px 15px;
  text-align: center;
  font-size: 15px;
  color: #333333;
}

.month-item.active {
  color: #ff525d;
  font-weight: bold;
}

/* 记录列表 */
.records-list {
  padding: 10px 0;
}

.record-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: #ffffff;
  margin-bottom: 8px;
}

.record-left {
  flex: 1;
}

.record-type {
  font-size: 15px;
  margin-bottom: 5px;
  color: #333333;
}

.record-time {
  font-size: 13px;
  color: #999999;
}

.record-right {
  text-align: right;
}

.record-amount {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.record-amount.income {
  color: #ff525d;
}

.record-amount.expense {
  color: #3cb371;
}

.record-balance {
  font-size: 13px;
  color: #999999;
}

/* 底部提示 */
.bottom-hint {
  text-align: center;
  padding: 20px;
  color: #999999;
  font-size: 13px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999999;
  font-size: 15px;
}
</style>