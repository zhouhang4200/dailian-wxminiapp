// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 更多操作
   */
  onMoreAction: function () {
    wx.showActionSheet({
      itemList: ['查看/上传截图', '查看/发送留言'],
      success: function (res) {
        const urls = ['/pages/screenshot/index', '/pages/msg/leaveMessageList/details/index'];
        wx.navigateTo({url: urls[res.tapIndex]})
      },
      fail: function (res) {
        console.log(res.errMsg)
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
  onReachBottom: function () {

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