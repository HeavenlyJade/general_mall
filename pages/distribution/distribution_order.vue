<template>
  <div class="commission-details">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="back-icon" @click="navigateBack">
        <i class="icon-back"></i>
      </div>
      <div class="title">推广明细</div>
      <div class="search-icon">
        <i class="icon-search"></i>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-item" @click="toggleDateFilter">
        <span>付款时间</span>
        <i class="icon-down"></i>
        <span class="date-range">{{ dateRange }}</span>
      </div>
    </div>

    <!-- 标签栏 -->
    <div class="tabs">
      <div class="tab-item" :class="{ active: activeTab === -1 }" @click="switchTab('all')">
        全部
      </div>
      <div class="tab-item" :class="{ active: activeTab === 0 }" @click="switchTab('paid')">
        待结算
      </div>
      <div class="tab-item" :class="{ active: activeTab === 1 }" @click="switchTab('settled')">
        结算
      </div>
      <div class="tab-item" :class="{ active: activeTab === 2 }" @click="switchTab('expired')">
        冻结
      </div>
    </div>

    <!-- 日期选择器弹窗部分更新 -->
    <div class="date-picker-modal" v-if="showDatePickerModal">
      <div class="date-picker-container">
        <div class="date-picker-header">
          <div class="date-picker-title">
            {{ isSelectingEndDate ? '选择结束日期' : '选择开始日期' }}
          </div>
          <div class="date-picker-close" @click="cancelDateSelection">×</div>
        </div>

        <!-- 引用新的日期选择器组件 -->
        <WxDatePicker :defaultDate="isSelectingEndDate ? endDate : startDate" @update:selectedDate="onDateSelected" />

        <div class="date-picker-footer">
          <button class="cancel-btn" @click="cancelDateSelection">取消</button>
          <button class="confirm-btn" @click="confirmDateSelection">确定</button>
        </div>
      </div>
    </div>

    <!-- 佣金明细列表 -->
    <div class="commission-list">
      <div class="commission-item" v-for="(item, index) in filteredCommissions" :key="index">
        <div class="product-info">
          <div class="product-image" v-if="item.image">
            <img :src="item.image" :alt="item.product_name" />
          </div>
          <div class="product-details">
            <div class="product-title">{{ item.title }}</div>
            <div class="commission-info">
              <span>佣金率: {{ item.ratio }}</span>
              <span>佣金等级: {{ item.grade_id }}</span>
            </div>
          </div>
          <div class="expand-icon">
            <i class="icon-expand"></i>
          </div>
        </div>

        <div class="financial-details">
          <!-- <div class="financial-item">
            <div class="label">付款金额</div>
            <div class="value">¥{{ item.paymentAmount }}</div>
          </div> -->
          <div class="financial-item">
            <div class="label">预估佣金</div>
            <div class="value">{{ item.money }}</div>
          </div>
          <!-- <div class="financial-item">
            <div class="label">结算金额</div>
            <div class="value">{{ item.settledAmount || '-' }}</div>
          </div> -->
          <div class="financial-item">
            <div class="label">结算佣金</div>
            <div class="value">{{ item.money || '-' }}</div>
          </div>
        </div>

        <div class="order-details">
          <div class="payment-time">
            <span>付款: {{ item.create_time }}</span>
          </div>
          <div class="order-id">
            <span>订单ID: {{ item.order_id }}</span>
          </div>
          <div class="status">{{ getStatusText(item.status) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WxDatePicker from '@/components/datePicker/datePicker.vue';

export default {
  components: {
    WxDatePicker
  },
  data() {


    // 格式化日期为 YYYY-MM-DD


    return {
      activeTab: -1,
      dateRange: '',
      tempStartDate: '',
      showDatePickerModal: false,
      isSelectingEndDate: false,
      startDate: new Date('2021-12-13'),
      endDate: new Date('2025-12-20'),
      tempSelectedDate: null,
      commissions: [],
      apiUrl: getApp().globalData.apiUrl,
    }
  },
  computed: {
    filteredCommissions() {
      if (this.activeTab === -1) {
        return this.commissions;
      } else if (this.activeTab === 0) {
        return this.commissions.filter(item => item.status === 0);
      } else if (this.activeTab === 1) {
        return this.commissions.filter(item => item.status === 1);
      } else if (this.activeTab === 2) {
        return this.commissions.filter(item => item.status === 2);
      }
      return this.commissions;
    }
  },
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1
      });
    },
    getStatusText(status) {
    switch(parseInt(status)) {
      case 0:
        return '待结算';
      case 1:
        return '已结算';
      case 2:
        return '冻结';
      default:
        return '未知状态';
    }
  },
    switchTab(tab) {
      switch (tab) {
        case 'all':
          this.activeTab = -1;
          break;
        case 'paid':
          this.activeTab = 0;
          break;
        case 'settled':
          this.activeTab = 1;
          break;
        case 'expired':
          this.activeTab = 2;
          break;
      }
      this.fetchCommissionData(); // 切换标签后重新获取数据
    },
    onDateSelected(date) {
      this.tempSelectedDate = date;
    },
    confirmDateSelection() {
      if (!this.tempSelectedDate) {
        return;
      }

      if (!this.isSelectingEndDate) {
        // 处理开始日期
        this.startDate = new Date(this.tempSelectedDate);
        this.isSelectingEndDate = true;
        this.tempSelectedDate = null; // 重置临时日期

        wx.showToast({
          title: '请选择结束日期',
          icon: 'none'
        });
      } else {
        // 处理结束日期
        const endDate = new Date(this.tempSelectedDate);

        // 确保结束日期不早于开始日期
        if (endDate < this.startDate) {
          wx.showToast({
            title: '结束日期不能早于开始日期',
            icon: 'none'
          });
          return;
        }

        this.endDate = endDate;
        this.showDatePickerModal = false;

        // 格式化日期为 YYYY-MM-DD
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        this.dateRange = `${formatDate(this.startDate)}至${formatDate(this.endDate)}`;
        this.fetchCommissionData();
      }
    },
    toggleDateFilter() {
      wx.showActionSheet({
        itemList: ['最近7天', '最近30天', '自定义日期'],
        success: (res) => {
          if (res.tapIndex === 2) {
            this.showDatePicker();
          } else if (res.tapIndex === 0) {
            this.dateRange = this.getDateRange(7);
            this.fetchCommissionData();
          } else if (res.tapIndex === 1) {
            this.dateRange = this.getDateRange(30);
            this.fetchCommissionData();
          }
        }
      });
    },
    showDatePicker() {
      // 使用自定义日期选择器
      this.isSelectingEndDate = false;
      this.showDatePickerModal = true;
    },

    // 处理开始日期选择
    handleStartDateSelected(date) {
      this.startDate = date;
      this.isSelectingEndDate = true;
      wx.showToast({
        title: '请选择结束日期',
        icon: 'none'
      });
    },

    // 处理结束日期选择
    handleEndDateSelected(date) {
      // 确保结束日期不早于开始日期
      if (date < this.startDate) {
        wx.showToast({
          title: '结束日期不能早于开始日期',
          icon: 'none'
        });
        return;
      }

      this.endDate = date;
      this.showDatePickerModal = false;

      // 格式化日期为 YYYY-MM-DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      this.dateRange = `${formatDate(this.startDate)}至${formatDate(this.endDate)}`;
      this.fetchCommissionData();
    },

    // 取消日期选择
    cancelDateSelection() {
      this.showDatePickerModal = false;
    },
    getDateRange(days) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      return `${formatDate(startDate)}至${formatDate(endDate)}`;
    },
    async fetchCommissionData() {
      // 从起始日期和结束日期解析出日期范围
      const [startDate, endDate] = this.dateRange.split('至');

      await wx.request({
        url: this.apiUrl + '/api/v1/mini_core/distribution_income',
        method: 'GET',
        data: {
          start_date: startDate,
          end_date: endDate,
          status: this.activeTab,
          user_id: this.uid
        },
        success: (response) => {
          console.log("fetchCommissionData", response.data);
          if (response.data && response.data.code === 200) {
            this.commissions = response.data.data;
          }
        },
        fail: (error) => {
          console.error('Failed to fetch commission data:', error);
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
        }
      });
    },
    geDateDef() {
      const endDate = new Date();
      // 获取7天前的日期
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      // 格式化日期为 YYYY-MM-DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const dateRange = `${formatDate(startDate)}至${formatDate(endDate)}`;
      this.dateRange = dateRange
    }
  },
  onShow() {
    this.fetchCommissionData();

  },
  onLoad() {
    this.geDateDef()
  },
  onPullDownRefresh() {
    this.fetchCommissionData();
    wx.stopPullDownRefresh();
  }
}
</script>

<style scoped>
.commission-details {
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
  background-color: #ffffff;
  color: #333;
  position: relative;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 17px;
  font-weight: 500;
}

.back-icon {
  position: absolute;
  left: 15px;
  font-size: 20px;
}

.search-icon {
  position: absolute;
  right: 15px;
  font-size: 20px;
}

/* 筛选区域 */
.filter-section {
  padding: 10px 15px;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
}

.filter-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.icon-down {
  margin-left: 5px;
  font-size: 12px;
}

.date-range {
  margin-left: auto;
  font-size: 13px;
  color: #999;
}

/* 标签栏 */
.tabs {
  display: flex;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #ff525d;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background-color: #ff525d;
}

/* 佣金明细列表 */
.commission-list {
  padding: 10px 0;
}

.commission-item {
  margin-bottom: 10px;
  background-color: #ffffff;
  padding: 15px;
}

.product-info {
  display: flex;
  margin-bottom: 10px;
}

.product-image {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.commission-info {
  font-size: 12px;
  color: #999;
  display: flex;
}

.commission-info span {
  margin-right: 10px;
}

.expand-icon {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.financial-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  padding: 10px 0;
}

.financial-item {
  display: flex;
  align-items: center;
}

.label {
  font-size: 12px;
  color: #999;
  margin-right: 5px;
}

.value {
  font-size: 12px;
  color: #ff525d;
}

.order-details {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 10px;
  position: relative;
}

.payment-time {
  font-size: 12px;
  color: #999;
  margin-right: 15px;
}

.order-id {
  font-size: 12px;
  color: #999;
}

.status {
  position: absolute;
  right: 0;
  font-size: 14px;
  color: #666;
}

/* 日期选择器弹窗样式 */
.date-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.date-picker-container {
  width: 90%;
  max-width: 320px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.date-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.date-picker-title {
  font-size: 16px;
  font-weight: 500;
}

.date-picker-close {
  font-size: 22px;
  color: #999;
  cursor: pointer;
}

.date-picker-footer {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-top: 1px solid #eee;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background-color: #ff525d;
  color: white;
}
</style>