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

### JS-SDK

- SDK： H5 / APP 跨端能使用 WX 的功能

* 同一公司，同一小程序中嵌套 H5（web-view）则使用：wx.\*\*\*，如：wx.getSystemInfo / wx.qy.login 即可，不需授权

* 同一公司，不同小程序中嵌套 H5（web-view）需要授权：wx.agentConfig，注意：企业微信 3.0.24 及以后版本

  ### 需授权的域名需要在企业微信后台管理系统添加位白名单，（校验：企微生成唯一标识码放入域名中用过校验）

  ### launchMiniprogram 企业微信 3.0.36 及以后版本支持

  ### Android 使用跳转到小程序无效，原因是由于 launchMiniprogram 没有在 amount 生命周期中调用

  ### token 验证：由于 H5 嵌套在小程序环境内，所以跳转时是可以获取到当前微信环境的用户信息/系统信息从而实现用户验证

- 使用用例：

```

// 比较版本号
export const compareVersion  = (v1: any, v2: any): number => {
  const _v1 = v1.split(".")
  const	_v2 = v2.split(".")
  // 或操作是为了占位，避免NaN
  const _r = parseInt(_v1[0] || 0, 10) - parseInt(_v2[0] || 0, 10);
  return v1 !== v2 && _r === 0 ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.')) : _r;
}

// 获取企微的版本号
export const getWorkWXversion = () => {
  const agent = window.navigator.userAgent || ''
  const version = agent.match(/wxwork\/(\S*) /)?.[1]
  return version || ''
}

// 最低支持版本号常量
const limitVersion = '3.0.36'

// 执行跳转
export const onMinApp = (path?: string) => {
  const { wx } = window
  console.log('path---->', path)
  console.log('调起wx---->', wx)
    if (wx) {
      if (compareVersion(getWorkWXversion(), limitVersion) < 0) {
        Modal.alert('版本过低', `企业微信升级至${limitVersion}及以后版本`, [
          { text: '好的', onPress: () => console.log('ok') },
        ])
        return false
      }

      wx.invoke(
        'launchMiniprogram',
        {

          appid: 'wx83b25ac313a*****', // 需跳转的小程序appid
          path: path || 'enterprise/pages/index/index', // 所需跳转的小程序内页面路径及参数。非必填
          miniprogramType: 1
        },
        (res:any) => {
          if (res.err_msg === 'launchMiniprogram:ok') {
            // 正常
            console.log('正常---->', res)
          } else {
            // 错误处理
            console.log('错误---->', res.err_msg)
          }
        }
      )
    } else {
      console.log('加载失败')
    }
}

// 生成签名
export const getSignature = (signatureInfo: any) => {
  const url = window.location.href.split('#')[0]
  const { nonceStr, timestamp, ticket } = signatureInfo
  const encodeStr = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
  const hash = CryptoJS.SHA1(encodeStr) // 生成sha1加密签名.
  const signatureText = CryptoJS.enc.Hex.stringify(hash)
  console.log('签名----->', signatureText)
  return signatureText
}

// 授权
export const loadingWX = (signatureInfo: any) => {
  const { wx } = window
  console.log('配置微信---->', wx)
  if (wx) {

    const { nonceStr, timestamp } = signatureInfo
    const signature = getSignature(signatureInfo)

    wx.agentConfig({
      corpid: 'wx5cc66*****c5469d', // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid: '10****1', // 必填，企业微信的应用id （e.g. 1000247）
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
      jsApiList: ['launchMiniprogram'], // 必填, 填入所需引用的方法
      success(res: any) {
        // 回调
        console.log('回调成功----->', res)
      },
      fail(res: any) {
        if (res.errMsg.indexOf('function not exist') > -1) {
          console.log('版本太低')
        }else {
          console.log(res.errMsg)
        }
      }
    })
  } else {
    console.log('wx没有加载成功')
  }
}

// 获取本地缓存
export const getStoragedData = (fieldName: string, needParse = true) => {
  const a = localStorage.getItem(fieldName) || '{}'
  return !needParse ? localStorage.getItem(fieldName) : JSON.parse(a)
}

// 写入本地缓存
export const setStoragedData = (fieldName: string, fieldValue: any, needStringify = true) => {
  localStorage.setItem(fieldName, needStringify ? JSON.stringify(fieldValue) : fieldValue)
}


// 微信授权
const AuthWXSignature = async() =>{
  const signatureKey = 'wx-signatureInfo'
  await getApi() // 通过后端API生成签名存入浏览器缓存
  const signatureInfo = getStoragedData(signatureKey)
  loadingWX(signatureInfo) // signatureInfo => {"noncestr":"","jsapi_ticket":"","timestamp":""}
}

```
