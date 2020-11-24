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
  }

  // 初始化设配值
  init () {
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
        }
      }
    })
  }
}

// 为什么使用类方式：因为require部分链接文件this的指向也是undefined，所以选择用新方式
module.exports = new Device()