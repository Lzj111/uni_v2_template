/**
 * @description bizUtil.ts 业务通用工具方法 *** 涉及到业务上的通用方法
 * @author lzj
 * @date 2023/07/07
 */
"use strict";

import {
    isNullOrEmpty,
    isObject,
    getPlatform,
    deepCopy,
    isNumber,
    isCardNo,
} from "./util";
import {
    BaseCode,
    UniPlatformCode,
    UniServiceType,
    WeChatStatusCode,
    StaticFileMapping,
} from "./codetable";
import {
    log,
    SetConfig,
    loadingBox,
} from "./core";
import {
    test,
} from "./api";
import {
    JSEncrypt
} from 'jsencrypt';

//#region 平台相关功能
let __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({
                    __proto__: []
                }
                instanceof Array && function (d, b) {
                    d.__proto__ = b;
                }) ||
            function (d, b) {
                for (var p in b)
                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

// > @description 基类
let PlatformClass = /** @class */ (function () {
    // > 构造函数
    function PlatformClass(config) {
        // > 平台&平台配置
        this.platform = config === null || config === void 0 ? void 0 : config.platform;
        this.platformConfig = config;
        // > uni服务供应商
        this.uniProvider = null;
        // > 用户信息
        this.userInfo = {
            // >> 服务商提供返回参数
            // face: "", // 头像
            gender: "", // 性别 
            extendData: {}, // 扩展配置(包含全部原始属性)
            // >>>>>>> API返回参数 <<<<<<<
            authStatus: 0, // 是否实名：0-否，1-是，默认0
            avatarUrl: null, // 微信头像
            name: "", // 姓名 
            nickName: null, // 微信昵称
            openid: "", // 微信标识 openid
            phone: "", // 手机号
            sessionKey: "", // 微信会话密钥 sessionKey
            token: "", // token
            twAutographId: null, /// 天威个人人名签ID
            twUserId: null, // 天威用户ID
            unionid: null, // 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台帐号下会返回 unionid
        }
        // > 配置文件webconfig配置
        this.webConfig = uni.getStorageSync(BaseCode.webConfig);
    }

    /**
     * @description 获取服务供应商
     * @param {UniServiceType} uniServiceType 服务类型，可取值见下面说明。
     */
    PlatformClass.prototype.uniGetProvider = function (uniServiceType) {
        uniServiceType = uniServiceType || UniServiceType.oauth;
        let _this = this;
        return new Promise(function (resolve, reject) {
            if (!isNullOrEmpty(_this.uniProvider)) {
                log.debug('PlatformClass.uniGetProvider.uniProvider=>', _this.uniProvider);
                resolve(_this.uniProvider);
                return;
            }
            uni.getProvider({
                service: uniServiceType,
                success: function (res) {
                    log.debug('PlatformClass.uniGetProvider.result=>', res);
                    let provider = res && res.provider && res.provider.length && res.provider[0] || null;
                    if (!isNullOrEmpty(provider)) {
                        _this.uniProvider = provider;
                        resolve(provider);
                    } else {
                        uni.showToast({
                            title: "服务供应商平台不支持",
                            icon: "none"
                        });
                        reject(1);
                    }
                },
                fail: function (err) {
                    uni.showToast({
                        title: err,
                        icon: "none"
                    });
                    log.error("PlatformClass.uniGetProvider.fail=>", err);
                    reject(err);
                }
            });
        });
    }

    // > uni的内置登录
    PlatformClass.prototype.uniLogin = function () {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.uniGetProvider(UniServiceType.oauth).then(provider => {
                uni.login({
                    provider: provider,
                    success: function (res) {
                        log.debug("PlatformClass.uniLogin.success=>", res);
                        resolve(res);
                    },
                    fail: function (err) {
                        uni.showToast({
                            title: err,
                            icon: "none"
                        });
                        log.error("PlatformClass.uniLogin.fail=>", err);
                        reject(err);
                    }
                });
            }, err => {
                log.error("PlatformClass.uniLogin.err=>", err);
                reject(err);
            });
        });
    }

    /**
     * @description uni获取各个平台用户信息
     * @param {Object} config 
     * @returns 
     */
    PlatformClass.prototype.uniGetUserInfo = function (config) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.uniGetProvider(UniServiceType.oauth).then(function (provider) {
                // 获取用户信息
                uni.getUserInfo({
                    provider: provider,
                    success: function (res) {
                        log.debug('PlatformClass.uniGetUserInfo.success=>', res);
                        resolve(res);
                    },
                    fail: function (err) {
                        log.debug('PlatformClass.uniGetUserInfo.error=>', err);
                        reject(null);
                    }
                });
            }, err => {
                log.debug('PlatformClass.uniGetUserInfo.error=>', err);
                reject(null);
            });
        });
    }

    /**
     * @description 平台通用-身份信息校验
     * @param {Object} identityInfo name:姓名 cardNum:身份证号
     */
    PlatformClass.prototype.commVerifyIdentity = function (identityInfo = {}) {
        let verifyState = true,
            errMsg = "";
        if (isNullOrEmpty(identityInfo.name)) {
            verifyState = false;
            errMsg = "姓名不能为空";
        } else if (isNullOrEmpty(identityInfo.cardNum)) {
            verifyState = false;
            errMsg = "身份证号不能为空";
        } else if (!isCardNo(identityInfo.cardNum)) {
            verifyState = false;
            errMsg = "身份证号有误";
        }
        if (!verifyState) {
            uni.showToast({
                title: errMsg,
                icon: "none"
            });
            return false;
        }
        return true;
    }

    /**
     * @description 平台不支持
     * @returns 
     */
    PlatformClass.prototype.commNotSupported = function () {
        let _this = this;
        return new Promise(function (resolve, reject) {
            uni.showToast({
                title: _this.platform + "平台尚未支持",
                icon: "none"
            });
            reject(null);
        });
    }

    /**
     * @description 页面支持分享
     * @returns 
     */
    PlatformClass.prototype.showShareMenu = function () {
        if (getPlatform() == UniPlatformCode["MP-WEIXIN"]) {
            // > 分享朋友圈
            typeof wx === 'object' && wx.showShareMenu({
                withShareTicket: true,
                menus: ["shareAppMessage", "shareTimeline"]
            });
        }
    }

    return PlatformClass;
}());

// > @description 微信平台通用类
let WeChatPlatformClass = /** @class */ (function (_super) {
    __extends(WeChatPlatformClass, _super);

    function WeChatPlatformClass(config) {
        var _this = _super.call(this, config) || this;
        // > 微信小程序获取的编码(用过一次就会过期)
        _this.code = null;
        // > 微信业务数据加解密
        return _this;
    }

    // > 获取webconfig中的微信配置(内部访问)
    WeChatPlatformClass.prototype._GetWeChatConfig = function (config = {}) {
        return tempWeChatConfig;
    }

    return WeChatPlatformClass;
}(PlatformClass));

// > @description 平台工厂类
let _PlatformFactory = function () {
    this._instance = null;
}
/**
 * @description 获取平台类实例
 * @param {PlatformConfig} config 平台实例化配置
 * @returns {PlatformClass} Instance
 */
_PlatformFactory.prototype.GetPlatformInstance = function (config = {}) {
    var platform = getPlatform();
    config.platform = platform;
    switch (platform) {
        case UniPlatformCode["MP-WEIXIN"]:
            this._instance = new WeChatPlatformClass(config);
            break;
        default:
            this._instance = new PlatformClass(config);
            break;
    }
    return this._instance;
}
let PlatformFactory = new _PlatformFactory();
//#endregion

//#region 业务方法相关
/**
 * @description 根据编码获取图片名称
 * @param {String} code StaticFileMapping.key 
 * @param {Number} size 大小 1|2
 */
const getImgNameByCode = function (code, size) {
    let imgName = StaticFileMapping[code];
    if (isNullOrEmpty(imgName)) return imgName;
    // > 验证size图标大小是否定义 拼接上-size
    if (isNumber(size)) {
        imgName = imgName.substring(0, imgName.lastIndexOf('.')) + "-" + size + imgName.substring(imgName.lastIndexOf('.'));
    }
    return imgName;
}

/**
 * @description 根据编码获取图片路径
 * @param {String} code StaticFileMapping.key 
 * @param {Number} size 大小 1 默认两倍图 不带2
 */
const getImgPathByCode = function (code, size) {
    let imgName = getImgNameByCode(code, size);
    return "/static/images/" + imgName;
}

/**
 * @description 获取webConfig
 */
const getWebConfig = function () {
    return uni.getStorageSync(BaseCode.webConfig);
}

/**
 * @description rsa解密
 * @param {String} str 加密的字符串
 * @returns
 */
const rsaDecrypt = function (str) {
    let config = getWebConfig(),
        crypt = new JSEncrypt();
    crypt.setKey(config.rsaPrivateKey);
    let dec = crypt.decrypt(str);
    return dec;
}

//#endregion
export {
    PlatformFactory,
    getImgNameByCode,
    getImgPathByCode,
    getWebConfig,
    rsaDecrypt,
}