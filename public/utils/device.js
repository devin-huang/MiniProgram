class Device {
  constructor(){
    // 设备型号
    this.model = null
    // 当前语言
    this.language = null
    // 设备品牌
    this.brand = null
    // 客户端平台
    this.platform = null
    // 屏幕宽高
    this.screenHeight = null
    this.screenWidth = null
    // 可使用窗体宽高
    this.windowHeight = null
    this.windowWidth = null
    // 手机电量
    this.batteryLevel = null
    // 当前运行环境（wx表示在微信端，wxwork表示在企业微信端）
    this.environment = null
    // 微信版本号
    this.version = null
    // 操作系统版本
    this.system = null

    /// 底部预留高度（兼容iPhone X）
    this.remainHeight = 0;
  }

  // 初始化设配值
  init (callback) {
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        Object.keys(that).forEach(item => {
          that[item] = res[item]
        })

        // 判断是否企业微信
        if (typeof res.environment === "undefined" || res.environment == null) {
          if (wx.qy != null) {
            // 企业微信
            that.environment = "wxwork";
          } else {
            // 微信
            that.environment = "wx";
          }
        } else {
          that.environment = res.environment;
        }

        // 安卓机先不考虑设配
        that.remainHeight = 0;

        // IPHONE X 兼容底部预留空间
        if (that.model.indexOf("iPhone X") >= 0) {
          that.remainHeight = 34.0;
        } else if (
          res.platform === "ios" &&
          res.safeArea != null &&
          typeof res.safeArea === "object"
        ) {
          that.remainHeight = Math.max(
            res.screenHeight - res.safeArea.bottom,
            0
          );
        }
      }
    })
    if (typeof callback === "function") {
      callback();
    }
  }
}

// 为什么使用类方式：因为require部分链接文件this的指向也是undefined，所以选择用新方式
module.exports = new Device()