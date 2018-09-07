// pages/user/myOrder/Screenshot/index.js

import Utils from '../../../lib/utils'
import {
  api_operationApplyCompleteImage
} from '../../../lib/api'

Page({

  ...Utils.page.action,
  ...Utils.img.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,
    ...Utils.globalData(),

    selfId: '1',
    images: []
  },

  initFetch: function () {
    api_operationApplyCompleteImage({
      trade_no: this.options.trade_no
    }).then(data => {
      if (!data.code) {
        return this.setData({
          images: data
        }, () => this.pageEnd())
      }
      wx.showToast({title: data.message, icon: 'none'})
    })
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
    this.getCropperImg().then(path => {
      if (path) {
        this.data.images.push({path});
        this.setData({
          images: this.data.images
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

  },
  /**
   * 图片预览
   */
  onPreviewImage: function (e) {
    let url = e.currentTarget.dataset.url;
    let urls = [];
    const imgList = this.data.imgList
    for (let i = 0; i < imgList.length; i++) {
      urls.push(imgList[i].imgUrl);
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  }
})