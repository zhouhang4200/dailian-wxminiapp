// pages/search/index.js
import {
  api_orderWait
} from '../../lib/api'

import Utils from '../../lib/utils'

Page({

  /**
   * 页面的初始数据
   */

  ...Utils.reachBottom.action,

  data: {

    ...Utils.reachBottom.data,

    isCancelHidden: true,
    reachEndInfo: {
      isHidden: true,
      isMore: true,
      isFail: false,
      isLoading: false
    },
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
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      'searchForm.page': 1,
      'searchForm.keyword': e.detail.value,
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
      let {
        asyncData
      } = this.data;
      this.setData({
        asyncData: {
          total: data.total,
          list: asyncData.list.concat(data.list)
        },
        'searchForm.page': params.page,
        isCancelHidden: false
      }, () => {
        wx.hideLoading();
        this.setReachEndInfo();
        if (this.data.asyncData.total === 0) {
          wx.showToast({title: '暂无记录', icon: 'none'})
        }
      })
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