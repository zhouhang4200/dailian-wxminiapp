// pages/account/capital/cash/index.js

import Utils from '../../../lib/utils'
import Encrypt from '../../../lib/encrypt'
import {
  api_cash,
  api_profile,
  api_cashInfo
} from '../../../lib/api'

Page({


  ...Utils.page.action,
  ...Utils.modal.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.page.data,
    ...Utils.modal.data,
    ...Utils.globalData(),

    payPasswordFocus: false,
    payPasswordLength: 0,
    pay_password: '',


    isSettingPasswordHidden: true,
    isPayPasswordHidden: true,
    modalKey: '',

    serviceCharge: 0,
    amount: 0,

    form: {},

    info: {
      tips: '',
      rate: '',
      balance: '',
    }
  },

  initFetch: function () {
    api_cashInfo().then(info => {
      this.setData({info}, () => this.pageEnd())
    })
  },

  onSubmit: function (e) {
    const formData = e.detail.value;
    const validate = this.isValidate(formData);
    if (validate) {
      wx.showLoading({icon: 'none', title: '加载中'});
      this.setData({
        form: formData
      })
      api_profile().then(data => {
        wx.hideLoading();
        const isSettingPayPassword = data.pay_password === 1;
        if (isSettingPayPassword) {
          this.setPayPasswordModal();
        }
        else {
          this.settingPayPasswordModal();
        }
      })
    }
  },

  onAmountInput: function (e) {
    const amount = e.detail.value;
    const {rate} = this.data.info;
    const serviceCharge = amount ? rate * amount : 0;
    this.setData({serviceCharge, amount})
  },

  /**
   *  提交 设置支付密码
   */
  onSettingPassword: function () {
    // 设置完成之后，回来再提交
    this.modalOverlayToggle();
    wx.navigateTo({
      url: '/pages/account/password/index?action=setting_pay'
    })
  },

  /**
   * 提交输入的支付密码开始提现
   */
  onPayPassword: function () {
    const {alipay_account, alipay_name} = this.data.form;
    const pay_password = this.data.pay_password;
    this.modalOverlayToggle();
    wx.showLoading({title: '加载中', icon: 'none'});
    if (!pay_password.length) {
      return wx.showToast({title: '请输入支付密码', icon: 'none'});
    }
    this.modalOverlayToggleEndInterval(() => {
      api_cash({
        pay_password: Encrypt(pay_password),
        alipay_account,
        alipay_name,
        amount: this.data.amount
      }).then(data => {
        if (data.code) {
          if (data.code === 4002) {
            this.setPayPasswordModal()
          }
          if (data.code === 3005) {
            wx.showModal({
              content: '您未进行实名认证，请先申请实名认证后再提现，是否申请实名认证？',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/account/certification/index'
                  })
                }
              }
            })
          }
          return false
        }
        wx.showModal({
          showCancel: false,
          content: '操作成功',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack();
            }
          }
        });
      })
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
    // this.setData({
    //   modalKey: 'isSettingPasswordHidden',
    //   isSettingPasswordHidden: false,
    //   actionName: 'onSettingPassword'
    // }, () => this.modalOverlayToggle())

    wx.showModal({
      content: '您未设置支付密码，是否去设置支付密码？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/account/password/index?action=setting_pay'
          });
        }
      }
    })
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
   * 窗口显示回调
   */
  modalOverlayShowHandle: function () {
    const focus = {
      isPayPasswordHidden: 'payPasswordFocus'
    };
    const focusKey = focus[this.data.modalKey];
    if (focusKey) {
      this.setData({
        [focusKey]: true
      })
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
    }, () => {

    });
  },

  /**
   * modal按钮提交
   */
  onModalSubmit: function (e) {
    const actionName = e.currentTarget.dataset.action;
    this[actionName]();
  },

  /**
   * 表单验证
   */
  isValidate: function (formData) {
    const {alipay_name, alipay_account, amount} = formData;
    const ValidateKeys = {
      alipay_account,
      alipay_name,
      amount
    }
    const {min_amount, rate, balance} = this.data.info;
    const sys_max_amount_actual = balance - (balance * rate);
    const requiredValidate = {
      alipay_account: '请输入支付宝姓名',
      alipay_name: '请输入提现金额',
      amount: '请输入提现金额'
    };
    for (let key in ValidateKeys) {
      if (ValidateKeys[key] === '') {
        wx.showToast({title: requiredValidate[key], icon: 'none'});
        return false;
      }
    }
    if (!/^[1-9]\d*$/.test(amount)) {
      wx.showToast({title: '提现金额必须为整数', icon: 'none'});
      return false;
    }
    if (amount < min_amount) {
      wx.showToast({title: `最小提现金额${min_amount}元`, icon: 'none'});
      return false;
    }
    if (amount > balance) {
      wx.showToast({title: `当前最大可提现金额${balance}元`, icon: 'none'});
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