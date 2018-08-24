// pages/user/myOrder/Screenshot/index.js

import Utils from '../../../lib/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selfId: '1',
    imgList: [
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        imgUrl: "http://thyrsi.com/t6/359/1534659629x-1404817850.png",
        user: "1"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        imgUrl: "http://thyrsi.com/t6/359/1534659629x-1404817850.png",
        user: "1"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        imgUrl: "http://thyrsi.com/t6/359/1534659629x-1404817850.png",
        user: "2"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        imgUrl: "http://thyrsi.com/t6/359/1534659629x-1404817850.png",
        user: "1"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        imgUrl: "http://thyrsi.com/t6/359/1534659629x-1404817850.png",
        user: "2"
      },
      {
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        imgUrl: "http://thyrsi.com/t6/359/1534659629x-1404817850.png",
        user: "2"
      },
    ]
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
      imgList.push({
        userIcon: "http://thyrsi.com/t6/359/1534638966x-1404817491.png",
        time: '2018-08-19 20:20:23',
        imgUrl,
        user: "1"
      },)
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
  onUploadImg:function(){
    Utils.chooseImage()
  }
})