// pages/account/capital/details/index.js
import Utils from '../../../../lib/utils'
import {
  api_financeFlows
} from '../../../../lib/api'

Page({

  ...Utils.page.action,
  ...Utils.reachBottom.action,

  /**
   * 页面的初始数据
   */
  data: {

    ...Utils.page.data,
    ...Utils.globalData(),
    // ...Utils.reachBottom.data,
    ...Utils.reachBottomPullDownRefresh.data,

    asyncData: {
      list: [],
      total: 0
    },
    searchForm: {
      page: 1,
      page_size: 10
    }
  },

  initFetch: function (opts) {
    let params = {
      ...this.data.searchForm,
      ...opts
    };
    api_financeFlows(params).then(data => {
      let {
        asyncData
      } = this.data;
      this.setData({
        asyncData: {
          total: data.total,
          list: asyncData.list.concat(data.list)
        },
        'searchForm.page': params.page
      }, () => {
        this.pageEnd();
        this.setReachEndInfo();
        if (this.data.asyncData.total === 0) {
          wx.showToast({ title: '暂无记录', icon: 'none' })
        }
      })
    });
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
  onReachBottom: function (e) {
    this._onReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})