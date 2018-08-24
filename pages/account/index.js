// pages/account/index.js
import Utils from '../../lib/utils'
import {
  api_profile
} from '../../lib/api'

Page({

  /**
   * 页面的初始数据
   */

  ...Utils.page.action,
  ...Utils.img.action,

  data: {
    ...Utils.page.data,

    isLogin: '',

    userInfo: {}
  },

  initFetch: function () {
    try {
      const token = wx.getStorageSync('token');
      if (token) {
        api_profile().then(data => {
          const {balance, frozen} = data;
          this.setData({
            isLogin: data.code === undefined,
            userInfo: {
              ...data,
              totalAmount: ((balance * 100 + frozen * 100) / 100).toFixed(2)
            }
          }, () => this.pageEnd())
        })
      }
      else {
        this.setData({
          isLogin: false
        }, () => this.pageEnd())
      }
    } catch (e) {
      this.pageEnd();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageLoad();
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
    if (wx.getStorageSync('token') && this.data.isLogin === false) {
      this.pageLoad();
    }
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

  }
})