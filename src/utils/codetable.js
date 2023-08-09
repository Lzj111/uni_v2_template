/**
 * @description 代码表 全局常量定义
 * @author lzj
 * @date 2023/07/13
 */

// > 基础代码表 系统使用的
const BaseCode = {
    // > 配置文件属性
    webConfig: "WebConfig",
    // > 授权码属性
    authorization: "Authorization",
    // > 入口文件参数
    appOptions: "AppOptions",
    // > 用户信息属性
    userInfo: "UserInfo",
    // > 实名认证配置属性
    authenticationConfig: "authenticationConfig",
    // > 首页参数标识
    identityKey: "contractId",
}

// > uni平台编码
const UniPlatformCode = {
    "VUE3": "VUE3", // HBuilderX 3.2.0+ 详情
    "APP-PLUS": "APP-PLUS", // App
    "APP-PLUS-NVUE": "APP-PLUS-NVUE", // App nvue 页面
    "APP-NVUE": "APP-NVUE", // App nvue 页面
    "APP-ANDROID": "APP-ANDROID", // App Android 平台 仅限 uts文件
    "APP-IOS": "APP-IOS", // App iOS 平台 仅限 uts文件
    "H5": "H5", // H5
    "MP-WEIXIN": "MP-WEIXIN", // 微信小程序
    "MP-ALIPAY": "MP-ALIPAY", // 支付宝小程序
    "MP-BAIDU": "MP-BAIDU", // 百度小程序
    "MP-TOUTIAO": "MP-TOUTIAO", // 抖音小程序
    "MP-LARK": "MP-LARK", // 飞书小程序
    "MP-QQ": "MP-QQ", // QQ小程序
    "MP-KUAISHOU": "MP-KUAISHOU", // 快手小程序
    "MP-JD": "MP-JD", // 京东小程序
    "MP-360": "MP-360", // 360小程序
    "MP": "MP", // 微信小程序/支付宝小程序/百度小程序/抖音小程序/飞书小程序/QQ小程序/360小程序
    "QUICKAPP-WEBVIEW": "QUICKAPP-WEBVIEW", // 快应用通用(包含联盟、华为)
    "QUICKAPP-WEBVIEW-UNION": "QUICKAPP-WEBVIEW-UNION", // 快应用联盟
    "QUICKAPP-WEBVIEW-HUAWEI": "QUICKAPP-WEBVIEW-HUAWEI", // 快应用华为
}

// > uni服务类型
const UniServiceType = {
    "oauth": "oauth", // 授权登录
    "share": "share", //	分享
    "payment": "payment", // 支付
    "push": "push", // 推送
}

// > 微信状态码
const WeChatStatusCode = {
    // > 小程序未认证企业版
    "failNoPermission": "getPhoneNumber:fail no permission",
    "failNoPermissionMsg": "未认证企业版",
    // > 用户拒绝授权
    "failUserDeny": "getPhoneNumber:fail user deny",
    "failUserDenyMsg": "用户拒绝授权",
}

// > 静态文件映射关系
const StaticFileMapping = {
    "logo": "logo.png",
    "banner": "banner.png",
    "frame": "frame.png",
    "noteSign": "note-sign.png",
    "signed": "signed.png",
    "unsigned": "unsigned.png",
    "rejected": "rejected.png",
    "checkSuccess": "check-success.png",
    "emptyImg": "empty.png",
    "serverErrorImg": "server_error.png",
    "noResultImg": "no_result.png",
    "lockedImg": "locked.png",
}

// > 页面消息码
const PageEmitCode = {
    // > 绑定手机号消息
    "confirmBindPhone": "confirmBindPhone",
    // > 签名完成后返回
    "signatureComplete": "signatureComplete",
    // > pop弹窗消息码
    "popupBtnClick": "popupBtnClick",
    // > 发送短信消息码
    "sendSmsClick": "sendSmsClick",
    // > 获取短信验证码
    "getSmsCode": "getSmsCode",
    // > 签署(通过/拒签)后消息码
    "signingResult": "signingResult",
    // > 实名认证后返回
    "nameAuthentication": "nameAuthentication",
    // > 签署图片参数通知(签署跳到新页面)
    "signingImgParams": "signingImgParams",
}

export {
    BaseCode,
    UniPlatformCode,
    UniServiceType,
    WeChatStatusCode,
    StaticFileMapping,
    PageEmitCode,
}