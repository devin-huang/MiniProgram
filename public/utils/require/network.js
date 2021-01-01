/**
 * 网络状态信息。
 */

// 各种网络类型
const NetworkTypeNone = 0;
const NetworkTypeUnknow = 1;
const NetworkTypeWifi = 2;
const NetworkType4G = 3;
const NetworkType3G = 4;
const NetworkType2G = 5;

module.exports = {
  NetworkTypeNone,
  NetworkTypeUnknow,
  NetworkTypeWifi,
  NetworkType4G,
  NetworkType3G,
  NetworkType2G,
}


// 当前网络状态
var networkType = NetworkTypeUnknow;
module.exports.networkType = networkType;


// 监听网络状态
const startNotifier = function () {
  
  var weakThis = this;

  wx.getNetworkType({
    success: function (res) {

      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType;

      if (networkType === 'none') {
        weakThis.networkType = weakThis.NetworkTypeNone;
      } else if (networkType === 'unknown') {
        weakThis.networkType = weakThis.NetworkTypeUnknow;
      } else if (networkType === 'wifi') {
        weakThis.networkType = weakThis.NetworkTypeWifi;
      } else if (networkType === '4g') {
        weakThis.networkType = weakThis.NetworkType4G;
      } else if (networkType === '3g') {
        weakThis.networkType = weakThis.NetworkType3G;
      } else if (networkType === '2g') {
        weakThis.networkType = weakThis.NetworkType2G;
      }
    }
  })
  wx.onNetworkStatusChange(function(res){
    var type = res.networkType;

    if (type === 'none') {
      weakThis.networkType = weakThis.NetworkTypeNone;
    } else if (type === 'unknown') {
      weakThis.networkType = weakThis.NetworkTypeUnknow;
    } else if (type === 'wifi') {
      weakThis.networkType = weakThis.NetworkTypeWifi;
    } else if (type === '4g') {
      weakThis.networkType = weakThis.NetworkType4G;
    } else if (type === '3g') {
      weakThis.networkType = weakThis.NetworkType3G;
    } else if (type === '2g') {
      weakThis.networkType = weakThis.NetworkType2G;
    }
  })
}
 
module.exports.startNotifier = startNotifier;