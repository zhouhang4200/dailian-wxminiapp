// pages/account/password/index.js
import Utils from '../../../lib/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.verificationCode.data
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const setting = {
      update_login: {
        title: '修改登录密码',
        form:[
          {

          }
        ]
      },
      update_pay: {
        title: '修改支付密码'
      },
      forget_pay: {
        title: '忘记支付密码'
      },
      setting_pay: {
        title: '设置支付密码'
      }
    };
    wx.setNavigationBarTitle({
      title: '忘记密码'
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取验证码
   */
  ...Utils.verificationCode.action
});