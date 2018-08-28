// pages/account/password/index.js
import Utils from '../../../lib/utils'
import {
  api_findLoginPassword,
  api_updateLoginPassword,
  api_findPayPassword,
  api_updatePayPassword,
  api_settingPayPassword,
} from '../../../lib/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.verificationCode.data,

    action: '',
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const action = options.action;
    const setting = {
      find_login: {
        title: '找回登录密码',
        type: 'find_login',
        action: 'api_findLoginPassword'
      },
      update_login: {
        title: '修改登录密码',
        type: 'update_login',
        action: 'api_updateLoginPassword'
      },
      find_pay: {
        title: '找回支付密码',
        type: 'find_pay',
        action: 'api_findPayPassword'
      },
      update_pay: {
        title: '修改支付密码',
        type: 'update_pay',
        action: 'api_updatePayPassword',
      },
      setting_pay: {
        title: '设置支付密码',
        type: 'setting_pay',
        action: 'api_settingPayPassword'
      }
    };
    this.setData({});
    wx.setNavigationBarTitle({
      title: '忘记密码'
    });
    const settingValue = setting[action];
    if (setting[action]) {
      this.setData({
        action: settingValue.action,
        type: settingValue.type,
      })
    }
  },


  /**
   * 修改登录密码
   * @param e
   */
  onUpdateLoginPassword: function (e) {
    const formData = e.detail.value;
    const isValidateForm = function () {
      const {old_password, new_password, confirm_password} = formData;
      const requiredValidate = {
        old_password: '请输入旧密码',
        new_password: '请输入新密码',
        confirm_password: '请再次输入新密码',
      };
      if (new_password.length < 6 && new_password) {
        wx.showToast({title: '密码长度最低为6位', icon: 'none'});
        return false;
      }
      for (let key in formData) {
        if (formData[key] === '') {
          wx.showToast({title: requiredValidate[key], icon: 'none'});
          return false;
        }
      }
      if (new_password !== confirm_password) {
        wx.showToast({title: '两次密码输入不一致，请检查', icon: 'none'});
        return false;
      }
      return true
    };
    if (isValidateForm()) {
      wx.showLoading({title: '加载中', icon: 'none'});
      api_updateLoginPassword(formData).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        wx.showModal({
          showCancel: false,
          content: '修改成功，请重新登录',
          success: function (res) {
            if (res.confirm) {
              wx.removeStorageSync('token');
              wx.redirectTo({
                url: '/pages/account/login/index'
              })
            }
          }
        });
      })
    }
  },

  /**
   * 修改支付密码
   * @param e
   */
  onUpdatePayPassword: function (e) {
    const formData = e.detail.value;
    const isValidateForm = function () {
      const {old_pay_password, new_pay_pasword, confirm_password} = formData;
      const requiredValidate = {
        old_pay_password: '请输入旧支付密码',
        new_pay_pasword: '请输入新支付密码',
        confirm_password: '请再次输入新密码',
      };
      if (new_pay_pasword.length < 6 && new_pay_pasword) {
        wx.showToast({title: '密码长度最低为6位', icon: 'none'});
        return false;
      }
      for (let key in formData) {
        if (formData[key] === '') {
          wx.showToast({title: requiredValidate[key], icon: 'none'});
          return false;
        }
      }
      if (new_pay_pasword !== confirm_password) {
        wx.showToast({title: '两次密码输入不一致，请检查', icon: 'none'});
        return false;
      }
      return true
    };
    if (isValidateForm()) {
      wx.showLoading({title: '加载中', icon: 'none'});
      api_updatePayPassword(formData).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        wx.showModal({
          showCancel: false,
          content: '修改成功',
          success: function (res) {
            if (res.confirm) {

            }
          }
        });
      })
    }
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
   * 获取验证码
   */
  ...Utils.verificationCode.action
});