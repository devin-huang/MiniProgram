// public/components/paymentMethod/paymentMethod.js
const api = require("../../objects/payApi.js");
const user = require("../../objects/user.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示
    show: {
      type: Boolean,
      value: false,
    },
    // 展示形式 默认页面 确认订单 提交订单 0 订单1  自助买单购物车2  付款积分3
    type: {
      type: Number,
      value: 0,
      observer() {
        let { type } = this.data;
        let selfcashiersStyle = false;
        let isShowIntegral = false;
        let pageType = type;
        if (pageType == 2) {
          selfcashiersStyle = true;
          pageType = 0;
        } else if (pageType == 3) {
          pageType = 1;
          isShowIntegral = true;
        }
        this.setData({
          pageType,
          selfcashiersStyle,
          isShowIntegral,
        });
      },
    },
    // 不可使用文案提示
    textTips: {
      type: String,
      value: "",
      observer() {
        const { textTips, paymentMethod } = this.data;
        if (textTips != null && paymentMethod != "wechat") {
          this.refreshType();
        }
      },
    },
    // 弹窗框默认选中项
    selectIndex: {
      type: Number,
      value: 0,
      observer() {
        const { selectIndex } = this.data;
        this.setData({
          selectType: selectIndex,
        });
      },
    },
    isShowIcon: {
      type: Object,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 支付方式
    playList: ["wechat", "rainbow", "integral"],
    paymentMethod: "wechat",
    iconSelect: "../../images/icon_select_red_selected.png",
    // 页面类型
    pageType: 0,
    // 是否显示积分
    isShowIntegral: false,
    // 自助买单样式
    selfcashiersStyle: false,
    // 接口是否请求成功
    apiDone: false,
    // 当前选中
    selectType: 0,

    payParams: null,
  },
  ready() {
    const integral = user.cardScore;
    let { isShowIntegral, selectIndex, selectType } = this.data;
    if (isShowIntegral) {
      selectType = selectIndex + 1;
    }
    this.setData({
      integral,
      selectType,
    });
    this.getAccountBalance();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 刷新接口
    refresh(param) {
      this.data.payParams = param;
      this.getAccountBalance();
    },
    // 选择支付方式
    handleType(e) {
      const { type } = e.currentTarget.dataset;
      const { info, textTips, playList, pageType } = this.data;
      const paymentMethod = playList[type];
      if ((info.hadPassword != 1 || textTips != "") && type == 1) {
        return;
      }
      this.setData({
        show: false,
        selectType: type,
        paymentMethod,
      });
      this.pay(paymentMethod);
    },

    pay(paymentMethod) {
      console.log("支付方式", paymentMethod);
      this.triggerEvent("paymentMethod", paymentMethod);
      if (
        this.data.payParams &&
        typeof this.data.payParams.method === "function"
      ) {
        this.data.payParams.method(paymentMethod);
      }
    },
    refreshType() {
      const paymentMethod = "wechat";
      this.triggerEvent("paymentMethod", paymentMethod);
      this.setData({
        selectType: 0,
        paymentMethod,
      });
      console.log("支付方式", paymentMethod);
    },
    // 立即开通
    handleOpenSoon() {
      const { hadPassword, payCodeFlag } = this.data.info;
      let index = 1;
      if (hadPassword == 0) {
        index = 3;
      }
      wx.navigateTo({
        url: "/rainbowpay/pages/forgetPwd/forgetPwd?payCodeFlag=" + index,
      });
      this.handleClose();
    },

    //关闭
    handleClose() {
      console.log("关闭");
      this.setData({
        show: false,
      });
    },

    // 调用购物卡接口
    getAccountBalance() {
      let { payParams } = this.data;
      api.post({
        path: "getAccountBalance",
        param: {
          vipAccount: user.cardNo,
        },
        success: (res) => {
          if (res.data.code == 200) {
            const info = res.data.data;
            this.setData({
              info,
              apiDone: true,
            });
            this.triggerEvent("success", info);
            if (payParams && typeof payParams.success === "function") {
              this.data.payParams.success(info);
            }
          } else {
            this.triggerEvent("apiFail", true);
            if (payParams && typeof payParams.fail === "function") {
              this.data.payParams.fail();
            }
          }
        },
        fail: function (res) {
          console.log("接口请求失败");
          this.triggerEvent("apiFail", true);
          if (tpayParams && typeof payParams.fail === "function") {
            this.data.payParams.fail();
          }
        },
      });
    },
    // 不处理（防止穿透）
    touchmove() {},
  },
});
