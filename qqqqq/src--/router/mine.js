/* 我的 */
export default [{
        path: '/mine/index',
        name: "mine",
        meta: {
            title: "我的",
            level: 1
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine')
    },
    {
        path: '/mine/address/index',
        name: "address",
        meta: {
            title: "收货地址管理",
            keepAlive: true
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine/address'),
    },
    {
        path: "/mine/address/add",
        name: "addAddress",
        meta: {
            title: "新增收货地址"
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine/address/add'),
    },
    {
        path: "/mine/address/update",
        name: "updateAddress",
        meta: {
            title: "修改收货地址"
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine/address/update'),
    },
    {
        path: "/mine/enterpriselist",
        name: "enterpriseList",
        meta: {
            title: "选择采购单位"
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine/enterpriselist'),
    },
    {
        path: "/mine/mystatement/index",
        name: "mystatement",
        meta: {
            title: "我的对账单"
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine/mystatement'),
    },
    {
        path: "/mine/mystatement/search",
        name: "mystatementsearch",
        meta: {
            title: "我的对账单"
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine/mystatement/search'),
    },
    {
        path: "/mine/mystatement/searchresult",
        name: "mystatementsearchresult",
        meta: {
            title: "我的对账单"
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine/mystatement/searchresult'),
    },

    {
        path: "/mine/paylist/:numericalorder?",
        name: "mypaylist",
        meta: {
            title: "付款列表"
        },
        component: () => import( /* webpackChunkName:'mine'*/ '@/views/mine/paylist'),
    },



]