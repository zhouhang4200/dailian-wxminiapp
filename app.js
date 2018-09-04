import Utils from 'lib/utils'
import {api_orderWait} from 'lib/api'

App({
  onLaunch: function (options) {
    Utils.wxLogin(true);
    let that = this;
    // 将获取的场景值保存到全局变量
    that.globalData.sceneNum = options.scene;
    // 首页数据优先获取策略，首页先进行获取
    api_orderWait({page_size: 10, page: 1}).then(data => {
      if (!data.code) {
        that.globalData.rootPageData = {
          list: data.list,
          total: data.total
        }
      }
    });
    // 获取手机信息
    wx.getSystemInfo({
      success: function (res) {
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model === 'iPhone X') {
          that.globalData.isIpx = true  //判断是否为iPhone X 默认为值false，iPhone X 值为true
        }
      }
    })
  },
  globalData: {
    rootPageData: null,
    sceneNum: '',
    isIpx: false,
    isLogin: !!wx.getStorageSync('token'),
    isRefreshHome: false, // 通知刷新首页,因为订单被接
  }
});
