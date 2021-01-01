/**
 * 接口请求和相关配置。
 */

const { appEnv, ENV, version } = require('../config.js');

// 小程序接口地址
let testHost = null;

// 命名空间
let dsApiNamepace = null;

// 小程序 - 图片CDN域名, 资源整体放在miniprogram下.
const cdnHost = {
  miniprogram: 'https://***.cn/assets/miniprogram',
  service: 'https://***.cn/assets/service',
};

switch (appEnv) {
  // 测试地址
  case ENV.TEST:
    testHost = 'https://test-***.cn';
    break;
  // 预发布地址
  case ENV.UAT:
    testHost = 'https://uat-***.cn';
    break;
  // 正式地址
  case ENV.PROD:
    testHost = 'https://***.cn';
    break;
  // 开发环境
  case ENV.DEV:
  default:
    testHost = 'https://dev-***.cn';
    break;
}

// 需要特定域名空间与cryptoAeskey才使用
if (appEnv == ENV.UAT || appEnv == ENV.PROD) {
  // 预发布地址、正式地址
  dsApiNamepace = 'api/21ea600b';
  cryptoAeskey = 'sGyehR9HluZt6zR2OD38Pc19vZ9RfRl2';
} else {
  // 开发环境、测试地址
  dsApiNamepace = 'api/e2687ef2';
  cryptoAeskey = 'QLMDgQPRreZs3glTYM18Lj1CXgGqDHcU';
}

// 计时器
let timer;

// 公用header参数
const commonHeaders = function () {
  const headers = new Object();

  // 系统信息
  headers['x-http-version'] = version;
  headers['Content-Type'] = 'application/json'; // application/x-www-form-urlencoded
  headers['x-http-devicetype'] = 'miniapp';

  // 用户信息
  const user = require('../user.js');

  // 设置TOKEN
  if (user.accessToken) {
    headers['x-http-token'] = user.accessToken;
  }

  return headers;
};

// 发送get请求
const get = data => {
  let header = commonHeaders();
  // 合并header
  if (data.header) {
    for (let obj in data.header) {
      header[obj] = data.header[obj];
    }
  }

  wx.request({
    url: data.url,
    method: 'get',
    header: header,
    data: data.param,
    success: res => {
      if (res.data.code == 40006 || res.data.code == 40003) {
        // 会话过期

        const device = require('./device.js');
        if (device.environment == 'wxwork') {
          // 企业微信环境下，重启到授权页面 (企业微信导购端应该不会执行这个文件)
          wx.reLaunch({
            url: '/enterprise/pages/auth/auth'
          });
          return;
        }

        if (timer == null) {
          wx.showToast({
            title: '会话过期',
            icon: 'none',
            mask: true,
            duration: 2500
          });

          timer = setTimeout(() => {
            // 清空用户信息
            const user = require('./user.js');
            user.cleanUserInfo();

            // 清除计时器
            clearTimeout(timer);
            timer = null;

            wx.reLaunch({
              url: '/index/pages/index/index'
            });
          }, 2000);
        }
      }

      if (data.success != null) {
        data.success(res);
      }
    },
    fail: res => {
      if (data.fail != null) {
        data.fail(res);
      }
    },
    complete: res => {
      if (data.complete != null) {
        data.complete(res);
      }
    }
  });
};

// 发送post请求
const post = data => {
  let header = commonHeaders();
  // 合并header
  if (data.header) {
    for (let obj in data.header) {
      header[obj] = data.header[obj];
    }
  }

  wx.request({
    url: data.url,
    method: 'post',
    header: header,
    data: data.param,
    success: res => {
      if (res.data.code == 40006 || res.data.code == 40003) {
        // 会话过期

        const device = require('./device.js');
        if (device.environment == 'wxwork') {
          // 企业微信环境下，重启到授权页面 (企业微信导购端应该不会执行这个文件)
          wx.reLaunch({
            url: '/login'
          });
          return;
        }

        if (timer == null) {
          wx.showToast({
            title: '会话过期',
            icon: 'none',
            mask: true,
            duration: 2500
          });

          timer = setTimeout(() => {
            // 清空用户信息
            const user = require('../user');
            user.cleanUserInfo();

            // 清除计时器
            clearTimeout(timer);
            timer = null;

            wx.reLaunch({
              url: '/index'
            });
          }, 2000);
        }

      }
      if (data.success != null) {
        data.success(res);
      }
    },
    fail: res => {
      if (data.fail != null) {
        data.fail(res);
      }
    },
    complete: res => {
      if (data.complete != null) {
        data.complete(res);
      }
    }
  });
};

module.exports = {
  testHost,
  cdnHost,
  dsApiNamepace,
  commonHeaders,
  cryptoAeskey,
  get,
  post,
};
