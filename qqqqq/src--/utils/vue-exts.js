import * as types from "@/store/root/types";
import store from '@/store';

let _openLoading = () => {
    store.commit(types.SET_SHOWLOADING, true);
}

let _hideLoading = () => {
    store.commit(types.SET_SHOWLOADING, false);
}

/** 是否智能通环境 */
function _isZntEnv() {
    return /(OAConnectStore|com.dbn.OAConnect)/i.test(navigator.userAgent);
}
/** 微信环境 */
function _isWechatEnv() {
    return /micromessenger/i.test(navigator.userAgent);
}

/** 小程序环境 */
function _isMiniProgramEnv() {
    return /miniprogram/i.test(navigator.userAgent);
}

export default {
    install(Vue) {
        Vue.prototype._showLoading = _openLoading;
        Vue.prototype._hideLoading = _hideLoading;
        Vue.prototype._isZntEnv = _isZntEnv;
        Vue.prototype._isWechatEnv = _isWechatEnv;
        Vue.prototype._isMiniProgramEnv = _isMiniProgramEnv;
    }
}