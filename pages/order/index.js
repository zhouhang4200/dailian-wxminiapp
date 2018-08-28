// pages/order/index.js

import Utils from '../../lib/utils'
import {
  api_selfOrder,
  api_selfOrderDetail,
  api_orderOperationCancelConsult,
  api_orderOperationCancelComplain,
  api_orderOperationCancelAnomaly,
  api_orderOperationAgreeConsult,
  api_orderOperationRejectComplain
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

    selectedOrderAmount: '',
    selectedOrderSecurityDeposit: '',

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
   * 取消撤销     取消仲裁
   */
  onCancel: function (e) {
    const status = e.currentTarget.dataset.status;
    this.setSelectedInfo(e, () => {
      wx.showLoading({title: '加载中', icon: 'none'});
      // status === 4 打手取消自己发起的撤销订单
      // status === 5 打手取消自己发起的仲裁订单
      const api = status === 4 ? api_orderOperationCancelConsult : api_orderOperationCancelComplain;
      api({
        trade_no: this.data.selectedTradeNo
      }).then(data => {
        if (data.code) {
          wx.hideLoading();
          return wx.showToast({title: data.message, icon: 'none'})
        }
        this.updateOrderStatus(() => {
          wx.showToast({title: '操作成功', icon: 'none'})
        });
      })
    });
  },

  /**
   * 同意撤销 确认
   */
  onCancelConfirm: function (e) {
    this.setSelectedInfo(e, () => {
      wx.showLoading({title: '加载中', icon: 'none'});
      this.modalOverlayToggle();
    });
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
    const {no, index, status = ''} = e.currentTarget.dataset;
    this.setData({
      selectedTradeNo: no,
      selectedTradeNoIndex: index,
      status
    }, () => callBack && callBack());
  },

  /**
   * 同意协商确认弹窗 选择操作
   * @param e
   */
  onSelect: function (e) {
    this.modalOverlayToggle();
    const index = parseInt(e.currentTarget.dataset.index);
    // index === 0 同意
    // index === 1 不同意
    wx.showLoading({title: '加载中', icon: 'none'});
    const api = index === 0 ? api_orderOperationAgreeConsult : api_orderOperationRejectComplain;
    api({
      trade_no: this.data.selectedTradeNo
    }).then(data => {
      if (data.code) {
        wx.hideLoading();
        return wx.showToast({title: data.message, icon: 'none'})
      }
      this.updateOrderStatus(() => {
        wx.showToast({title: '操作成功', icon: 'none'})
      });
    })
  },

  /**
   * 更多操作
   */
  onMoreAction: function (e) {
    this.setSelectedInfo(e, () => {
      const {selectedTradeNo,status} = this.data;
      wx.showActionSheet({
        itemList: ['查看我的申诉', '查看/上传截图', '查看/发送留言'],
        success: function (res) {
          const params = `?trade_no=${selectedTradeNo}&status=${status}`;
          const urls = [
            '/pages/myComplaint/index',
            '/pages/order/screenshot/index',
            '/pages/msg/leaveMessageList/details/index'
          ];
          wx.navigateTo({url: urls[res.tapIndex] + params})
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 有可能一系列订单操作之后，订单如果改变状态就需要刷新当前订单数据
    this.updateOrderStatus();
  },

  /**
   * 取消异常
   */
  onCancelCatch: function (e) {
    this.setSelectedInfo(e, () => {
      api_orderOperationCancelAnomaly({
        trade_no: this.data.selectedTradeNo
      }).then(data => {
        if (data.code) {
          wx.hideLoading();
          return wx.showToast({title: data.message, icon: 'none'})
        }
        this.updateOrderStatus(() => {
          wx.showToast({title: '操作成功', icon: 'none'})
        });
      })
    });
  },

  /**
   * 更新订单状态
   */
  updateOrderStatus: function (callBack) {
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
          });
          wx.hideLoading();
          callBack && callBack();
        }
      })
    }
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