/**
 * @description 平台兼容TS框架 各个平台兼容的方法可以写在该处 使用tsc platform.ts编译后生成的js内容
 * @author lzj
 * @date 2023/07/15
 */

declare let uni: any,
    BaseCode: any,
    UniPlatformCode: any,
    getPlatform: any,
    log: any;

//#region 登录区域

/**
 * @description 业务平台通用类
 */
interface PlatformConfig {
    platform: string,
}
class PlatformClass {
    // > 平台&平台配置
    private platform: String = null;
    private platformConfig: PlatformConfig = null;

    // > 构造函数
    constructor(config?: PlatformConfig) {
        this.platform = config?.platform;
        this.platformConfig = config;
    }

    // > 初始化配置
    InitConfig(): Promise<any> {
        return new Promise((resolve, reject) => { resolve(null); });
    }

    // > 登陆
    SignIn(config?: PlatformConfig): Promise<any> {
        return new Promise((resolve, reject) => { resolve(null); });
    }
}

/**
 * @description 微信平台通用类
 */
interface WeChatConfig extends PlatformConfig {
    appId: String,
    secret: String,
}
class WeChatPlatformClass extends PlatformClass {
    // > 微信小程序获取的编码
    private code: string = null;

    constructor(config?: PlatformConfig) {
        super(config);
    }

    InitConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.code) {
                resolve(this.code);
                log.debug("WeChatPlatformClass.InitConfig.code=>", this.code);
                return;
            }
            uni.login({
                success(res: any) {
                    log.debug("WeChatPlatformClass.InitConfig.code=>", res);
                    this.code = res && res.code;
                    resolve(res);
                },
                fail(err: any) {
                    log.error("WeChatPlatformClass.InitConfig.code=>", err);
                    reject(err);
                }
            });
        });
    }

    SignIn(config?: WeChatConfig): Promise<any> {
        return new Promise((resolve, reject) => {
            let wechatConfig = uni.getStorageSync(BaseCode.webConfig);
            
        });
    }
}

/**
 * @description 平台工厂类
 */
export class PlatformFactory {
    static _instance = null;

    /**
     * @description 获取平台类实例
     * @param {PlatformConfig} config 平台实例化配置
     * @returns {PlatformClass} Instance
     */
    static GetPlatformInstance(config?: PlatformConfig) {
        let platform = getPlatform();
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
}
//#endregion
