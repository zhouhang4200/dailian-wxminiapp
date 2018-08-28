// pages/order/negotiated/index.js
import Utils from "../../../lib/utils";
import {
  api_orderOperationApplyConsult
} from "../../../lib/api";

Page({

  ...Utils.page.action,
  ...Utils.modal.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.modal.data,
    ...Utils.page.data,
  },

  onSubmitForm: function () {
    const formData = e.detail.value;
    const isValidate = this.isValidateForm(formData);
    if (isValidate) {
      this.modalOverlayToggle();
    }
  },

  isValidateForm: function (formData) {
    const {amount, efficiency_deposit, security_deposit} = formData;
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)
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

  },
  /**
   * 选择操作
   * @param e
   */
  onSelect: function (e) {
    this.modalOverlayToggle();
    const index = e.currentTarget.dataset.index;
    console.log(index)
  }
})