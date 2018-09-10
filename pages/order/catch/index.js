// pages/applyArbitration/index.js
import Utils from '../../../lib/utils'
import {
  api_orderOperationAnomaly
} from '../../../lib/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.globalData()
  },

  /**
   * 提交数据
   */
  onSubmit: function (e) {
    const formData = e.detail.value;
    const validate = this.isValidateForm(formData);
    if (validate) {
      wx.showLoading({title: '加载中', icon: 'none'});
      api_orderOperationAnomaly({
        trade_no: this.options.trade_no,
        reason: formData.reason,
      }).then(data => {
        wx.hideLoading();
        if (data.code) {
          return wx.showToast({title: data.message, icon: 'none', duration: 3000})
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

  /**
   * 表单验证
   * @param formData
   * @returns {boolean}
   */
  isValidateForm: function (formData) {
    if (!formData.reason.length) {
      wx.showToast({title: '请填写原因及要求', icon: 'none', duration: 3000});
      return false;
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