// pages/msg/leaveMessageList/details/index.js

import Utils from '../../../../lib/utils'
import {
  api_getOrderOperationGetMessage
} from '../../../../lib/api'

Page({
  ...Utils.page.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,

    selfId: '1',
    msgList: [
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        content: "我这边有点问题，想问你一下",
        user: "1"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        content: "你好，我现在有点事，等下就上号代练",
        user: "2"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        content: "好的，多长时间上号,好的，多长时间上号,好的，多长时间上号,好的，多长时间上号,好的，多长时间上号,好的，多长时间上号",
        user: "1"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        content: "20分钟",
        user: "2"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        content: "没问题",
        user: "1"
      }
    ]
  },

  initFetch:function(){
    api_getOrderOperationGetMessage({})
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