/**
 * @description core.js 核心js
 * @author lzj
 * @date 2023/07/07
 */

"use strict";

import {
    BaseCode
} from "./codetable";

//#region 内置工具函数
/**
 * @description 设置属性给对象(兼容处理)
 * @param {Object} obj 更新的对象
 * @param {String} propertyName 属性名
 * @param {any} propertyValue 属性值
 * @param {Boolean} isReadOnly 只读
 */
const _SetProperty2Object = function (obj, propertyName, propertyValue, isReadOnly = false) {
    Object.defineProperty || function (obj, pName, attrs) {
        obj[pName] = attrs.value;
    };
    Object.defineProperty(obj, propertyName, {
        value: propertyValue,
        writable: !isReadOnly
    });
};
//#endregion

//#region 通用日志相关
const _Log = function (logLevel) {
    this._logLevel = logLevel;
}
_Log.prototype._showLog = function (consoleFun, title, msg) {
    let vStyle = "border-radius:3px;color:#ffffff;background:olive;";
    if (title == undefined || title == null) {
        consoleFun("%c$" + msg, vStyle);
    } else {
        consoleFun("%c$" + title, vStyle, msg);
    }
}
_Log.prototype.debug = function (title, msg) {
    ["debug", "info"].indexOf(this._logLevel) != -1 && this._showLog(console && console.log, title, msg);
};
_Log.prototype.error = function (title, msg) {
    this._logLevel == "error" && this._showLog(console && console.error, title, msg);
}
const log = new _Log(WebConfig.logLevel);
//#endregion

//#region 配置文件相关
// > 读取&设置配置文件
import WebConfig from "@/static/config.json";
const _SetConfig = function (config) {
    log.debug("core._SetConfig.config=>", config);
    try {
        uni.setStorageSync(BaseCode.webConfig, config);
    } catch (error) {
        throw new Error("core._SetConfig.error=>" + error);
    }
}
_SetConfig(WebConfig);
//#endregion

//#region 通用请求相关
// > 加载框提示
const _LoadingBox = (function () {
    let loadingCount = 0;
    /**
     * @description 显示加载框
     * @param {Boolean} isLoading 是否显示加载框
     * @param {String} msg 加载框提示语
     */
    let showLoading = function (isLoading, msg) {
        if (isLoading) {
            uni.showLoading({
                title: msg || "加载中",
            });
            loadingCount += 1;
        }
    }
    // >> 隐藏加载框
    let hideLoading = function () {
        loadingCount -= 1;
        if (loadingCount <= 0) {
            uni.hideLoading();
            loadingCount = 0;
        }
    }

    return {
        showLoading,
        hideLoading,
    }
}());

// > 失败的处理方法
const _FunReject = (reject, err) => {
    const {
        errmsg = '操作异常', errno = -1,
    } = err;
    switch (errno) {
        default:
            uni.showToast({
                title: errmsg,
                icon: 'none',
            });
            break;
    }
    reject(err);
}

/**
 * @description 基础请求方法
 * @param {String} method  请求类型  'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined,
 * @param {String} url 请求地址 
 * @param {Object} params 请求数据
 * @param {Object} config 请求扩展配置
 * @param {Map<String,String>} config.contentType 请求头类型 默认"application/json; charset=utf-8" 支持传入"application/x-www-form-urlencoded"
 * @param {Map<String,String>} config.hasAuthorization 请求头是否带上Authorization 默认带传false取消
 * @param {Map<String,Boolean>} config.hasBearer 是否要Bearer 默认带false取消
 * @param {Map<String,Number>} config.timeout 请求超时时间 默认30000
 * @param {Map<String,String>} config.baseURL 自定义域名
 * @param {Map<String,Boolean>} config.isLoading true时显示接口请求加载框 false不显示
 * @param {Map<String,String>} config.loadingMsg 加载框提示语
 * @param {Map<String,Object>} config.originResponse 原始响应 默认fasel
 * @returns 
 */
const _BaseRequest = function (method, url, params, config = {}) {
    return new Promise((resolve, reject) => {
        log.debug("core._BaseRequest.parameter=>", {
            method,
            url,
            params,
            config,
        });

        // > 显示请求遮罩
        _LoadingBox.showLoading(config.isLoading, config.loadingMsg);

        // > 兼容API地址
        if (url.charAt(0) != "/") url = "/" + url;

        // > 处理请求扩展配置
        const baseURL = config.baseURL || WebConfig.webApi;
        const contentType = config.contentType || "application/json; charset=utf-8";
        const hasAuthorization = config.hasAuthorization == false ? false : true;
        const timeout = config.timeout || 30000;
        let headers = {
            'content-type': contentType,
        };
        // > 追加accesstoken
        if (hasAuthorization) {
            const tokenValue = uni.getStorageSync(BaseCode.authorization);
            let hasBearer = config.hasBearer == false ? false : true;
            headers[BaseCode.authorization] = (hasBearer ? "Bearer " : "") + tokenValue;
        }

        // > uniapi请求的配置
        let requestOptions = {
            url: baseURL + url,
            method,
            timeout: timeout,
            header: headers,
            data: params,
            success: (result) => {
                log.debug("core._BaseRequest.success=>", result);
                if (result.statusCode >= 200 && result.statusCode < 400) {
                    let responseDate = config.originResponse ? result.data : result.data.data;
                    resolve(responseDate);
                } else {
                    let errmsg = result.data && result.data.msg || "操作异常";
                    let errCode = result.data && result.data.code || -1;
                    _FunReject(reject, {
                        errno: errCode,
                        errmsg: errmsg
                    });
                }
            },
            fail: (error) => {
                log.debug("core._BaseRequest.fail=>", error);
                _FunReject(reject, {
                    errno: -1,
                    errmsg: '网络不给力,请检查你的网络设置'
                }, );
            },
            complete: (data) => {
                _LoadingBox.hideLoading();
            }
        }
        // > uniapi发起网络请求
        uni.request(requestOptions);
    });
}

/**
 * @description http请求
 */
// const _Http = /** @class */ (function () {
//     function _Http() {}
//     _Http.prototype.get = (url, params, config) => _BaseRequest("GET", url, params, config);
//     _Http.prototype.post = (url, params, config) => _BaseRequest("POST", url, params, config);
//     _Http.prototype.options = (url, params, config) => _BaseRequest("OPTIONS", url, params, config);
//     _Http.prototype.put = (url, params, config) => _BaseRequest("PUT", url, params, config);
//     _Http.prototype.delete = (url, params, config) => _BaseRequest("DELETE", url, params, config);
//     return _Http;
// }());
const _Http = () => {};
_Http.prototype.get = (url, params, config) => _BaseRequest("GET", url, params, config);
_Http.prototype.post = (url, params, config) => _BaseRequest("POST", url, params, config);
_Http.prototype.options = (url, params, config) => _BaseRequest("OPTIONS", url, params, config);
_Http.prototype.put = (url, params, config) => _BaseRequest("PUT", url, params, config);
_Http.prototype.delete = (url, params, config) => _BaseRequest("DELETE", url, params, config);
const http = new _Http();
//#endregion

export {
    WebConfig,
    _SetConfig as SetConfig,
    http,
    log,
    _LoadingBox as loadingBox,
}