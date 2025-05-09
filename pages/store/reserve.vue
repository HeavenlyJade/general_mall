<template>
  <div class="reserve-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="back-icon" @click="navigateBack">
        <i class="icon-back"></i>
      </div>
      <div class="title">预约到店</div>
    </div>

    <!-- 门店信息 -->
    <div class="store-info">
      <div class="store-image">
        <image :src="storeInfo.image || getConst().defaultStoreImage" mode="aspectFill"></image>
      </div>
      <div class="store-details">
        <div class="store-name">{{storeInfo.name}}</div>
        <div class="store-address">{{storeInfo.address}}</div>
      </div>
    </div>

    <!-- 预约表单 -->
    <div class="form-container">
      <!-- 选择日期 -->
      <div class="form-group">
        <div class="form-title">选择日期</div>
        <div class="date-picker">
          <div 
            v-for="(date, index) in availableDates" 
            :key="index"
            class="date-item"
            :class="{'date-selected': selectedDate === date.value}"
            @click="selectDate(date.value)"
          >
            <div class="date-day">{{date.day}}</div>
            <div class="date-weekday">{{date.weekday}}</div>
          </div>
        </div>
      </div>

      <!-- 选择时间段 -->
      <div class="form-group">
        <div class="form-title">选择时间段</div>
        <div class="time-picker">
          <div 
            v-for="(time, index) in availableTimes" 
            :key="index"
            class="time-item"
            :class="{
              'time-selected': selectedTime === time.value,
              'time-disabled': time.disabled
            }"
            @click="!time.disabled && selectTime(time.value)"
          >
            {{time.label}}
          </div>
        </div>
      </div>

      <!-- 选择服务项目 -->
      <div class="form-group">
        <div class="form-title">选择服务项目</div>
        <div class="service-picker">
          <div 
            v-for="(service, index) in availableServices" 
            :key="index"
            class="service-item"
            :class="{'service-selected': selectedServices.includes(service.id)}"
            @click="toggleService(service.id)"
          >
            <div class="service-name">{{service.name}}</div>
            <div class="service-price">¥{{service.price}}</div>
            <div class="service-duration">{{service.duration}}分钟</div>
            <div class="service-checkbox">
              <i class="checkbox-icon" :class="{'checkbox-active': selectedServices.includes(service.id)}"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="form-group">
        <div class="form-title">联系信息</div>
        <div class="contact-form">
          <div class="input-group">
            <div class="input-label">姓名</div>
            <input type="text" v-model="contactInfo.name" placeholder="请输入您的姓名" />
          </div>
          <div class="input-group">
            <div class="input-label">手机号</div>
            <input type="text" v-model="contactInfo.phone" placeholder="请输入您的手机号" />
          </div>
          <div class="input-group">
            <div class="input-label">备注</div>
            <textarea v-model="contactInfo.remark" placeholder="请输入备注信息（选填）"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提交按钮 -->
    <div class="bottom-bar">
      <div class="price-info">
        <div class="price-label">总计：</div>
        <div class="price-total">¥{{totalPrice}}</div>
      </div>
      <div class="submit-button" @click="submitReservation">提交预约</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeId: '',
      storeInfo: {
        name: '',
        address: '',
        image: ''
      },
      availableDates: [],
      availableTimes: [],
      availableServices: [],
      selectedDate: '',
      selectedTime: '',
      selectedServices: [],
      contactInfo: {
        name: '',
        phone: '',
        remark: ''
      }
    }
  },
  computed: {
    totalPrice() {
      if (!this.availableServices.length) return 0;
      
      return this.selectedServices.reduce((total, serviceId) => {
        const service = this.availableServices.find(s => s.id === serviceId);
        return total + (service ? parseFloat(service.price) : 0);
      }, 0).toFixed(2);
    }
  },
  methods: {
    navigateBack() {
      uni.navigateBack();
    },
    fetchStoreInfo() {
      const that = this;
      this.$get("/wx_mini_app/wx/store_detail", {
        id: this.storeId
      }, function(response) {
        if (response && response.code === 200) {
          const responseData = response.data || {};
          
          if (responseData.store) {
            that.storeInfo = {
              name: responseData.store.name || '',
              address: responseData.store.address || '',
              image: responseData.store.images && responseData.store.images.length > 0 
                ? responseData.store.images[0] 
                : ''
            };
          }
        } else {
          console.error('获取门店信息失败:', response);
          uni.showToast({
            title: '获取门店信息失败',
            icon: 'none'
          });
        }
      });
    },
    fetchAvailableDates() {
      // 这里模拟获取可预约日期的数据
      // 实际应该从后端获取
      const dates = [];
      const now = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
        
        dates.push({
          value: `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`,
          day: day,
          weekday: weekday
        });
      }
      
      this.availableDates = dates;
      if (dates.length > 0) {
        this.selectedDate = dates[0].value;
        this.fetchAvailableTimes();
      }
    },
    fetchAvailableTimes() {
      // 这里模拟获取可预约时间段的数据
      // 实际应该根据选择的日期从后端获取
      const times = [];
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const isToday = this.selectedDate === today;
      const currentHour = now.getHours();
      
      // 生成09:00至20:00的时间段，每1小时一个时间段
      for (let hour = 9; hour < 20; hour++) {
        const startHour = hour < 10 ? '0' + hour : hour;
        const endHour = (hour + 1) < 10 ? '0' + (hour + 1) : (hour + 1);
        
        times.push({
          value: `${startHour}:00`,
          label: `${startHour}:00 - ${endHour}:00`,
          disabled: isToday && hour <= currentHour // 如果是今天，且时间已过，则禁用
        });
      }
      
      this.availableTimes = times;
      
      // 选择第一个可用的时间段
      const firstAvailable = times.find(time => !time.disabled);
      if (firstAvailable) {
        this.selectedTime = firstAvailable.value;
      } else {
        this.selectedTime = '';
      }
    },
    fetchAvailableServices() {
      const that = this;
      // 实际应该从后端获取门店的可预约服务
      this.$get("/wx_mini_app/wx/store_services", {
        id: this.storeId
      }, function(response) {
        if (response && response.code === 200) {
          const responseData = response.data || {};
          
          if (responseData.services) {
            that.availableServices = responseData.services;
          } else {
            // 模拟数据，实际项目中请删除
            that.availableServices = [
              { id: 1, name: '基础剪发', price: '68.00', duration: 45 },
              { id: 2, name: '洗剪吹', price: '88.00', duration: 60 },
              { id: 3, name: '烫发', price: '298.00', duration: 120 },
              { id: 4, name: '染发', price: '258.00', duration: 90 },
              { id: 5, name: '头皮护理', price: '128.00', duration: 30 }
            ];
          }
        } else {
          console.error('获取服务项目失败:', response);
          // 模拟数据，实际项目中请删除
          that.availableServices = [
            { id: 1, name: '基础剪发', price: '68.00', duration: 45 },
            { id: 2, name: '洗剪吹', price: '88.00', duration: 60 },
            { id: 3, name: '烫发', price: '298.00', duration: 120 },
            { id: 4, name: '染发', price: '258.00', duration: 90 },
            { id: 5, name: '头皮护理', price: '128.00', duration: 30 }
          ];
        }
      });
    },
    selectDate(date) {
      this.selectedDate = date;
      this.fetchAvailableTimes();
    },
    selectTime(time) {
      this.selectedTime = time;
    },
    toggleService(serviceId) {
      const index = this.selectedServices.indexOf(serviceId);
      if (index === -1) {
        this.selectedServices.push(serviceId);
      } else {
        this.selectedServices.splice(index, 1);
      }
    },
    validateForm() {
      if (!this.selectedDate) {
        uni.showToast({
          title: '请选择预约日期',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.selectedTime) {
        uni.showToast({
          title: '请选择预约时间',
          icon: 'none'
        });
        return false;
      }
      
      if (this.selectedServices.length === 0) {
        uni.showToast({
          title: '请选择至少一项服务',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.contactInfo.name) {
        uni.showToast({
          title: '请输入您的姓名',
          icon: 'none'
        });
        return false;
      }
      
      if (!this.contactInfo.phone) {
        uni.showToast({
          title: '请输入您的手机号',
          icon: 'none'
        });
        return false;
      }
      
      // 简单的手机号格式验证
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.contactInfo.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return false;
      }
      
      return true;
    },
    submitReservation() {
      if (!this.validateForm()) return;
      
      const that = this;
      const params = {
        store_id: this.storeId,
        date: this.selectedDate,
        time: this.selectedTime,
        services: this.selectedServices,
        name: this.contactInfo.name,
        phone: this.contactInfo.phone,
        remark: this.contactInfo.remark || ''
      };
      
      this.$post("/wx_mini_app/wx/store_reserve", params, function(response) {
        if (response && response.code === 200) {
          uni.showToast({
            title: '预约成功',
            icon: 'success',
            duration: 2000,
            success: function() {
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/user/reservation'
                });
              }, 2000);
            }
          });
        } else {
          console.error('预约失败:', response);
          uni.showToast({
            title: response && response.msg ? response.msg : '预约失败',
            icon: 'none'
          });
        }
      }, function(error) {
        console.error('请求出错:', error);
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      });
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.storeId = options.id;
      this.fetchStoreInfo();
      this.fetchAvailableServices();
    } else {
      uni.showToast({
        title: '门店ID不存在',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
    
    // 获取可预约日期和时间
    this.fetchAvailableDates();
    
    // 获取用户信息，预填姓名和手机号
    const userInfo = this.getUser();
    if (userInfo) {
      this.contactInfo.name = userInfo.nickName || '';
      this.contactInfo.phone = userInfo.phone || '';
    }
  }
}
</script>

<style scoped>
.reserve-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px; /* 为底部按钮留出空间 */
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

.back-icon {
  position: absolute;
  left: 15px;
  font-size: 18px;
}

.title {
  font-size: 18px;
  font-weight: 500;
}

/* 门店信息 */
.store-info {
  display: flex;
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.store-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
}

.store-image image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-details {
  flex: 1;
}

.store-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.store-address {
  font-size: 13px;
  color: #666;
}

/* 表单容器 */
.form-container {
  margin-bottom: 10px;
}

.form-group {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.form-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

/* 日期选择器 */
.date-picker {
  display: flex;
  overflow-x: auto;
  padding-bottom: 5px;
}

.date-item {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-right: 10px;
}

.date-selected {
  background-color: #1ea875;
  color: white;
  border-color: #1ea875;
}

.date-day {
  font-size: 18px;
  font-weight: 500;
}

.date-weekday {
  font-size: 12px;
  margin-top: 3px;
}

/* 时间选择器 */
.time-picker {
  display: flex;
  flex-wrap: wrap;
}

.time-item {
  width: calc(33.33% - 10px);
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 13px;
}

.time-selected {
  background-color: #1ea875;
  color: white;
  border-color: #1ea875;
}

.time-disabled {
  color: #ccc;
  background-color: #f7f7f7;
  pointer-events: none;
}

/* 服务选择器 */
.service-item {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 10px;
}

.service-selected {
  border-color: #1ea875;
  background-color: #f0f9f6;
}

.service-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.service-price {
  font-size: 15px;
  color: #ff6b6b;
  margin-bottom: 5px;
}

.service-duration {
  font-size: 12px;
  color: #999;
}

.service-checkbox {
  position: absolute;
  right: 12px;
  top: 12px;
}

.checkbox-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  border-radius: 50%;
}

.checkbox-active {
  background-color: #1ea875;
  border-color: #1ea875;
  position: relative;
}

.checkbox-active::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  left: 6px;
  top: 3px;
}

/* 联系信息表单 */
.input-group {
  margin-bottom: 15px;
}

.input-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  color: #333;
}

textarea {
  height: 80px;
}

/* 底部提交按钮 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: white;
  border-top: 1px solid #f0f0f0;
  height: 50px;
  z-index: 100;
}

.price-info {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 15px;
}

.price-label {
  font-size: 14px;
  color: #333;
}

.price-total {
  font-size: 18px;
  color: #ff6b6b;
  font-weight: 500;
}

.submit-button {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1ea875;
  color: white;
  font-size: 16px;
  font-weight: 500;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .time-picker {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }
  
  .time-item {
    width: auto;
    margin-right: 0;
    margin-bottom: 0;
  }
  
  .service-picker {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .service-item {
    margin-bottom: 0;
  }
  
  .contact-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .input-group:last-child {
    grid-column: span 2;
  }
}
</style> 