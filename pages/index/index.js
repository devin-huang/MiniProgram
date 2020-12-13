//index.js
//获取应用实例
const app = getApp()
const qrScan = require('../../public/scan/QRcode')
const location = require('../../public/location/location')
const device = require('../../public/utils/device')
const user = require('../../public/utils/user')

Page({
  data: {
    locationBygcj02: {
      longitude: 0,
      latitude: 0
    },
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 扫码
  scanCodeByCamera() {
    wx.navigateTo({
      url: '../camera/camera'
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onload')
    // 用户参数

    // 设备参数
    device.init()
    // 二维码生成
    /**
       * params (str) 唯一编码，转为文本再转二维码
       * params (canvas) canvas组件ID值
       * params (cavW) canvas 宽度
       * params (cavH) canvas 高度
       * params ($this) 传入组件的this,兼容在组件中生成
       * params (ecc) 一般传undefined
       * params (callback) 成功生成后的回调操作
       */
    qrScan.api.draw(20201111, `demo-20201111`, 130, 130, this, undefined, () => {
      console.log('二维码生成成功')
    })

    // 获取当前地理位置（含GOOGLE/百度/高德，具体类型查看源文件）
    location.getLocation((ret)=>{
      // ret 200：成功 201：失败
      console.log(ret, 'ret', location.gcj02)
      this.setData({
        locationBygcj02: location.gcj02
      })
    })


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo

    // 保存用户信息
    user.nickname = e.detail.userInfo.nickname
    user.mobileIv = e.detail.userInfo.iv
    user.mobileEncryptedData = e.detail.userInfo.encryptedData

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  displayModal: function () {
    this.modal = this.selectComponent('#modal')
    this.modal.show({ title: '测试标题', content: '测试内容' })
  },

  displayPopuBox: function () {
    this.popupBox = this.selectComponent('#popupBox')
    this.popupBox.show()
  }
})
