// pages/msg/index.js
import Utils from '../../lib/utils'
import {
  api_totalMsg
} from '../../lib/api'

Page({

  ...Utils.page.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.page.data,
    ...Utils.globalData(),
    isLogin: false,
    count: 0
  },

  initFetch: function () {
    Utils.tabBarBadgeMsg().then(data => {
      if (!data.code) {
        this.setData({
          count: data.count,
          isLogin: true
        }, () => this.pageEnd());
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Utils.isLogin() ? this.pageLoad() : '';
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
    this.setData({isLogin: Utils.isLogin()})
    Utils.tabBarBadgeMsg();
    this.initFetch();
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