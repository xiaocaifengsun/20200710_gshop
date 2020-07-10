/* 购物车 */
export default [
    {
        path: '/cart/index',
        name: "cart",
        meta: { title: "已选商品" },//, level: 1
        component: () => import(/* webpackChunkName:'cart'*/'@/views/cart')
    },
]