// pages/myComplaint/index.js
import Utils from '../../../lib/utils'
import {
  api_orderOperationComplainInfo,
  api_orderOperationSendComplainMessage
} from '../../../lib/api'


Page({

  ...Utils.page.action,
  ...Utils.img.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,
    ...Utils.img.data,
    ...Utils.globalData(),

    tabName: 'tab1',
    remark: '',
    status: '',
    images: [],
    content: '',
    isPageInfo: true
  },

  /**
   * 切换tab
   */
  onSwitchTab: function (e) {
    const tabName = e.currentTarget.dataset.tab;
    if (tabName !== this.data.tabName) {
      this.setData({
        tabName
      })
    }
  },

  initFetch: function () {
    api_orderOperationComplainInfo({
      trade_no: this.options.trade_no
    }).then(info => {
      if (info.code) {
        wx.showToast({title: info.message, icon: 'none', duration: 2000});
        return false;
      }
      this.setData({
        info,
        isPageInfo: !info.code
      }, () => this.pageEnd())
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageLoad();
    this.setData({
      status: options.status
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  chooseImageHandle: function () {
    this.chooseImage({}, url => {
      this.data.images.push(url);
      this.setData({
        images: this.data.images
      });
    })
  },

  /**
   * 提交补充留言数据
   */
  onSubmitComplain: function (e) {
    wx.showLoading({title: '加载中', icon: 'none',});
    const content = e.detail.value.content;
    if (!content.length) {
      wx.showToast({title: '请填写内容', icon: 'none', duration: 2000});
      return false;
    }
    api_orderOperationSendComplainMessage({
      image: this.data.images[0],
      content: e.detail.value.content,
      trade_no: this.options.trade_no
    }).then(data => {
      if (data.code) {
        wx.showToast({title: data.message, icon: 'none', duration: 2000});
        return false;
      }
      wx.showToast({title: '提交成功', icon: 'none', duration: 2000});
      this.setData({
        tabName: 'tab1',
        image: '',
        content: ''
      });
      this.initFetch();
    });
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
})