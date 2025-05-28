<template>
  <view class="container" v-if="order && order.order_info">
    <!-- 订单状态栏 -->
    <view class="status-section">
      <view class="status-icon" :class="statusClass">
        <text class="iconfont" :class="statusIcon"></text>
      </view>
      <view class="status-text">
        <text class="main-status">{{ order.order_info.status }}</text>
        <text class="sub-status">{{ statusDesc }}</text>
      </view>
    </view>
    
    <!-- 物流信息 -->
    <view class="logistics-section" v-if="order.order_info.status === '已发货'">
      <view class="section-header">
        <text class="title">物流信息</text>
        <view class="more" @click="showLogistics(order)">
          <text>查看物流</text>
          <text class="iconfont iconicon_right"></text>
        </view>
      </view>
      <view class="logistics-info">
        <text class="company">{{ order.order_info.express_company || '暂无物流公司信息' }}</text>
        <text class="number">物流单号: {{ order.order_info.express_no || '暂无物流单号' }}</text>
      </view>
    </view>
    
    <!-- 收货地址 -->
    <view class="address-section">
      <view class="section-header">
        <text class="title">收货地址</text>
      </view>
      <view class="address-box">
        <text class="name">{{ order.order_info.receiver_name || '收货人' }}</text>
        <text class="mobile">{{ order.order_info.receiver_phone || order.order_info.phone }}</text>
        <text class="address">{{ order.order_info.province + order.order_info.city + order.order_info.district + order.order_info.address }}</text>
      </view>
    </view>
    
    <!-- 商品列表 -->
    <view class="goods-section">
      <view class="section-header">
        <text class="title">商品信息</text>
      </view>
      <view class="goods-list">
        <view class="goods-item" v-for="(item, index) in order.order_details" :key="index"
          @click="$navigateTo('goods/detail?id=' + item.product_id)">
          <image class="goods-img" :src="item.product_img" mode="aspectFill"></image>
          <view class="goods-info">
            <text class="goods-title">{{ item.product_name }}</text>
            <text class="goods-spec">{{ item.product_spec }}</text>
            <view class="goods-price-box">
              <text class="price">¥{{ item.actual_price }}</text>
              <text class="quantity">×{{ item.product_count }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 订单信息 -->
    <view class="order-info-section">
      <view class="section-header">
        <text class="title">订单信息</text>
      </view>
      <view class="info-item">
        <text class="label">订单编号:</text>
        <view class="value-box">
          <text class="value">{{ order.order_info.order_no }}</text>
          <text class="copy-btn" @click="copyOrderNo">复制</text>
        </view>
      </view>
      <view class="info-item" v-if="order.order_info.create_time">
        <text class="label">创建时间:</text>
        <text class="value">{{ order.order_info.create_time }}</text>
      </view>
      <view class="info-item" v-if="order.order_info.payment_time">
        <text class="label">支付时间:</text>
        <text class="value">{{ order.order_info.payment_time }}</text>
      </view>
      <view class="info-item" v-if="order.order_info.ship_time">
        <text class="label">发货时间:</text>
        <text class="value">{{ $getDateStr(order.order_info.ship_time) }}</text>
      </view>
      <view class="info-item" v-if="order.order_info.complete_time">
        <text class="label">完成时间:</text>
        <text class="value">{{ $getDateStr(order.order_info.complete_time) }}</text>
      </view>
    </view>
    
    <!-- 金额信息 -->
    <view class="amount-section">
      <view class="amount-item">
        <text class="label">商品金额</text>
        <text class="value">¥{{ order.order_info.product_amount || '0.00' }}</text>
      </view>
      <view class="amount-item">
        <text class="label">运费</text>
        <text class="value">¥{{ order.order_info.freight_amount || '0.00' }}</text>
      </view>
      <view class="amount-item">
        <text class="label">会员折扣</text>
        <text class="value">-¥{{ order.order_info.discount_amount || '0.00' }}</text>
      </view>
      <view class="amount-item">
        <text class="label">积分抵扣</text>
        <text class="value">-¥{{ order.order_info.point_amount || '0.00' }}</text>
      </view>
      <view class="amount-item total">
        <text class="label">实付款</text>
        <text class="value">¥{{ order.order_info.actual_amount || '0.00' }}</text>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="footer">
      <!-- 待付款 -->
      <view class="btn-group" v-if="order.order_info.status === '待支付' || order.order_info.status === '待付款'">
        <button class="btn" @click="cancelOrder(order)">取消订单</button>
        <button class="btn primary" @click="topay(order)">立即支付</button>
      </view>
      
      <!-- 待发货 -->
      <view class="btn-group" v-if="order.order_info.status === '待发货'">
        <button class="btn" @click="tuikuan(order)">申请退款</button>
        <button class="btn primary" @click="$toast('已经向商家推送消息啦')">催发货</button>
      </view>
      
      <!-- 已发货 -->
      <view class="btn-group" v-if="order.order_info.status === '已发货'">
        <button class="btn" @click="showLogistics(order)">查看物流</button>
        <button class="btn primary" @click="comfirm(order)">确认收货</button>
      </view>
      
      <!-- 已完成 -->
      <view class="btn-group" v-if="order.order_info.status === '已完成'">
        <button class="btn" @click="to_comment(order)">评价</button>
        <button class="btn primary" @click="to_return(order)">申请售后</button>
      </view>
    </view>
  </view>
  <view class="loading" v-else>
    <text>加载中...</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: null,
      order: {
        order_info: {},
        order_details: []
      },
      statusIcon: 'icontubiaozhizuomoban',
      statusClass: '',
      statusDesc: ''
    }
  },
  onLoad(options) {
    this.orderId = options.id;
    this.loadOrderDetail();
  },
  methods: {
    loadOrderDetail() {
      this.$get(`/wx_mini_app/shop-order/by-order-no/${this.orderId}`, {}, res => {
        if (res && res.data) {
          console.log("返回数据:", res.data);
          this.order = {
            order_info: res.data,
            order_details: []
          };
          this.loadOrderItems(res.data.order_no || res.data.id);
          this.setStatusInfo();
        } else {
          uni.showToast({
            title: '获取订单详情失败',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      }, err => {
        uni.showToast({
          title: '获取订单详情失败',
          icon: 'none'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      });
    },
    loadOrderItems(orderNoOrId) {
      this.$get(`/wx_mini_app/shop-order/by-order-no/${orderNoOrId}`, {}, res => {
        if (res && res.data && Array.isArray(res.data)) {
          this.order.order_details = res.data;
        }
      });
    },
    setStatusInfo() {
      if (!this.order || !this.order.order_info) {
        console.error('订单信息不完整，无法设置状态');
        return;
      }
      
      const status = this.order.order_info.status;
      switch(status) {
        case '待支付':
        case '待付款':
          this.statusIcon = 'iconweixinzhifu3';
          this.statusClass = 'wait-pay';
          this.statusDesc = '请尽快完成支付';
          break;
        case '待发货':
          this.statusIcon = 'iconweixinzhifu3';
          this.statusClass = 'wait-ship';
          this.statusDesc = '商家正在备货中';
          break;
        case '已发货':
          this.statusIcon = 'iconweixinzhifu3';
          this.statusClass = 'shipped';
          this.statusDesc = '商品已发出';
          break;
        case '已完成':
          this.statusIcon = 'iconweixinzhifu3';
          this.statusClass = 'completed';
          this.statusDesc = '交易已完成';
          break;
        default:
          this.statusIcon = 'iconweixinzhifu3';
          this.statusClass = '';
          this.statusDesc = '';
      }
    },
    copyOrderNo() {
      uni.setClipboardData({
        data: this.order.order_info.order_no,
        success: () => {
          this.$toast('订单号已复制');
        }
      });
    },
    // 以下方法直接复用订单列表页的方法
    showLogistics(item) {
      if (item.order_info.delivery_platform === "自提") {
        this.$toast("该订单的商品已经自提");
        return;
      }
      let uri = "/pages/order/logister?order=" + item.order_info.order_no +
        "&logistics_company=" + item.order_info.express_company +
        "&logistics_no=" + item.order_info.express_no;
      this.$navigateTo(uri);
    },
    cancelOrder(e) {
      this.$comfirm("订单还没有支付,确定要删除吗?", cf => {
        this.$post(`/wx_mini_app/shop-order/cancel`, {  "order_no": e.order_info.order_no}, res => {
          this.$toast("取消成功");
          uni.navigateBack();
        });
      });
    },
    comfirm(e) {
      this.$comfirm("您确定要确认收货吗?", cf => {
        this.$post("/wx_mini_app/shop-order/status", {
          "status": "已完成",
          "order_no": e.order_info.order_no
        }, res => {
          this.$toast("确认收货成功");
          this.loadOrderDetail();
        });
      });
    },
    topay(item) {
      let order_id = item.order_info.id;
      let money = item.order_info.actual_amount;
      if (this.isWeixin()) {
        this.$post("order/hpj_unifield", { "order_id": order_id }, (res2) => {
          if (res2.status != 200) {
            alert(res2.msg)
            return;
          }
          var obj = JSON.parse(res2.data);
          var url = obj.url;
          this.$jumpExter(url);
        });
      } else {
        this.$redirectTo('/pages/pay/pay?order_id=' + order_id + '&money=' + money);
      }
    },
    tuikuan(item) {
      let _this = this;
      uni.showModal({
        title: '提示',
        content: '亲，确定要发起退款吗',
        success: function (res) {
          if (res.confirm) {
            var o = {};
            o.id = item.id;
            o.refundStat = 1;  //申请中
            o.stat = 5;
            _this.$post("/order/update", o, function (res) {
              uni.showToast({ title: '申请成功' });
              setTimeout(function () {
                uni.navigateTo({
                  "url": "/pages/order/order-refund?state=5"
                });
              }, 1000);
            });
          }
        }
      });
    },
    to_comment(e) {
      this.$navigateTo("/pages/order/comment?id=" + e.id);
    },
    to_return(e) {
      this.$navigateTo("/pages/order/return?order_id=" + e.id);
    }
  }
}
</script>

<style lang="scss">
.container {
  padding-bottom: 120rpx;
  background-color: #f8f8f8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  font-size: 28rpx;
  
  .title {
    font-weight: bold;
    color: #333;
  }
  
  .more {
    display: flex;
    align-items: center;
    color: #666;
    
    .iconfont {
      margin-left: 10rpx;
      font-size: 24rpx;
    }
  }
}

.status-section {
  display: flex;
  align-items: center;
  background-color: #fa436a;
  color: #fff;
  padding: 40rpx 30rpx;
  
  .status-icon {
    width: 80rpx;
    height: 80rpx;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20rpx;
    
    .iconfont {
      font-size: 40rpx;
    }
    
    &.wait-pay { background: rgba(255,255,255,0.2); }
    &.wait-ship { background: rgba(255,255,255,0.2); }
    &.shipped { background: rgba(255,255,255,0.2); }
    &.completed { background: rgba(255,255,255,0.2); }
  }
  
  .status-text {
    display: flex;
    flex-direction: column;
    
    .main-status {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    
    .sub-status {
      font-size: 24rpx;
      opacity: 0.8;
    }
  }
}

.logistics-section, .address-section, .goods-section, .order-info-section, .amount-section {
  margin: 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
  overflow: hidden;
}

.logistics-info {
  padding: 0 30rpx 30rpx;
  
  .company {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .number {
    font-size: 24rpx;
    color: #666;
  }
}

.address-box {
  padding: 0 30rpx 30rpx;
  
  .name {
    font-size: 28rpx;
    color: #333;
    margin-right: 20rpx;
  }
  
  .mobile {
    font-size: 28rpx;
    color: #333;
  }
  
  .address {
    font-size: 26rpx;
    color: #666;
    margin-top: 10rpx;
    line-height: 1.4;
  }
}

.goods-list {
  .goods-item {
    display: flex;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .goods-img {
      width: 140rpx;
      height: 140rpx;
      margin-right: 20rpx;
      border-radius: 6rpx;
    }
    
    .goods-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .goods-title {
        font-size: 28rpx;
        color: #333;
        line-height: 1.4;
      }
      
      .goods-spec {
        font-size: 24rpx;
        color: #999;
        margin: 10rpx 0;
      }
      
      .goods-price-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .price {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
        }
        
        .quantity {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  font-size: 26rpx;
  color: #666;
  
  .label {
    color: #999;
  }
  
  .value-box {
    display: flex;
    align-items: center;
    
    .copy-btn {
      margin-left: 20rpx;
      background-color: #f5f5f5;
      color: #666;
      padding: 4rpx 12rpx;
      border-radius: 4rpx;
      font-size: 22rpx;
    }
  }
}

.amount-section {
  padding-bottom: 30rpx;
  
  .amount-item {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    font-size: 26rpx;
    color: #666;
    
    &.total {
      margin-top: 10rpx;
      border-top: 1rpx solid #f5f5f5;
      padding-top: 30rpx;
      
      .label, .value {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }
      
      .value {
        color: #fa436a;
      }
    }
  }
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: flex-end;
  
  .btn-group {
    display: flex;
  }
  
  .btn {
    min-width: 160rpx;
    height: 60rpx;
    line-height: 60rpx;
    margin: 0;
    margin-left: 20rpx;
    padding: 0 30rpx;
    text-align: center;
    font-size: 26rpx;
    color: #333;
    border-radius: 30rpx;
    background-color: #f5f5f5;
    
    &.primary {
      background-color: #fa436a;
      color: #fff;
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 28rpx;
  color: #666;
}
</style> 