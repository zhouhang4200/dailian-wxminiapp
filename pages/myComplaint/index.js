// pages/myComplaint/index.js
import Utils from '../../lib/utils'
import {
  api_orderOperationComplainInfo,
  api_orderOperationSendComplainMessage
} from '../../lib/api'


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
    image: '',
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
      debugger;
      if (info.code) {
        wx.showToast({title: info.messahe, icon: 'none'});
        return this.pageEnd()
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCropperImg().then(image => {
      if (image) {
        this.setData({image})
      }
    })
  },

  /**
   * 提交补充留言数据
   */
  onSubmitComplain: function (e) {
    wx.showLoading({title: '加载中', icon: 'none'});
    const content = e.detail.value.content;
    if (!content.length) {
      wx.showToast({title: '请填写内容', icon: 'none'});
      return false;
    }
    api_orderOperationSendComplainMessage({
      image: this.data.image,
      content: e.detail.value.content,
      trade_no: this.options.trade_no
    }).then(data => {
      if (data.code) {
        wx.showToast({title: data.message, icon: 'none'});
        return false;
      }
      wx.showToast({title: '提交成功', icon: 'none'});
      this.setData({
        tabName: 'tab1',
        image: '',
        content: ''
      });
      this.initFetch();
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
})