// pages/account/pay/index.js

import {
  api_recharge
} from '../../../lib/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onSubmit: function (e) {
    const amount = e.detail.value.amount;
    if (amount < 1) {
      return wx.showToast({title: '最低充值金额1元', icon: 'none'})
    }
    wx.showLoading();
    const onCancelHandle = errMsg => {
      const isCancel = ['requestPayment:fail cancel', 'requestPayment:cancel'].indexOf(errMsg) !== -1;
      if (isCancel) {
        console.log('取消支付');
        return true
      }
      return false;
    };
    api_recharge({amount}).then(payParams => {
      wx.requestPayment({
        ...payParams,
        'success': function (res) {
          console.log('支付成功');
        },
        'fail': function (res) {
          if (!onCancelHandle(res)) {
            console.log('支付失败:::')
          }
        },
        // bug: 6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调，回调 errMsg 为 'requestPayment:cancel'
        'complete': onCancelHandle
      })
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