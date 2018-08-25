import WeCropper from '../../lib/cropper.min.js'
import Utils from '../../lib/cropper.min'

const device = wx.getSystemInfoSync(); // 获取设备信息
const windowWidth = device.windowWidth;
const windowHeight = device.windowHeight;

const app = getApp();
Page({
  data: {
    isCanvasLoad: false,
    cropperOpt: {
      id: 'cropper',
      width: windowWidth, // 画布宽度
      height: windowHeight, // 画布高度
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (windowWidth - 300) / 2,
        y: (windowHeight - 200) / 2,
        width: 300,
        height: 200
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    const that = this;
    this.wecropper.getCropperImage((src) => {
      if (src) {
        wx.setStorageSync(that.data.name, src);
        wx.navigateBack();
      } else {
        wx.showToast({title: '获取图片地址失败，请稍后重试', icon: 'none'});
      }
    })
  },
  uploadTap: function () {
    const that = this;
    const call = function (fileList) {
      setTimeout(function () {
        that.wecropper.pushOrign(fileList[0])
      }, 500)
    };
    Utils.chooseImage(null, call);
  },
  closeModel: function () {
    wx.removeStorageSync(this.data.name);
    wx.navigateBack();
  },
  initCropper: function () {
    const that = this;
    const {cropperOpt} = this.data;
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        setTimeout(function () {
          that.wecropper.pushOrign(that.data.url);
        }, 500);
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showLoading({
          title: '上传中'
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideLoading();
        this.setData({
          isCanvasLoad: true
        })
      })
  },

  /**
   * 返回身份证裁剪照片的参数
   */
  personalCardType: function () {
    const card_width = 240;
    const card_height = 151;
    const ratio = (card_height / card_width).toFixed(2);
    const cut_width = Math.floor(windowWidth * 0.9);
    const cut_height = Math.floor(cut_width * ratio);
    return {
      cut: {
        x: (windowWidth - cut_width) / 2, // 裁剪框x轴起点
        y: (windowHeight - cut_height) / 2, // 裁剪框y轴期起点
        width: cut_width, // 裁剪框宽度
        height: cut_height // 裁剪框高度
      }
    }
  },

  /**
   * 根据比例计算裁剪图片
   * @param ratio
   * @returns {{cut: {x: number, y: number, width: number, height: number}}}
   */
  ratioCropper: function (ratio) {
    const cut_width = Math.floor(windowWidth * 0.9);
    const cut_height = Math.floor(cut_width * ratio);
    return {
      cut: {
        x: (windowWidth - cut_width) / 2, // 裁剪框x轴起点
        y: (windowHeight - cut_height) / 2, // 裁剪框y轴期起点
        width: cut_width, // 裁剪框宽度
        height: cut_height // 裁剪框高度
      }
    }
  },

  cropperSize: function (cropperSize) {
    const [cropperWidth, cropperHeight] = JSON.parse(cropperSize);
    return {
      cut: {
        x: (windowWidth - cropperWidth) / 2,
        y: (windowHeight - cropperHeight) / 2,
        width: cropperWidth,
        height: cropperHeight
      }
    }
  },

  onLoad: function (options) {
    const {cropperSize, ratio, cropperType, url} = options;
    let setData = {
      name: 'cropperImg',
      url,
      cropperOpt: {
        ...this.data.cropperOpt,
        ...(cropperSize ? this.cropperSize(cropperSize) : {}),
        ...(ratio ? this.ratioCropper(ratio) : {}),
        ...(cropperType ? this[cropperType]() : {})
      },
    };
    this.setData(setData, () => this.initCropper());
  }
});