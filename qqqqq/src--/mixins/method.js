import Qs from 'qs';

export function _getDate(days) {
    var getPadZero = function (va) {
        va = va < 10 ? '0' + va : va;
        return va;
    };
    var value = new Date();
    if (days) {
        value.setDate(value.getDate() + days);
    }
    var year = value.getFullYear();
    var month = getPadZero(value.getMonth() + 1);
    var day = getPadZero(value.getDate());
    return year + '-' + month + '-' + day;
};

export function _getDateTime(fmt) {
    if (!fmt) fmt = "yyyy-MM-dd";
    var date = new Date();
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

export function _deleteEmpty(jObj) {
    let res = {};
    if (!jObj || typeof (jObj) == "string") return jObj;
    for (var key in jObj) {
        let val = jObj[key];
        if (val !== "" && val != null) {
            res[key] = val;
        }
    }
    return res;
}

export function _formatMoney(val, precision) {
    if (val == null) return val;
    precision = precision || 2;
    val = _.round(val, precision);
    return val.toFixed(precision).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};

export function _clone(vals) {
    return _.cloneDeep(vals);
};

export function _stringify(params) {
    return Qs.stringify(params);
};

export function _getUrlParams(url = "") {
    return Qs.parse(url.split("?")[1]);
}

export function _localStorageGet(key, defVal) {
    let str = localStorage.getItem(key);
    if (str != null) {
        return JSON.parse(str);
    }
    return defVal;
}

export function _localStorageSet(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

export function _localStorageRemove(prefix) {
    Object.keys(localStorage).forEach(item => {
        if (_.startsWith(item, prefix)) {
            localStorage.removeItem(item);
        }
    });
    // console.log(`removeing storage prefix: ${prefix}`);
}

export function _localStorageRemoveItem(key) {
    localStorage.removeItem(key);
    // console.log(`removeing storage key: ${key}`);
}

export function _localStorageClear() {
    localStorage.clear();
    // console.log(`clear storaged`);
}