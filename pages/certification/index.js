// pages/certification/index.js
import Utils from '../../lib/utils'
import BankCardInfo from '../../lib/bank.card.info'
import {
  api_certificationProfile
} from '../../lib/api'

Page({

  ...Utils.img.action,

  /**
   * 页面的初始数据
   */
  data: {

    chooseImgKey: '',
    identity_card_back: '',
    identity_card_front: '',
    identity_card_hand: '',
    info: {
      real_name: '',
      bank_card: '',
      bank_name: '',
      identity_card: '',
    }
  },

  /**
   * 格式化银行卡号
   * @param e
   */
  onCardInput: function (e) {
    const bank_card = e.detail.value;
    this.setData({
      'info.bank_card': Utils.format.bank_card(e.detail.value)
    });
    BankCardInfo.getBankBin(bank_card.replace(/ /g, '')).then(data => {
      this.setData({
        'info.bank_name': data.bankName
      })
    }, err => {

    })
  },

  /**
   * 提交验证
   * @param e
   */
  onSubmit: function (e) {
    const formData = e.detail.value;
    const validate = this.formValidate(formData);
    const {identity_card_back, identity_card_front, identity_card_hand} = this.data;
    if (validate) {
      wx.showLoading();
      Promise.all([
        Utils.files.uploadFile(identity_card_back),
        Utils.files.uploadFile(identity_card_front),
        Utils.files.uploadFile(identity_card_hand),
      ]).then(result => {
        const [identity_card_back, identity_card_front, identity_card_hand] = result;
        api_certificationProfile({
          ...this.data.info,
          identity_card_back,
          identity_card_front,
          identity_card_hand
        }).then(data => {
          wx.hideLoading();
          wx.showToast({title: '实名认证提交成功', icon: 'none'})
        })
      })
    }
  },

  /**
   *  表单验证
   * @param formData {object} 表单数据
   */
  formValidate: function (formData) {
    const requiredValidate = {
      real_name: '请输入你的真实姓名',
      bank_card: '请输入您的银行卡号',
      bank_name: '请输入您的银行名称',
      identity_card: '请输入18位居民身份号',
      identity_card_back: '请上传身份照背面照',
      identity_card_front: '请上传身份证正面照',
      identity_card_hand: '请上传手持身份证照',
    };
    let {
      real_name,
      bank_card,
      bank_name,
      identity_card,
    } = formData;
    bank_card = bank_card.replace(/ /g, '');
    for (let key in formData) {
      if (formData[key] === '') {
        wx.showToast({title: requiredValidate[key], icon: 'none'});
        return false;
      }
    }
    const regRexKey = [
      {
        value: bank_card,
        msg: '请输入正确银行卡号',
        reg: 'bank_card'
      },
      {
        value: identity_card,
        msg: '请输入正确的身份证号',
        reg: 'identity_card'
      }
    ];
    for (let i = 0; i < regRexKey.length; i++) {
      const validate = regRexKey[i];
      const value = validate.value;
      if (!(Utils.Regrex[validate.reg].test(value)) && value) {
        wx.showToast({title: validate.msg, icon: 'none'});
        return false;
      }
    }
    let {
      identity_card_back,
      identity_card_front,
      identity_card_hand,
    } = this.data;
    let imgUploadFiles = {identity_card_back, identity_card_front, identity_card_hand};
    for (let key in imgUploadFiles) {
      if (imgUploadFiles[key] === '') {
        wx.showToast({title: requiredValidate[key], icon: 'none'});
        return false;
      }
    }
    return true
  },

  chooseImageCard: function (e) {
    console.log(typeof e)
    const chooseImgKey = e.currentTarget.dataset.key;
    this.setData({
      chooseImgKey
    });
    this.chooseImage({cropperType: 'personalCardType'})
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
    this.getCropperImg().then(url => {
      if (url) {
        this.setData({
          [this.data.chooseImgKey]: url
        })
      }
    })
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
});