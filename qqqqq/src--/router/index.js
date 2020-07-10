import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

import purchase from './purchase'
import mine from './mine'
import order from './order'
import cart from './cart'
import other from './other'

const router = new Router({
    routes: [
        ...purchase,
        ...mine,
        ...order,
        ...cart,
        ...other
    ]
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
})

export default router;