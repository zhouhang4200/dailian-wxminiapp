// pages/msg/leaveMessageList/index.js

import Utils from '../../../lib/utils'
import {
  api_getMessageList,
  api_getMessageReaded
} from '../../../lib/api'

Page({

  ...Utils.page.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,
    ...Utils.pageNoneResultData,
    ...Utils.globalData(),

    list: []

  },

  initFetch: function () {
    api_getMessageList().then(data => {
      if (data.code) {
        wx.showToast({title: data.message, icon: 'none'})
        return false;
      }
      api_getMessageReaded().then(data => {
      })
      this.setData({
        list: data
      }, () => {
        this.pageEnd();
        this.setData({
          'pageNoneResult.isHidden': data.length !== 0
        })
      })
    })
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