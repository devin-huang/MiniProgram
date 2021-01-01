
const api = require('./api.js');
const network = require("./network.js");

/*
 * data: {

 *   // mockData *** mock调试用数据, 不请求接口 ***
 *   格式
 *   { 
 *     code: 10005,
 *     message: 'hello world',
 *     data: ...
 *   }
 * 
 *   // 请求全地址（有url则path没效）
 *   url
 * 
 *   // 请求路径
 *   path
 * 
 *   // 参数
 *   param
 * 
 *   // 自定header
 *   header
 * 
 *   // 主动处理code (1.null或不传, 2.空数组, 3.自定code数组)
 *   handleCodes
 * 
 *   // 200回调
 *   success
 * 
 *   // 非200及其他异常错误回调
 *   1.不实现此方法则不弹出提示
 *   2.实现了此方法, 回调fail, 根据 handleCodes 作不同处理
 *   <1>.null或不传
 *       统一弹出提示
 *   <2>.空数组
 *       不弹出提示
 *   <3>.自定code数组
 *       非对应code统一弹出提示
 *   fail
 * 
 *   // 完成回调success、fail后都会触发
 *   complete
 * }
 * 
 */


/*
 * 自定义各种服务器请求信息配置
 * 封装好请求头部、域名前缀供外部使用： 
 * postTest({
 *  path, 
 *  param,
 *  success () {},
 *  fail () {},
 *  complete () {}
 * }}
 * 
 */
const postTest = data => {
  let header = {
    'x-http-source': 'wxmp-work',
    'x-http-module': 'ds',
  }
  
  postCommon({
    ...data,
    // 需要特定域名空间使用`${api.testHost}/${api.dsApiNamepace}`
    host: api.testHost,
    header,
  });
}


// 公共调用请求封装
const postCommon = (data) => {

  const handleCodes = data.handleCodes;

  // 200处理
  const handleRequestSuccess = (res) => {
    const { data: resData, data: { code } } = res;
    if (code === 200) {
      if (typeof data.success === 'function') {
        data.success(resData);
      }
      handleRequestComplete();
    } else {
      handleRequestFail(res);
    }
  }

  // 非200及其他处理
  const handleRequestFail = (res = {}) => {
    const { data: resData = {}, data: { code, message } = {} } = res;
    if (typeof data.fail === 'function') {
      data.fail(resData);
      
      let showToast = true;
      if (Array.isArray(handleCodes) && handleCodes.length > 0 && handleCodes.indexOf(code) !== -1) {
        // 对应code不提示toast
        showToast = false;
      } else if (Array.isArray(handleCodes) && handleCodes.length === 0) {
        // 空codes数组不提示toast
        showToast = false;
      }
      if (showToast) {
        // 统一提示
        wx.showToast({
          title: message || ((network.networkType === 0) ? '谁家的网络，信号这么差~' : '加载失败，请重试~'),
          icon: 'none',
          duration: 2000,
        })
      }
    } 
    handleRequestComplete();
  }

  // 完成
  const handleRequestComplete = () => {
    if (typeof data.complete === 'function') {
      data.complete();
    }
  }

  if (appConfig.release !== 1 && data.mockData !== null) {
    // mock调试数据
    setTimeout(() => {
      handleRequestSuccess({ data: data.mockData });
    }, 300);
  } else {
    // 正常请求
    api.post({
      url: data.url ? data.url : `${data.host}/${data.path}`,
      header: data.header,
      param: data.param,
      success: handleRequestSuccess,
      fail: handleRequestFail,
    });
  }
}


module.exports = {
  postTest
};