// public/components/payOrder/payOrder.js
const api = require("../../objects/payApi");
const user = require("../../objects/user");
const Crypto = require("../../utils/crypto");

// 50102-虹支付，50101-微信支付
const payModeTrans = {
  wechat: "50101",
  rainbow: "50102",
};

// const CartSubject = require('./cart.js');

// 统计库
const reporter = require("../../vendor/actionReporter.js");

Component({
  options: {
    // 指定所有 _ 开头的数据字段为纯数据字段
    pureDataPattern: /^_/,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // 层级
    zIndex: {
      type: String,
      value: "9",
    },
    // 订单金额
    finalPayment: {
      type: String,
      value: "",
    },
    totalBalance: {
      type: String,
      value: "",
    },
    // 是否需求订单确认提示
    isConfirm: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 传入数据
    _param: null,
    // 返回数据
    _result: null,

    // 支付账户业务类型, 在此增加类型
    // selfcashiers: 2 (自助买单)
    // daojia: 4 (到家)
    // shopping： 6 (电商)
    // couponbuy: 9 (买券)
    // homeexpress: 11 (宅配)
    // ds: 13 (百货)
    // dsexpress: 15 (百货取件)
    // catering: 32 (H5外卖)
    _business: {
      selfcashiers: 2,
      daojia: 4,
      shopping: 6,
      couponbuy: 9,
      homeexpress: 11,
      ds: 13,
      dsexpress: 15,
      catering: 32,
    },

    // 重置密码输入
    isResetInput: false,
    // 订单金额
    payAmount: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*
     * 入参
     * param {
     *  type 支付账户业务类型（见_business）
     *
     *  method 支付方式
     *  rainbow, wechat
     *
     *  orderNoList 支付订单号数组
     *
     *  totalAmount 支付金额（虹支付接口用到）
     *
     *  成功回调，只触发一种
     *  succss
     *  成功提示后回调（不实现不提示哦）
     *  toastSuccess
     *
     *  失败回调，只触发一种
     *  fail
     *  失败提示后回调（不实现不提示哦）
     *  toastFail
     *
     *  取消回调，只触发一种
     *  cancel
     *  取消提示后回调（不实现不提示哦）
     *  toastCancel
     * }
     */
    pay(param) {
      this.data._param = param;

      const { type, method, orderNoList } = param;
      let businessType = this.data._business[type];
      if (businessType == null) {
        console.log("支付业务异常");
        return;
      }

      const payMode = payModeTrans[method];
      if (!payMode) {
        console.log("支付方式异常");
        return;
      }

      wx.showLoading({
        title: "加载中...",
        mask: true,
      });

      api.postOrder({
        path: "payment-route-api/paycenter/pay",
        param: {
          businessType,
          payMode,
          orderNoList,
        },
        success: (res) => {
          const { code, message, data } = res.data;
          if (code == 200) {
            this.data._result = data;
            this.setData({
              payAmount: data.payAmount,
            });
            wx.hideLoading();
            this.checkPayment();
          } else {
            this.handleFailCallback(message);
          }
        },
        fail: () => {
          this.handleFailCallback();
        },
      });
    },

    // 使用对应的支付方式
    checkPayment() {
      const method = this.data._param.method;
      if (method === "rainbow") {
        if (this.properties.isConfirm) {
          const payConfirm = this.selectComponent("#pay-confirm");
          payConfirm.onOpen();
        } else {
          this.rainbowPay();
        }
      } else if (method === "wechat") {
        this.wxPay();
      }
    },

    // 微信支付
    wxPay(data) {
      const {
        timeStamp,
        nonceStr,
        prepayId,
        signType,
        paySign,
        outTradeNo,
      } = this.data._result;

      // 支付统计
      reporter.requestPayment(outTradeNo);

      // 支付
      wx.requestPayment({
        timeStamp: timeStamp + "",
        nonceStr: nonceStr,
        package: prepayId,
        signType: signType,
        paySign: paySign,
        success: (res) => {
          wx.showLoading({
            title: "支付中...",
            mask: true,
          });
          this.payQuery();
        },
        fail: (res) => {
          if (
            res.errMsg != null &&
            res.errMsg == "requestPayment:fail cancel"
          ) {
            this.handleCancelCallback();
          } else {
            this.handleFailCallback("支付失败");
          }
        },
      });
    },

    // 虹支付
    rainbowPay(data) {
      wx.showLoading({
        title: "支付中...",
        mask: true,
      });
      const { outTradeNo, notifyUrl, payAmount } = this.data._result;
      // const { totalAmount } = this.data._param;
      api.post({
        path: "appPayment/appTradePay",
        param: {
          vipAccount: user.cardNo,
          totalAmount: payAmount,
          outTradeNo,
          // 支付方式，1条码支付，2app支付，3扫码支付
          payType: 2,
          notifyUrl,
        },
        success: (res) => {
          const { code, message } = res.data;
          // 操作结果状态码。200：支付成功；120000：需验证支付密码；120205：变更设备首次支付需要密码； 120104：未设置支付密码；其他状态码为失败场景，请参见共通状态码
          if (code == 200) {
            this.payQuery();
          } else if (code == 120000 || code == 120205) {
            wx.hideLoading();
            this.setData({
              isResetInput: true,
              showPayPwdPanel: true,
            });
          } else {
            this.handleFailCallback(message);
          }
        },
        fail: (res) => {
          this.handleFailCallback();
        },
      });
    },

    // 查询支付状态
    payQuery() {
      const { outTradeNo } = this.data._result;
      api.postOrder({
        path: "payment-route-api/paycenter/payQuery",
        param: {
          outTradeNo: outTradeNo,
        },
        success: (res) => {
          const { code, message } = res.data;
          if (code == 200) {
            this.handleSuccessCallback({ outTradeNo });
          } else {
            this.handleSuccessCallback({ message: message || "加载失败" });
          }
        },
        fail: () => {
          this.handleFailCallback("支付状态查询失败");
        },
      });
    },

    // 成功事件
    handleSuccessCallback({ outTradeNo, message }) {
      wx.hideLoading();
      const { success, toastSuccess, method } = this.data._param;
      if (typeof success === "function") {
        success();
      } else if (typeof toastSuccess === "function") {
        if (method === "rainbow") {
          toastSuccess({ outTradeNo });
          return;
        }
        let options = {
          title: "支付成功",
          icon: "success",
          duration: 2000,
          mask: true,
        };
        if (message) {
          options = {
            title: message,
            icon: "none",
            duration: 2000,
            mask: true,
          };
        }
        wx.showToast(options);
        setTimeout(() => {
          toastSuccess({ outTradeNo });
        }, 2000);
      }
    },

    // 失败事件
    handleFailCallback(message) {
      wx.hideLoading();
      const { fail, toastFail } = this.data._param;
      if (typeof fail === "function") {
        fail();
      } else if (typeof toastFail === "function") {
        let msg = "加载失败";
        if (message != null) {
          msg = message;
        }
        wx.showToast({
          title: msg,
          icon: "none",
          duration: 1500,
          mask: true,
        });
        setTimeout(() => {
          toastFail();
        }, 1500);
      }
    },

    // 取消事件
    handleCancelCallback() {
      wx.hideLoading();
      const { cancel, toastCancel } = this.data._param;
      if (typeof cancel === "function") {
        cancel();
      } else if (typeof toastCancel === "function") {
        wx.showToast({
          title: "支付取消",
          icon: "none",
          duration: 1500,
          mask: true,
        });
        setTimeout(() => {
          toastCancel();
        }, 1500);
      }
    },

    handleInputFail(message) {
      wx.hideLoading();
      let msg = "加载失败";
      if (message != null) {
        msg = message;
      }
      wx.showToast({
        title: msg,
        icon: "none",
      });

      this.setData({
        isResetInput: true,
      });
    },

    // 输入虹包支付密码完成回调
    handleKey(e) {
      wx.showLoading({
        title: "支付中...",
        mask: true,
      });
      const password = e.detail;
      const { outTradeNo } = this.data._result;
      api.post({
        path: "payPassword/tradePayValidPassword",
        param: {
          vipAccount: user.cardNo,
          password: Crypto.Encrypt(password),
          outTradeNo: outTradeNo,
          // 支付方式，1条码支付，2app支付，3扫码支付
          payType: 2,
        },
        success: (res) => {
          const { code, message } = res.data;
          if (code == 200) {
            this.setData({
              showPayPwdPanel: false,
            });
            this.payQuery();
          } else if (code == 120009 || code == 120002) {
            wx.hideLoading();
            this.setData({
              isResetInput: true,
            });
            const alertView = this.selectComponent("#alertView");
            if (code == 120009) {
              // 支付密码错误
              if (alertView != null) {
                alertView.show({
                  text: {
                    content: message,
                    cancelText: "忘记密码",
                    confirmText: "重新输入",
                  },
                  confirm: () => {},
                  close: () => {
                    // 忘记密码
                    wx.navigateTo({
                      url: `/rainbowpay/pages/forgetPwd/forgetPwd`,
                    });
                  },
                });
              }
            } else {
              // 被锁
              const passwordSettings = this.selectComponent(
                "#passwordSettings"
              );
              if (alertView != null) {
                alertView.show({
                  text: {
                    content: "虹包功能已被锁定，次日凌晨3点自动解锁",
                    cancelText: "我知道了",
                    confirmText: "联系客服",
                  },
                  confirm: () => {
                    wx.makePhoneCall({
                      phoneNumber: "4008295295",
                    });
                    if (passwordSettings != null) {
                      passwordSettings.handleClose();
                    }
                  },
                  close: () => {
                    if (passwordSettings != null) {
                      passwordSettings.handleClose();
                    }
                  },
                });
              }
            }
          } else {
            this.handleInputFail(message);
          }
        },
        fail: () => {
          this.handleInputFail();
        },
      });
    },

    // 关闭输入密码框
    handleClose(e) {
      this.handleCancelCallback();
    },
  },
});
