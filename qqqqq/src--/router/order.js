/* 订单 */
export default [
    {
        path: '/order/index',
        name: "order",
        meta: { title: "订单", level: 1, keepAlive: true },
        component: () => import(/* webpackChunkName:'order'*/'@/views/order')
    },
    {
        path: '/order/detail/:numericalorder',
        name: "orderDetail",
        meta: { title: "订单详情" },
        component: () => import(/* webpackChunkName:'order'*/'@/views/order/detail')
    },
    {
        path: '/order/delivery/:numericalorder',
        name: "orderDelivery",
        meta: { title: "确认收货", keepAlive: true },
        component: () => import(/* webpackChunkName:'order'*/'@/views/order/delivery')
    },
    {
        path: '/order/supplier',
        name: "orderSupplier",
        meta: { title: "选择供应商" },
        component: () => import(/* webpackChunkName:'order'*/'@/views/order/supplier')
    },
    {
        path: '/order/inventory',
        name: "orderInventory",
        meta: { title: "选择库存" },
        component: () => import(/* webpackChunkName:'order'*/'@/views/order/inventory')
    },

    {
        path: '/order/goods/:productid',
        name: "orderGoods",
        meta: { title: "选择商品" },
        component: () => import(/* webpackChunkName:'order'*/'@/views/order/goods')
    },
]