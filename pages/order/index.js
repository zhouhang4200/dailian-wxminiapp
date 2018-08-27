// pages/order/index.js

import Utils from '../../lib/utils'
import {
  api_selfOrder
} from "../../lib/api";

Page({

  ...Utils.page.action,
  ...Utils.reachBottom.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.page.data,
    ...Utils.reachBottom.data,

    asyncData: {
      list: [],
      total: 0
    },
    searchForm: {
      page: 1,
      page_size: 10
    }
  },

  /**
   * 更多操作
   */
  onMoreAction: function () {
    wx.showActionSheet({
      itemList: ['查看/上传截图', '查看/发送留言'],
      success: function (res) {
        const urls = ['/pages/order/screenshot/index', '/pages/msg/leaveMessageList/details/index'];
        wx.navigateTo({url: urls[res.tapIndex]})
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 加载更多翻页数据
   */
  initFetch: function (opts) {
    let params = {
      ...this.data.searchForm,
      ...opts
    };
    api_selfOrder(params).then(data => {
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
        this.pageShow();
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
  onReachBottom: function () {
    this._onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 提交完成
   * @param e
   */
  onSubmitComplete: function (e) {
    wx.showModal({
      title: '提交完成',
      confirmColor: '#198cff',
      content: '确定提交完成，给对方验收吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})