// pages/account/api_login/index.js
import Utils from '../../../lib/utils'

import {
  api_login
} from '../../../lib/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 提交登录
   */
  onSubmitLogin: function (e) {
    const formData = e.detail.value;
    const validate = this.formValidate(formData);
    if (validate) {
      wx.showLoading({title: '加载中', icon: 'none'});
      api_login(formData).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        Utils.user.storageToken(data).then(() => {
          Utils.wxLogin(true);
          wx.navigateBack();
        });
      })
    }
  },

  /**
   *  表单验证
   * @param formData {object} 表单数据
   */
  formValidate: function (formData) {
    const {phone, password} = formData;
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