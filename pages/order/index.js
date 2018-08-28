// pages/order/index.js

import Utils from '../../lib/utils'
import {
  api_selfOrder,
  api_selfOrderDetail,
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
  onSubmitCheck: function (e) {
    this.setSelectedInfo(e, () => {
      wx.navigateTo({
        url: `/pages/order/submitCheck/index?trade_no=${this.data.selectedTradeNo}`
      })
    });
  },

  /**
   * 设置订单信息
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
    // 有可能一系列订单操作之后，订单如果改变状态就需要刷新当前订单数据
    let {selectedTradeNo, selectedTradeNoIndex} = this.data;
    let selectOrderData = this.data.asyncData.list[selectedTradeNoIndex];
    if (selectedTradeNo) {
      api_selfOrderDetail({trade_no: selectedTradeNo}).then(data => {
        if (!data.code) {
          const status = data.status;
          if (selectOrderData.status !== status) {
            this.data.asyncData.list.splice(selectedTradeNoIndex, 1, {
              ...selectOrderData,
              status
            })
          }
          this.setData({
            'asyncData.list': this.data.asyncData.list
          })
        }
      })
    }
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