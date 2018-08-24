// pages/search/index.js
import {
  api_orderWait
} from '../../lib/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    const {searchForm, reachEndInfo} = this.data;
    this.setData({
      searchForm: {
        ...searchForm,
        page: 1,
        keyword: e.detail.value,
      },
      asyncData: {
        list: [],
        totalRows: 0
      },
      isCancelHidden: true,
      reachEndInfo: {
        ...reachEndInfo,
        isHidden: true
      },
    }, this.fetchSearch);
  },

  /**
   *  搜索fetchFetch
   */
  fetchSearch: function (opts) {
    let params = {
      ...this.data.searchForm,
      ...opts
    };
    api_orderWait(params).then(data => {
      let {
        searchForm,
        asyncData
      } = this.data;
      this.setData({
        asyncData: {
          total: data.total,
          list: asyncData.list.concat(data.list)
        },
        searchForm: {
          ...searchForm,
          page: searchForm.page + 1,
        },
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
   * 设置更多加载信息
   */
  setReachEndInfo: function () {
    let {
      asyncData,
      reachEndInfo,
      searchForm
    } = this.data;
    let listTotal = asyncData.list.length;
    let total = asyncData.total;
    this.setData({
      reachEndInfo: {
        ...reachEndInfo,
        isHidden: total < searchForm.page,
        isMore: total > listTotal,
        isLoading: false
      }
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
    const {
      reachEndInfo,
      searchForm
    } = this.data;
    const {
      isHidden,
      isMore,
      isLoading
    } = reachEndInfo;
    if (!isHidden && isMore && !isLoading) {
      this.setData({
        reachEndInfo: {
          ...reachEndInfo,
          isLoading: true
        }
      });
      this.fetchSearch({
        page: searchForm.page + 1
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})