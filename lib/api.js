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
 * @link https://www.yuque.com/kvxnmz/gfboxd/ot2umb
 * @param params
 */
export const api_certificationProfile = params => Utils.http('/v1/profile/certification', params);

/**
 * 充值
 * @link https://www.yuque.com/kvxnmz/gfboxd/bflv9r
 * @param params
 */
export const api_recharge = params => Utils.http('/v1/finance/recharge', params);