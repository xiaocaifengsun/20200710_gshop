/* 订货 */
export default [
    /*默认页面 */
    {
        path: '/',
        redirect: '/purchase/index'
    },
    {
        path: '/purchase/index',
        name: "purchase",
        meta: { title: "订货", level: 1, keepAlive: true },
        component: () => import(/* webpackChunkName:'purchase'*/'@/views/purchase')
    },
    {
        path: '/purchase/order',
        name: "purchaseOrder",
        meta: { title: "确认订单" },
        component: () => import(/* webpackChunkName:'purchase'*/'@/views/purchase/order')
    },
    {
        path: '/purchase/supplier',
        name: "supplier",
        meta: { title: "选择供应商" },
        component: () => import(/* webpackChunkName:'purchase'*/'@/views/purchase/supplier')
    },
    {
        path: '/purchase/search',
        name: "puchaseSearch",
        meta: { title: "搜索商品" },
        component: () => import(/* webpackChunkName:'purchase'*/'@/views/purchase/search')
    },
    {
        path: '/purchase/searchresult',
        name: "purchaseSearchResult",
        meta: { title: "搜索商品" },
        component: () => import(/* webpackChunkName:'purchase'*/'@/views/purchase/searchresult'),
    },
]