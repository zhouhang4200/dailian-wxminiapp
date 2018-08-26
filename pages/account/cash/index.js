// pages/account/capital/cash/index.js

import Utils from '../../../lib/utils'
import {api_cash} from '../../../lib/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_password: ''
  },

  initFetch: function () {

  },

  onSubmit: function (e) {
    const formData = e.detail.value;
    const validate = this.isValidate(formData);
    if (validate) {

    }
  },


  /**
   * 表单验证
   */
  isValidate: function (formData) {
    const {amount} = formData;
    const requiredValidate = {
      amount: '请输入提现金额'
    };
    for (let key in formData) {
      if (formData[key] === '') {
        wx.showToast({title: requiredValidate[key], icon: 'none'});
        return false;
      }
    }
    if (!/^[1-9]\d*$/.test(amount)) {
      wx.showToast({title: '提现金额必须为整数', icon: 'none'});
      return false;
    }
    if (amount < 10) {
      wx.showToast({title: '提现金额最低10元', icon: 'none'});
      return false;
    }
    return true
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