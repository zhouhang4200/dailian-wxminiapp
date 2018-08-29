// pages/msg/arcitleTemplate/index.js

import Utils from '../../../lib/utils'
import {
  api_helpDetails,
  api_noticeDetails
} from '../../../lib/api'

Page({

  ...Utils.page.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,
    ...Utils.globalData(),

    info: {
      "id": '',
      "title": '',
      "content": '',
      "created_at": ""
    }

  },

  initFetch: function () {
    const {id, action} = this.options;
    const api = {api_helpDetails, api_noticeDetails};
    api[action]({id}).then(info => {
      wx.setNavigationBarTitle({
        title: info.title
      });
      this.setData({
        info: {
          ...info,
          content: info.content ? this.formatContent(info.content) : ''
        }
      }, () => this.pageEnd());
    })
  },

  formatContent: function (content) {
    return content.replace(/<\/?.+?>/g, "")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageLoad();
    wx.setNavigationBarTitle({
      title: options.title
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

  }
})