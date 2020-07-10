
import * as apis from '@/api/common';

let updateState = async function (res = {}) {
    this.SET_ENTID(res.ID != undefined ? res.ID : "");
    this.SET_USERTYPE(res.Type != undefined ? res.Type : "");
}

let clearAllCookie = function () {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
    }
}

let clearLocalData = function () {
    clearAllCookie();
    localStorage.clear();//清除缓存
}

let h5Login = async function (failback) {
    return await GET_ENTID.call(this, failback);
}

let h5ToLogin = function () {
    updateState.call(this);
    clearLocalData();
    if (this._isZntEnv()) {
        this.$dialog.alert({ message: '未获取到登录信息' });
        return;
    } else if (this._isWechatEnv() || this._isMiniProgramEnv()) {
        let url = window.location.href;
        let appId = apis.appId;
        let nxAppId = "22";
        let systemId = "16";
        let useCas = true;
        let nxinUrl = `${this._mUrl}/oauth/weChat?retUrl=${encodeURIComponent(url)}&appId=${nxAppId}&systemId=${systemId}&useCas=${useCas}`;
        let openWUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(nxinUrl)}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
        window.location.replace(openWUrl);
    } else {
        let curUrl = encodeURIComponent(window.location.href);
        let loginurl = `${this._loginUrl}?service=${curUrl}&systemId=16`;
        window.location.replace(loginurl);
    }
}

export async function TO_LOGOUT(callbackUrl) {
    updateState.call(this);
    callbackUrl = callbackUrl || window.location.href;
    let curUrl = callbackUrl;// encodeURIComponent(callbackUrl);
    let logouturl = `${this._logoutUrl}?service=${curUrl}`;
    clearLocalData();

    if (this._isWechatEnv() || this._isMiniProgramEnv()) {
        await this.$get(apis.unbindWx);
    }
    window.location.replace(logouturl);
}

export async function CHECK_LOGIN(failback) {
    return await h5Login.call(this, failback);
}

export function TO_LOGIN() {
    h5ToLogin.call(this);
}

export async function GET_ENTID(failback) {
    let res = await this.$get(apis.getEntId, da => { }, err => {
        updateState.call(this);
        _.isFunction(failback) && failback.call(this);
    });
    if (res.Type == "1") {
        // this.$dialog.alert({ message: "当前登录身份为个人，暂不支持个人订货" });
        // window.location.href = this._toSwitchDemoUrl;
        // updateState.call(this);
        // return;
    } else {
        // updateState.call(this, res);
    }
    updateState.call(this, res);
    GET_USERINFO.call(this);
    return res;
}


async function GET_USERINFO() {
    let res = await this.$get(apis.getUserInfo);
    this.SET_USERINFO(res);
}