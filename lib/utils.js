import Http from './http/index'
import {BASE_URL, ENVIROMENT} from './config'
import {api_getOpenId, api_profile, api_recharge, api_totalMsg} from './api'
import DayJs from './dayjs.min'

let Utils = {};

let {platform} = getApp().globalData

/**
 * 全局自定义值
 * @type {any}
 */
Utils.globalData = function () {
  let app = getApp();
  return app.globalData
};

/**
 * 页面被中断执行时候，返回页面显示的时候继续执行
 * @type {{data: {pageShowInterruptAction: string}, action: {setPageShowInterruptAction: Utils.pageShowInterruptAction.action.setPageShowInterruptAction, evalPageShowInterruptAction: Utils.pageShowInterruptAction.action.evalPageShowInterruptAction}}}
 */
Utils.pageShowInterruptAction = {
  data: {
    pageShowInterruptAction: ''
  },
  action: {
    /**
     * 设置中断执行的action
     * @param actionStr
     */
    setPageShowInterruptAction: function (actionStr) {
      this.setData({
        pageShowInterruptAction: actionStr
      });
    },
    /**
     * 页面显示时执行 设置中断执行的action
     * @param isLogin  是否需要限制登录才能执行,默认是
     */
    evalPageShowInterruptAction: function (isLogin = true) {
      const pageShowInterruptAction = this.data.pageShowInterruptAction;
      if (pageShowInterruptAction) {
        if (isLogin) {
          if (Utils.getUserToken()) {
            this[pageShowInterruptAction]();
            this.setPageShowInterruptAction('');
          }
        }
      }
    },
  }
};

/**
 * 微信登录
 * @param isRefresh {boolean} 如果是刷新提交就要重新获取一下
 * @returns {Promise<any>}
 */
Utils.wxLogin = function (isRefresh) {
  /**
   * 保存code和微信openid .有效期为5天
   * @param params
   * @returns {*}
   */
  const setStorageCodeOpenId = function (params) {
    try {
      const {code, openid} = params;
      wx.setStorageSync('code', code);
      wx.setStorageSync('openid', openid);
      wx.setStorageSync('code_openid_expired_date', DayJs().add(5, 'day').toString());  // 存储微信code 和 openid有效期
      return Promise.resolve(true)
    } catch (e) {
      return Promise.resolve()
    }
  };

  return new Promise((resolve, reject) => {
    try {
      let code = wx.getStorageSync('key');
      let openid = wx.getStorageSync('openid');
      let code_openid_expired_date = wx.getStorageSync('code_openid_expired_date');
      // 微信code和openid未过期并且不刷新的情况下，不再重新获取
      if (code && openid && DayJs(code_openid_expired_date).diff(DayJs(), 'days') < 5 && isRefresh) resolve();
      wx.login({
        success: function (res) {
          if (res.code) {
            const code = res.code;
            // 登录成功 拿到了 code
            // 1. 存储openid  存储 openid的有效时间 同微信code有效期一样(5分钟)
            // 2  存储code    存储  code 的有效时间 同微信code有效期一样(5分钟)
            api_getOpenId({code}).then(data => {
              let openid = data.openid;
              if (!openid) {
                openid = '';
                if (ENVIROMENT === 'developer') {
                  console.log("%c 获取openid失败,错误信息为：%c " + JSON.stringify(data), "background-color:#F56C6C;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#F56C6C;font-size:12px;font-weight:bold");
                  console.log("%c 获取openid失败,微信code获取成功：%c " + code, "background-color:#F56C6C;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#F56C6C;font-size:12px;font-weight:bold");
                }
              }
              setStorageCodeOpenId({openid, code}).then(status => {
                if (ENVIROMENT === 'developer') {
                  console.log("%c 微信code 和 open 存储值为：%c " + ('code::' + code + ':::openid:::' + (openid ? openid : '空')), "background-color:#67C23A;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#000;font-weight:bold;font-size:12px");
                }
                status ? resolve() : reject();
              })
            })
          } else {
            console.log("%c 获取微信code失败,错误信息为：%c " + JSON.stringify(res.errMsg), "background-color:#fff;color:#F56C6C;padding:2px 4px;font-weight:bold;font-size:12px", "color:#F56C6C;font-size:12px;font-weight:bold;");
          }
        }
      });
    } catch (e) {
      reject()
    }
  }).catch()
};

/**
 * 将JSON对象拼接成 & 形式的 l参数
 * @param params {object}
 * @returns {string}
 */
Utils.getStitchingUrlParams = params => {
  let strParams = '';
  for (let keyItem in params) {
    strParams += keyItem + '=' + params[keyItem] + '&';
  }
  return strParams.substr(0, strParams.length - 1)
};

/**
 * 获取用户个人资料信息
 * @returns {Promise<any | never>}
 */
Utils.getUserProfile = function () {
  return new Promise(resolve => {
    // 未登录情况下，直接空
    if (!Utils.getUserToken()) {
      resolve(null)
    }
    api_profile().then(data => {
      resolve(data)
    })
  }).catch()
}

/**
 * 通过token判断是否登录
 */
Utils.isLogin = () => Utils.getUserToken() !== '';

/**
 * 设置msg tabr的红点
 */
Utils.tabBarBadgeMsg = function () {
  return new Promise(resolve => {
    if (!Utils.isLogin()) {
      resolve({code: 500})
    }
    else {
      api_totalMsg().then(data => {
        !data.code && data.count ? wx.showTabBarRedDot({index: 1}) : wx.hideTabBarRedDot({index: 1})
        resolve(data)
      })
    }
  }).catch()
};

/**
 * 微信支付
 * @param params {object} =>{amount:'充值金额'}
 */
Utils.wxPay = function (params) {
  const {amount} = params;
  return new Promise((resolve, reject) => {
    api_recharge({amount}).then(payParams => {
      wx.hideLoading();
      wx.requestPayment({
        ...payParams,
        // bug: 6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调，回调 errMsg 为 'requestPayment:cancel'
        complete: function (res) {
          const errMsg = res.errMsg;
          const isCancel = ['requestPayment:fail cancel', 'requestPayment:cancel'].indexOf(errMsg) !== -1;
          const isSuccess = errMsg === 'requestPayment:ok';
          // 支付取消
          if (isCancel) {
            if (ENVIROMENT === 'developer') {
              console.log("%c 未支付，原因：%c " + errMsg, "background-color:#E6A23C;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#E6A23C;font-size:12px;font-weight:bold;");
            }
            reject('cancel')
          }
          // 支付成功
          if (isSuccess) {
            resolve()
          }
          // 支付错误
          if (!isSuccess && !isCancel) {
            if (ENVIROMENT === 'developer') {
              console.log("%c 支付发生错误：%c " + JSON.stringify(res), "background-color:#E6A23C;color:#fff;padding:2px 4px;font-weight:bold;font-size:12px", "color:#E6A23C;font-size:12px;font-weight:bold;");
            }
            reject(res)
          }
        }
      })
    })
  }).catch()
};

/**
 * http 请求头header设置
 * @returns {{Authorization: string}}
 */
Utils.httpHeader = function () {
  return {
    Authorization: `Bearer ${Utils.getUserToken()}`
  }
};

/**
 * 获取用户token
 */
Utils.getUserToken = function () {
  try {
    let token = wx.getStorageSync('token');
    let token_expired_date = wx.getStorageSync('token_expired_date');
    if (token && token_expired_date && DayJs(token_expired_date).diff(DayJs(), 'days') < 29) {
      return token
    }
    else {
      Utils.signOutStorage();
      return ''
    }
  } catch (e) {
    return ''
  }
};

/**
 * 选择图片
 * @param  {object} opts 文件大小限制，默认5MB
 * @param  {function} handleUrl 文件大小限制，默认5MB
 * =>{
 *   maxSize:5,
 *   params: object  // 自定义参数
 * }
 */
Utils.chooseImage = (opts, handleUrl) => {
  const unitMB = 1024 * 1024;
  let maxSize = 5; // 默认单位
  const setting = {
    maxSize,  // 文件最大大小,单位M
    count: 1,  // 最多可以选择的图片张数
    sizeType: ['compressed'],  // original 原图，compressed 压缩图
    ...opts
  };
  let maxFileSize = setting.maxSize;
  wx.chooseImage({
    count: setting.count,
    sizeType: setting.sizeType,
    success: function (res) {
      const chooseFile = res.tempFiles[0];
      const chooseFileSize = chooseFile.size;
      const calcFileMB = (chooseFileSize / unitMB).toFixed(2);
      if (chooseFileSize > maxFileSize * unitMB) {
        wx.showModal({
          title: '警告',
          content: '图片大小不能超过' + maxFileSize + 'MB\r\n当前图片大小' + calcFileMB + 'MB',
          confirmText: '重新选择',
          success: function (res) {
            if (res.confirm) {
              Utils.chooseImage(setting);
            }
          }
        })
      }
      else {
        handleUrl(setting.count > 1 ? res.tempFiles : chooseFile.path)
      }
    }
  })
};

/**
 * 裁剪图片
 * @param opts
 */
Utils.chooseImageCropper = opts => {
  const isEvent = opts && opts.currentTarget !== undefined;
  // 如果是直接事件调用可以尝试 dom 元素 data-* 去读取设置属性
  // eg=>>>  <view bindtap="chooseImage" data-croppersize=[''] data-croppertype='' data-ratio=''></view>
  let domParams = {};
  if (isEvent) {
    let {croppersize = '', croppertype = '', ratio = ''} = opts.currentTarget.dataset;
    domParams = {
      cropperSize: croppersize,
      ratio: ratio,
      cropperType: croppertype
    }
  }
  const setting = {
    cropperSize: '', // 裁剪图片大小，请按照 dp1的大小输入 如 160(宽度)*120(高)
    ratio: '',// 裁剪比例 例如 4(宽):3(高) 就是 3/4=0.75 ,如果传递了 cropperSize 此参数失效,
    cropperType: '',// 裁剪类型 目前支持一下类型(待补充) personalCardType:身份证。 fullScreen:全屏 如果传递了 cropperSize | ratio 此参数失效,
    ...isEvent ? domParams : opts
  };
  Utils.chooseImage({}, function (url) {
    const {cropperType, ratio, cropperSize} = setting;
    wx.navigateTo({
      url: `/components/cropper/cropper?url=${url}&${Utils.getStitchingUrlParams({
        url: url,
        cropperType,
        ratio,
        cropperSize
      })}`
    })
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
    // 选择并裁剪图片
    chooseImageCropper: Utils.chooseImageCropper,
    // 获取裁剪的图片
    getCropperImg: function () {
      return new Promise(resolve => {
        const imgUrl = wx.getStorageSync('cropperImg');
        if (imgUrl) {
          wx.removeStorageSync('cropperImg');
          resolve(imgUrl)
        }
        resolve('')
      }).catch()
    },
    // 图片预览
    previewImage: function (e) {
      let {url, list, key} = e.currentTarget.dataset;
      let urls = [url];
      if (list) {
        if (key) {
          urls = [];
          for (let i = 0; i < list.length; i++) {
            urls.push(list[i][key]);
          }
        }
        else {
          urls = list;
        }
      }
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表
      })
    }
  },
};

/**
 * 文件接口
 */
Utils.files = {
  // 上传图片
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
          if (ENVIROMENT === 'developer') {
            console.log('图片上传信息:::', data.code === 0 ? data.data : data)
          }
          if (data.code === 0) {
            resolve(data.data)
          }
          reject(data);
        },
        fail: function (res) {
          reject(reject);
          wx.hideLoading();
          wx.showToast({title: '图片上传失败'});
          if (ENVIROMENT === 'developer') {
            console.warn('图片上传失败:::', res)
          }
          reject(res)
        }
      })
    })
  },
  // 批量上传图片
  arrayFiles: function (arrayFiles) {
    let PromiseUploadFiles = [];
    arrayFiles.forEach(value => {
      PromiseUploadFiles.push(this.uploadFile(value))
    });
    return Promise.all(PromiseUploadFiles).catch()
  },
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
      wx.showToast({title: '发送成功,请注意查收', icon: 'none'});
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
 * 格式化字符串
 * @type {{card_no: Utils.format.card_no}}
 */
Utils.format = {
  /**
   * 银行卡格式化，每4位显示
   * @param bank_card {string}
   * @returns {string}
   */
  bank_card: function (bank_card) {
    if (/\S{5}/.test(bank_card)) {
      bank_card = bank_card.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    return bank_card
  }
};

/**
 * 登录时保存用户数据
 */
Utils.signInStorage = function (data) {
  return new Promise((resolve, reject) => {
    try {
      let app = getApp();
      app.globalData.isLogin = true;
      wx.setStorageSync('token', data.token);
      wx.setStorageSync('token_expired_date', DayJs().add(29, 'day').toString());  // 存储 token 有效期
      resolve(data)
    } catch (e) {
      wx.showToast({title: '存储登录信息失败!'.message, icon: 'none'});
      reject();
    }
  }).catch()
};

/**
 * 退出时删除用户数据
 */
Utils.signOutStorage = function (data) {
  return new Promise((resolve, reject) => {
    // Utils.tabBarBadgeMsg();
    try {
      let app = getApp();
      app.globalData.isLogin = true;
      wx.removeStorageSync('token');
      wx.removeStorageSync('token_expired_date');
      wx.removeStorageSync('openid');
      wx.hideTabBarRedDot({index: 1});
      resolve(data)
    } catch (e) {
      wx.showToast({title: '删除登录信息失败!'.message, icon: 'none'});
      reject();
    }
  }).catch()
};

/**
 * http请求
 * @param url {string}
 * @param params {object}
 */
Utils.http = function (url, params = {}) {
  return Http(url, params);
};

/**
 * 页面loading
 * @type {{data: {isPageHidden: boolean}, action: {pageLoad: Utils.page.action.pageLoad, pageShow: Utils.page.action.pageShow, pageHidden: Utils.page.action.pageHidden}}}
 */
Utils.page = {
  data: {
    isPageHidden: true,
    loadAnimationPage: {}
  },
  action: {
    pageLoad: function () {
      // wx.showLoading({title: '加载中...', icon: 'none'});
      wx.showNavigationBarLoading();
      this.initFetch && this.initFetch();
    },
    pageEnd: function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      const loadAnimationPage = this.data.loadAnimationPage;
      const opacity = loadAnimationPage.action ? loadAnimationPage.actions[0].animates[0].args[1] : 0;
      if (!opacity) {
        let animation = wx.createAnimation({
          duration: platform === 'ios' ? 180 : 100,
          timingFunction: platform === 'ios' ? 'ease-in-out' : 'linear',
        }).opacity(1).step();
        this.setData({
          loadAnimationPage: animation.export()
        })
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
        duration: platform === 'ios' ? 150 : 80,
        timingFunction: platform === 'ios' ? 'ease-in-out' : 'linear',
      });
      if (isModalOverlayHidden) {
        this.setData({
          isModalOverlayHidden: false, // 先显示元素,但是透明度为0，之后执行动画
          isModalContentHidden: false // 先显示元素,但是透明度为0，之后执行动画
        }, () => {
          this.setData({
            animationModalOverlay: animation.opacity(0.5).step().export(),
          }, () => {
            this.setData({
              animationModalOverlayContent: animation.opacity(1).step().export(),
            })
          })
        })
      }
      else {
        this.setData({
          isModalOverlayHidden: false, // 先显示元素,但是透明度为0，之后执行动画
          isModalContentHidden: false // 先显示元素,但是透明度为0，之后执行动画
        }, () => {
          this.setData({
            animationModalOverlayContent: animation.opacity(0).step().export()
          }, () => {
            this.setData({
              animationModalOverlay: animation.opacity(0).step().export()
            })
          })
        })
      }
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
          isModalContentHidden: true,
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
  identity_card: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  // 银行卡号
  bank_card: /^([1-9])(\d{12}|\d{15}|\d{18})$/
};

/**
 * 上拉加载更多
 */
Utils.reachBottom = {
  data: {
    reachEndInfo: {
      isHidden: true,
      isMore: true,
      isFail: false,
      isLoading: false
    }
  },
  action: {

    /**
     * 页面上拉触底事件的处理函数
     */
    _onReachBottom: function (e) {
      if (this.data.refresh.isLoading) {
        return wx.showToast({title: '正在刷新，请稍等', icon: 'none'});
      }
      const {
        reachEndInfo,
        asyncData
      } = this.data;
      const {
        isHidden,
        isMore,
        isLoading,
        isFail
      } = reachEndInfo;
      if (!isHidden && isMore && !isLoading) {
        wx.showNavigationBarLoading();
        const listLength = asyncData.list.length;
        this.setData({
          'reachEndInfo.isLoading': true
        }, () => this.initFetch({
          page_size: listLength % 10 + 10,
          page: Math.ceil(listLength / 10) + (isFail ? 0 : 1)
        }));
      }
    },

    /**
     * 设置更多加载状态
     * 判断条件一般是默认获取 asyncData字段
     */
    setReachEndInfo: function (info = {}) {
      let {
        asyncData,
        reachEndInfo,
      } = this.data;
      let listTotal = info.length !== undefined ? info.length : asyncData.list.length;
      let total = info.total !== undefined ? info.total : asyncData.total;
      // 列表填写之后延迟更新下拉加载更多的状态。
      this.setData({
        reachEndInfo: {
          ...reachEndInfo,
          isHidden: false,
          isMore: total > listTotal,
          isLoading: false
        }
      })
    },
  }
};

/**
 * 下拉刷新
 * @type {{}}
 */
Utils.pullDownRefresh = {
  data: {
    refresh: {
      isRefresh: true,
      isLoading: false,
    }
  },
  action: {

    /**
     * 清空数据刷新分页数据
     * @returns {{refresh: {isRefresh: boolean, isLoading: boolean}, asyncData: {list: Array, total: number}, "searchForm.page": number, "searchForm.page_size": number}}
     */
    getInitFetchParams: function () {
      return {
        asyncData: {
          list: [],
          total: 0
        },
        'searchForm.page': 1,
        'searchForm.page_size': 10,
      }
    },

    /**
     * 开始下拉刷新
     * @param onBefore {function} 刷新之前的回调
     * @param onAfter  {function} 刷新之后回调
     */
    startPullDownRefresh: function (onBefore, onAfter) {
      wx.stopPullDownRefresh();
      onBefore && onBefore();
      const isRefresh = this.data.refresh.isRefresh;
      if (!isRefresh) return wx.stopPullDownRefresh();
      if (this.data.reachEndInfo.isLoading) {
        return wx.showToast({title: '正在加载更多，请稍等', icon: 'none'});
      }
      wx.showNavigationBarLoading();
      this.setData({
        'refresh.isLoading': true,
        'searchForm.page': 1,
        'searchForm.page_size': this.data.asyncData.list.length
      }, () => {
        this.initFetch();
        onAfter && onAfter();
      })
    }
  }
};

/**
 * 上拉加载更多  下拉刷新
 * @type {{}}
 */
Utils.reachBottomPullDownRefresh = {
  data: {
    ...Utils.pullDownRefresh.data,
    ...Utils.reachBottom.data,
  },
  action: {
    ...Utils.pullDownRefresh.action,
    ...Utils.reachBottom.action,
    // 设置格式化数据
    _getFormatFetchDataParams: function ({params, data}) {
      let {
        asyncData
      } = this.data;
      const dataList = asyncData.list;
      const isRefresh = this.data.refresh.isLoading;
      return {
        'refresh.isLoading': false,
        asyncData: {
          total: data.total,
          list: (isRefresh ? [] : dataList).concat(data.list)
        },
        'searchForm.page': params.page || 1,
        'searchForm.page_size': params.page_size || 10,
      }
    },
    /**
     * 下拉刷新和上拉加载更多加载之后  更新页面数据
     * @param params
     * @param data
     * @param handle
     */
    updateReachBottomPullDownRefreshPageData: function ({params, data}, handle) {
      wx.stopPullDownRefresh();
      this.setData(this._getFormatFetchDataParams({params, data}), () => {
        this.pageEnd();
        this.setReachEndInfo();
        if (this.data.asyncData.total === 0) {
          this.setData({
            'pageNoneResult.isHidden': false
          })
        }
        handle && handle()
      })
    }
  }
};

export default Utils;