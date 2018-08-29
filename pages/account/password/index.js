// pages/account/password/index.js
import Utils from '../../../lib/utils'
import {
  api_findLoginPassword,
  api_updateLoginPassword,
  api_findPayPassword,
  api_updatePayPassword,
  api_settingPayPassword,
  api_sendFindLoginPasswordPhoneCode,
  api_sendFindPayPasswordPhoneCode
} from '../../../lib/api'


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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.verificationCode.data,

    action: '',
    type: '',
    phone: ''
  },

  /**
   *找回登录密码
   */
  onFindLoginPassword: function (e) {
    const formData = e.detail.value;
    const {phone, new_password, confirm_password, verification_code} = formData;
    const isValidateForm = function () {
      const requiredValidate = {
        phone: '请输入手机号码',
        new_password: '请输入新登录密码',
        confirm_password: '请再次输入新密码',
      };
      if (!(Utils.Regrex.phone.test(phone)) && phone) {
        wx.showToast({title: '请输入正确的手机号码', icon: 'none'});
        return false;
      }
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
      api_findLoginPassword({
        phone,
        new_password,
        verification_code
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        wx.showModal({
          showCancel: false,
          content: '密码找回成功，请重新登录',
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
   * 修改登录密码
   * @param e
   */
  onUpdateLoginPassword: function (e) {
    const formData = e.detail.value;
    const {old_password, new_password, confirm_password} = formData;
    const isValidateForm = function () {
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
      api_updateLoginPassword({
        old_password,
        new_password
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        wx.showModal({
          showCancel: false,
          content: '密码修改成功，请重新登录',
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
   *找回支付密码
   */
  onFindPayPassword: function (e) {
    const formData = e.detail.value;
    const {phone, new_password, confirm_password, verification_code} = formData;
    const isValidateForm = function () {
      const requiredValidate = {
        phone: '请输入手机号码',
        new_password: '请输入新登录密码',
        confirm_password: '请再次输入新密码',
      };
      if (!(Utils.Regrex.phone.test(phone)) && phone) {
        wx.showToast({title: '请输入正确的手机号码', icon: 'none'});
        return false;
      }
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
      api_findPayPassword({
        phone,
        new_password,
        verification_code
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        wx.showModal({
          showCancel: false,
          content: '密码找回成功',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack();
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
    const {old_pay_password, new_pay_password, confirm_password} = formData;
    const isValidateForm = function () {
      const requiredValidate = {
        old_pay_password: '请输入旧支付密码',
        new_pay_password: '请输入新支付密码',
        confirm_password: '请再次输入新密码',
      };
      if (new_pay_password.length < 6 && new_pay_password) {
        wx.showToast({title: '密码长度最低为6位', icon: 'none'});
        return false;
      }
      for (let key in formData) {
        if (formData[key] === '') {
          wx.showToast({title: requiredValidate[key], icon: 'none'});
          return false;
        }
      }
      if (new_pay_password !== confirm_password) {
        wx.showToast({title: '两次密码输入不一致，请检查', icon: 'none'});
        return false;
      }
      return true
    };
    if (isValidateForm()) {
      wx.showLoading({title: '加载中', icon: 'none'});
      api_updatePayPassword({
        old_pay_password,
        new_pay_password
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        return wx.showToast({title: '修改成功', icon: 'none'})
      })
    }
  },

  /**
   *设置支付密码
   */
  onSettingPayPassword: function (e) {
    const formData = e.detail.value;
    const {pay_password, confirm_password} = formData;
    const isValidateForm = function () {
      const requiredValidate = {
        new_password: '请输入支付密码',
        confirm_password: '请再次输入新密码',
      };
      if (pay_password.length < 6 && pay_password) {
        wx.showToast({title: '密码长度最低为6位', icon: 'none'});
        return false;
      }
      for (let key in formData) {
        if (formData[key] === '') {
          wx.showToast({title: requiredValidate[key], icon: 'none'});
          return false;
        }
      }
      if (pay_password !== confirm_password) {
        wx.showToast({title: '两次密码输入不一致，请检查', icon: 'none'});
        return false;
      }
      return true
    };
    if (isValidateForm()) {
      wx.showLoading({title: '加载中', icon: 'none'});
      api_settingPayPassword({
        pay_password
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none'})
        }
        wx.showModal({
          showCancel: false,
          content: '支付密码设置成功',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack();
            }
          }
        });
      })
    }
  },

  onPhoneInput: function (e) {
    this.setData({phone: e.detail.value})
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
    wx.showLoading();
    let api = this.data.type === 'find_login' ? api_sendFindLoginPasswordPhoneCode : api_sendFindPayPasswordPhoneCode;
    api({phone}).then(data => {
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
    const action = options.action;
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