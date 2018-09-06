// pages/account/api_profile/page.js
import Utils from '../../../lib/utils'
import {
  api_profile,
  api_profileUpdate
} from '../../../lib/api'

Page({

  /**
   * 页面的初始数据
   */
  ...Utils.page.action,
  ...Utils.img.action,

  data: {
    ...Utils.page.data,
    ...Utils.globalData(),

    selectUploadIcon: '',
    uploadUrl: '',
    userInfo: {
      avatar: '',
      name: '',
      contact_phone: '',
      email: '',
      signature: ''
    }
  },

  initFetch() {
    api_profile().then(userInfo => {
      const {
        avatar = '',
        name = '',
        contact_phone = '',
        qq = '',
        email = '',
        signature = ''
      } = userInfo;
      this.setData({
        userInfo: {
          avatar,
          name,
          contact_phone,
          email,
          signature,
          qq
        }
      }, () => this.pageEnd());
    })
  },

  onSubmitForm: function (e) {
    const formData = e.detail.value;
    const validate = this.formValidate(formData);
    const {selectUploadIcon, uploadUrl, userInfo} = this.data;
    if (validate) {
      wx.showLoading({title: '加载中', icon: 'none'});
      let userIconUrl = () => selectUploadIcon ? Utils.files.uploadFile([selectUploadIcon]) : Promise.resolve(uploadUrl || userInfo.avatar);
      userIconUrl()
        .then(url => {
          this.setData({'selectUploadIcon': '', uploadUrl: url});
          return api_profileUpdate({...formData, avatar: url})
        })
        .then(data => {
          wx.hideLoading();
          wx.showToast({title: '修改成功', icon: 'none'})
        })
    }
  },

  /**
   *  表单验证
   * @param formData {object} 表单数据
   */
  formValidate: function (formData) {
    const {name, contact_phone, qq, email} = formData;
    const requiredValidate = {
      name: '昵称不能为空',
      contact_phone: '联系电话不能为空',
      qq: 'QQ不能为空',
      signature: '个人签名不能为空',
    };
    if (!(Utils.Regrex.phone.test(contact_phone)) && contact_phone) {
      wx.showToast({title: '请输入正确格式的手机号', icon: 'none'});
      return false;
    }
    if (!(Utils.Regrex.qq.test(qq)) && qq) {
      wx.showToast({title: '请输入正确格式的QQ号', icon: 'none'});
      return false;
    }
    if (!(Utils.Regrex.email.test(email)) && email) {
      wx.showToast({title: '请输入正确格式的邮箱', icon: 'none'});
      return false;
    }
    for (let key in {name, contact_phone, qq}) {
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
    this.pageLoad()
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
    this.getCropperImg().then(url => {
      if (url) {
        this.setData({
          selectUploadIcon: url,
          'userInfo.avatar': url
        })
      }
    });
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