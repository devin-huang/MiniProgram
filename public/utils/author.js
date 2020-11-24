/**
 * 系统操作对象。
 */


// 获取用户权限
const getScope = function(scopeName, callback) {
    wx.getSetting({
      success: res => {
        callback(res.authSetting[scopeName]);
      }
    });
  }
  
  module.exports.getScope = getScope;
  
  // 打开用户权限
  const openScope = function(scopeName, callback) {
    wx.authorize({
      scope: scopeName,
      success() {
        callback(200); // 返回200
      }, fail() {
        // 拒绝授权
        callback(201); // 返回201
      }
    });
  }
  module.exports.openScope = openScope;
  
  // 打开设置页面
  const openSetting = function (callback) {
    wx.openSetting({
      success: function (res) {
        if (callback) {
          callback(res);
        }
      }
    });
  }
  module.exports.openSetting = openSetting;