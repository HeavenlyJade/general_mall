<!-- distribution_num.vue -->
<template>
  <view class="tree-container">
    <view class="tree-header">
      <text class="tree-title">分销会员</text>
    </view>
    
    <view class="search-box">
      <input type="text" v-model="searchText" placeholder="搜索用户姓名" class="search-input" />
      <button class="search-btn" @tap="handleSearch">搜索</button>
    </view>
    
    <scroll-view scroll-y class="tree-content">
      <!-- 在树结构加载前不渲染节点 -->
      <tree-node 
        v-if="treeData && treeData.id"
        :node="treeData" 
        :level="0"
        :expanded-nodes="expandedNodes"
        @toggle="toggleNode"
        @node-click="handleNodeClick"
      />
      <view v-else class="loading-text">加载中...</view>
    </scroll-view>
    
    <!-- 用户详情弹窗 -->
    <view class="user-detail-modal" v-if="showDetailModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">用户详情</text>
          <text class="close-btn" @tap="closeDetailModal">×</text>
        </view>
        <view class="modal-body">
          <view class="detail-item">
            <text class="detail-label">ID:</text>
            <text class="detail-value">{{selectedUser.id}}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">姓名:</text>
            <text class="detail-value">{{selectedUser.name}}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">手机号:</text>
            <text class="detail-value">{{selectedUser.mobile}}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">备注:</text>
            <text class="detail-value">{{selectedUser.remark || '无'}}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">状态:</text>
            <text class="detail-value">{{getStatusText(selectedUser.status)}}</text>
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn" @tap="closeDetailModal">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 树节点组件 - 在同一个文件中定义，然后在components中注册
import TreeNode  from '@/components/tree-node/tree-node.vue';


export default {
  components: {
    TreeNode
  },
  data() {
    return {
      treeData: null,
      expandedNodes: [], 
      searchText: '',
      showDetailModal: false,
      selectedUser: {},
      apiUrl: getApp().globalData.apiUrl,
      statusMap: {
        0: '待审核',
        1: '正常',
        2: '已拒绝'
      }
    };
  },
  methods: {
    async fetchTreeData() {
      // 调用API获取树状数据
      await wx.request({
        url: this.apiUrl+ '/api/v1/mini_core/distribution_members',
        method: 'GET',
        data: {
          user_id: this.uid
        },
        success: (res) => {
          if (res.data && res.data.data) {
            console.log("res.data.data", res.data.data);
            // 设置数据
            this.treeData = res.data.data;
            // 默认展开根节点
            if (this.treeData.id) {
              this.expandedNodes = [this.treeData.id];
            }
          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    },
    
    toggleNode(nodeId) {
      const index = this.expandedNodes.indexOf(nodeId);
      if (index > -1) {
        // 节点已展开，收起
        this.expandedNodes.splice(index, 1);
      } else {
        // 节点未展开，展开
        this.expandedNodes.push(nodeId);
      }
    },
    
    handleNodeClick(node) {
      this.selectedUser = node;
      this.showDetailModal = true;
    },
    
    closeDetailModal() {
      this.showDetailModal = false;
    },
    
    getStatusText(status) {
      return this.statusMap[status] || '未知';
    },
    
    getStatusClass(status) {
      const classMap = {
        0: 'status-pending',
        1: 'status-active',
        2: 'status-rejected'
      };
      return classMap[status] || '';
    },
    
    handleSearch() {
      // 实现搜索功能
      if (!this.searchText.trim()) {
        this.fetchTreeData(); // 清空搜索时重新加载
        return;
      }
      
      const app = getApp();
      wx.showLoading({ title: '搜索中...' });
      wx.request({
        url: app.globalData.apiUrl + '/api/v1/mini_core/distribution_members',
        method: 'GET',
        data: {
          user_id: this.uid,
          ser_name: this.searchText
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.data) {
            this.treeData = res.data.data;
            // 展开包含搜索结果的节点
            this.expandRelevantNodes(this.treeData, this.searchText);
          } else {
            wx.showToast({
              title: '搜索失败',
              icon: 'none'
            });
          }
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    },
    
    expandRelevantNodes(node, keyword) {
      // 递归展开包含搜索关键词的节点及其父节点
      if (this.nodeMatchesSearch(node, keyword)) {
        if (!this.expandedNodes.includes(node.id)) {
          this.expandedNodes.push(node.id);
        }
        return true;
      }
      
      if (node.children && node.children.length) {
        let hasMatch = false;
        for (const child of node.children) {
          if (this.expandRelevantNodes(child, keyword)) {
            hasMatch = true;
          }
        }
        
        if (hasMatch && !this.expandedNodes.includes(node.id)) {
          this.expandedNodes.push(node.id);
          return true;
        }
      }
      
      return false;
    },
    
    nodeMatchesSearch(node, keyword) {
      if (!node || !keyword) return false;
      
      const lowerKeyword = keyword.toLowerCase();
      return (
        (node.name && node.name.toLowerCase().includes(lowerKeyword)) ||
        (node.mobile && node.mobile.toLowerCase().includes(lowerKeyword))
      );
    }
  },
  onShow() {
    this.fetchTreeData()

  }
};
</script>

<style>
.tree-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.tree-header {
  padding: 20rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #e0e0e0;
}

.tree-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.loading-text {
  padding: 30rpx;
  text-align: center;
  color: #999999;
}

.search-box {
  display: flex;
  padding: 20rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #e0e0e0;
}

.search-input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  border: 1rpx solid #cccccc;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.search-btn {
  width: 150rpx;
  height: 70rpx;
  background-color: #07c160;
  color: #ffffff;
  font-size: 28rpx;
  line-height: 70rpx;
  text-align: center;
  border-radius: 8rpx;
}

.tree-content {
  flex: 1;
  background-color: #ffffff;
}

.tree-node {
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.node-content {
  display: flex;
  align-items: center;
}

.toggle-icon {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #999999;
}

.node-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.node-name {
  font-size: 30rpx;
  color: #333333;
  margin-right: 20rpx;
}

.node-mobile {
  font-size: 28rpx;
  color: #666666;
  margin-right: 20rpx;
}

.node-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.status-pending {
  background-color: #faad14;
  color: #ffffff;
}

.status-active {
  background-color: #52c41a;
  color: #ffffff;
}

.status-rejected {
  background-color: #f5222d;
  color: #ffffff;
}

.user-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 80%;
  background-color: #ffffff;
  border-radius: 10rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #e0e0e0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.close-btn {
  font-size: 40rpx;
  color: #999999;
}

.modal-body {
  padding: 30rpx;
}

.detail-item {
  display: flex;
  margin-bottom: 20rpx;
}

.detail-label {
  width: 150rpx;
  font-size: 28rpx;
  color: #666666;
}

.detail-value {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.modal-footer {
  padding: 20rpx;
  border-top: 1rpx solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.btn {
  width: 200rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  font-size: 28rpx;
  background-color: #07c160;
  color: #ffffff;
  border-radius: 8rpx;
}
</style>