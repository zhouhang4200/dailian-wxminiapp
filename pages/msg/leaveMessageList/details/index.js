// pages/msg/leaveMessageList/details/index.js

import Utils from '../../../../lib/utils'
import {
  api_getOrderOperationGetMessage,
  api_sendOrderOperationGetMessage
} from '../../../../lib/api'

Page({
  ...Utils.page.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,

    content: '',

    scrollIntoView: '',

    scrollTop: 1000000,
    scrollInitBottom: '120rpx',

    list: []
  },

  initFetch: function () {
    this.setData({
      trade_no: this.options.trade_no
    })
    api_getOrderOperationGetMessage({
      trade_no: this.options.trade_no
    }).then(data => {
      if (data.code) {
        wx.showToast({title: data.message, icon: 'none'})
        return false;
      }
      this.setData({
        list: data,
        scrollIntoView: data.length !== 0 ? 'msg_row_' + (data.length - 1) : 0
      }, () => this.pageEnd());
      if (!data.length) {
        wx.showToast({title: '暂无留言', icon: 'none'})
      }
    })
  },

  onContentFocus: function (e) {
    wx.createSelectorQuery().select('#J_ScrollView').boundingClientRect(function (rect) {

    }).exec()
  },

  onContentBlur: function (e) {

  },

  onContentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  onSendMsg: function () {
    const {content, trade_no} = this.data;
    if (content.length === 0) {
      return false;
    }
    api_sendOrderOperationGetMessage({
      trade_no,
      content
    }).then(data => {
      if (data.code) {
        wx.showToast({title: data.message, icon: 'none'});
        return false;
      }
      this.data.list.push(data);
      this.setData({
        list: this.data.list,
        content: ''
      }, () => this.setData({
        scrollIntoView: 'msg_row_' + (data.length - 1)
      }))
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