// pages/order/index.js

import Utils from '../../lib/utils'
import {
  api_selfOrder,
  api_orderOperationApplyComplete
} from "../../lib/api";

Page({

  ...Utils.page.action,
  ...Utils.modal.action,
  ...Utils.reachBottom.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.page.data,
    ...Utils.modal.data,
    ...Utils.reachBottom.data,

    selectedTradeNo: '',
    selectedTradeNoIndex: '',

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
   * 提交完成按钮
   * @param e
   */
  setSelectedTradeNo: function (e) {
    this.setSelectedInfo(e, this.modalOverlayToggle);
  },

  /**
   *
   */
  setSelectedInfo: function (e, callBack) {
    const {no, index} = e.currentTarget.dataset;
    this.setData({
      selectedTradeNo: no,
      selectedTradeNoIndex: index
    }, () => callBack && callBack());
  },

  /**
   * 更多操作
   */
  onMoreAction: function (e) {
    this.setSelectedInfo(e, () => {
      const trade_no = this.data.selectedTradeNo;
      wx.showActionSheet({
        itemList: ['查看/上传截图', '查看/发送留言'],
        success: function (res) {
          const urls = ['/pages/order/screenshot/index?trade_no=' + trade_no, '/pages/msg/leaveMessageList/details/index?trade_no=' + trade_no];
          wx.navigateTo({url: urls[res.tapIndex]})
        }
      })
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
      this.pageEnd();
        wx.hideLoading();
        this.setReachEndInfo();
        if (this.data.asyncData.total === 0) {
          wx.showToast({title: '暂无记录', icon: 'none'})
        }
      })
    });
  },

  /**
   * 提交完成
   * @param e
   */
  onSubmitComplete: function (e) {
    this.modalOverlayToggle();
    wx.showLoading({title: '加载中', icon: 'none'});
    const {selectedTradeNo, selectedTradeNoIndex} = this.data;
    api_orderOperationApplyComplete({
      trade_no: selectedTradeNo
    }).then(data => {
      wx.hideLoading();
      if (data.code) {
        return wx.showToast({title: data.message, icon: 'none'})
      }
      const selectData = this.data.asyncData.list[selectedTradeNoIndex];
      // this.data.asyncData.list[selectedTradeNoIndex].status = 3;
      const dataKey = 'asyncData.list[' + selectedTradeNoIndex + ']';
      this.setData({
        [dataKey]: {
          ...selectData,
          status: 3
        }
      })
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
})