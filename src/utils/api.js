/**
 * @description api.js 全局API请求统一在此定义便于后期维护
 * @author lzj
 * @date 2023/07/07
 */

"use strict";

import {
    http,
} from "./core";

/**
 * @description 参考示例
 * @param {Object} params 
 * @returns {Promise}
 */
const test = (params) => {
    let url = "/api/login";
    return http.post(url, params, {
        isLoading: true,
        hasAuthorization: false
    });
}

export {
    test
}