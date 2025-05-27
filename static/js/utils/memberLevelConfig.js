import { get } from './requestUtil.js';
import { data_local } from './cacheUtil.js';

// 获取会员等级配置并缓存到本地
export function fetchMemberLevelConfig(callback) {
    get('/wx_mini_app/member-level/', { need_total_count: true }, (res) => {
        if (res && res.code === 200) {
            console.log(res.data)
            data_local('member_level_config', res.data);
        }
        if (typeof callback === 'function') {
            callback(res);
        }
    }, (err) => {
        if (typeof callback === 'function') {
            callback(null, err);
        }
    });
}

// 获取本地缓存的会员等级配置
export function getLocalMemberLevelConfig() {
    return data_local('member_level_config');
}