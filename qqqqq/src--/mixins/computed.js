import * as apis from '@/api/base'

export function _isDevelopmentEnv() {
    var origin = document.location.origin;
    return origin.indexOf(".test.") > -1 || origin.indexOf(".t.") > -1 || origin.indexOf("localhost") > -1;
}

export function _isPreProductionEnv() {
    var origin = document.location.origin;
    return origin.indexOf(".p.") > -1;
}

export function _domainPrefix() {
    return this._isDevelopmentEnv ? ".t" : this._isPreProductionEnv ? ".p" : "";
}
export function _demoPrefix(){
    return /^(http|https):\/\/demo/.test(document.location.origin);
}

export function _openUrl() {
    return this._isDevelopmentEnv ? apis.openUrl_Dev : this._isPreProductionEnv ? apis.openUrl_Pre : apis.openUrl;
}

export function _loginUrl() {
    return this._isDevelopmentEnv ? apis.h5LoginPage_Dev : this._isPreProductionEnv ? apis.h5LoginPage_Pre : apis.h5LoginPage;
}

export function _logoutUrl() {
    return this._isDevelopmentEnv ? apis.logoutUrl_Dev : this._isPreProductionEnv ? apis.logoutUrl_Pre : apis.logoutUrl;
}

export function _woNxinUrl() {
    return this._isDevelopmentEnv ? apis.wonxinUrl_Dev : this._isPreProductionEnv ? apis.wonxinUrl_Pre : apis.wonxinUrl;
}

export function _toSwitchDemoUrl() {
    return this._isDevelopmentEnv ? apis.demoUrl_Dev : this._isPreProductionEnv ? apis.demoUrl_Pre : apis.demoUrl;
}

export function _mUrl() {
    return this._isDevelopmentEnv ? apis.mUrl_Dev : this._isPreProductionEnv ? apis.mUrl_Pre : apis.mUrl;
}

export function _projectUrl() {
    return this._isDevelopmentEnv ? apis.projectUrl_Dev : this._isPreProductionEnv ? apis.projectUrl_Pre : apis.projectUrl;
}

