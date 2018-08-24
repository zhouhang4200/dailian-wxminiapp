import Http from './http/index'
import {BASE_URL} from './config'


let Utils = {};

/**
 * http 请求头header设置
 * @returns {{Authorization: string}}
 */
Utils.httpHeader = function () {
  const token = wx.getStorageSync('token');
  return {
    Authorization: `Bearer ${token}`
  }
};

/**
 * 选择图片
 * @param  {object} opts 文件大小限制，默认5MB
 * =>{
 *   maxSize:5,
 *   params: object  // 自定义参数
 * }
 */
Utils.chooseImage = opts => {
  const mb = 1024 * 1024;
  const set = {maxSize: 5, params: '', ...opts};
  let size = set.maxSize;
  wx.chooseImage({
    count: 1,
    sizeType: ['original'],
    success: function (res) {
      const fileSize = res.tempFiles[0].size;
      const fileSize2 = (fileSize / mb).toFixed(2);
      console.log('文件大小:' + fileSize2 + 'MB');
      if (fileSize > size * mb) {
        wx.showModal({
          title: '警告',
          content: '图片大小不能超过' + size + 'MB\r\n当前图片大小' + fileSize2 + 'MB',
          confirmText: '重新选择',
          success: function (res) {
            if (res.confirm) {
              Utils.chooseImage(set);
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '/components/cropper/cropper?url=' + res.tempFilePaths[0] + set.params
        })
      }
    }
  })
};

/**
 * 图片相关操作
 * @type {{action: {chooseImage: (Utils.chooseImage|*), getCropperImg: Utils.img.action.getCropperImg}}}
 */
Utils.img = {
  action: {
    // 选择图片
    chooseImage: Utils.chooseImage,
    // 获取裁剪的图片
    getCropperImg: function () {
      return new Promise(resolve => {
        const imgUrl = wx.getStorageSync('cropperImg');
        if (imgUrl) {
          wx.removeStorageSync('cropperImg');
          resolve(imgUrl)
        }
        resolve('')
      })
    }
  },
};

/**
 * 文件接口
 */
Utils.files = {
  // 上传
  uploadFile: function (tempFilePaths) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${BASE_URL}/v1/upload/image`, //仅为示例，非真实的接口地址
        header: {
          ...Utils.httpHeader()
        },
        filePath: typeof tempFilePaths === 'string' ? tempFilePaths : tempFilePaths[0],
        name: 'image',
        success: function (res) {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data.data)
          }
          reject(data);
        },
        fail: function (res) {
          reject(reject)
          wx.hideLoading();
          wx.showToast({title: '图片上传失败'});
          reject(res)
        }
      })
    })
  }
};

/**
 * 获取验证码
 * @example =>
 * import Utils from '/lib/utils'
 * 页面的 js
 *     1. 绑定data元素  ...Utils.verificationCode.data
 *     2. 绑定方法  ...Utils.verificationCode.action
 * 页面的 wxml
 *  1.元素的文本形式绑定 {{verificationCode.text}}
 */
Utils.verificationCode = {
  data: {
    verificationCode: {
      disabled: false, // 是否可用
      time: 60, // 倒计时时间 60s
      text: '获取验证码',  // 默认文本
      timeSetInterval: null, // 倒计时 setInterval
    }
  },
  action: {
    /**
     * 恢复验证码初始状态
     */
    verificationCodeReset: function () {
      clearInterval(this.data.verificationCode.timeSetInterval);
      this.setData({
        verificationCode: {
          ...this.data.verificationCode,
          disabled: false,
          timeSetInterval: null,
          text: '获取验证码',
        }
      });
    },
    /**
     * 发送成功
     */
    verificationCodeSuccess: function () {
      let time = this.data.verificationCode.time;
      let timeSetInterval = setInterval(() => {
        time--;
        this.setData({
          verificationCode: {
            ...this.data.verificationCode,
            disabled: true,
            text: `${time}s`
          }
        }, () => {
          if (time === 0) {
            this.verificationCodeReset();
          }
        });
      }, 1000);
      this.setData({
        verificationCode: {
          ...this.data.verificationCode,
          timeSetInterval
        }
      })
    },
    /**
     * 开始发送验证码
     */
    verificationCodeSend: function () {
      const disabled = this.data.verificationCode.disabled;
      if (disabled) return;
      this.setData({
        verificationCode: {
          ...this.data.verificationCode,
          disabled: true,
          text: '获取中',
        }
      });
    },
    /**
     * 发送失败
     */
    verificationCodeFail: function (msg) {
      wx.showToast({
        icon: 'none',
        title: msg || '验证发送失败，请重试'
      });
      this.verificationCodeSuccess();
    }
  }
};

/**
 * 用户数据存储
 * @params data {object}
 * @type {{storageToken: (function(*=): Promise<any>)}}
 */
Utils.user = {
  storageToken: function (data) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: 'token',
        data: data.token,
        success: function () {
          resolve(data)
        },
        fail: function () {
          wx.showToast({title: '存储token信息失败!'.message, icon: 'none'})
          reject();
        }
      });
    })
  }
}

/**
 * http请求
 * @param url {string}
 * @param params {object}
 */
Utils.http = function (url, params) {
  return Http(url, params);
};

/**
 * 页面loading
 * @type {{data: {isPageHidden: boolean}, action: {pageLoad: Utils.page.action.pageLoad, pageShow: Utils.page.action.pageShow, pageHidden: Utils.page.action.pageHidden}}}
 */
Utils.page = {
  data: {
    isPageHidden: true
  },
  action: {
    pageLoad: function () {
      wx.showLoading({
        title: '加载中',
      });
      let {
        isPageHidden
      } = this.data;
      if (!isPageHidden) {
        this.setData({isPageHidden: true}, () => this.initFetch())
      }
      else {
        this.initFetch()
      }
    },
    pageEnd: function () {
      this.pageHidden();
    },
    pageShow: function () {
      wx.hideLoading();
      let {
        isPageHidden
      } = this.data;
      if (isPageHidden) {
        this.setData({isPageHidden: !isPageHidden})
      }
    },
    pageHidden: function () {
      wx.hideLoading();
      let {
        isPageHidden
      } = this.data;
      if (isPageHidden) {
        this.setData({isPageHidden: !isPageHidden})
      }
    }
  }
};

/**
 * modal 数据
 * @type {{data: {isModalOverlayHidden: boolean, isModalContentHidden: boolean, animationModalOverlay: {}, animationModalOverlayContent: {}}, action: {modalOverlayToggle: Utils.modal.action.modalOverlayToggle, onModalOverlayToggleEnd: Utils.modal.action.onModalOverlayToggleEnd}}}
 */
Utils.modal = {
  data: {
    isModalOverlayHidden: true,
    isModalContentHidden: true,
    animationModalOverlay: {},
    animationModalOverlayContent: {},
  },
  action: {
    /**
     * 弹窗遮罩动画 toggle
     */
    modalOverlayToggle: function () {
      const {isModalOverlayHidden} = this.data;
      let animation = wx.createAnimation({
        duration: 80,
        timingFunction: 'linear',
      });
      this.setData({
        isModalOverlayHidden: false // 先显示元素,但是透明度为0，之后执行动画
      }, () => {
        this.setData({
          animationModalOverlay: animation.opacity(isModalOverlayHidden ? 0.5 : 0).step().export(),
          animationModalOverlayContent: animation.opacity(isModalOverlayHidden ? 1 : 0).step({
            delay: isModalOverlayHidden ? 20 : 0
          }).export(),
        })
      })
    },

    /**
     * 弹窗遮罩动画结束
     */
    onModalOverlayToggleEnd: function () {
      const {animationModalOverlay} = this.data;
      const opacity = animationModalOverlay.actions[0].animates[0].args[1];
      // 遮罩完毕之后需要隐藏元素
      if (!opacity) {
        this.setData({
          isModalOverlayHidden: true,
        }, () => {
          this.modalOverlayCloseHandle && this.modalOverlayCloseHandle()
        })
      }
      else {
        this.modalOverlayShowHandle && this.modalOverlayShowHandle()
      }
    },
  }
};

/**
 * 正则表达式
 * @type {{phone: RegExp}}
 */
Utils.Regrex = {
  //  手机
  phone: /^[1][3,4,5,7,8][0-9]{9}$/,
  //  qq
  qq: /^[1-9]\d{4,13}$/,
  // 邮箱
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  // 身份证
  cardNo: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  // 银行卡号
  bankCardNo: /^([1-9]{1})(\d{15}|\d{18}|\d{19})$/
};

/**
 * 上拉加载更多
 */
Utils.pullUpLoadMore = {
  data: {
    asyncData: {
      list: [],
      total: 0
    },
    searchForm: {
      page: 1,
      page_size: 10
    },
  },
  action: {
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
        this.initFetch({
          page: searchForm.page + 1
        })
      }
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
  }
};

export default Utils;