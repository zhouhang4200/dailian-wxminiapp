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

  /**
   * 更新用户信息
   */
  updateUserInfo: function () {
    api_profile().then(data => {
      const {balance, frozen} = data;
      this.setData({
        isLogin: data.code === undefined,
        userInfo: {
          ...data
        }
      }, () => this.pageEnd())
    })
  },

  initFetch: function () {
    try {
      const token = wx.getStorageSync('token');
      if (token) {
        this.updateUserInfo();
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
    if (wx.getStorageSync('token')) {
      if (this.data.isLogin === false) {
        wx.showLoading({title: '加载中', icon: 'none'});
        this.setData({
          isLogin: '',
          isPageHidden: true
        }, () => this.pageLoad());
      }
      else {
        this.updateUserInfo();
      }
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