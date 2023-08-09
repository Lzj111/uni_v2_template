/**
 * @description 入口文件
 * @author lzj
 */

import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'
import {
  WebConfig,
  http,
  log
} from './utils/core'
import mixinsbase from './utils/mixinsbase'
Vue.mixin(mixinsbase);

Vue.config.productionTip = false;

// > 挂载配置对象&挂载http对象&挂载log对象
Vue.prototype.WebConfig = WebConfig;
Vue.prototype.http = http;
Vue.prototype.log = log;
// > 挂载全局平台对象
import {
  PlatformFactory
} from './utils/bizutil';
let _instance = PlatformFactory.GetPlatformInstance();
Vue.prototype.platformInstance = _instance;

App.mpType = 'app'
const app = new Vue({
  ...App
});
app.$mount();