// pages/account/pay/index.js

import Utils from "../../../lib/utils";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.globalData(),

    isAmountFocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  loadPageTransitionEnd: function () {
    this.setData({
      isAmountFocus: true
    })
  },

  onSubmit: function (e) {
    const amount = e.detail.value.amount;
    if (amount < 0) {
      return wx.showToast({title: '最低充值金额1元', icon: 'none'})
    }
    wx.showLoading({title: '加载中'});
    Utils.wxPay({amount}).then(() => {
      wx.hideLoading();
      return wx.showToast({title: '充值成功', icon: 'none'})
    }).catch();
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