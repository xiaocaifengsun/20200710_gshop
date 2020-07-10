export default function datetime(str, fmt) {
    if (!str) return "";
    if (!fmt) {
        fmt = "yyyy-MM-dd";
    }
    var date = null;
    if (str.indexOf("T") > -1) {
        date = new Date(str.replace("T", " ").replace("Z","").replace(/-/g, "/"));
    }
    else {
        date = new Date(+str.replace(/\/Date\((\d+)\)\//gi, "$1"));
    }
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