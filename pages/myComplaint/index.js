// pages/myComplaint/index.js
import Utils from '../../lib/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabName: 'tab1',
    remark: '',
    imgList: ['']
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
    const imgUrl = wx.getStorageSync('cropperImg');
    if (imgUrl) {
      let imgList = this.data.imgList;
      imgList[0] = imgUrl;
      wx.removeStorageSync('cropperImg');
      this.setData({
        imgList
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 提交数据
   */
  onSubmit: function (e) {
    wx.getUserInfo({
      success: function () {

      },
      fail: function () {

      }
    });
    let isValidate = () => {
      let {remark} = e.detail.value;
      let validate = true;
      if (remark == '') {
        validate = false;
        wx.showToast({
          title: '原因不能为空',
          icon: 'none'
        });
      }
      return validate
    }
    if (isValidate()) {
      wx.showLoading();
      setTimeout(() => {
        // 异步api请求
        wx.hideLoading();
        wx.showToast({
          title: '提交成功'
        });
      }, 2000)

    }
  },
  /**
   * 图片预览
   */
  onPreviewImage: function (e) {
    let url = e.currentTarget.dataset.url;
    let urls = [];
    const imgList = this.data.imgList
    for (let i = 0; i < imgList.length; i++) {
      urls.push(imgList[i].imgUrl);
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },

  /**
   * 上传截图
   */
  onUploadImg: function () {
    Utils.chooseImage()
  }
})