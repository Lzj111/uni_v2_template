/**
 * @description 
 * @author lzj
 * @ddate 2023/07/31 基础混入文件 挂载至main.js
 */

export default {
    created(res) {
        this.platformInstance.showShareMenu();
    }
}