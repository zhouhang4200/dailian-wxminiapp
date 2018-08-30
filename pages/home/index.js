// pages/home/index.js
import Utils from '../../lib/utils'
import {
  api_orderWait,
  api_gameAllRegionServer
} from '../../lib/api'


Page({

  ...Utils.page.action,
  ...Utils.reachBottomPullDownRefresh.action,

  /**
   * 页面的初始数据
   */
  data: {
    ...Utils.page.data,
    ...Utils.globalData(),
    ...Utils.reachBottomPullDownRefresh.data,

    isModalOverlayHidden: true,
    animationModalOverlay: {},

    animationPage: {},
    animationSortModal: {},
    actionAnimationSortContent: null, // 筛选内容的弹窗显示动画
    actionAnimationModalOverlay: null, // 遮罩动画
    actionAnimationNextSortContent: null, // 在当前遮罩情况切换sort
    actionAnimationSortSearch: null, // 选择筛选之后的值进行搜索

    sortType: 'null',
    sortTypeList: [
      {
        title: '游戏区服',
        type: 'area',
        alias: '游戏区服',
      },
      {
        title: '默认排序',
        type: 'default',
        alias: '默认排序',
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
        alias: '价格筛选',
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
    searchForm: {
      page: 1,
      page_size: 10,
      sort: 0,
      amount: 0,
      game_id: '',
      region_id: '',
      server_id: ''
    },
    historySortValue: {  // 存储历史记录的选择值。在用户选择然后关闭遮罩之后是否进行筛选查询。
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
    this.setSelectedSortTitle(sortindex, name);
    this.onSortItem(e);
    this.setData({
      actionAnimationSortSearch: () => {
        const constKey = 'searchForm.' + key;
        this.setData({
          sortTypeList: this.data.sortTypeList,
          'searchForm.page': 1,
          [constKey]: value,
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

  // 设置选择的的类型值
  setSelectedSortTitle: function (sortIndex, name) {
    if (sortIndex !== undefined) {
      this.data.sortTypeList[sortIndex].title = name;
      this.setData({
        sortTypeList: this.data.sortTypeList
      })
    }
  },

  /**
   * 游戏选择筛选
   * @param e
   * @returns {boolean}
   */
  onGameSortSelect: function (e) {
    const {key, value, index, sortindex, name} = e.currentTarget.dataset;
    this.setSelectedSortTitle(sortindex, name);
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
    api_orderWait(params).then(data => {
      this.updateReachBottomPullDownRefreshPageData({params, data})
    });
  },

  /**
   * 头部排序
   */
  onSortItem: function (e) {
    const {game_id, region_id, server_id} = this.data.searchForm;
    this.setData({
      historySortValue: {game_id, region_id, server_id}
    });
    const targetSortType = e.currentTarget.dataset.sort;
    const {sortType, isModalOverlayHidden, gameList} = this.data;
    const isArea = targetSortType === 'area';
    // 选择 游戏区服 筛选需要单独处理
    // 先看游戏名称列表是否有,没有的话，需要异步去获取
    if (!gameList.length && isArea) return this.fetchGameAllRegionServer(e);
    if (sortType === targetSortType || isModalOverlayHidden) {
      this.setData({
        actionAnimationSortContent: () => this.modalContentToggle(isModalOverlayHidden ? targetSortType : sortType),
        actionAnimationModalOverlay: this.modalOverlayToggle,
        actionAnimationNextSortContent: "",
      }, this.setListGoodsAnimationToggle)
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
  setListGoodsAnimationToggle: function (callBack) {
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
  listGoodsTransitionEnd: function () {
    const {actionAnimationModalOverlay, actionAnimationSortContent} = this.data;
    actionAnimationModalOverlay && actionAnimationModalOverlay();
    actionAnimationSortContent && actionAnimationSortContent();
  },

  // 点击遮罩，判断游戏选项是否有变更
  payloadSort: function (e) {
    const targetSortType = e.currentTarget.dataset.sort;
    const {searchForm, historySortValue, isModalOverlayHidden, sortType} = this.data;
    const isPlayloadRefresh = searchForm.game_id !== historySortValue.game_id || searchForm.region_id !== historySortValue.region_id || searchForm.server_id !== historySortValue.server_id
    this.setData({
      actionAnimationSortContent: () => {
        this.modalContentToggle(isModalOverlayHidden ? targetSortType : sortType)
      },
      actionAnimationModalOverlay: this.modalOverlayToggle,
      actionAnimationNextSortContent: isPlayloadRefresh ? () => {
        this.setData(this.getInitFetchParams(), () => {
          wx.showLoading({title: '加载中', icon: 'none'});
          this.initFetch();
        });
      } : '',
    }, this.setListGoodsAnimationToggle)
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
  modalContentTransitionEnd: function () {
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
  modalOverlayTransitionEnd: function () {
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
    let {globalData} = getApp();
    if (globalData.rootPageData) {
      this.updateReachBottomPullDownRefreshPageData({params: {}, data: globalData.rootPageData})
    }
    else {
      this.pageLoad();
    }
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
      wx.startPullDownRefresh();
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
    this.startPullDownRefresh();
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
    console.log(':::this.data.asyncData', this.data.asyncData);
    this._onReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

});