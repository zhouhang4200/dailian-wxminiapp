// pages/applyArbitration/index.js
import Utils from '../../lib/utils'
import {
  api_orderOperationApplyComplain
} from '../../lib/api'

Page({

  ...Utils.img.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.img.data,

    trade_no: '',
    remark: '',
    images: []
  },
  /**
   * 提交数据
   */
  onSubmit: function (e) {
    const formData = e.detail.value;
    const validate = this.isValidateForm(formData);
    if (validate) {
      Utils.files.arrayFiles(this.data.images).then(images => {
        api_orderOperationApplyComplain({
          trade_no: this.options.trade_no,
          images
        }).then(data => {
          if (data.code) {
            return wx.showToast({title: data.message, icon: 'none'})
          }
          wx.showToast({title: '申请仲裁成功', icon: 'none'});
          wx.navigateBack();
        })
      })
    }
  },


  /**
   * 表单验证
   * @param formData
   * @returns {boolean}
   */
  isValidateForm: function (formData) {
    const {remark} = formData;
    if (!remark.length) {
      wx.showToast({title: '请输入原因及要求', icon: 'none'});
      return false;
    }
    if (!this.data.images.length) {
      wx.showToast({title: '请上传截图', icon: 'none'});
      return false;
    }
    return true
  },

  /**
   * 删除图片
   * @param e
   */
  delImages: function (e) {
    const index = e.currentTarget.dataset;
    this.data.images.splice(index, 1);
    this.setData({
      images: this.data.images
    })
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
        this.data.images.push(url);
        this.setData({
          images: this.data.images
        });
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