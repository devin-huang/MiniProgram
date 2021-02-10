# MiniProgram

### 设置用户属性

```
    // page/index/index.js
    const device = require('public/utils/user.js')
    user.readUserInfo() // 初始化

```

### 获取设备值

```
    // page/index/index.js
    const device = require('public/utils/device.js')
    device.init() // 初始化

    console.log(device.remainHeight)
```

### 二维码

    `components/QRcode.js`

### 地位位置

```
    // page/index/index.js
    const location = require('../../public/location/location')
    location.getLocation()
```

### 分享

### 支付

    `components/paymentMethod`

    `components/payConfirm`

    `components/payOrder`

    `components/passwordSettings`

### 授权

### 请求

```
  const { postTest } = require('public/utils/require/requireApi.js')
  postTest({
    path,
    param,
    success () { console.log('success') },
    fail () { console.log('fail') },
    complete () { console.log('complete') }
  }}
```

### 图片引用

- 二选一方式

```
    // 第一种
    <wxs src="public/utils/image/image.wxs" module="_" />
    <image src='{{ _.src("common", "icon_coupon_code") }}' />

    // 第二种
    const { getImageUrl } = require('public/utils/image/image.js')
    getImageUrl('common', 'order_status')
```

### 组件

    #### 顶部条件框

    #### 弹出框 Modal

    #### 底部弹框 popuBox
