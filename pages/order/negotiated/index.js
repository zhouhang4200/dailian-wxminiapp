// pages/order/negotiated/index.js
import Utils from "../../../lib/utils";
import {
  api_orderOperationApplyConsult
} from "../../../lib/api";

Page({

  ...Utils.modal.action,
  ...Utils.page.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.modal.data,
    ...Utils.page.data,
    ...Utils.globalData()
  },

  onSubmitForm: function (e) {
    const formData = e.detail.value;
    const isValidate = this.isValidateForm(formData);
    if (isValidate) {
      this.modalOverlayToggle();
      wx.showLoading({title: '提交中', icon: 'none'});
      api_orderOperationApplyConsult({
        ...formData,
        trade_no: this.options.trade_no
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none', duration: 2000})
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
    }
  },

  isValidateForm: function (formData) {
    const {amount, deposit, reason} = formData;
    const {orderPrice, efficiency_deposit, security_deposit} = this.data;
    const totalDeposit = (efficiency_deposit * 100 + security_deposit * 100) / 100;
    const requiredValidate = {
      amount: '请输入代练费',
      deposit: '请输入赔偿保证金',
      reason: '请输入协商原因'
    };
    if (amount * 100 > orderPrice * 100 && amount * 100) {
      wx.showToast({title: '代练费用不能大于订单金额', icon: 'none', duration: 2000});
      return false;
    }
    for (let key in formData) {
      if (formData[key] === '') {
        wx.showToast({title: requiredValidate[key], icon: 'none', duration: 2000});
        return false;
      }
    }
    if (deposit * 100 > totalDeposit * 100) {
      wx.showToast({title: '赔偿保证金不能大于总保证金', icon: 'none', duration: 2000});
      return false;
    }
    return true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageLoad();
    this.setData(options, () => this.pageEnd())
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