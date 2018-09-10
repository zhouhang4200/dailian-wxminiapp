// pages/account/api_login/index.js
import Utils from '../../../lib/utils'
import Encrypt from '../../../lib/encrypt'

import {
  api_login
} from '../../../lib/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    password: '',
    phone: '',
    isPasswordFocus: false,
    isPhoneFocus: false
  },

  /**
   * 提交登录
   */
  onSubmitLogin: function (e) {
    const validate = this.formValidate();
    const {phone, password} = this.data;
    if (validate) {
      wx.showLoading({title: '登录中', icon: 'none'});
      api_login({
        phone,
        password: Encrypt(password)
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        Utils.signInStorage(data).then(() => {
          Utils.wxLogin(true);
          wx.navigateBack();
        });
      })
    }
  },

  /**
   * 手机号输入
   */
  onPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value,
      isPasswordFocus: e.detail.value.length === 11
    })
  },

  onPasswordInput: function (e) {
    this.setData({password: e.detail.value})
  },

  /**
   *  表单验证
   * @param formData {object} 表单数据
   */
  formValidate: function () {
    const {phone, password} = this.data;
    let formData = {phone, password}
    const requiredValidate = {
      phone: '请输入手机号码',
      password: '请输入密码',
    };
    if (!(Utils.Regrex.phone.test(phone)) && phone) {
      wx.showToast({title: '请输入正确的手机号码', icon: 'none'});
      return false;
    }
    for (let key in formData) {
      if (formData[key] === '') {
        wx.showToast({title: requiredValidate[key], icon: 'none'});
        return false;
      }
    }
    return true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      isPhoneFocus: true
    })
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