Component({
  properties: {
    finalPayment: {
      type: String,
      value: "",
    },
    totalBalance: {
      type: String,
      value: "",
    },
  },
  data: {
    isShow: false,
  },
  methods: {
    onClose() {
      return new Promise((resolve) => {
        this.setData(
          {
            isShow: false,
          },
          () => {
            this.triggerEvent("close");
            resolve();
          }
        );
      });
    },
    close() {
      return new Promise((resolve) => {
        this.setData(
          {
            isShow: false,
          },
          () => {
            resolve();
          }
        );
      });
    },
    onOpen() {
      this.setData({
        isShow: true,
      });
    },
    onPay() {
      this.close().then(() => {
        this.triggerEvent("pay");
      });
    },
  },
});
