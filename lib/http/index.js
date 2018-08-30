import MD5 from './md5'
import * as Config from '../config'
import Utils from "../utils";

/**
 * 约定的接口key
 * @type {string}
 */
const SIGN_KEY = '123456789';

/**
 * 微信请求封装
 * @param url
 * @param params
 * @returns {Promise<any | never>}
 */
export default (url, params) => {
  url = Config.BASE_URL + url;
  const sign = (MD5(objKeyAscStr(params) + SIGN_KEY)).toUpperCase();
  const token = wx.getStorageSync('token');
  const getRequestData = {
    ...params,
    sign,
    timestamp: new Date().getTime()
  };
  if (Config.ENVIROMENT === 'developer') {
    console.log("%c url：%c " + url, "background-color:#000;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#198cff;font-weight:bold;font-size:12px");
    console.log("%c params：%c " + JSON.stringify(params), "background-color:#000;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#198cff;font-weight:bold;font-size:12px");
    console.log("%c token：%c " + (token.substr(0, 100) + '....'), "background-color:#000;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#198cff;font-weight:bold;font-size:12px");
    console.log("%c objKeyAscStr params：%c " + (objKeyAscStr(params).substr(0, 100) + '....'), "background-color:#000;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#198cff;font-weight:bold;font-size:12px");
    console.log("%c md5 before sign：%c " + objKeyAscStr(params) + SIGN_KEY, "background-color:#000;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#198cff;font-weight:bold;font-size:12px");
    console.log("%c md5 sign：%c " + sign, "background-color:#000;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#198cff;font-weight:bold;font-size:12px");
    console.log('==wz http==提交参数：：：', JSON.stringify(params))
  }
  // 失败回调
  const failHandle = () => {
    wx.hideLoading();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  };
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: 'POST',
      header: {
        ...Utils.httpHeader()
      },
      data: JSON.stringify(getRequestData),
      success: function (res) {
        const data = res.data;
        let code = parseInt(data.code);
        code = isNaN(code) ? 'fail' : code;
        const FAIL_CODE = [1001, 1002, 1003, 1005];
        // 不可预支的服务器错误
        if (code === 'fail') {
          failHandle();
          wx.showToast({title: '服务器错误', icon: 'none', duration: 2000});
          reject(data)
        }
        if (Config.ENVIROMENT === 'developer') {
          console.log('==wz http==服务器res：：：', data);
          console.log("%c url：%c " + url, "background-color:#67C23A;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#67C23A;font-weight:bold;font-size:12px");
          console.log("%c result：%c " + (JSON.stringify(code === 0 ? data.data : data).substr(0, 100) + '....'), "background-color:#67C23A;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#000;font-size:12px;font-weight:bold");
        }
        if (FAIL_CODE.indexOf(code) !== -1) {
          failHandle();
          wx.showToast({title: data.message, icon: 'none'});
          reject(data)
        }
        // 没有权限，被退出登录
        if (code === 1004) {
          let app = getApp();
          app.globalData.isLogin = false;
          wx.removeStorageSync('token');
          wx.removeStorageSync('token_expired_date');
        }
        resolve(code === 0 ? data.data : data)
      },
      fail: function (res) {
        failHandle();
        wx.showToast({title: '网络请求失败', icon: 'none'})
      }
    })
  }).catch();
}


/**
 * 将对象按照key的升序排列，只排列最外面一级
 * @param obj
 * @returns {object}
 * @author ZhuYuan
 * @example
 * {b:2,a:1} => a=1&b=2
 */
const objKeyAscStr = function (obj) {
  // 转换为数组
  let tempArray = [];
  for (let item in obj) {
    tempArray.push(item)
  }

  //按ASCII码进行排序
  tempArray.sort(function (a, b) {
    if (a < b) {
      return -1; //按照降序排列，即a排在b的前面
    } else {
      return 1;
    }
  });

  let strParams = '';

  tempArray.forEach(function (str) {
    let value = obj[str];
    strParams += (str + '=' + (typeof value === 'object' ? JSON.stringify(value) : value) + '&');
  });
  return strParams
};