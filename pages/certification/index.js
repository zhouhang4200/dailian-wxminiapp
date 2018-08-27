// pages/certification/index.js
import Utils from '../../lib/utils'
import BankCardInfo from '../../lib/bank.card.info'
import {
  api_certificationProfile,
  api_certificationDetail
} from '../../lib/api'

Page({

  ...Utils.img.action,
  ...Utils.page.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,

    chooseImgKey: '',

    checkInfo: {
      title: '',
      class: '',
      icon: ''
    },

    status: 4,
    real_name: '',
    bank_card: '',
    bank_name: '',
    identity_card: '',
    identity_card_back: '',
    identity_card_front: '',
    identity_card_hand: '',
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
        identity_card_back.indexOf('.38sd.') !== -1 ? Promise.resolve(identity_card_back) : Utils.files.uploadFile(identity_card_back),
        identity_card_front.indexOf('.38sd.') !== -1 ? Promise.resolve(identity_card_front) : Utils.files.uploadFile(identity_card_front),
        identity_card_hand.indexOf('.38sd.') !== -1 ? Promise.resolve(identity_card_hand) : Utils.files.uploadFile(identity_card_hand),
      ]).then(result => {
        const [identity_card_back, identity_card_front, identity_card_hand] = result;
        const submitData = {
          real_name: formData.real_name,
          bank_card: formData.bank_card.replace(/ /g, ''),
          bank_name: formData.bank_name,
          identity_card: formData.identity_card,
          identity_card_back,
          identity_card_front,
          identity_card_hand,
        };
        api_certificationProfile(submitData).then(data => {
          wx.hideLoading();
          this.setData({
            status: 1,
            checkInfo: this.getCheckInfo(1),
            submitData,

          });
          wx.showToast({title: '实名认证提交成功,请等待审核', icon: 'none'})
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
    const chooseImgKey = e.currentTarget.dataset.key;
    this.setData({
      chooseImgKey
    });
    this.chooseImage({cropperType: 'personalCardType'})
  },

  initFetch: function () {
    api_certificationDetail().then(data => {
      this.setData({
        ...this.data,
        ...data,
        checkInfo: this.getCheckInfo(data.status)
      }, () => this.pageEnd())
    })
  },

  getCheckInfo: function (status) {
    const dataCheckInfo = this.data.status;
    const checkInfo = {
      1: {
        class: 'waiting-status',
        title: '已提交实名认证，工作人员会在3个工作日内审核',
        icon: 'waiting'
      },
      2: {
        class: 'success-status',
        title: '实名认证已通过',
        icon: 'right'
      },
      3: {
        class: 'fail-status',
        title: '认证审核不通过，请重新提交',
        icon: 'err'
      }
    };
    return status ? checkInfo[status] : dataCheckInfo
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