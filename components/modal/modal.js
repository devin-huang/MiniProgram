// public/components/nativeComponentModal/nativeComponentModal.js
/***
 * 原生组件上面显示弹出框
 * 
 */
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hideModal: true,
    modalData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 外部使用this.selectComponent()调用该方法并将自定义属性传入 生成自定义弹框
    show(params){
      let primary = {
        content: '',
        title: '',
        hasConfirmBtn: true,
        hasCancelBtn: true,
        confirmText: '确定',
        cancelText: '取消',
        confirmColor: '#ff2332',
        confirm: null,
        cancel: null
      }
      this.setData({
        modalData: {
          ...primary
        },
        hideModal: false
      }, function () {
        console.log(this.data.modalData)
      })
    },

    hide(){
      this.setData({
        hideModal: true
      })
    },

    handleCancel(){
      const { modalData } = this.data
      this.setData({
        hideModal: true
      }, ()=> modalData.cancel && modalData.cancel())
    },

    handleConfirm(){
      const { modalData } = this.data
      this.setData({
        hideModal: true
      }, ()=> modalData.confirm && modalData.confirm())
    },
  }
})
