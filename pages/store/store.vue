<template>
  <div class="store-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="title">门店中心</div>
      <div class="menu-icon">
        <i class="icon-more"></i>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <div class="search-box">
        <i class="search-icon"></i>
        <input 
          type="text" 
          placeholder="搜索门店名称" 
          v-model="searchKeyword"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 门店列表 -->
    <div class="store-list">
      <div class="section-title">附近门店 ({{storeList.length}})</div>
      
      <div v-if="storeList.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <div class="empty-text">暂无门店信息</div>
      </div>
      
      <div 
        v-for="(store, index) in storeList" 
        :key="index" 
        class="store-card"
        @click="navigateToStoreDetail(store.id)"
      >
        <div class="store-image">
          <image class="store-img" mode="aspectFill" :src="store.image || getConst().defaultStoreImage"></image>
        </div>
        <div class="store-info">
          <div class="store-name">{{store.name}}</div>
          <div class="store-address">
            <i class="location-icon"></i>
            <span>{{store.address}}</span>
          </div>
          <div class="store-details">
            <span class="store-distance">{{store.distance}}km</span>
            <span class="store-time">营业时间: {{store.business_hours}}</span>
          </div>
          <div class="store-tags">
            <span v-for="(tag, tagIndex) in store.tags" :key="tagIndex" class="tag">{{tag}}</span>
          </div>
        </div>
        <div class="store-action">
          <div class="phone-button" @click.stop="callStore(store.phone)">
            <i class="phone-icon"></i>
            <span>电话</span>
          </div>
          <div class="navigation-button" @click.stop="navigateTo(store.latitude, store.longitude)">
            <i class="navigation-icon"></i>
            <span>导航</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐门店 -->
    <div class="recommended-stores" v-if="recommendedStores.length > 0">
      <div class="section-title">推荐门店</div>
      <div class="recommended-list">
        <div 
          v-for="(store, index) in recommendedStores" 
          :key="index" 
          class="recommended-card"
          @click="navigateToStoreDetail(store.id)"
        >
          <div class="recommended-image">
            <image class="store-img" mode="aspectFill" :src="store.image || getConst().defaultStoreImage"></image>
          </div>
          <div class="recommended-name">{{store.name}}</div>
          <div class="recommended-address">{{store.address}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      storeList: [],
      recommendedStores: [],
      userLocation: {
        latitude: 0,
        longitude: 0
      }
    }
  },
  methods: {
    fetchStoreList() {
      const that = this;
      console.log('即将请求门店数据，参数:', {
        need_total_count: true,
        keyword: this.searchKeyword,
        latitude: this.userLocation.latitude,
        longitude: this.userLocation.longitude
      });
      
      this.$get("/wx_mini_app/shop-store", {
        need_total_count: true,
        keyword: this.searchKeyword,
        latitude: this.userLocation.latitude,
        longitude: this.userLocation.longitude
      }, function(response) {
        
        if (response && response.code === 200) {
          // 处理门店列表数据
          if (response.data) {
            // 转换数据格式
            that.storeList = response.data.map(store => {
              let image = null;
              try {
                if (store.store_image && typeof store.store_image === 'string' && store.store_image.trim() !== '') {
                  let parsedImages = JSON.parse(store.store_image);
                  image = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : store.store_logo;
                } else {
                  image = store.store_logo;
                }
              } catch (e) {
                console.error('解析图片数据出错:', e, store.store_image);
                image = store.store_logo;
              }
              
              return {
                id: store.id,
                name: store.name,
                address: store.address || '暂无地址',
                image: image,
                distance: store.latitude && store.longitude ? 
                  that.calculateDistance(that.userLocation.latitude, that.userLocation.longitude, store.latitude, store.longitude) : 
                  "未知",
                business_hours: store.opening_hours || "暂无营业时间",
                phone: store.contact_phone || '',
                latitude: store.latitude,
                longitude: store.longitude,
                tags: store.features ? store.features.split("、") : []
              };
            });
            
            
            // 获取推荐门店（例如取前4个作为推荐）
            that.recommendedStores = that.storeList.slice(0, 4);
          }
        } else {
          console.error('获取门店数据失败:', response);
          uni.showToast({
            title: '获取数据失败',
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
    handleSearch() {
      // 防抖处理，可以根据需要添加
      this.fetchStoreList();
    },
    getUserLocation() {
      const that = this;
      uni.getLocation({
        type: 'gcj02',
        success: function(res) {
          that.userLocation.latitude = res.latitude;
          that.userLocation.longitude = res.longitude;
          that.fetchStoreList();
        },
        fail: function() {
          uni.showToast({
            title: '获取位置信息失败',
            icon: 'none'
          });
          // 获取位置失败时也要加载数据
          that.fetchStoreList();
        }
      });
    },
    navigateToStoreDetail(storeId) {
      this.$navigateTo(`/pages/store/detail?id=${storeId}`);
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
    calculateDistance(lat1, lon1, lat2, lon2) {
      if (!lat1 || !lon1 || !lat2 || !lon2) return "未知";
      
      const R = 6371; // 地球半径，单位km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // 距离，单位km
      
      return d.toFixed(1);
    },
    deg2rad(deg) {
      return deg * (Math.PI/180);
    },
    getConst() {
      return {
        defaultStoreImage: '/static/img/store/default-store.png'
      };
    }
  },
  onShow() {
    // this.getUserLocation();
  },
  onLoad() {
    console.log("门店页面加载");
    // 先尝试获取位置信息，成功后会自动调用fetchStoreList
    this.getUserLocation();
    
    // 设置一个安全兜底，确保即使定位失败也能请求数据
    setTimeout(() => {
      if (this.storeList.length === 0) {
        console.log("位置获取超时，直接请求门店数据");
        this.fetchStoreList();
      }
    }, 1500);
  },
  onPullDownRefresh() {
    this.fetchStoreList();
    setTimeout(function() {
      uni.stopPullDownRefresh();
    }, 1000);
  }
}
</script>

<style scoped>
.store-page {
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

/* 搜索框样式 */
.search-container {
  padding: 10px 15px;
  background-color: #1ea875;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  padding: 8px 15px;
}

.search-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-image: url('/static/img/icons/search.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
}

/* 门店列表样式 */
.store-list {
  margin: 15px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.empty-icon {
  width: 60px;
  height: 60px;
  /* 暂时移除背景图片 */
  /* background-image: url('../../static/img/store/empty.png'); */
  background-color: #eee; /* 临时添加背景色以便可视化 */
  background-size: contain;
  background-repeat: no-repeat;
  margin-bottom: 10px;
}

.empty-text {
  color: #999;
  font-size: 14px;
}

.store-card {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.store-image {
  width: 100%;
  height: 130px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.store-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-info {
  margin-bottom: 15px;
}

.store-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.store-address {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.location-icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  /* background-image: url('/static/img/store/location.png'); */
  background-size: contain;
  background-repeat: no-repeat;
}

.store-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.store-tags {
  display: flex;
  flex-wrap: wrap;
}

.tag {
  background-color: #f0f9f6;
  color: #1ea875;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.store-action {
  display: flex;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
}

.phone-button, .navigation-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 8px 0;
}

.phone-button {
  border-right: 1px solid #f0f0f0;
}

.phone-icon, .navigation-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  background-size: contain;
  background-repeat: no-repeat;
}

.phone-icon {
  background-image: url('/static/img/icons/phone.png');
}

.navigation-icon {
  background-image: url('/static/img/icons/navigation.png');
}

/* 推荐门店样式 */
.recommended-stores {
  margin: 15px;
}

.recommended-list {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
}

.recommended-card {
  flex-shrink: 0;
  width: 140px;
  margin-right: 10px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.recommended-image {
  width: 100%;
  height: 90px;
}

.recommended-name {
  font-size: 14px;
  font-weight: 500;
  margin: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommended-address {
  font-size: 12px;
  color: #999;
  margin: 0 8px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .store-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .store-card {
    margin-bottom: 0;
  }
  
  .recommended-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
  }
  
  .recommended-card {
    width: auto;
    margin-right: 0;
  }
}
</style>
