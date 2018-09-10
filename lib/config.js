/**
 * api base url 配置
 * @type {number}
 */

/**
 * ====== @@@@@@@@==== !!! 部署之前必改 !!! ======@@@@@@@@ ======
 * @type {number}
 */
const ENVIROMENT_CODE = 0;  // 0: 测试环境  1: 正式环境

/**
 * ====== 正式线 API_BASE_URL ======
 * @type {string}
 */
const PRODUCTION_API_BASEURL = 'https://apiwz.38sd.com';

/**
 * ====== 测试线 API_BASE_URL ======
 * @type {string}
 */
const TEST_API_BASEURL = 'https://apiwz.38sd.com';


/**
 * ====== 环境识别码 ======
 * @type {string}
 */
export const ENVIROMENT = ENVIROMENT_CODE === 0 ? 'developer' : 'production';

/**
 * ====== 全局API_BASE_URL ======
 * @type {string}
 */
export const BASE_URL = ENVIROMENT === 'developer' ? TEST_API_BASEURL : PRODUCTION_API_BASEURL;

