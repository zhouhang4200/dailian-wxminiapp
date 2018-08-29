import Utils from 'lib/utils'

App({
  onLaunch: function () {
    Utils.wxLogin(true)
    // wx.login({
    //   success: function(res) {
    //     console.log('：：：微信：：：res:::',res)
    //     // if (res.code) {
    //     //   //发起网络请求
    //     //   wx.request({
    //     //     url: 'https://test.com/onLogin',
    //     //     data: {
    //     //       code: res.code
    //     //     }
    //     //   })
    //     // } else {
    //     //   console.log('登录失败！' + res.errMsg)
    //     // }
    //   }
    // });
  }
});
