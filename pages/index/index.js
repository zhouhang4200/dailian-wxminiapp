// pages/home/index.js
import Utils from '../../lib/utils'
import {
  api_orderWait,
  api_gameAllRegionServer
} from '../../lib/api'

let {platform} = getApp().globalData;

// 动画内容
let timingFunction = platform === 'ios' ? 'ease-in-out' : 'linear';

let mockList = [{
  "trade_no": "2018090715283100000038",
  "status": 1,
  "foreign_trade_no": "2018090715124200000039",
  "user_id": 1,
  "username": "发单平台",
  "user_phone": "18500132452",
  "user_qq": null,
  "parent_user_id": 1,
  "parent_username": "wsa",
  "take_user_id": 0,
  "take_username": null,
  "take_parent_user_id": 0,
  "take_parent_username": null,
  "order_type_id": 1,
  "game_type_id": 1,
  "game_class_id": 1,
  "game_name": "王者荣耀",
  "region_id": 2,
  "region_name": "IOS微信",
  "server_id": 2,
  "server_name": "默认服",
  "game_leveling_type_id": 1,
  "game_leveling_type_name": "排位",
  "title": "sdf",
  "amount": "12.00",
  "game_account": "sdf",
  "game_password": "sdf",
  "game_role": "sdf",
  "day": 3,
  "hour": 4,
  "security_deposit": "12.00",
  "efficiency_deposit": "12.00",
  "explain": "sdf",
  "requirement": "12",
  "player_name": "0",
  "player_phone": "122234234",
  "player_qq": "0",
  "take_at": null,
  "price_increase_step": "0.00",
  "price_ceiling": "0.00",
  "apply_complete_at": "",
  "complete_at": null,
  "source": 1,
  "top": 2,
  "top_at": "1971-01-01 00:00:00",
  "created_at": "2018-09-07 15:28:31",
  "updated_at": "2018-09-07 15:28:31",
  "parent_user_phone": "",
  "parent_user_qq": "",
  "take_user_qq": "0",
  "take_user_phone": "",
  "take_parent_phone": "",
  "take_parent_qq": "",
  "private": 2,
  "icon": "https://apiwz.38sd.com/storage/wz.png"
},
  {
    "trade_no": "2018090715233100000037",
    "status": 1,
    "foreign_trade_no": "2018090715132500000040",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "18500132452",
    "user_qq": null,
    "parent_user_id": 1,
    "parent_username": "wsa",
    "take_user_id": 0,
    "take_username": null,
    "take_parent_user_id": 0,
    "take_parent_username": null,
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 2,
    "region_name": "IOS微信",
    "server_id": 2,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "sdf909234234234234234",
    "amount": "12.00",
    "game_account": "sdf",
    "game_password": "sdf",
    "game_role": "sdf",
    "day": 3,
    "hour": 4,
    "security_deposit": "12.00",
    "efficiency_deposit": "12.00",
    "explain": "sdf",
    "requirement": "12",
    "player_name": "0",
    "player_phone": "122334234234234",
    "player_qq": "0",
    "take_at": null,
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": null,
    "source": 1,
    "top": 2,
    "top_at": "1971-01-01 00:00:00",
    "created_at": "2018-09-07 15:23:31",
    "updated_at": "2018-09-07 15:23:31",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": "0",
    "take_user_phone": "",
    "take_parent_phone": "",
    "take_parent_qq": "",
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  },
  {
    "trade_no": "2018090715233000000036",
    "status": 1,
    "foreign_trade_no": "2018090715073800000037",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "18500132452",
    "user_qq": null,
    "parent_user_id": 1,
    "parent_username": "wsa",
    "take_user_id": 0,
    "take_username": null,
    "take_parent_user_id": 0,
    "take_parent_username": null,
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 2,
    "region_name": "IOS微信",
    "server_id": 2,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "23花样百出",
    "amount": "23.00",
    "game_account": "23",
    "game_password": "23",
    "game_role": "23",
    "day": 2,
    "hour": 0,
    "security_deposit": "23.00",
    "efficiency_deposit": "23.00",
    "explain": "3",
    "requirement": "2",
    "player_name": "0",
    "player_phone": "185454545",
    "player_qq": "0",
    "take_at": null,
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": null,
    "source": 1,
    "top": 2,
    "top_at": "1971-01-01 00:00:00",
    "created_at": "2018-09-07 15:23:30",
    "updated_at": "2018-09-07 15:23:30",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": "0",
    "take_user_phone": "",
    "take_parent_phone": "",
    "take_parent_qq": "",
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  },
  {
    "trade_no": "2018090715085100000035",
    "status": 1,
    "foreign_trade_no": "2018090715085000000038",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "18500132452",
    "user_qq": null,
    "parent_user_id": 1,
    "parent_username": "wsa",
    "take_user_id": 0,
    "take_username": null,
    "take_parent_user_id": 0,
    "take_parent_username": null,
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 2,
    "region_name": "IOS微信",
    "server_id": 2,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "sdf可欺",
    "amount": "12.00",
    "game_account": "sdf",
    "game_password": "sdf",
    "game_role": "sdf",
    "day": 3,
    "hour": 4,
    "security_deposit": "12.00",
    "efficiency_deposit": "12.00",
    "explain": "sdf",
    "requirement": "12",
    "player_name": "0",
    "player_phone": "12",
    "player_qq": "0",
    "take_at": null,
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": null,
    "source": 1,
    "top": 2,
    "top_at": "1971-01-01 00:00:00",
    "created_at": "2018-09-07 15:08:51",
    "updated_at": "2018-09-07 15:08:51",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": "0",
    "take_user_phone": "",
    "take_parent_phone": "",
    "take_parent_qq": "",
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  },
  {
    "trade_no": "2018090714324800000034",
    "status": 1,
    "foreign_trade_no": "2018090714324700000036",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "18500132452",
    "user_qq": null,
    "parent_user_id": 1,
    "parent_username": "wsa",
    "take_user_id": 0,
    "take_username": null,
    "take_parent_user_id": 0,
    "take_parent_username": null,
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 2,
    "region_name": "IOS微信",
    "server_id": 2,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "sdf",
    "amount": "12.00",
    "game_account": "sdf",
    "game_password": "sdf",
    "game_role": "sdf",
    "day": 3,
    "hour": 4,
    "security_deposit": "12.00",
    "efficiency_deposit": "12.00",
    "explain": "sdf",
    "requirement": "12",
    "player_name": "0",
    "player_phone": "0",
    "player_qq": "0",
    "take_at": null,
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": null,
    "source": 1,
    "top": 2,
    "top_at": "1971-01-01 00:00:00",
    "created_at": "2018-09-07 14:32:48",
    "updated_at": "2018-09-07 14:32:48",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": "0",
    "take_user_phone": "",
    "take_parent_phone": "",
    "take_parent_qq": "",
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  },
  {
    "trade_no": "2018090714315300000004",
    "status": 1,
    "foreign_trade_no": "",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "18500132452",
    "user_qq": null,
    "parent_user_id": 1,
    "parent_username": "18500132452",
    "take_user_id": 0,
    "take_username": null,
    "take_parent_user_id": 0,
    "take_parent_username": null,
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 1,
    "region_name": "IOSQQ",
    "server_id": 1,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "中国",
    "amount": "12.22",
    "game_account": "asdfasd",
    "game_password": "asdfasd",
    "game_role": "王小明",
    "day": 1,
    "hour": 1,
    "security_deposit": "12.00",
    "efficiency_deposit": "1.00",
    "explain": "说明",
    "requirement": "要求",
    "player_name": "0",
    "player_phone": "0",
    "player_qq": "0",
    "take_at": null,
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": null,
    "source": 1,
    "top": 2,
    "top_at": "1971-01-01 00:00:00",
    "created_at": "2018-09-07 14:31:53",
    "updated_at": "2018-09-07 14:31:53",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": "0",
    "take_user_phone": "",
    "take_parent_phone": "",
    "take_parent_qq": "",
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  },
  {
    "trade_no": "2018090714044000000028",
    "status": 2,
    "foreign_trade_no": "2018090713484700000028",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "0",
    "user_qq": "1231213",
    "parent_user_id": 1,
    "parent_username": "发单平台",
    "take_user_id": 9,
    "take_username": "9LxPt",
    "take_parent_user_id": 9,
    "take_parent_username": "9LxPt",
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 2,
    "region_name": "IOS微信",
    "server_id": 2,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "1",
    "amount": "10.00",
    "game_account": "测试下单201806131745",
    "game_password": "201806131745",
    "game_role": "下单201806131745",
    "day": 2,
    "hour": 1,
    "security_deposit": "5.00",
    "efficiency_deposit": "5.00",
    "explain": "测试下单100",
    "requirement": "测试下单100",
    "player_name": "0",
    "player_phone": "1123122222",
    "player_qq": "0",
    "take_at": "2018-09-07 14:31:13",
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": null,
    "source": 1,
    "top": 2,
    "top_at": "2018-09-07 14:04:40",
    "created_at": "2018-09-07 14:04:40",
    "updated_at": "2018-09-07 16:37:13",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": null,
    "take_user_phone": "18682022027",
    "take_parent_phone": "18682022027",
    "take_parent_qq": null,
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  },
  {
    "trade_no": "2018090714015500000027",
    "status": 8,
    "foreign_trade_no": "2018090714015500000030",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "0",
    "user_qq": "1231213",
    "parent_user_id": 1,
    "parent_username": "发单平台",
    "take_user_id": 2,
    "take_username": "接单账号",
    "take_parent_user_id": 2,
    "take_parent_username": "接单账号",
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 2,
    "region_name": "IOS微信",
    "server_id": 2,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "3",
    "amount": "10.00",
    "game_account": "测试下单201806131745",
    "game_password": "201806131745",
    "game_role": "下单201806131745",
    "day": 2,
    "hour": 1,
    "security_deposit": "5.00",
    "efficiency_deposit": "5.00",
    "explain": "测试下单100",
    "requirement": "测试下单100",
    "player_name": "0",
    "player_phone": "1123122222",
    "player_qq": "0",
    "take_at": "2018-09-07 14:02:04",
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": "2018-09-07 14:02:16",
    "source": 1,
    "top": 2,
    "top_at": "2018-09-07 14:01:55",
    "created_at": "2018-09-07 14:01:55",
    "updated_at": "2018-09-07 14:02:16",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": "0",
    "take_user_phone": "0",
    "take_parent_phone": "",
    "take_parent_qq": "",
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  },
  {
    "trade_no": "2018090713593900000026",
    "status": 8,
    "foreign_trade_no": "2018090713593900000029",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "0",
    "user_qq": "1231213",
    "parent_user_id": 1,
    "parent_username": "发单平台",
    "take_user_id": 2,
    "take_username": "接单账号",
    "take_parent_user_id": 2,
    "take_parent_username": "接单账号",
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 2,
    "region_name": "IOS微信",
    "server_id": 2,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "2",
    "amount": "10.00",
    "game_account": "测试下单201806131745",
    "game_password": "201806131745",
    "game_role": "下单201806131745",
    "day": 2,
    "hour": 1,
    "security_deposit": "5.00",
    "efficiency_deposit": "5.00",
    "explain": "测试下单100",
    "requirement": "测试下单100",
    "player_name": "0",
    "player_phone": "1123122222",
    "player_qq": "0",
    "take_at": "2018-09-07 13:59:49",
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": "2018-09-07 14:01:39",
    "source": 1,
    "top": 2,
    "top_at": "2018-09-07 13:59:39",
    "created_at": "2018-09-07 13:59:39",
    "updated_at": "2018-09-07 14:01:39",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": "0",
    "take_user_phone": "0",
    "take_parent_phone": "",
    "take_parent_qq": "",
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  },
  {
    "trade_no": "2018090712362000000025",
    "status": 1,
    "foreign_trade_no": "2018090712202900000025",
    "user_id": 1,
    "username": "发单平台",
    "user_phone": "0",
    "user_qq": "1231213",
    "parent_user_id": 1,
    "parent_username": "发单平台",
    "take_user_id": 0,
    "take_username": null,
    "take_parent_user_id": 0,
    "take_parent_username": null,
    "order_type_id": 1,
    "game_type_id": 1,
    "game_class_id": 1,
    "game_name": "王者荣耀",
    "region_id": 2,
    "region_name": "IOS微信",
    "server_id": 2,
    "server_name": "默认服",
    "game_leveling_type_id": 1,
    "game_leveling_type_name": "排位",
    "title": "下单20180828",
    "amount": "10.00",
    "game_account": "测试下单201806131745",
    "game_password": "201806131745",
    "game_role": "下单201806131745",
    "day": 2,
    "hour": 1,
    "security_deposit": "5.00",
    "efficiency_deposit": "5.00",
    "explain": "测试下单100",
    "requirement": "测试下单100",
    "player_name": "0",
    "player_phone": "1123122222",
    "player_qq": "0",
    "take_at": null,
    "price_increase_step": "0.00",
    "price_ceiling": "0.00",
    "apply_complete_at": "",
    "complete_at": null,
    "source": 1,
    "top": 2,
    "top_at": "2018-09-07 17:05:52",
    "created_at": "2018-09-07 12:36:20",
    "updated_at": "2018-09-07 17:05:52",
    "parent_user_phone": "",
    "parent_user_qq": "",
    "take_user_qq": "0",
    "take_user_phone": "0",
    "take_parent_phone": "",
    "take_parent_qq": "",
    "private": 2,
    "icon": "https://apiwz.38sd.com/storage/wz.png"
  }
]

// 上推和下推动画
let slideUpDownAnimation = wx.createAnimation({
  duration: platform === 'ios' ? 180 : 100,
  timingFunction,
});
// 遮罩动画
let modalOverlayAnimation = wx.createAnimation({
  duration: platform === 'ios' ? 180 : 100,
  timingFunction,
});
// 弹窗筛选条件动画
let sortModalAnimation = wx.createAnimation({
  duration: platform === 'ios' ? 230 : 180,
  timingFunction,
});

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

    showSkeleton: true,

    isModalOverlayHidden: true,
    animationModalOverlay: {},

    isHeadTopFixed: false,
    headTopHeight: 0,

    animationSlideUpDown: {}, // 页面上推 or 下推动画
    slideUpDownDirection: 'up', // 上推和下推方向
    animationSortModal: {},

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
    payload: {  // 存储历史记录的选择值。在用户选择然后关闭遮罩之后是否进行筛选查询。
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
    this.setSelectedSortTitle(sortindex, name);
    const constKey = 'searchForm.' + key;
    this.setData({
      [constKey]: value
    }, () => this.slideUpDownAnimationToggle());
  },

  /**
   * 商品详情页
   * @param sortIndex
   * @param name
   */
  goodsDetailNavigator: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
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
   *  选择游戏名称
   */
  onSortGameOption: function (e) {
    const {value, index, sortindex, name} = e.currentTarget.dataset;
    const isCurrent = value === this.data.searchForm.game_id;
    const gameList = this.data.gameList;
    this.setSelectedSortTitle(sortindex, name);
    if (!isCurrent) {
      this.setData({
        'searchForm.game_id': value,
        regionList: [{id: 0, name: '全部'}].concat(gameList[index].regions),
        serverList: [],
      });
    }
  },

  /**
   *  选择游戏区
   */
  onSortGameRegion: function (e) {
    const {value, index, sortindex, name} = e.currentTarget.dataset;
    const isCurrent = value === this.data.searchForm.region_id;
    if (value === 0 || isCurrent) {
      this.setSelectedSortTitle(sortindex, name);
      this.slideUpDownAnimationToggle();
      return false;
    }
    if (!isCurrent) {
      this.setData({
        'searchForm.region_id': value,
        serverList: this.data.regionList[index].servers,
      });
    }
  },

  /**
   * 动画参数配置
   */
  getDialogCreateAnimation: function () {
    return wx.createAnimation({
      duration: platform === 'ios' ? 330 : 250,
      timingFunction: platform === 'ios' ? 'ease-in-out' : 'linear',
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
    const {game_id, region_id, server_id, amount, sort} = this.data.searchForm;
    // 保存数据快照历史数据
    this.setData({
      isHeadTopFixed: true,
      payload: {game_id, region_id, server_id, amount, sort}
    });
    const targetSortType = e.currentTarget.dataset.sort;
    const {sortType, gameList} = this.data;
    // 选择 游戏区服 筛选需要单独处理
    // 先看游戏名称列表是否有,没有的话，需要异步去获取
    if (!gameList.length && targetSortType === 'area') return this.fetchGameAllRegionServer(e);
    // 当前切换
    // 1.先把页面动画推下去
    if (sortType === targetSortType) {
      this.slideUpDownAnimationToggle();
    }
    // 新的切换
    else {
      this.setData({sortType: targetSortType}, () => {
        // 当前已经下的状态表示是当前筛选条件进行，不进行变化
        this.data.slideUpDownDirection !== 'down' && this.slideUpDownAnimationToggle();
      })
    }
  },

  // 页面  上推/下推 动画切换
  slideUpDownAnimationToggle: function () {
    const slideUpDownDirection = this.data.slideUpDownDirection;
    if (slideUpDownDirection === 'up') {
      this.setData({
        slideUpDownDirection: 'up',
        animationSlideUpDown: slideUpDownAnimation.translateY(-40).step().export()
      })
    }
    else {
      this.setData({
        slideUpDownDirection: 'down',
        animationSlideUpDown: slideUpDownAnimation.translateY(0).step().export(),
        // 因为有间隔40的空隙，因此弹窗筛选内容和筛选条件一起下移
        animationSortModal: slideUpDownAnimation.translateY(40).step().export()
      })
    }
  },

  // 页面 上推/下推 动画结束
  slideUpDownAnimationTransitionEnd: function () {
    const slideUpDownDirection = this.data.slideUpDownDirection;
    // 上推结束
    // 遮罩 && 筛选弹窗 内容一起显示
    if (slideUpDownDirection === 'up') {
      this.setData({
        isModalOverlayHidden: false // 先显示遮罩元素
      }, () => {
        this.setData({
          slideUpDownDirection: "down",
          animationSortModal: sortModalAnimation.translateY(0).step().export(),
          animationModalOverlay: modalOverlayAnimation.opacity(0.5).step().export()
        })
      })
    }
    // 下推结束
    // 遮罩 && 筛选弹窗 内容一起隐藏,恢复初始状态
    else {
      this.setData({
        isHeadTopFixed: true,
        slideUpDownDirection: "up",
        animationSortModal: sortModalAnimation.translateY('-100%').step().export(),
        animationModalOverlay: modalOverlayAnimation.opacity(0).step().export()
      })
    }
  },

  /**
   * 筛选 上推/下推 内容动画结束
   */
  animationSortModalTransitionEnd: function () {
    const slideUpDownDirection = this.data.slideUpDownDirection;
    if (slideUpDownDirection === 'up') {
      this.payloadRefresh()
      this.setData({
        isHeadTopFixed: false,
        sortType: null
      })
    }
  },

  // 查看筛选条件是否有更新，然后进行查询
  payloadRefresh: function () {
    const {searchForm, payload} = this.data;
    const isPayloadRefresh = searchForm.sort !== payload.sort || searchForm.amount !== payload.amount || searchForm.game_id !== payload.game_id || searchForm.region_id !== payload.region_id || searchForm.server_id !== payload.server_id
    if (isPayloadRefresh) {
      wx.showLoading({title: '筛选中', icon: 'none'});
      this.setData({
        'searchForm.page': 1,
        asyncData: {
          list: [],
          totalRows: 0
        },
        'reachEndInfo.isHidden': true,
      }, () => this.initFetch());
    }
  },

  /**
   * 弹窗遮罩动画结束
   */
  modalOverlayTransitionEnd: function () {
    const animationModalOverlay = this.data.animationModalOverlay;
    const opacity = animationModalOverlay.actions[0].animates[0].args[1];
    if (!opacity) {
      this.setData({
        isModalOverlayHidden: true
      })
    }
  },

  /**
   * 获取所有游戏的所有的区服列表信息
   * @param e
   */
  fetchGameAllRegionServer: function (e) {
    wx.showLoading({title: '加载中...', icon: 'none'});
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
        this.setData({
          gameList: [{id: '', name: '全部'}].concat(games),
          regionList: [],
          serverList: []
        });
        resolve();
      }, (err) => {
        reject(err);
      });
    }).catch()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageLoad();
    const windowWidth = this.data.windowWidth;
    let headTopHeight = 160 / ((windowWidth * 2) / windowWidth);
    this.setData({
      headTopHeight
    })
    Utils.tabBarBadgeMsg();
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
    this.setData({
      isHeadTopFixed: false
    })
    this.startPullDownRefresh();
  },

  /**
   * 页面滚动
   */
  onPageScroll: function (params) {
    // 160
    const headTopHeight = this.data.headTopHeight;
    const scrollTop = params.scrollTop;
    this.setData({
      isHeadTopFixed: scrollTop > 0.1
    })
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