// pages/msg/leaveMessageList/details/index.js

import Utils from '../../../../lib/utils'
import {
  api_getOrderOperationGetMessage,
  api_sendOrderOperationGetMessage
} from '../../../../lib/api'

let isIpx = Utils.globalData().isIpx

Page({
  ...Utils.page.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,
    ...Utils.globalData(),

    content: '',

    scrollIntoView: '',

    scrollTop: 0,
    scrollInitBottom: isIpx ? '218rpx' : '150rpx',
    scrollBottom: isIpx ? '218rpx' : '150rpx',
    isInputFocus: false,

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
          scrollTop: 100000
        }, this.pageEnd);
    })
  },

  /**
   * 键盘显示
   * @param plusHeight
   */
  keyBoardShow: function (plusHeight = 0) {
    // 需要更改滚动视图的bottom高度
    wx.createSelectorQuery().select('#J_MsgForm').boundingClientRect(rect => {
      this.snsScrollViewListBottom(rect.height + plusHeight + 20)
    }).exec()
  },

  /**
   * 键盘显示
   */
  keyBoardHide: function () {
    // 需要更改滚动视图的bottom高度
    this.snsScrollViewListBottom()
  },

  // 设置聊天内容列表视图距离底部的距离
  snsScrollViewListBottom: function (size) {
    let bottom = (size || this.data.scrollInitBottom) + '';
    const pixelRatio = this.data.ratio;
    // 无 rpx 单位证明是用原来的单位
    bottom = bottom.indexOf('rpx') !== -1 ? bottom : bottom / pixelRatio;
    if (this.data.isIpx) {
      bottom = Math.floor(parseInt(bottom) + parseInt('68rpx')) + 'rpx'
    }
    this.setData({
      scrollBottom: bottom + 'rpx',
      scrollTop: this.data.scrollTop + 10
    })
  },

  onContentFocus: function (e) {
    this.keyBoardShow(e.detail.height);
  },

  onContentBlur: function (e) {
    this.setData({
      scrollBottom: this.data.scrollInitBottom,
      scrollTop: this.data.scrollTop + 10
    })
  },

  onContentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  onSendMsg: function () {
    const {content, trade_no} = this.data;
    if (content.length === 0) {
      wx.showToast({title: '请输入内容', icon: 'none'});
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
      }, () => {
        this.setData({
          scrollTop: this.data.scrollTop + 10
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