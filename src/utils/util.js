/**
 * @description utils.js 通用工具方法
 * @author lzj
 * @date 2023/07/07
 */

"use strict";
//#region 类型校验相关
/**
 * @description 获取数据类型——返回类型的小写形式,eg:array|function|promise
 * @param {Object} sourceObj 入参
 * @returns {String} 
 */
const getDataType = function (sourceObj) {
    return Object.prototype.toString.call(sourceObj).toLocaleLowerCase();
};
/**
 * @description 入参是否为对象
 * @param {Object} sourceObj 入参
 * @returns {Boolean}
 */
const isObject = function (sourceObj) {
    return getDataType(sourceObj) === "[object object]";
};
/**
 * @description 入参是否为数组
 * @param {Object} sourceObj 入参
 * @returns {Boolean}
 */
const isArray = function (sourceObj) {
    return getDataType(sourceObj) === "[object array]";
};
/**
 * @description 入参是否为字符串
 * @param {Object} sourceObj 入参
 * @returns {Boolean}
 */
const isString = function (sourceObj) {
    return getDataType(sourceObj) === "[object string]";
};
/**
 * @description 入参是否为数值
 * @param {Object} sourceObj 入参
 * @returns {Boolean}
 */
const isNumber = function (sourceObj) {
    return getDataType(sourceObj) === "[object number]";
};
/**
 * @description 入参是否为null||""||undefined
 * @param {Object} sourceObj 入参
 * @returns {Boolean}
 */
const isNullOrEmpty = function (sourceObj) {
    if (null == sourceObj || undefined == sourceObj)
        return true;
    else if (isString(sourceObj)) {
        return sourceObj.toString().trim() === '';
    } else {
        return false;
    }
};
//#endregion

//#region 其他验证
/**
 * @description 是否为手机号
 * @param {String} phone 
 * @returns 
 */
const isMobileNumber = function (phone) {
    var rtnVal = false;
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
    if (phone == '') {
        rtnVal = "手机号码不能为空";
    } else if (phone.length != 11) {
        rtnVal = "请输入11位手机号码";
    } else if (!myreg.test(phone)) {
        rtnVal = "请输入有效的手机号码";
    } else {
        rtnVal = true;
    }
    return rtnVal;
}

/**
 * @description 判断身份证号码
 * @param {String} card 
 * @param {Boolean} toast
 * @returns 
 */
const isCardNo = (card, toast = false) => {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (reg.test(card) === false) {
        if (toast) uni.showToast({
            title: "身份证号码有误",
            icon: "none"
        });
        return false
    } else {
        return true
    }
}

/**
 * @description 判断是否中文
 * @param {String} str 
 * @returns 
 */
const isChinese = str => {
    var reg = /^[\u4E00-\u9FA5]+$/;
    return reg.test(str)
}

/**
 * @description 判断是否为邮箱
 * @param {String} str 
 * @param {Boolean} toast
 * @returns 
 */
const isEmail = (str, toast = false) => {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (reg.test(str)) {
        return true;
    } else {
        if (toast) uni.showToast({
            title: "邮箱有误",
            icon: "none"
        });
        return false;
    }
}

//#endregion

//#region 地址栏操作函数
/**
 * @description 获取url参数
 * @deprecated
 * @param {String} url url地址
 * @param {String} property 查询属性
 * @returns {String}
 */
const getUrlParamByKey = function (url, property) {
    var reg = new RegExp("(^|\\?|&)" + property + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(url))
        return unescape(RegExp.$2.replace(/\+/g, " "));
    return null;
}

/**
 * @description 获取url地址参数对象(正则表达式) 包含hash之后的值
 * @param {String} url 源地址
 * @param {Boolean} appendPrefix 是否追加前缀?
 * @returns {Object} params 返回的对象
 */
const getUrlParamsRegex = function (url, appendPrefix = false) {
    // > 自动追加?
    if (appendPrefix && url.indexOf("?") == -1) {
        url = "?" + url;
    }

    let paramsObj = {};
    if (url.indexOf("?") > -1) {
        let str = url.slice(url.indexOf("?") + 1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            // > 如果出现乱码的话，可以用decodeURI()进行解码
            paramsObj[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
    }
    return paramsObj;
}

/**
 * @description 获取URL实例对象
 * @param {String} url url地址
 * @param {Boolean} containHashParams 包含hash之后的地址栏参数
 * @returns {URL} URL
 */
const getURLInstance = function (url, containHashParams = true) {
    let urlIns = new URL(url);
    // > 不存在hash返回
    if (isNullOrEmpty(urlIns.hash)) return urlIns;
    // > 不存在地址参数返回
    if (url.indexOf("?") == -1) return urlIns;
    // > 不需要hash(#后面的参数)返回
    if (!containHashParams) return urlIns;

    // > 拼接参数
    let tempUrl = urlIns.origin + urlIns.hash.substring(urlIns.hash.indexOf("?"));
    let params = getUrlParamsRegex(tempUrl);
    for (let key in params) {
        urlIns.searchParams.set(key, params[key]);
    }
    return urlIns;
}

/**
 * @description 获取url地址参数对象
 * @param {String} url 源地址
 * @returns {Object} params 返回的对象
 */
const getUrlParams = function (url) {
    let urlIns = getURLInstance(url);
    let params = {};
    for (const [key, value] of urlIns.searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

/**
 * @description 获取url地址中的某个参数值
 * @param {String} url 源地址
 * @param {String} property 查询的属性
 * @returns {String} 
 */
const getUrlParam = (url, property) => {
    let urlIns = getURLInstance(url);
    return urlIns.searchParams.get(property);
}

/**
 * @description 拼接地址参数
 * @param {String} url 地址
 * @param {Object} parameters 拼接到地址栏后面的参数对象
 */
const joinUrlParameters = function (url, parameters) {
    if (!objContainElement(parameters)) return url;

    // > 追加新参数
    let appendParamsStr = "";
    for (let key in parameters) {
        appendParamsStr += "&" + key + "=" + parameters[key];
    }

    // > 原始地址不包含地址参数
    if (url.indexOf("?") == -1) {
        url += "?";
        appendParamsStr = appendParamsStr.substring(1);
    }
    url += appendParamsStr;
    return url;
}
//#endregion

//#region UNI系统函数封装(非uni项目使用不了)
/**
 * @description uni获取平台类型
 * @returns 
 */
const getPlatform = function () {
    let platform = null;
    // #ifdef VUE3
    platform = "VUE3"; // HBuilderX 3.2.0+
    // #endif
    // #ifdef APP-PLUS
    platform = "APP-PLUS"; // App
    // #endif
    // #ifdef APP-PLUS-NVUE
    platform = "APP-PLUS-NVUE"; // App nvue 页面
    // #endif
    // #ifdef APP-NVUE
    platform = "APP-NVUE"; // App nvue 页面
    // #endif
    // #ifdef APP-ANDROID
    platform = "APP-ANDROID"; // App Android 平台 仅限 uts文件
    // #endif
    // #ifdef APP-IOS
    platform = "APP-IOS"; // App iOS 平台 仅限 uts文件
    // #endif
    // #ifdef H5
    platform = "H5"; // H5
    // #endif
    // #ifdef MP-WEIXIN
    platform = "MP-WEIXIN"; // 微信小程序
    // #endif
    // #ifdef MP-ALIPAY
    platform = "MP-ALIPAY"; // 支付宝小程序
    // #endif
    // #ifdef MP-BAIDU
    platform = "MP-BAIDU"; // 百度小程序
    // #endif
    // #ifdef MP-TOUTIAO
    platform = "MP-TOUTIAO"; // 抖音小程序
    // #endif
    // #ifdef MP-LARK
    platform = "MP-LARK"; // 飞书小程序
    // #endif
    // #ifdef MP-QQ
    platform = "MP-QQ"; // QQ小程序
    // #endif
    // #ifdef MP-KUAISHOU
    platform = "MP-KUAISHOU"; // 快手小程序
    // #endif
    // #ifdef MP-JD
    platform = "MP-JD"; // 京东小程序
    // #endif
    // #ifdef MP-360
    platform = "MP-360"; // 360小程序
    // #endif
    // #ifdef QUICKAPP-WEBVIEW
    platform = "QUICKAPP-WEBVIEW"; // 快应用通用(包含联盟、华为)
    // #endif
    // #ifdef QUICKAPP-WEBVIEW-UNION
    platform = "QUICKAPP-WEBVIEW-UNION"; // 快应用联盟
    // #endif
    // #ifdef QUICKAPP-WEBVIEW-HUAWEI
    platform = "QUICKAPP-WEBVIEW-HUAWEI"; // 快应用华为
    // #endif
    return platform;
}

/**
 * @description 文件路径转base64格式
 * @param {String} path 
 */
const filePathToBase64 = function (path) {
    return new Promise(function (resolve, reject) {
        // > base64直接返回
        if (path.indexOf("data:image") != -1) {
            resolve(path);
            return;
        }
        // > app端
        if (typeof plus === 'object') {
            plus.io.resolveLocalFileSystemURL(path, function (entry) {
                entry.file(function (file) {
                    var fileReader = new plus.io.FileReader()
                    fileReader.onload = function (evt) {
                        resolve(evt.target.result)
                    }
                    fileReader.onerror = function (error) {
                        reject(error)
                    }
                    fileReader.readAsDataURL(file)
                }, function (error) {
                    reject(error)
                })
            }, function (error) {
                reject(error)
            })
            return;
        }

        // > 微信小程序
        if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
            wx.getFileSystemManager().readFile({
                filePath: path,
                encoding: 'base64',
                success: function (res) {
                    resolve('data:image/png;base64,' + res.data)
                },
                fail: function (error) {
                    reject(error)
                }
            })
            return;
        }
        // ...
        reject(new Error('not support'));
    });
}

/**
 * @description 将base64转为临时的文件
 * @param {String} base64Str
 * @returns 
 */
const base64ToTempFilePath = function (base64Str) {
    return new Promise(function (resolve, reject) {
        // > 微信小程序
        if (typeof wx === 'object') {
            try {
                const time = new Date().getTime();
                const imgPath = wx.env.USER_DATA_PATH + "/poster" + time + "share" + ".png";
                // >> 如果图片字符串不含要清空的前缀,可以不执行下行代码.
                const imageData = base64Str.replace(/^data:image\/\w+;base64,/, "");
                const file = wx.getFileSystemManager();
                file.writeFileSync(imgPath, imageData, "base64");
                // >> 清理本地文件
                // file.removeSavedFile({
                //     filePath: imgPath,
                // });
                resolve(imgPath);
            } catch (error) {
                // >> 解析失败返回原数据
                resolve(base64Str);
            }
            return;
        } else {
            resolve(base64Str);
        }
    });
}

//#endregion

//#region 数据方法函数
/**
 * @description 对象数组根据对象内某个属性倒序
 * @param {String} property 属性名称
 * @param {String} sortType 排序规则  0正序 1倒序
 * @return {function} 用于数组的sort方法使用
 */
const sortByProp = function (property, sortType) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (sortType == '0') {
            return value1 - value2
        } else {
            return value2 - value1;
        }
    }
};

/**
 * @description 深拷贝对象
 * @param {Object} obj 需要深拷贝的数据
 * @return {Object} 返回深拷贝结果
 */
const deepCopy = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * @description 根据属性和值获取数组中对应对象的索引
 * @param {Array} array 数组对象
 * @param {String} propertyKey 查询的属性key
 * @param {String} propertyValue 查询的属性值
 * @returns {Number} index 索引
 */
const getArrayIndex = function (array, propertyKey, propertyValue) {
    if (!isArray(array)) return -1;
    let index = -1;
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element[propertyKey] == propertyValue) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * @description 根据属性和值获取数组中对应对象的索引
 * @param {Array} array 数组对象
 * @param {String} propertyKey 查询的属性key
 * @param {String} propertyValue 查询的属性值
 * @returns {Object} 查询到的对象
 */
const getArrayItem = function (array, propertyKey, propertyValue) {
    let index = getArrayIndex(array, propertyKey, propertyValue);
    if (index == -1) return null;
    return array[index];
}

/**
 * @description 防抖
 * @param {Function} fn 回调函数
 * @param {Number} delay 时间延迟(毫秒ms)
 * @returns {Function}
 */
const debounce = (fun, time = 500) => {
    let timer = null;
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fun();
            timer = null;
        }, time);
    }
}

/**
 * @description 对象是否包含元素项目
 * @param {any} sourceObj 传入参数
 * @returns {Boolean}
 */
const objContainElement = function (sourceObj) {
    if (!isObject(sourceObj)) return false;
    if (Object.keys(sourceObj).length == 0) return false;
    return true;
}

/**
 * @description 手机号码脱敏
 * @param {String} number
 * @param {String} size *数量
 * @returns 
 */
const phoneNuberConvert = function (number, size = 4) {
    if (!number) return number;
    if (isNumber(number)) number = "" + number;
    let pat = /(\d{3})\d*(\d{4})/;
    let result = number.replace(pat, `$1${"".padStart(size, "*")}$2`);
    return result;
}

/**
 * @description 获取文件的后缀名称
 * @param {String} fileName 
 */
const getFileExt = function (fileName) {
    return fileName.split('.');
}

//#endregion

export {
    getDataType,
    isObject,
    isArray,
    isString,
    isNumber,
    isNullOrEmpty,
    isMobileNumber,
    isCardNo,
    isChinese,
    isEmail,
    sortByProp,
    deepCopy,
    getArrayIndex,
    getArrayItem,
    debounce,
    objContainElement,
    getURLInstance,
    getUrlParams,
    getUrlParam,
    getUrlParamsRegex,
    joinUrlParameters,
    getPlatform,
    filePathToBase64,
    phoneNuberConvert,
    getFileExt,
    base64ToTempFilePath,
}