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
export const api_sendRegisterPhoneCode = params => Utils.http('/v1/verification-code', {type: 1, ...params});

/**
 * 发送 找回登录密码手机验证码
 * @link https://www.yuque.com/kvxnmz/gfboxd/bngrmk
 * @param params
 */
export const api_sendFindLoginPasswordPhoneCode = params => Utils.http('/v1/verification-code', {type: 2, ...params});

/**
 * 发送 找回找回支付密码
 * @link https://www.yuque.com/kvxnmz/gfboxd/bngrmk
 * @param params
 */
export const api_sendFindPayPasswordPhoneCode = params => Utils.http('/v1/verification-code', {type: 3, ...params});

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
 * 订单申请验收(打手)
 * @link https://www.yuque.com/kvxnmz/gfboxd/grgtvd
 * @param params
 */
export const api_orderOperationApplyComplete = params => Utils.http('/v1/order/operation/apply-complete', params);

/**
 * 订单申请协商(打手)
 * @link https://www.yuque.com/kvxnmz/gfboxd/sfheal
 * @param params
 */
export const api_orderOperationApplyConsult = params => Utils.http('/v1/order/operation/apply-consult', params);

/**
 * 取消协商(打手)
 * @link https://www.yuque.com/kvxnmz/gfboxd/urvll9
 * @param params
 */
export const api_orderOperationCancelConsult = params => Utils.http('/v1/order/operation/cancel-consult', params);

/**
 * 取消仲裁(打手)
 * @link https://www.yuque.com/kvxnmz/gfboxd/lwgbza
 * @param params
 */
export const api_orderOperationCancelComplain = params => Utils.http('/v1/order/operation/cancel-complain', params);

/**
 * 获取仲裁信息
 * @link https://www.yuque.com/kvxnmz/gfboxd/wy2u3t
 * @param params
 */
export const api_orderOperationComplainInfo = params => Utils.http('/v1/order/operation/get-complain-info', params);

/**
 * 补充仲裁证据
 * @link https://www.yuque.com/kvxnmz/gfboxd/efkztl
 * @param params
 */
export const api_orderOperationSendComplainMessage = params => Utils.http('/v1/order/operation/send-complain-message', params);

/**
 * 取消异常(打手)
 * @link https://www.yuque.com/kvxnmz/gfboxd/lwgbza
 * @param params
 */
export const api_orderOperationCancelAnomaly = params => Utils.http('/v1/order/operation/cancel-anomaly', params);

/**
 * 同意协商(打手)
 * @link https://www.yuque.com/kvxnmz/gfboxd/vzcsmv
 * @param params
 */
export const api_orderOperationAgreeConsult = params => Utils.http('/v1/order/operation/agree-consult', params);

/**
 * 不同意协商(打手)
 * @link https://www.yuque.com/kvxnmz/gfboxd/tytaeo
 * @param params
 */
export const api_orderOperationRejectComplain = params => Utils.http('/v1/order/operation/reject-consult', params);

/**
 * 订单申请仲裁(打手)
 * @link https://www.yuque.com/kvxnmz/gfboxd/vkg393
 * @param params
 */
export const api_orderOperationApplyComplain = params => Utils.http('/v1/order/operation/apply-complain', params);

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
 * 公告中心详情
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

/**
 * 查看验收图片
 * @link https://www.yuque.com/kvxnmz/gfboxd/twrlfd
 * @param params
 */
export const api_operationApplyCompleteImage = params => Utils.http('/v1/order/operation/apply-complete-images', params);

/**
 * 获取订单留言详情
 * @link https://www.yuque.com/kvxnmz/gfboxd/qrnfl7
 * @param params
 */
export const api_getOrderOperationGetMessage = params => Utils.http('/v1/order/operation/get-message', params);

/**
 * 获取订单留言列表
 * @link https://www.yuque.com/kvxnmz/gfboxd/lfbgze
 * @param params
 */
export const api_getMessageList = params => Utils.http('/v1/message', params);

/**
 * 发送订单留言
 * @link https://www.yuque.com/kvxnmz/gfboxd/deaziv
 * @param params
 */
export const api_sendOrderOperationGetMessage = params => Utils.http('/v1/order/operation/send-message', params);

/**
 * 找回登录密码
 * @link https://www.yuque.com/kvxnmz/gfboxd/bczp2e
 * @param params
 */
export const api_findLoginPassword = params => Utils.http('/v1/password/refund', params);

/**
 * 修改登录密码
 * @link https://www.yuque.com/kvxnmz/gfboxd/ye4xcd
 * @param params
 */
export const api_updateLoginPassword = params => Utils.http('/v1/password/reset', params);

/**
 * 找回支付密码
 * @link https://www.yuque.com/kvxnmz/gfboxd/udgtes
 * @param params
 */
export const api_findPayPassword = params => Utils.http('/v1/profile/pay-password/refund', params);

/**
 * 修改支付密码
 * @link https://www.yuque.com/kvxnmz/gfboxd/dixs1a
 * @param params
 */
export const api_updatePayPassword = params => Utils.http('/v1/profile/pay-password/reset', params);

/**
 * 设置支付密码
 * @link https://www.yuque.com/kvxnmz/gfboxd/nsp2vo
 * @param params
 */
export const api_settingPayPassword = params => Utils.http('/v1/profile/pay-password/set', params);

/**
 * 获取 通过微信code 获取 openid
 * @link https://www.yuque.com/kvxnmz/gfboxd/oh9ov7
 * @param params
 */
export const api_getOpenId = params => Utils.http('/v1/code', params);

/**
 * 提现信息获取
 * @link https://www.yuque.com/kvxnmz/gfboxd/cuua3g
 * @param params
 * @returns {*}
 */
export const api_cashInfo = params => Utils.http('/v1/finance/withdraw-info', params);

/**
 * 留言消息统计
 * @link https://www.yuque.com/kvxnmz/gfboxd/cuua3g
 * @param params
 * @returns {*}
 */
export const api_totalMsg = params => Utils.http('/v1/message/count', params);

