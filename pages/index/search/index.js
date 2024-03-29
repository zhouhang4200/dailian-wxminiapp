// pages/search/index.js
import {
  api_orderWait
} from '../../../lib/api'

import Utils from '../../../lib/utils'

Page({

  /**
   * 页面的初始数据
   */

  ...Utils.reachBottom.action,
  ...Utils.page.action,
  ...Utils.reachBottomPullDownRefresh.action,

  data: {

    ...Utils.reachBottomPullDownRefresh.data,
    ...Utils.pageNoneResultData,
    ...Utils.page.data,

    isCancelHidden: true,

    asyncData: {
      list: [],
      total: 0
    },
    searchForm: {
      page: 1,
      page_size: 10,
      keyword: ''
    }
  },

  /**
   * 文本框搜索
   * @param
   */
  onInputSearch: function (e) {
    wx.showLoading({title: '搜索中', icon: 'none'});
    this.setData({
      'searchForm.page': 1,
      'searchForm.keyword': e.detail.value,
      'pageNoneResult.isHidden': true,
      asyncData: {
        list: [],
        totalRows: 0
      },
      isCancelHidden: true,
      'reachEndInfo.isHidden': true,
    }, this.initFetch);
  },

  /**
   *  搜索fetchFetch
   */
  initFetch: function (opts) {
    let params = {
      ...this.data.searchForm,
      ...opts
    };
    api_orderWait(params).then(data => {
      this.updateReachBottomPullDownRefreshPageData({params, data}, () => {
        wx.hideLoading();
        this.setData({isCancelHidden: false})
      })
      // let {
      //   asyncData
      // } = this.data;
      // this.setData({
      //   asyncData: {
      //     total: data.total,
      //     list: asyncData.list.concat(data.list)
      //   },
      //   'searchForm.page': params.page,
      //   isCancelHidden: false
      // }, () => {
      //   wx.hideLoading();
      //   this.setReachEndInfo();
      // })
    });
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

  }
})