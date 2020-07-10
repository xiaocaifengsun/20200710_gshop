export const deleteOrder = "/api/nxin.BusinessShop.DeleteOrder/1.0"; //删除订单
export const addOrder = "/api/nxin.BusinessShop.AddOrder/1.0"; //从购物车确认下订单
export const orderInfo = "/api/nxin.BusinessShop.qlw.saleorder.detail/2.0"; //获取订单详情
// export const orderList = "/api/nxin.BusinessShop.qlw.saleorder.list/1.0"; //订单列表
export const orderList = "/api/nxin.BusinessShop.qlw.saleorder.list/3.0"; //订单列表 (修改)
                         


export const deliveryOrder = "/api/nxin.BusinessShop.sales.order.delivery/1.0"; //确认收货
export const checkQuantity = "/api/nxin.BusinessShop.saorder.checkstate/1.0"; //确认收货前,如果开启了配送环节，则判断送货员是否已完成送货核对数量，如果未输入核对数量，则不允许完成收货
export const systemOption = "/api/nxin.BusinessShop.qlw.option.get/1.0"; //系统选项
export const getAvgByWhere = "/api/nxin.BusinessShop.qlw.saleorder.list/2.0"; //根据时间段、客户、供应商获取订单平均件数、数量
export const createPurchaseOrder = "/api/nxin.BusinessShop.addpurchases/1.0"; //开启自动生成采购入库单选项开关时，收货成功后调用此接口

export const enterprise = '/api/nxin.permission.permission.check/2.0'; // 获取用户单位id
export const enterpriseList = "/api/nxin.usercenter.supplier.enterprise.list/1.0"; // 供应商列表
export const getWarehouseList = "/api/nxin.BusinessShop.warehouselist.get/1.0"; // 获取库存仓库
export const detailbyenter = "/api/nxin.qlw.product.detailbyenter.list/1.0"; //  获取某单位商品列表
export const groupclasslistbyenter = "/api/nxin.qlw.product.groupclasslistbyenter/1.0"; // 获取商品分类
export const getUnionGoods = "/api/nxin.qlw.getdownenterpriceproductinfo/1.0"; //根据查询单位、被查询单位列表、商品列表查询关联商品  //api/nxin.BusinessShop.getpurchase.productlist/1.0
export const updateUnionGoods = "/api/nxin.merchandisecenter.productforbusinesscenterpid.update/1.0"; //更新商品信息，供应商和采购方的商品关联信息
export const getsupplierState = "/api/nxin.qlw.customer.checkcusorsupbytarget.list/1.0"; //获取本单位引入的客户或者供应商档案
export const addcustomerapi = "/api/nxin.qlwbase.bsorg.CreateCusInfoByBoid/2.0"; //客户档案 增加||修改 接口
export const getnewwarehouseapi = "/api/nxin.BusinessShop.newwarehouse.get/1.0"; //查找采购最新仓库
export const getenterpriserinfolistapi = "/api/nxin.BusinessShop.enterpriserinfolist.get/1.0"; //查找创建单位信息
export const checkOrderRepeat = "/api/nxin.BusinessShop.orderdatals.repeat.check/1.0";//重复订单检测