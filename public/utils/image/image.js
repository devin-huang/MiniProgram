/**
 * 维护所有模块的
 * common: 公共
 * shopping: 大电商购物
 *
 * 使用方法
 *
 */

const { cdnHost } = require("../../objects/api");

const { shoppingImagePath } = require("./shopping.js");
const { commonImagePath } = require("./common.js");

const thImagePath = {
  //  公共
  common: {
    ...commonImagePath,
  },

  // 大电商购物
  shopping: {
    ...shoppingImagePath,
  },
};

/**
 * *************************************
 *
 * 使用案例
 * const { getImageUrl } = require('../../../public/constant/image/image');
 * urlPath : getImageUrl('daojia', 'logo');
 *
 * *************************************
 * 获取图片路径
 * @param {*} 分包名称
 * @param {*} 图片名称
 */
const getImageUrl = (packageName, name) => {
  return `${cdnHost.miniprogram}/${packageName}/${name}.png`;
};

module.exports = {
  thImagePath,
  getImageUrl,
};
