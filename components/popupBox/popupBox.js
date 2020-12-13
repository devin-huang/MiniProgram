// enterprise/components/popupBox/popupBox.js
const device = require("../../public/utils/device");

Component({
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {

    // 标题底部是否有线条
    hasTitleLine: {
      type: Boolean,
      value: false
    },  

    titleStyle: {
      type: String,
      value: ""
    },

    //弹出框状态
    status: {
      type: Boolean,
      value: false
    },

    // 弹框高度
    height: {
      type: Number,
      value: 335
    },

    // 弹框层级
    zIndex: {
      type: Number,
      value: 99
    },

    // 是否自定自定义底部按钮
    btnClass: {
      type: String,
      value: "popbtn"
    },

    // 圆角
    fillet: {
      type: String,
      value: "0"
    },

    // 标题内容 (是否显示标题)
    title: {
      type: String
    },

    //标题文字方式
    textAlign: {
      type: String,
      value: 1
    },

    // 按钮高度
    titleHeight: {
      type: Number,
      value: 40
    },

    //使用按钮
    btnStatus: {
      type: Boolean,
      value: false
    },

    //按钮样式
    btnStyle: {
      type: String,
      value: ''
    },

    // 底部按钮
    btnText: {
      type: String,
      value: "确定"
    },

    // 关闭图标
    closeIcon: {
      type: String,
      value: ""
    },

    btnClosePosition: {
      type: String,
      value: 'right'
    },

    /**
     * 是否显示关闭按钮, 默认展示
     * */ 
    closeable: {
      type: Boolean,
      value: true,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    callbackParam: null,
  },
  ready() {
    const { remainHeight, screenWidth } = device
    console.log(remainHeight, screenWidth)
    const { height, btnStatus, title } = this.data
    let btnHeight = 0;
    let titleHeight = 0;

    // 是否有标题
    if (title) {
      titleHeight = 40;
    }

    // 是否有按钮
    if (btnStatus) {
      btnHeight = 50;
    }
    var scrollHeight = height - btnHeight - (this.data.noTitleDom ? 0 : titleHeight);
    this.setData({
      remainHeight,
      screenWidth,
      scrollHeight,
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹框
    close() {
      this.triggerEvent("closeBtn", "");
      this.setData({ status: false });
    },

    // 打开弹框
    show(param) {
      this.setData({
        status: true,
        callbackParam: param || null,
      });
    },

    // 底部按钮
    popBtn() {
      const { callbackParam } = this.data;
      if (callbackParam != null && typeof callbackParam.confirm === 'function') {
        return callbackParam.confirm();
      }

      this.triggerEvent("popBtn", "");
      console.log("确定");
    },
    // catchtouchMove() {}
  }
});
