/**
 * 系统配置信息。
 */

const ENV = {
  DEV: 0, // 开发
  TEST: 1, // 测试
  UAT: 2, // 预发布
  PROD: 3, // 生产, 上生产环境还要修改神策的配置文件
};

// app当前环境
const appEnv = ENV.TEST;

// 版本号
const version = "1.0.0";

/***** 默认0，上传发布代码时改1，其他情况请忽修改 !!! *****/
const release = 0;

module.exports = { appEnv, version, ENV, release };
