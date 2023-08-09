# srm_mob

供应商协同移动端

# 一、规范

# 二、结构说明(srm_mob)
│  .gitignore  > git忽略文件
│  babel.config.js
│  jsconfig.json
│  package.json
│  postcss.config.js  > css处理
├─public
│      index.html  > html模板
└─src
    │  App.vue  > 根组件
    │  main.js  > 项目入口文件
    │  manifest.json  > 基础配置文件
    │  pages.json  > 所有页面存放的目录
    │  uni.promisify.adaptor.js
    │  uni.scss
    ├─ lib
    │  │  WXBizDataCrypt.js  > 微信加解密相关
    ├─pages  > 业务页面
    │  └─index
    │          index.vue   
    ├─static
    │  │  config.json  > 站点配置文件
    │  ├─css
    │  │      common.scss  > 通用css文件
    │  ├─font  > 字体图标
    │  └─images  > 图片存放目录
    │          logo.png
    └─utils  > 通用工具方法
            api.js  > 全局API请求:所有用到的API统一放在该文件,便于管理
            bizutil.js  > 业务通用方法,涉及到的业务方法放该处
            codetable.js  > 代码表,涉及全局的一些通用枚举定义
            core.js  > core文件:一些核心方法写在此处(如http请求)
            platform.ts > ts写法生成js文件
            util.js  > 通用方法

# 三、VUE实例挂载说明
1.vue实例调用http服务：this.http
2.vue实例调用log服务：this.log
3.vue实例调用WebConfig配置：this.WebConfig