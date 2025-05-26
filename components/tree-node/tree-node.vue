<template>
	<view class="tree-node">
	  <!-- 当前节点 -->
	  <view class="node-item" :style="{ paddingLeft: level * 24 + 'px' }">
		<!-- 主干线 -->
		<view class="main-line" v-if="level > 0" 
			  :style="{ 
				left: ((level-1) * 24 + 12) + 'px',
				height: '40px'  /* 限制主干线高度 */
			  }"></view>
			  
		<!-- 节点连接线 -->
		<view class="node-connector" v-if="level > 0"
			  :style="{ 
				left: ((level-1) * 24 + 12) + 'px', 
				width: '12px'
			  }"></view>
		
		<!-- 节点展开/折叠图标 -->
		<view class="toggle-area" @tap.stop="onToggle" v-if="!node.isLeaf">
		  <text class="toggle-icon">{{ isExpanded ? '-' : '+' }}</text>
		</view>
		<view class="toggle-placeholder" v-else></view>
		
		<!-- 节点内容 -->
		<view class="node-content" @tap.stop="onNodeClick">
		  <text class="node-username" v-if="node.nickname">{{ node.nickname }}</text>
		  <text class="node-unknown" v-else>{{ node.name || '未知用户' }}</text>
		</view>
	  </view>
	  
	  <!-- 子节点容器 -->
	  <view class="children-container" v-if="hasChildren && isExpanded">
		<!-- 垂直连接线 - 父节点到第一个子节点 -->
		<view class="child-connector" 
			  :style="{ 
				left: (level * 24 + 12) + 'px',
				height: '20px',
				top: '0'
			  }"></view>
		
		<!-- 递归渲染子节点 -->
		<tree-node
		  v-for="(child, index) in node.children"
		  :key="child.id ? 'id-' + child.id : 'index-' + index"
		  :node="child"
		  :level="level + 1"
		  :default-expanded="defaultExpanded"
		  :isLastChild="index === node.children.length - 1"
		  @node-toggle="onChildToggle"
		  @node-click="onChildClick"
		/>
	  </view>
	  
	  <!-- 下一个同级节点的连接线 -->
	  <view class="sibling-connector" v-if="!isLastChild"
			:style="{ 
			  left: ((level-1) * 24 + 12) + 'px',
			  top: '40px',
			  height: '20px'  
			}"></view>
	</view>
  </template>
  
  <script>
  export default {
	name: 'tree-node',
	props: {
	  node: {
		type: Object,
		required: true
	  },
	  level: {
		type: Number,
		default: 0
	  },
	  defaultExpanded: {
		type: Boolean,
		default: false
	  },
	  isLastChild: {
		type: Boolean,
		default: false
	  }
	},
	data() {
	  return {
		isExpanded: this.defaultExpanded
	  };
	},
	computed: {
	  hasChildren() {
		return this.node.children && this.node.children.length > 0;
	  }
	},
	methods: {
	  // 切换当前节点展开/折叠状态
	  onToggle() {
		this.isExpanded = !this.isExpanded;
		this.$emit('node-toggle', {
		  nodeId: this.node.id,
		  expanded: this.isExpanded
		});
	  },
	  
	  // 点击节点内容
	  onNodeClick() {
		this.$emit('node-click', this.node);
	  },
	  
	  // 处理子节点的toggle事件
	  onChildToggle(data) {
		// 传递子节点事件到父组件
		this.$emit('node-toggle', data);
	  },
	  
	  // 处理子节点的click事件
	  onChildClick(node) {
		// 传递子节点事件到父组件
		this.$emit('node-click', node);
	  },
	  
	  // 获取状态文本
	  getStatusText(status) {
		const statusMap = {
		  0: '待审核',
		  1: '正常', 
		  2: '已拒绝'
		};
		return statusMap[status] || '未知';
	  },
	  
	  // 获取状态样式类
	  getStatusClass(status) {
		const classMap = {
		  0: 'pending',
		  1: 'active',
		  2: 'rejected'
		};
		return classMap[status] || 'unknown';
	  }
	}
  };
  </script>
  
  <style>
  .tree-node {
	position: relative;
	padding: 0;
	margin: 0;
  }
  
  .node-item {
	position: relative;
	display: flex;
	align-items: center;
	height: 40px;
	margin: 0;
  }
  
  /* 展开/折叠图标区域 */
  .toggle-area, .toggle-placeholder {
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 5px;
	z-index: 2;
  }
  
  .toggle-icon {
	width: 20px;
	height: 20px;
	line-height: 18px;
	text-align: center;
	border: 1px solid #ccc;
	border-radius: 2px;
	background-color: #f5f5f5;
  }
  
  /* 节点内容样式 */
  .node-content {
	display: flex;
	align-items: center;
	flex: 1;
	z-index: 2;
  }
  
  .node-name {
	font-size: 14px;
	color: #333;
	margin-right: 10px;
  }
  
  .node-username {
	font-size: 13px;
	color: #666;
	margin-right: 10px;
  }
  
  .node-unknown {
	font-size: 13px;
	color: #999;
	margin-right: 10px;
  }
  
  .node-status {
	font-size: 12px;
	padding: 2px 6px;
	border-radius: 10px;
  }
  
  .status-pending {
	background-color: #faad14;
	color: #fff;
  }
  
  .status-active {
	background-color: #52c41a;
	color: #fff;
  }
  
  .status-rejected {
	background-color: #f5222d;
	color: #fff;
  }
  
  /* 连接线样式 - 修正长度版 */
  /* 主干线 */
  .main-line {
	position: absolute;
	top: 0;
	width: 1px;
	background-color: #000;
	z-index: 1;
  }
  
  /* 节点水平连接线 */
  .node-connector {
	position: absolute;
	top: 20px; /* 垂直居中 */
	height: 1px;
	background-color: #000;
	z-index: 1;
  }
  
  /* 子节点连接线 */
  .child-connector {
	position: absolute;
	width: 1px;
	background-color: #000;
	z-index: 1;
  }
  
  /* 兄弟节点连接线 */
  .sibling-connector {
	position: absolute;
	width: 1px;
	background-color: #000;
	z-index: 1;
  }
  
  /* 子节点容器 */
  .children-container {
	position: relative;
  }
  
  /* 边框分隔线 */
  .tree-node {
	border-bottom: 1px solid #f0f0f0;
  }
  
  .tree-node:last-child {
	border-bottom: none;
  }
  </style>