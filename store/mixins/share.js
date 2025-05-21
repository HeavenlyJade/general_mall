// 创建文件 mixins/share.js
export default {
    data() {
      return {
        // 默认分享信息，可在各页面覆盖
        shareInfo: {
          title: '东翁酒业',
          path: '',
          imageUrl: '',
          content: '精选东翁酱酒，品味非凡'
        },
        // 分享来源用户信息
        fromUser: {
          openid: '',
          user_id: ''
        }
      }
    },
    
    onLoad(options) {
      // 设置当前页面路径
      this.shareInfo.path = this.getPagePath()
      
      // 解析分享来源用户信息
      if (options.share_openid) {
        this.fromUser.openid = options.share_openid
      }
      if (options.share_user_id) {
        this.fromUser.user_id = options.share_user_id
      }
      
      // 如果存在分享用户信息，可以上报统计并处理
      if (this.fromUser.openid || this.fromUser.user_id) {
        // 将分享用户信息存储到本地临时存储中
        this.saveShareSource(this.fromUser)
        
        this.reportShareClick()
        console.log('来自用户分享:', this.fromUser.user_id)
        this.handleShareReward()
      }
    },
    
    onShareAppMessage() {
      // 获取当前用户信息
      const userInfo = this.getUser() || {}
      const openid = userInfo.openid || ''
      const user_id = userInfo.id || userInfo.user_id || ''
      
      // 构建带有用户信息的分享路径
      let sharePath = this.shareInfo.path || this.getPagePath()
      const separator = sharePath.includes('?') ? '&' : '?'
      
      // 添加分享者的用户ID和openid
      sharePath += `${separator}share_openid=${openid}&share_user_id=${user_id}`
      
      return {
        title: this.shareInfo.title,
        path: sharePath,
        imageUrl: this.shareInfo.imageUrl,
        success: function() {
          uni.showToast({ title: '分享成功' })
        },
        fail: function() {
          uni.showToast({ title: '分享失败', icon: 'none' })
        }
      }
    },
    
    onShareTimeline() {
      // 获取当前用户信息
      const userInfo = this.getUser() || {}
      const openid = userInfo.openid || ''
      const user_id = userInfo.id || userInfo.user_id || ''
      
      // 从分享路径提取查询参数
      let query = this.shareInfo.path.split('?')[1] || ''
      
      // 添加分享者的用户ID和openid
      if (query) {
        query += `&share_openid=${openid}&share_user_id=${user_id}`
      } else {
        query = `share_openid=${openid}&share_user_id=${user_id}`
      }
      
      return {
        title: this.shareInfo.title,
        query: query,
        imageUrl: this.shareInfo.imageUrl
      }
    },
    
    methods: {
      getPagePath() {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const path = `/${currentPage.route}`
        const query = currentPage.options
        
        if (Object.keys(query).length) {
          return path + '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
        }
        return path
      },
      
      // 上报分享点击统计
      reportShareClick() {
        console.log('用户通过分享打开，分享者信息:', this.fromUser)
        
        // 这里可以调用API上报分享点击数据
        // 例如：记录谁分享的，谁点击的，实现裂变追踪
        /* 
        this.$post('/api/share/record', {
          share_openid: this.fromUser.openid,
          share_user_id: this.fromUser.user_id,
          current_user: this.getUser()?.id || '',
          page_path: this.getPagePath()
        })
        */
      },
      
      // 处理分享奖励
      handleShareReward() {
        // 获取当前登录用户
        const currentUser = this.getUser() || {}
        const currentUserId = currentUser.id || currentUser.user_id
        
        // 避免自己分享给自己的情况
        if (currentUserId && this.fromUser.user_id && currentUserId !== this.fromUser.user_id) {
          // 可以调用API记录有效分享并发放奖励
          console.log('有效分享跳转，可发放奖励')
          
          // 示例：记录分享关系
          /* this.$post('/api/share/reward', {
            from_user_id: this.fromUser.user_id,
            to_user_id: currentUserId,
            page_path: this.getPagePath()
          }) */
        }
      },
      
      // 保存分享来源信息到本地存储
      saveShareSource(shareInfo) {
        try {
          // 添加时间戳，以便设置过期逻辑
          const shareData = {
            ...shareInfo,
            timestamp: Date.now()
          }
          // 保存到本地存储
          uni.setStorageSync('SHARE_SOURCE_INFO', shareData)
          console.log('分享来源信息已保存')
        } catch (e) {
        }
      },
      
      // 获取分享来源信息（可在登录成功后调用）
      getShareSource() {
        try {
          const shareData = uni.getStorageSync('SHARE_SOURCE_INFO')
          if (shareData) {
            // 检查是否已过期（这里设置24小时过期）
            const now = Date.now()
            const expired = now - shareData.timestamp > 24 * 60 * 60 * 1000
            
            if (!expired) {
              return {
                openid: shareData.openid,
                user_id: shareData.user_id
              }
            } else {
              // 已过期，清除数据
              this.clearShareSource()
              return null
            }
          }
          return null
        } catch (e) {
          console.error('获取分享来源信息失败', e)
          return null
        }
      },
      
      // 清除分享来源信息（登录成功并上报后调用）
      clearShareSource() {
        try {
          uni.removeStorageSync('SHARE_SOURCE_INFO')
          console.log('分享来源信息已清除')
        } catch (e) {
          console.error('清除分享来源信息失败', e)
        }
      },
      
      // 在用户注册/登录成功后上报分享关系
      reportShareRelation(newUserId) {
        const shareSource = this.getShareSource()
        if (shareSource && shareSource.user_id) {
          console.log('用户登录成功，建立分享关系', {
            from_user_id: shareSource.user_id,
            new_user_id: newUserId
          })
          
          // 调用API上报分享关系
          /* this.$post('/api/user/share-relation', {
            inviter_id: shareSource.user_id,
            invitee_id: newUserId
          }) */
          
          // 上报成功后清除临时存储
          this.clearShareSource()
        }
      }
    }
  }