export const ENTID = "enterpriseid";//单位Id
export const SET_ENTID = "setEnterpriseID";//更新单位ID
export const USERTYPE = "e_loginUserType";//用户身份，1 = 个人、0 = 单位
export const SET_USERTYPE = "setLoginUserType";//更新用户身份
export const FLUSH_ENTID_CACHE = "flushEnterpriseIdCache";//刷新单位ID的缓存信息并删除所有缓存,但不更新ENTID,需要更新ENTID请使用SET_ENTID方法

export const SHOWLOADING = "showLoading";//全局loading显隐状态
export const SET_SHOWLOADING = "setShowLoading";//设置全局loading显隐状态

export const USERINFO = "u_userInfo";//当前登录用户信息
export const SET_USERINFO = "setUserInfo";//设置用户信息