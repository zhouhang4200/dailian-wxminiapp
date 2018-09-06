App({
  onLaunch: function (options) {
    let that = this;
    // 将获取的场景值保存到全局变量
    that.globalData.sceneNum = options.scene;
    // 获取手机信息
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.windowWidth = res.windowWidth
        that.globalData.ratio = res.pixelRatio
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model === 'iPhone X') {
          that.globalData.isIpx = true  //判断是否为iPhone X 默认为值false，iPhone X 值为true
        }
      }
    })
  },
  globalData: {
    sceneNum: '',
    windowWidth: '',
    ratio: '',
    isIpx: false,
    isLogin: !!wx.getStorageSync('token'),
  }
});
