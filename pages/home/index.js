// pages/home/index.js
import Utils from '../../lib/utils'
import {
  api_orderWait,
  api_gameAllRegionServer
} from '../../lib/api'

/**
 * 静态数据存储
 * @type {{gameInfo: {gameList: Array, regionList: Array, serverList: Array}}}
 */

Page({

  ...Utils.page.action,
  ...Utils.reachBottom.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.page.data,
    ...Utils.globalData(),
    ...Utils.reachBottom.data,

    isModalOverlayHidden: true,
    animationModalOverlay: {},

    animationPage: {},
    animationSortModal: {},
    actionAnimationSortContent: null, // 筛选内容的弹窗显示动画
    actionAnimationModalOverlay: null, // 遮罩动画
    actionAnimationNextSortContent: null, // 在当前遮罩情况切换sort
    actionAnimationSortSearch: null, // 选择之后进行搜索

    sortType: 'null',
    sortTypeList: [
      {
        title: '游戏区服',
        type: 'area'
      },
      {
        title: '默认排序',
        type: 'default',
        list: [
          {title: '综合排序', sort: 0},
          {title: '价格从低到高', sort: 1},
          {title: '价格从高到低', sort: 2},
          {title: '代练时间由长到短', sort: 4},
          {title: '代练时间由短到长', sort: 3}
        ]
      },
      {
        title: '价格筛选',
        type: 'price',
        list: [
          {title: '全部', amount: 0},
          {title: '10元以下', amount: 1},
          {title: '10元-100元(含)', amount: 2},
          {title: '100元-200元(含)', amount: 3},
          {title: '100元-200元(含)', amount: 4}
        ]
      }
    ],
    gameList: [],  // 游戏列表
    regionList: [], // 区列表
    serverList: [], // 服列表
    asyncData: {
      list: [],
      total: 0
    },
    isNoneResultList: false,
    searchForm: {
      page: 1,
      page_size: 10,
      sort: 0,
      amount: 0,
      game_id: '',
      region_id: '',
      server_id: ''
    }
  },

  /**
   * 选择弹窗中条件进行查询
   */
  onSelectSort: function (e) {
    const {key, value, sortindex, name} = e.currentTarget.dataset;
    if (sortindex !== undefined) {
      this.data.sortTypeList[sortindex].title = name;
    }
    this.onSortItem(e);
    this.setData({
      actionAnimationSortSearch: () => {
        const constKey = 'searchForm.' + key;
        this.setData({
          sortTypeList: this.data.sortTypeList,
          'searchForm.page': 1,
          [constKey]: value,
          isNoneResultList: false,
          asyncData: {
            list: [],
            totalRows: 0
          },
          'reachEndInfo.isHidden': true,
          actionAnimationSortSearch: ''
        });
        wx.showLoading({title: '加载中'});
        this.initFetch();
      }
    });
  },

  onGameSortSelect: function (e) {
    const {key, value, index, sortindex, name} = e.currentTarget.dataset;
    if (sortindex !== undefined) {
      this.data.sortTypeList[sortindex].title = name;
    }
    const {gameList} = this.data;
    const isSelectGame = key === 'game_id';
    const isSelectServer = key === 'server_id';
    const isSelectRegion = key === 'region_id';
    let isSelectGameAll = (key === 'game_id' && value === 0);
    let isSelectRegionAll = (key === 'region_id' && value === 0);
    let isSearch = isSelectGameAll || isSelectRegionAll || isSelectServer;
    const constKey = 'searchForm.' + key;
    if (key === 'game_id' && value !== 0) {
      this.setData({
        [constKey]: value,
        regionList: [{id: 0, name: '全部'}].concat(gameList[index].regions),
        serverList: [],
      });
    }
    if (key === 'region_id' && value !== 0) {
      this.setData({
        [constKey]: value,
        serverList: this.data.regionList[index].servers,
      });
    }
    // 相同选项忽略筛选，不做任何操作
    if (!isSearch) return false;
    this.setData({
      'searchForm.server_id': (isSelectGame || isSelectRegion) ? '' : this.data.searchForm.server_id,
      'searchForm.region_id': isSelectGame ? '' : this.data.searchForm.region_id,
      [constKey]: value,
      sortTypeList: this.data.sortTypeList,
      regionList: isSelectGameAll ? [] : isSelectGame ? gameList[index].regions : this.data.regionList,
      serverList: (isSelectGame || isSelectRegionAll) ? [] : isSelectRegion ? this.data.regionList[index].servers : this.data.serverList,
    }, () => {
      const {regionList, serverList} = this.data;
      if ((regionList.length !== 0 && key === 'game_id') || (serverList.length !== 0 && key === 'region_id')) {
        return false;
      }
      this.onSelectSort(e);
    });
  },

  /**
   * 动画参数配置
   */
  getDialogCreateAnimation: function () {
    return wx.createAnimation({
      duration: 150,
      timingFunction: 'linear',
    });
  },

  /**
   * 加载更多翻页数据
   */
  initFetch: function (opts) {
    let params = {
      ...this.data.searchForm,
      ...opts
    };
    const isRefresh = params.page === this.data.searchForm.page;
    api_orderWait(params).then(data => {
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
        wx.hideLoading();
        this.pageEnd();
        this.setReachEndInfo();
        if (this.data.asyncData.total === 0) {
          this.setData({
            isNoneResultList: true
          })
        }
      })
    });
  },

  /**
   * 头部排序
   */
  onSortItem: function (e) {
    const targetSortType = e.currentTarget.dataset.sort;
    const {sortType, isModalOverlayHidden, gameList} = this.data;
    // 选择 游戏区服 筛选需要单独处理
    // 先看游戏名称列表是否有,没有的话，需要异步去获取
    if (!gameList.length && targetSortType === 'area') return this.fetchGameAllRegionServer(e);
    if (sortType === targetSortType || isModalOverlayHidden) {
      this.setData({
        actionAnimationSortContent: () => this.modalContentToggle(isModalOverlayHidden ? targetSortType : sortType),
        actionAnimationModalOverlay: this.modalOverlayToggle,
        actionAnimationNextSortContent: "",
      }, this.onPageAnimation)
    }
    else {
      this.setData({
        actionAnimationNextSortContent: () => {
          this.setData({
            sortType: 'null'
          }, () => this.modalContentToggle(targetSortType))
        }
      }, () => this.modalContentToggle(sortType))
    }
  },

  /**
   * 获取所有游戏的所有的区服列表信息
   * @param e
   */
  fetchGameAllRegionServer: function (e) {
    wx.showLoading({title: '加载中...'});
    this.setGameRegionServer().then(() => {
      wx.hideLoading();
      this.onSortItem(e)
    });
  },

  /**
   * 获取所有区服数据，在主页面核心数据显示之后，去辅助显示数据
   * @returns {Promise<any>}
   */
  setGameRegionServer: function () {
    return new Promise((resolve, reject) => {
      api_gameAllRegionServer().then(data => {
        let {games, regions, servers} = data;
        for (let j = 0; j < regions.length; j++) {
          let _regions = regions[j];
          for (let k = 0; k < servers.length; k++) {
            let _server = servers[k];
            if (_regions.id === _server.region_id) {
              regions[j]['servers'] = (regions[j]['servers'] || []).concat(_server);
            }
          }
        }
        for (let i = 0; i < games.length; i++) {
          let _game = games[i];
          for (let j = 0; j < regions.length; j++) {
            let _regions = regions[j];
            if (_game.id === _regions.game_id) {
              games[i]['regions'] = (games[i]['regions'] || []).concat(_regions);
            }
          }
        }
        const _regions = games[0].regions;
        this.setData({
          gameList: [{id: 0, name: '全部'}].concat(games),
          regionList: [{id: 0, name: '全部'}].concat(_regions),
          serverList: [{id: 0, name: '全部'}].concat(_regions[0].servers)
        });
        resolve();
      }, (err) => {
        reject(err);
      });
    }).catch()
  },

  /**
   * 页面上推动画 toggle
   * @param callBack
   */
  onPageAnimation: function (callBack) {
    const animationPage = this.data.animationPage;
    const translateY = animationPage.actions ? animationPage.actions[0].animates[0].args[0] : false;
    let animation = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear',
    }).translateY(!translateY ? -40 : 0).step();
    this.setData({
      animationPage: animation.export()
    }, callBack)
  },

  /**
   * 页面上推动画结束
   */
  onPageAnimationEnd: function () {
    const {actionAnimationModalOverlay, actionAnimationSortContent} = this.data;
    actionAnimationModalOverlay && actionAnimationModalOverlay();
    actionAnimationSortContent && actionAnimationSortContent();
  },

  /**
   * 筛选弹窗动画
   * @param sortType {string}
   */
  modalContentToggle: function (sortType) {
    let animate = this.getDialogCreateAnimation();
    const dataSortType = this.data.sortType;
    const isCurrent = dataSortType === sortType;
    this.setData({
      sortType,
      animationSortModal: animate.translateY(isCurrent ? '-100%' : 0).step().export()
    }, () => {
      isCurrent && this.setData({sortType: ''})
    })
  },

  /**
   * 筛选弹窗动画结束
   */
  onModalContentToggle: function () {
    const {actionAnimationNextSortContent} = this.data;
    actionAnimationNextSortContent && actionAnimationNextSortContent();
  },

  /**
   * 弹窗遮罩动画 toggle
   */
  modalOverlayToggle: function () {
    const isModalOverlayHidden = this.data.isModalOverlayHidden;
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    }).opacity(isModalOverlayHidden ? 0.5 : 0).step();
    this.setData({
      isModalOverlayHidden: false // 先显示元素
    }, () => {
      this.setData({
        animationModalOverlay: animation.export()
      })
    })
  },

  /**
   * 弹窗遮罩动画结束
   */
  onModalOverlayToggleEnd: function () {
    const {actionAnimationSortSearch, animationModalOverlay} = this.data;
    const opacity = animationModalOverlay.actions[0].animates[0].args[1];
    if (!opacity) {
      this.setData({
        isModalOverlayHidden: true
      }, () => {
        actionAnimationSortSearch && actionAnimationSortSearch();
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageLoad();
    this.setGameRegionServer()
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
    let app = getApp();
    if (app.globalData.isRefreshHome) {
      app.globalData.isRefreshHome = false;
      wx.showLoading({title: '加载中'});
      this.setData({
        asyncData: {
          list: [],
          total: 0
        },
        isNoneResultList: false,
        'searchForm.page': 1,
        'searchForm.page_size': 10
      });
      this.initFetch();
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
   * 页面滚动
   */
  onPageScroll: function (params) {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    this._onReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

});