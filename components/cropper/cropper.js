import WeCropper from '../../lib/cropper.min.js'


const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight // 示例为一个与屏幕等宽的正方形裁剪框

const app = getApp();
Page({
	data: {
		cropperOpt: {
			id: 'cropper',
			width: width, // 画布宽度
			height: width, // 画布高度
			scale: 2.5, // 最大缩放倍数
			zoom: 8, // 缩放系数
			cut: {
				x: 10, // 裁剪框x轴起点
				y: 10, // 裁剪框y轴期起点
				width: width - 20, // 裁剪框宽度
				height: width - 20 // 裁剪框高度
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
        wx.showToast({
          title: '获取图片地址失败，请稍后重试'
        })
			}
		})
	},
	uploadTap: function() {
		const that = this;
		const call = function(fileList) {
			setTimeout(function() {
				that.wecropper.pushOrign(fileList[0])
			}, 500)
		}
		Utils.chooseImage(1, call);
	},
	closeModel: function() {
		wx.removeStorageSync(this.data.name);
    wx.navigateBack();
	},
	initCropper: function() {
		const that = this;
		const { cropperOpt } = this.data;
		new WeCropper(cropperOpt)
			.on('ready', (ctx) => {
				console.log('wecropper is ready for work!');
				// that.uploadTap();
				console.log(that.data.url)
				setTimeout(function() {
					that.wecropper.pushOrign(that.data.url);
				}, 500);
			})
			.on('beforeImageLoad', (ctx) => {
				wx.showLoading({
				  title: '上传中'
				})
			})
			.on('imageLoad', (ctx) => {
				wx.hideLoading()
			})
	},
	onLoad: function(options) {
		const name = 'cropperImg' + (options.file || '');
		this.setData({
			name: name,
			url: options.url
		})
		if (options.w && options.h) {
			const cropperOpt = this.data.cropperOpt;
			const h = Math.round((width - 20) * options.h / options.w);
			cropperOpt.height = h + 20;
			cropperOpt.cut.height = h
			this.setData({
				cropperOpt: cropperOpt
			})
		}
		this.initCropper();
	}
})