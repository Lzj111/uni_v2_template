<script lang="js">
import { BaseCode } from './utils/codetable';
export default {
	onLaunch: function (options) {
		console.log('App Launch', options);
		// > 设置入口页面参数
		uni.setStorageSync(BaseCode.appOptions, options.query);
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
}
</script>

<style lang="scss">
/* 引入字体图标 */
@import url("~@/static/font/iconfont.css");

/* 每个页面公共css在该处写 */
/* page */
page {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
}

/* #ifdef H5 */
// uni-page-head {
// 	display: none;
// }

// uni-page-wrapper {
// 	height: calc(100% - env(safe-area-inset-top)) !important;
// }

/* #endif */
</style>
