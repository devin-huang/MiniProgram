/*
 * @Author: 黄德辉 
 * @Date: 2020-11-23 17:41:55 
 * @Last Modified by: 黄德辉
 * @Last Modified time: 2020-11-24 11:39:59
 *
 * 使用方式：
 * 
 * 引用1：import localtion from './localtion' 必须全引用，否则this在某方法下为undefined; 
 * 引用2：const localtion = require('./localtion')
 * 
 * localtion.getLocation((ret)=>{
 *  if (ret && ret === 201) {
 *      console.log('获取失败的回调')
 *  } else {
 *      console.log('获取成功的回调')
 *  }
 * })
 * 
 */
const author = require("../utils/author.js");
const gcoord = require("../utils/gcoord/index.js");

// 定位服务是否可用
var locationEnabled = false;
 
// 经纬度（wgs84坐标系，高德、Google国外坐标系）
var wgs84 = {
  longitude: 0.0,
  latitude: 0.0
};

// 经纬度（gcj02坐标系，高德、Google国内坐标系）
var gcj02 = {
  longitude: 0.0,
  latitude: 0.0
};

// 经纬度（bd09坐标系，百度坐标系）
var bd09 = {
  longitude: 0.0,
  latitude: 0.0
};


/// 暴露属性
module.exports.locationEnabled = locationEnabled;
module.exports.wgs84 = wgs84;
module.exports.gcj02 = gcj02;
module.exports.bd09 = bd09;

/**
 * 获取定位地址。
 * 如果用户没有授权，或者定位失败，返回201，此时根据locationEnabled属性区分没授权还是定位失败。
 * 默认获取的是wgs84坐标系，再手动转gcj02和bd09，如果想知道当前是否已经定位，只要检测wgs84坐标系是否为{0,0}即可。
 * 
 * callback：可以参数 ret: 200代表授权成功 201代表授权失败
 */
const getLocation = function (callback) {
  var weakThis = this;
  author.getScope("scope.userLocation", function (locationScope) {
    // 判断是否第一次获取定位
    if (!locationScope) {
      author.openScope("scope.userLocation", function (ret) {
        if (ret == 200) {
          // 已经打开用户权限

          // 设置服务可用
          weakThis.locationEnabled = true;

          // 更新位置
          weakThis.updateLocation(callback);
        } else {
          // 用户拒绝获取信息
          callback && callback(201);
        }
      })
    } else {
      // 定位权限是打开的

      // 设置服务可用
      weakThis.locationEnabled = true;

      // 更新位置
      weakThis.updateLocation(callback);
    }

  });
}

/**
 * 更新定位地址。
 * 
 * 在确认自己已经开启定位的情况下使用，否则返回201。
 */
const updateLocation = function (callback) {
  var weakThis = this;
  // 微信获取地理位置方法
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {

      // 测试不可配送
      // res.longitude = 1;
      // res.latitude = 1;

      // 保存位置
      weakThis.wgs84.longitude = res.longitude;
      weakThis.wgs84.latitude = res.latitude;

      // 转gcj02坐标系
      var gcj02 = gcoord.transform(
        [res.longitude, res.latitude],
        gcoord.WGS84,
        gcoord.GCJ02
      );
      weakThis.gcj02.longitude = gcj02[0];
      weakThis.gcj02.latitude = gcj02[1];

      // 转bd09坐标系
      var bd09 = gcoord.transform(
        [res.longitude, res.latitude],
        gcoord.WGS84,
        gcoord.BD09
      );
      weakThis.bd09.longitude = bd09[0];
      weakThis.bd09.latitude = bd09[1];

      console.log("当前wgs84坐标为：" + weakThis.wgs84.longitude + "," + weakThis.wgs84.latitude);
      console.log("当前gcj02坐标为：" + weakThis.gcj02.longitude + "," + weakThis.gcj02.latitude);
      console.log("当前bd09坐标为：" + weakThis.bd09.longitude + "," + weakThis.bd09.latitude);
       // 设置服务可用
      weakThis.locationEnabled = true;
      // 获取位置成功
      callback && callback(200);
    },
    fail: function (res) {
      // 获取位置失败
      callback && callback(201);
    }
  })
}
module.exports.getLocation = getLocation;
module.exports.updateLocation = updateLocation;


// 计算两个经纬度之间的距离（返回单位：公里）
const calculateDistionce = function (lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  return s
};
module.exports.calculateDistionce = calculateDistionce;

