import Utils from './utils';

/*
* 待接订单列表
* @link https://www.yuque.com/kvxnmz/gfboxd/welcome-to-lark
* @param params
* */
export const api_orderWait = params => Utils.http('/v1/order/wait', params);

/*
* 待接订单详情
* @link https://www.yuque.com/kvxnmz/gfboxd/ezqvrr
* @param params
* */
export const api_orderWaitDetail = params => Utils.http('/v1/order/wait/show', params);

/**
 * 获取所有游戏区服信息
 * @link https://www.yuque.com/kvxnmz/gfboxd/hd5cd8
 * @param params
 */
export const api_gameAllRegionServer = params => Utils.http('/v1/game-info', params);

/**
 * 登录
 * @link https://www.yuque.com/kvxnmz/gfboxd/owdgsk
 * @param params
 */
export const api_login = params => Utils.http('/v1/login', params);

/**
 * 获取个人信息
 * @link https://www.yuque.com/kvxnmz/gfboxd/osaizt
 */
export const api_profile = () => Utils.http('/v1/profile');

/**
 * 修改个人资料
 * @link https://www.yuque.com/kvxnmz/gfboxd/ndswpe
 * @param params
 */
export const api_profileUpdate = params => Utils.http('/v1/profile/update', params);

/**
 * 发送 注册手机验证码
 * @link https://www.yuque.com/kvxnmz/gfboxd/bngrmk
 * @param params
 */
export const api_sendPhoneCode = params => Utils.http('/v1/verification-code', {type: 1, ...params});

/**
 * 注册
 * @link https://www.yuque.com/kvxnmz/gfboxd/xtxw2e
 * @param params
 */
export const api_register = params => Utils.http('/v1/register', params);

/**
 * 个人流水列表
 * @link https://www.yuque.com/kvxnmz/gfboxd/ftszu6
 * @param params
 */
export const api_financeFlows = params => Utils.http('/v1/finance/flows', params);

/**
 * 流水详情
 * @link https://www.yuque.com/kvxnmz/gfboxd/sgackh
 * @param params
 */
export const api_financeFlowsDetails = params => Utils.http('/v1/finance/flows/show', params);

/**
 * 实名认证
 * @link https://www.yuque.com/kvxnmz/gfboxd/ode0bs
 * @param params
 */
export const api_certificationProfile = params => Utils.http('/v1/profile/certification', params);

/**
 * 实名认证详情
 * @link https://www.yuque.com/kvxnmz/gfboxd/ot2umb
 * @param params
 */
export const api_certificationDetail = params => Utils.http('/v1/profile/certification/show', params);

/**
 * 充值
 * @link https://www.yuque.com/kvxnmz/gfboxd/bflv9r
 * @param params
 */
export const api_recharge = params => Utils.http('/v1/finance/recharge', params);

/**
 * 提现
 * @link https://www.yuque.com/kvxnmz/gfboxd/aoocmb
 * @param params
 */
export const api_cash = params => Utils.http('/v1/finance/withdraw', params);

/**
 * 个人订单列表
 * @link https://www.yuque.com/kvxnmz/gfboxd/ibrkyi
 * @param params
 */
export const api_selfOrder = params => Utils.http('/v1/order/take', params);

/**
 * 个人订单详情
 * @link https://www.yuque.com/kvxnmz/gfboxd/nzt9cd
 * @param params
 */
export const api_selfOrderDetail = params => Utils.http('/v1/order/take/show', params);

/**
 * 帮助列表
 * @link https://www.yuque.com/kvxnmz/gfboxd/pwapl3
 * @param params
 */
export const api_help = params => Utils.http('/v1/help', params);

/**
 * 帮助详情
 * @link https://www.yuque.com/kvxnmz/gfboxd/if8cth
 * @param params
 */
export const api_helpDetails = params => Utils.http('/v1/help/show', params);

/**
 * 公告中心
 * @link https://www.yuque.com/kvxnmz/gfboxd/stthgw
 * @param params
 */
export const api_notice = params => Utils.http('/v1/notice', params);

/**
 * 公告中心
 * @link https://www.yuque.com/kvxnmz/gfboxd/gzqtt6
 * @param params
 */
export const api_noticeDetails = params => Utils.http('/v1/notice/show', params);

/**
 * 接单
 * @link https://www.yuque.com/kvxnmz/gfboxd/xp8r9b
 * @param params
 */
export const api_operationOrder = params => Utils.http('/v1/order/operation/take', params);
