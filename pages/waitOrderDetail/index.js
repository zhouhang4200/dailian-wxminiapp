// pages/goodsDetail/index.js

import Utils from '../../lib/utils'
import {
  api_orderWaitDetail,
  api_operationOrder,
  api_profile
} from '../../lib/api'

// 倒计时清除
let intervalSuccess = '';

Page({

  ...Utils.page.action,
  ...Utils.modal.action,
  ...Utils.pageShowInterruptAction.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,
    ...Utils.modal.data,
    ...Utils.pageShowInterruptAction.data,
    ...Utils.globalData(),

    payPasswordFocus: false,
    payPasswordLength: 0,
    pay_password: '',

    countDownTime: 3, // 倒计时时间

    actionName: '',

    orderPasswordFocus: false,
    orderPayPasswordFocus: false,

    isSettingPasswordHidden: true,
    isOrderSuccessHidden: true,
    isOrderPasswordHidden: true,
    isPayPasswordHidden: true,
    modalKey: '',

    info: {},
    take_order_password: '',
  },

  initFetch() {
    api_orderWaitDetail({trade_no: this.options.trade_no}).then(info => {
      this.setData({info}, () => {
        this.pageEnd();
        this.setOrderSuccessModal();
      })
    })
  },

  /**
   * 立即接单
   */
  onReceiveSubmit: function () {
    wx.showLoading({icon: 'none', title: '加载中'});
    api_profile().then(data => {
      wx.hideLoading();
      if (data.code === 1004) {
        wx.navigateTo({
          url: '/pages/account/login/index'
        });
        this.setPageShowInterruptAction('onReceiveSubmit');
        return false;
      }
      const isSettingPayPassword = data.pay_password === 1;
      const isPayOrderPassword = this.data.info.private === 1;
      if (isSettingPayPassword) {
        if (isPayOrderPassword) {
          this.setOrderAndPayPasswordModal()
        }
        else {
          this.setPayPasswordModal();
        }
      }
      else {
        this.settingPayPasswordModal();
      }
    })
  },

  /**
   * 订单密码
   * @param e
   */
  onInputOrderPassword: function (e) {
    this.setData({
      take_order_password: e.detail.value
    })
  },

  /**
   * 输入支付密码handle
   * @param e
   */
  onInputPayPassword: function (e) {
    const pay_password = e.detail.value;
    this.setData({
      pay_password,
      payPasswordLength: pay_password.length
    })
  },

  /**
   * 设置支付密码焦点
   */
  setPayPasswordFocus: function () {
    this.setData({
      payPasswordFocus: true
    })
  },

  /**
   * 是否设置支付密码弹窗
   */
  settingPayPasswordModal: function () {
    this.setData({
      modalKey: 'isSettingPasswordHidden',
      isSettingPasswordHidden: false,
      actionName: 'onSettingPassword'
    }, () => this.modalOverlayToggle())
  },

  /**
   * 支付密码弹窗
   */
  setPayPasswordModal: function () {
    this.setData({
      modalKey: 'isPayPasswordHidden',
      isPayPasswordHidden: false,
      actionName: 'onPayPassword'
    }, () => this.modalOverlayToggle())
  },

  /**
   * 订单密码和支付密码 弹窗
   */
  setOrderAndPayPasswordModal: function () {
    this.setData({
      modalKey: 'isOrderPasswordHidden',
      isOrderPasswordHidden: false,
      actionName: 'onOrderPassword'
    }, () => this.modalOverlayToggle())
  },

  /**
   * 接单成功弹窗
   */
  setOrderSuccessModal: function () {
    // 接单成功，首页准备刷新
    Utils.setIsRefreshHome();
    this.setData({
      modalKey: 'isOrderSuccessHidden',
      isOrderSuccessHidden: false,
      actionName: 'onOrderSuccess'
    }, () => this.modalOverlayToggle())
  },

  /**
   * modal按钮提交
   */
  onModalSubmit: function (e) {
    const actionName = e.currentTarget.dataset.action;
    this[actionName]();
  },

  /**
   * 提交输入的支付密码
   */
  onPayPassword: function () {
    const pay_password = this.data.pay_password;
    if (pay_password.length < 6) {
      return wx.showToast({title: '请输入完整的支付密码', icon: 'none'});
    }
    this.modalOverlayToggle();
    wx.showLoading({title: '加载中', icon: 'none'});
    this.onOrderSubmitAsync({
      pay_password,
    }).then(data => {
      wx.hideLoading();
      if (data.code) {
        wx.showToast({title: data.message, icon: 'none'});
        this.setPayPasswordModal();
      }
      else {
        this.setOrderSuccessModal();
      }
    })
  },

  /**
   * 提交输入的支付和订单密码
   */
  onOrderPassword: function () {
    const {pay_password, take_order_password} = this.data;
    if (!take_order_password.length) {
      return wx.showToast({title: '请输入订单密码', icon: 'none'});
    }
    if (pay_password.length < 6) {
      return wx.showToast({title: '请输入支付密码', icon: 'none'});
    }
    this.modalOverlayToggle();
    wx.showLoading({title: '加载中', icon: 'none'});
    this.onOrderSubmitAsync({
      pay_password,
      take_order_password
    }).then(data => {
      wx.hideLoading();
      if (data.code) {
        wx.showToast({title: data.message, icon: 'none'});
        this.setOrderAndPayPasswordModal();
      }
      else {
        this.setOrderSuccessModal();
      }
    })
  },

  /**
   *  设置/忘记 支付密码
   */
  onSettingPassword: function (e) {
    const action = e === undefined ? 'setting_pay' : e.currentTarget.dataset.action;
    // 设置完成之后，回来直接提交
    this.modalOverlayToggle();
    wx.navigateTo({
      url: '/pages/account/password/index?action=' + action
    });
    this.setPageShowInterruptAction('onReceiveSubmit');
  },

  /**
   * 订单提交
   */
  onOrderSubmitAsync: function (params) {
    return api_operationOrder({
      trade_no: this.data.info.trade_no,
      ...params,
    })
  },

  /**
   * 订单提交成功，开始自动跳转
   */
  onOrderSuccess: function () {
    this.modalOverlayToggle();
  },

  /**
   * 窗口显示回调
   */
  modalOverlayShowHandle: function () {
    const focus = {
      isOrderPasswordHidden: 'orderPasswordFocus',
      isPayPasswordHidden: 'payPasswordFocus'
    };
    const focusKey = focus[this.data.modalKey];
    if (focusKey) {
      this.setData({
        [focusKey]: true
      })
    }
    // 为成功弹窗的话，就要执行自动关闭弹窗
    if (!this.data.isOrderSuccessHidden) {
      this.autoCloseSuccessModal();
    }
  },

  /**
   * 关窗回调
   */
  modalOverlayCloseHandle: function () {
    const modalKey = this.data.modalKey;
    this.setData({
      [modalKey]: true,
      payPasswordFocus: false,
      payPasswordLength: 0,
      pay_password: '',
      take_order_password: '',
      orderPasswordFocus: false,
      orderPayPasswordFocus: false,
    }, () => {
      // 如果是成功弹窗关闭，就要跳转到详情页
      if (modalKey === 'isOrderSuccessHidden') {
        this.setData({
          countDownTime: 3
        })
        clearInterval(intervalSuccess);
        this.redirectToOrderDetails();
      }
    });
  },

  /**
   * 自动关闭订单成功弹窗
   */
  autoCloseSuccessModal: function () {
    let countDownTime = this.data.countDownTime;
    intervalSuccess = setInterval(() => {
      countDownTime--;
      this.setData({
        countDownTime
      }, () => {
        if (this.data.countDownTime === 1) {
          clearInterval(intervalSuccess)
          // 关闭弹窗，之后执行关闭弹窗回调
          this.modalOverlayToggle();
        }
      })
    }, 1000)
  },

  /**
   * 跳转订单详情
   */
  redirectToOrderDetails: function () {
    clearInterval(intervalSuccess);
    wx.redirectTo({
      url: '/pages/order/details/index?trade_no=' + this.data.info.trade_no
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
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.evalPageShowInterruptAction();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(intervalSuccess);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(intervalSuccess);
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