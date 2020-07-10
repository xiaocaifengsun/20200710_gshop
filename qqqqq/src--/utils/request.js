import axios from 'axios'
import Qs from 'qs'
import Vue from 'vue'
import * as utils from '@/mixins/method';

// axios.defaults.baseURL = process.env.VUE_APP_API;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

let _getFn = function (url, params, successFn, failFn, finallyFn, diy = 0) {
    let _self = this;
    if (typeof params == "function") { failFn = successFn; successFn = params; params = {}; }
    params = utils._deleteEmpty(params);
    if (!_verifyUrl(url)) url = _self._openUrl + url;
    return new Promise((resolve, reject) => {
        axios.get(url, { params: params }).then(res => { callbackFn.call(_self, res, successFn, failFn, finallyFn, resolve, reject, diy); })
            .catch(d => { failcallbackFn.call(_self, d, failFn, finallyFn, reject, 1); });
    });
}

let _postFn = function (url, params, successFn, failFn, finallyFn, isForm = 0, diy = 0) {
    let _self = this;
    if (typeof params == "function") { failFn = successFn; successFn = params; params = {}; }
    params = utils._deleteEmpty(params);
    if (!_verifyUrl(url)) url = _self._openUrl + url;
    return new Promise((resolve, reject) => {
        let data = isForm ? Qs.stringify(params) : params;
        axios.post(url, data, { headers: { "content-type": isForm ? "application/x-www-form-urlencoded" : "application/json" } }).then(res => { callbackFn.call(_self, res, successFn, failFn, finallyFn, resolve, reject, diy); })
            .catch(d => { failcallbackFn.call(_self, d, failFn, finallyFn, reject, 1); });
    });
}

function _verifyUrl(url) {
    var reg = /^(https?|ftp|file):\/\/.+$/;
    return reg.test(url);
}

Vue.prototype.$get = function (url, data, successFn, failFn, finallyFn) {
    return _getFn.call(this, url, data, successFn, failFn, finallyFn, 0);
}

Vue.prototype.$post = function (url, data, successFn, failFn, finallyFn) {
    return _postFn.call(this, url, data, successFn, failFn, finallyFn, 1);
}

Vue.prototype.$postJson = function (url, data, successFn, failFn, finallyFn) {
    return _postFn.call(this, url, data, successFn, failFn, finallyFn, 0);
}

Vue.prototype._get = function (url, data, successFn, failFn, finallyFn) {
    return _getFn.call(this, url, data, successFn, failFn, finallyFn, 1);
}

Vue.prototype._post = function (url, data, successFn, failFn, finallyFn) {
    return _postFn.call(this, url, data, successFn, failFn, finallyFn, 1, 1);
}

Vue.prototype._postJson = function (url, data, successFn, failFn, finallyFn) {
    return _postFn.call(this, url, data, successFn, failFn, finallyFn, 0, 1);
}

let callbackFn = function (res, successFn, failFn, finallyFn, resolve, reject, diy = 0) {
    let da = res.data;
    if (!diy) {
        if (da.code == 0) {
            resolve(da.data);
            successFn && (typeof successFn == "function") && successFn.call(this, da.data);
            finallyFn && (typeof finallyFn == "function") && finallyFn.call(this, da);
        } else if (da.code == 10011) {
            this.TO_LOGIN();
        } else {
            failcallbackFn.call(this, da, failFn, finallyFn, reject, 0);
        }
    } else {
        resolve(da);
        successFn && (typeof successFn == "function") && successFn.call(this, da);
        finallyFn && (typeof finallyFn == "function") && finallyFn.call(this, da);
    }
};

let failcallbackFn = function (da, failFn, finallyFn, reject, isCatch = 0) {
    this._hideLoading();
    let showTip = true;
    if (failFn && typeof failFn == "function") {
        var resFail = failFn.call(this, da, reject);
        if (_.isBoolean(resFail)) { showTip = resFail; }
    }
    if (showTip) {
        let errTip = da.isAxiosError ? "网络异常，请稍后再试" : da.msg || da.message || da.error;
        this.$toast(errTip);
    }
    finallyFn && (typeof finallyFn == "function") && finallyFn.call(this, da);
}