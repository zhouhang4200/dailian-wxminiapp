// pages/goodsDetail/index.js

import Utils from '../../lib/utils'
import {
  api_orderWaitDetail,
} from '../../lib/api'

Page({

  ...Utils.page.action,
  ...Utils.modal.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,
    ...Utils.modal.data,

    payPasswordFocus: false,
    payPasswordLength: 0,

    orderPasswordFocus: false,
    orderPayPasswordFocus: false,

    isSettingPasswordHidden: true,
    isReceiveOrderHidden: true,
    isOrderPasswordHidden: true,
    isPayPasswordHidden: true,
    modalKey: '',

    info: {},
    payPassword: ''
  },


  initFetch() {
    api_orderWaitDetail({trade_no: this.options.trade_no}).then(info => {
      this.pageEnd();
      this.setData({info})
    })
  },

  onInput: function (e) {
    const payPassword = e.detail.value;
    this.setData({
      payPasswordLength: payPassword.length
    })
  },

  modalOverlayShowHandle: function () {

  },

  modalOverlayCloseHandle: function () {
    this.setData({
      [this.data.modalKey]: true,
      payPasswordFocus: false,
      payPasswordLength: 0,

      orderPasswordFocus: false,
      orderPayPasswordFocus: false,
    });
  },

  /**
   * 设置支付密码
   */
  settingPayPassword: function () {
    this.setData({
      modalKey: 'isSettingPasswordHidden',
      isSettingPasswordHidden: false,
    })
  },
  /**
   * 接单成功
   */
  orderReceiveSuccess: function () {
    this.setData({
      modalKey: 'isReceiveOrderHidden',
      isReceiveOrderHidden: false
    })
  },
  /**
   * 接单输入密码(订单密码和支付密码)
   */
  setOrderPassword: function () {
    this.setData({
      orderPasswordFocus: true,
      modalKey: 'isOrderPasswordHidden',
      isOrderPasswordHidden: false
    })
  },
  /**
   * 输入支付密码
   */
  inputPayPassword: function () {
    this.setData({
      payPasswordFocus: true,
      modalKey: 'isPayPasswordHidden',
      isPayPasswordHidden: false
    })
  },

  /**
   * 立即接单
   */
  onReceiveSubmit: function () {
    setTimeout(function () {
      this.setData({

      },()=>this.modalOverlayToggle());
    },1000)
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
    wx.hideLoading()
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