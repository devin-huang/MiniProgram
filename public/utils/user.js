/**
 * 用户信息。
 */
class User {
  constructor() {
    // 是否为虹领巾会员
    this.isVip = null;
    // 登录钥匙串
    this.accessToken = null;
    // 登录成功之后的code
    this.loginCode = null;
    // 获取手机号码要使用的iv和encryptedData
    this.mobileIv = null;
    this.mobileEncryptedData = null;
    // 用户openid（可能为空）
    this.openid = null;
    // 用户unionId（登录的时候返回，可能为空）
    this.unionId = null;
    // 用户id（登录的时候不会赋值，只有在统计的时候需要，如果为空可以调用fetchMemberId方法获取）
    this.memberId = null;
    this.loginTodo = null;
    this.avatar = null; // 用户头像
    this.cardName = null; // 卡号
    this.cardNo = null;
    this.cardLevel = null;
    this.cardScore = null;
    this.phone = null; // 手机号掩码
    this.realphone = null; // 手机号非掩码
    this.isLogin = false;
    this.nickname = null;
    this.profileActivity = false;   //补充资料送积分活动
    this.profileActivityTitle = '';  //补充资料送积分活动
    this.profileDone = false;   //资料补充已完成
  }

  // 保存信息到缓存
  saveUserInfo() {
    if (this.accessToken != null) {
      wx.setStorageSync("sys-accesstoken", this.accessToken);
      wx.setStorageSync("sys-isvip", this.isVip);
      wx.setStorageSync("sys-unionid", this.unionId);
      wx.setStorageSync("sys-logintodo", this.loginTodo);
    } else {
      wx.removeStorageSync("sys-isvip");
      wx.removeStorageSync("sys-accesstoken");
      wx.removeStorageSync("sys-unionid");
      wx.removeStorageSync("sys-logintodo");
    }
  }

  //读取信息（读取前会先请求接口获取用户信息保存在localstorage中）
  readUserInfo () {
    var isVip = wx.getStorageSync("sys-isvip");
    var accessToken = wx.getStorageSync("sys-accesstoken");
    var unionId = wx.getStorageSync("sys-unionid");
    var loginTodo = wx.getStorageSync("sys-logintodo");

    if (accessToken.length > 0) {
      this.isVip = isVip;
      this.accessToken = accessToken;
      this.loginTodo = loginTodo;
    }

    if (unionId != null && unionId.length > 0) {
      this.unionId = unionId;
    }
  }

  // 清理用户信息
  cleanUserInfo () {
    this.isVip = false;
    this.accessToken = null;
    this.loginTodo = null;
    this.isLogin = false;
  
    this.avatar = null;
    this.cardName = null;
    this.cardNo = null;
    this.cardLevel = null;
    this.cardScore = null;
    this.phone = null;
    this.realphone = null;
    this.nickname = null;
    
    this.profileActivity = false;
    this.profileActivityTitle = '';
    this.profileDone = false;
  
    this.mobileIv = null;
    this.mobileEncryptedData = null;
  
    this.openid = null;
    this.memberId = null;
  
    wx.removeStorageSync("sys-isvip");
    wx.removeStorageSync("sys-accesstoken");
    wx.removeStorageSync("sys-unionid");
    wx.removeStorageSync("sys-logintodo");
  };
}

// 为什么使用类方式：因为require部分链接文件this的指向也是undefined，所以选择用新方式
module.exports = new User()
