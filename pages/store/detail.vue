<template>
  <div class="store-detail">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="back-icon" @click="navigateBack">
        <i class="icon-back"></i>
      </div>
      <div class="title">门店详情</div>
      <div class="menu-icon">
        <i class="icon-more"></i>
      </div>
    </div>

    <!-- 门店基本信息 -->
    <div class="store-basic-info">
      <div class="store-images">
        <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
          <swiper-item v-for="(image, index) in storeDetail.images" :key="index">
            <image :src="image" mode="aspectFill" class="swiper-image"></image>
          </swiper-item>
        </swiper>
      </div>

      <div class="store-info-card">
        <div class="store-name">{{storeDetail.name}}</div>
        <div class="store-rating">
          <div class="stars">
            <i v-for="i in 5" :key="i" class="star-icon" :class="{'star-active': i <= storeDetail.rating}"></i>
          </div>
          <div class="rating-value">{{storeDetail.rating}}</div>
          <div class="review-count">({{storeDetail.review_count}}条评价)</div>
        </div>
        <div class="store-address">
          <i class="location-icon"></i>
          <span>{{storeDetail.address}}</span>
          <div class="navigation-button" @click="navigateTo(storeDetail.latitude, storeDetail.longitude)">
            <i class="navigation-icon"></i>
            <span>导航</span>
          </div>
        </div>
        <div class="store-contact">
          <i class="phone-icon"></i>
          <span>{{storeDetail.phone}}</span>
          <div class="call-button" @click="callStore(storeDetail.phone)">
            <i class="call-icon"></i>
            <span>拨打</span>
          </div>
        </div>
        <div class="store-hours">
          <i class="time-icon"></i>
          <span>营业时间：{{storeDetail.business_hours}}</span>
        </div>
      </div>
    </div>

    <!-- 门店服务 -->
    <div class="store-services">
      <div class="section-title">门店服务</div>
      <div class="services-list">
        <div class="service-item" v-for="(service, index) in storeDetail.services" :key="index">
          <div class="service-icon" :style="{'background-color': service.color}">
            <i :class="service.icon"></i>
          </div>
          <div class="service-name">{{service.name}}</div>
        </div>
      </div>
    </div>

    <!-- 门店介绍 -->
    <div class="store-description">
      <div class="section-title">门店介绍</div>
      <div class="description-content">{{storeDetail.description}}</div>
    </div>

    <!-- 门店评价 -->
    <div class="store-reviews" v-if="storeDetail.reviews && storeDetail.reviews.length > 0">
      <div class="section-title">用户评价</div>
      
      <div class="review-item" v-for="(review, index) in storeDetail.reviews" :key="index">
        <div class="review-header">
          <div class="reviewer-avatar">
            <image :src="review.avatar || getConst().defaultAvatar" mode="aspectFill"></image>
          </div>
          <div class="reviewer-info">
            <div class="reviewer-name">{{review.username}}</div>
            <div class="review-date">{{review.date}}</div>
          </div>
          <div class="review-rating">
            <i v-for="i in 5" :key="i" class="star-icon" :class="{'star-active': i <= review.rating}"></i>
          </div>
        </div>
        <div class="review-content">{{review.content}}</div>
        <div class="review-images" v-if="review.images && review.images.length > 0">
          <image 
            v-for="(image, imgIndex) in review.images" 
            :key="imgIndex" 
            :src="image" 
            mode="aspectFill"
            class="review-image"
            @click="previewImage(review.images, imgIndex)"
          ></image>
        </div>
      </div>
      
      <div class="view-more" @click="viewMoreReviews" v-if="hasMoreReviews">
        查看更多评价
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-action-bar">
      <div class="share-button" @click="shareStore">
        <i class="share-icon"></i>
        <span>分享</span>
      </div>
      <div class="favorite-button" @click="toggleFavorite">
        <i class="favorite-icon" :class="{'favorite-active': isFavorite}"></i>
        <span>{{isFavorite ? '已收藏' : '收藏'}}</span>
      </div>
      <div class="reserve-button" @click="reserveStore">预约到店</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storeId: '',
      storeDetail: {
        name: '',
        rating: 0,
        review_count: 0,
        address: '',
        phone: '',
        business_hours: '',
        latitude: 0,
        longitude: 0,
        images: [],
        services: [],
        description: '',
        reviews: []
      },
      isFavorite: false,
      hasMoreReviews: false,
      reviewPage: 1,
      reviewPageSize: 5
    }
  },
  methods: {
    navigateBack() {
      uni.navigateBack();
    },
    fetchStoreDetail() {
      const that = this;
      this.$get("/wx_mini_app/wx/store_detail", {
        id: this.storeId
      }, function(response) {
        console.log(response);
        
        if (response && response.code === 200) {
          const responseData = response.data || {};
          
          if (responseData.store) {
            that.storeDetail = responseData.store;
            // 检查是否有更多评价
            that.hasMoreReviews = that.storeDetail.reviews && that.storeDetail.reviews.length >= that.reviewPageSize;
          }
          
          if (responseData.is_favorite !== undefined) {
            that.isFavorite = responseData.is_favorite;
          }
        } else {
          console.error('获取门店详情失败:', response);
          uni.showToast({
            title: '获取详情失败',
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
    },
    fetchMoreReviews() {
      const that = this;
      this.reviewPage++;
      
      this.$get("/wx_mini_app/wx/store_reviews", {
        id: this.storeId,
        page: this.reviewPage,
        page_size: this.reviewPageSize
      }, function(response) {
        if (response && response.code === 200) {
          const responseData = response.data || {};
          
          if (responseData.reviews && responseData.reviews.length > 0) {
            that.storeDetail.reviews = [...that.storeDetail.reviews, ...responseData.reviews];
            that.hasMoreReviews = responseData.reviews.length >= that.reviewPageSize;
          } else {
            that.hasMoreReviews = false;
          }
        } else {
          console.error('获取更多评价失败:', response);
        }
      });
    },
    viewMoreReviews() {
      this.fetchMoreReviews();
    },
    callStore(phone) {
      if (!phone) return;
      uni.makePhoneCall({
        phoneNumber: phone
      });
    },
    navigateTo(latitude, longitude) {
      if (!latitude || !longitude) return;
      uni.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        scale: 18
      });
    },
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: images[current]
      });
    },
    toggleFavorite() {
      const that = this;
      const action = this.isFavorite ? 'cancel' : 'add';
      
      this.$post("/wx_mini_app/wx/store_favorite", {
        id: this.storeId,
        action: action
      }, function(response) {
        if (response && response.code === 200) {
          that.isFavorite = !that.isFavorite;
          uni.showToast({
            title: that.isFavorite ? '收藏成功' : '已取消收藏',
            icon: 'success'
          });
        } else {
          console.error('操作失败:', response);
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
        }
      });
    },
    shareStore() {
      // 分享功能
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      });
    },
    reserveStore() {
      // 跳转到预约页面
      this.$navigateTo(`/pages/store/reserve?id=${this.storeId}`);
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.storeId = options.id;
      this.fetchStoreDetail();
    } else {
      uni.showToast({
        title: '门店ID不存在',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  },
  onShareAppMessage() {
    return {
      title: this.storeDetail.name,
      path: `/pages/store/detail?id=${this.storeId}`
    };
  }
}
</script>

<style scoped>
.store-detail {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px; /* 为底部操作栏留出空间 */
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

.menu-icon {
  position: absolute;
  right: 15px;
  font-size: 20px;
}

/* 门店基本信息 */
.store-images {
  width: 100%;
  height: 200px;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-info-card {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.store-name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}

.store-rating {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.stars {
  display: flex;
}

.star-icon {
  width: 16px;
  height: 16px;
  margin-right: 2px;
  background-image: url('/static/img/store/star-inactive.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.star-active {
  background-image: url('/static/img/store/star-active.png');
}

.rating-value {
  color: #ff9c38;
  font-weight: 500;
  margin: 0 5px;
}

.review-count {
  color: #999;
  font-size: 12px;
}

.store-address, .store-contact, .store-hours {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.location-icon, .phone-icon, .time-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-size: contain;
  background-repeat: no-repeat;
}

.location-icon {
  background-image: url('/static/img/store/location.png');
}

.phone-icon {
  background-image: url('/static/img/store/phone.png');
}

.time-icon {
  background-image: url('/static/img/store/time.png');
}

.navigation-button, .call-button {
  margin-left: auto;
  display: flex;
  align-items: center;
  background-color: #f0f9f6;
  color: #1ea875;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.navigation-icon, .call-icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  background-size: contain;
  background-repeat: no-repeat;
}

.navigation-icon {
  background-image: url('/static/img/store/navigation.png');
}

.call-icon {
  background-image: url('/static/img/store/call.png');
}

/* 门店服务 */
.store-services, .store-description, .store-reviews {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.services-list {
  display: flex;
  flex-wrap: wrap;
}

.service-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.service-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

.service-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 门店介绍 */
.description-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 门店评价 */
.review-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.reviewer-avatar image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 3px;
}

.review-date {
  font-size: 12px;
  color: #999;
}

.review-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
}

.review-images {
  display: flex;
  flex-wrap: wrap;
}

.review-image {
  width: 80px;
  height: 80px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
}

.view-more {
  text-align: center;
  color: #1ea875;
  font-size: 14px;
  padding: 10px 0;
}

/* 底部操作栏 */
.bottom-action-bar {
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

.share-button, .favorite-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  font-size: 12px;
  color: #666;
}

.share-icon, .favorite-icon {
  width: 20px;
  height: 20px;
  margin-bottom: 3px;
  background-size: contain;
  background-repeat: no-repeat;
}

.share-icon {
  background-image: url('/static/img/store/share.png');
}

.favorite-icon {
  background-image: url('/static/img/store/favorite-inactive.png');
}

.favorite-active {
  background-image: url('/static/img/store/favorite-active.png');
}

.reserve-button {
  flex: 1;
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
  .store-basic-info {
    display: flex;
  }
  
  .store-images {
    width: 50%;
    height: 300px;
  }
  
  .store-info-card {
    width: 50%;
    margin-bottom: 0;
  }
  
  .services-list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }
  
  .service-item {
    width: auto;
  }
  
  .review-images {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
  }
  
  .review-image {
    width: 100%;
    height: 100px;
    margin-right: 0;
    margin-bottom: 0;
  }
}
</style> 