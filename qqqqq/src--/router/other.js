/* 其它 */
export default [
    {
        path: '*',
        name: "404",
        meta: { title: "页面未找到" },
        component: () => import(/* webpackChunkName:'other'*/'@/views/other/404')
    },
    {
        path: '/test/com',
        name: "testCom",
        meta: { title: "组件测试" },
        component: () => import(/* webpackChunkName:'other'*/'@/views/other/testcom')
    },
    {
        path: '/test/pay',
        name: "testPay",
        meta: { title: "组件测试" },
        component: () => import(/* webpackChunkName:'other'*/'@/views/other/testpay')
    },
]