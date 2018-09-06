// pages/account/password/index.js
import Utils from '../../../lib/utils'
import {
  api_sendRegisterPhoneCode,
  api_register
} from '../../../lib/api'

Page({

  /**
   * 获取验证码
   */
  ...Utils.verificationCode.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.verificationCode.data,
    phone: ''
  },

  isValidateForm: function (formData) {
    const {phone, verification_code, password, confirmPassword} = formData;
    const requiredValidate = {
      phone: '请输入手机号码',
      verification_code: '请输入验证码',
      password: '请输入密码',
      confirmPassword: '请再次输入注册密码',
    };
    if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) && phone) {
      wx.showToast({title: '请输入正确的手机号码', icon: 'none'});
      return false;
    }
    if (password.length < 6 && password) {
      wx.showToast({title: '密码长度最低为6位', icon: 'none'});
      return false;
    }
    for (let key in formData) {
      if (formData[key] === '') {
        wx.showToast({title: requiredValidate[key], icon: 'none'});
        return false;
      }
    }
    if (password !== confirmPassword) {
      wx.showToast({title: '两次密码输入不一致，请检查', icon: 'none'});
      return false;
    }
    return true
  },

  onPhoneInput: function (e) {
    this.setData({phone: e.detail.value})
  },


  onFormSubmit: function (e) {
    const formData = e.detail.value;
    const validate = this.isValidateForm(formData);
    if (validate) {
      wx.showLoading({title: '加载中',icon:'none'});
      api_register({
        phone: formData.phone,
        password: formData.password,
        verification_code: formData.verification_code
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        Utils.signInStorage(data).then(() => {
          wx.switchTab({
            url: '/pages/account/index'
          })
        });
      })
    }
  },

  /**
   * 发送手机验证码
   * @returns {boolean}
   */
  sendPhoneCode: function () {
    const phone = this.data.phone;
    if (this.data.verificationCode.disabled) {
      return false;
    }
    if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(phone))) {
      wx.showToast({title: '请输入正确的手机号码', icon: 'none'});
      return false;
    }
    this.verificationCodeSend();
    wx.showLoading({title:'加载中',icon:'none'});
    api_sendRegisterPhoneCode({phone}).then(data => {
      wx.hideLoading();
      if (data.code) {
        return this.verificationCodeFail(data.message);
      }
      return this.verificationCodeSuccess()
    }, () => this.verificationCodeFail())
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
    this.verificationCodeReset();
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

  },
});