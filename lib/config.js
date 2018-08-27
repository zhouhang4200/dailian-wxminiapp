/**
 * api base url 配置
 * @type {number}
 */

const ENVIROMENT_CODE = 0; // 0: 测试环境  1: 正式环境
export const ENVIROMENT = ENVIROMENT_CODE === 0 ? 'developer' : 'production';
// api base url
const PRODUCTION_API_BASEURL = 'https://apiwz.38sd.com';
const TEST_API_BASEURL = 'https://apiwz.38sd.com';
export const BASE_URL = ENVIROMENT === 'developer' ? TEST_API_BASEURL : PRODUCTION_API_BASEURL;