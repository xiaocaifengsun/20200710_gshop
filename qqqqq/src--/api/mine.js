/** 收货地址相关,目前是用户为粒度，后期会添加以单位为粒度的接口 */
export const addresslist = "/api/nxin.usercenter.addr.list/1.0"; //获取列表
export const addAddress = "/api/nxin.usercenter.addr.add/1.0"; //添加
export const updateAddress = "/api/nxin.usercenter.addr.update/1.0"; //更新
export const deleteAddress = "/api/nxin.usercenter.addr.delete/1.0"; //删除

export const enterpriseList = "/api/nxin.usercenter.enterprise.list/5.0"; //获取当前账号下可查看单位列表
export const switchEnterprise = "/api/nxin.qlw.home.ente.switch/1.0"; //切换单位


/*我的对账单API*/
export const mystatementList = "/api/nxin.qlw.home.ente.switch/1.0"; //获取列表页
export const mystatementDetail = "/api/nxin.qlw.home.ente.switch/1.0"; //获取详情页

export const getStateMent = "/api/nxin.BusinessShop.getstatement.list/1.0";//  获取电子对账单列表页



export const jumpurlGet = "/api/nxin.BusinessShop.jumpurl.get/1.0"; //获取跳转拼接地址

  
export const paysList = "/api/nxin.BusinessShop.pays.record.list/1.0";    // 付款记录
// https://gateway-admin.t.nxin.com/docs/BusinessShop/pays.record.list// 付款记录
