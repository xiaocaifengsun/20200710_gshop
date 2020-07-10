import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import root from './root'
import store from './store'
import cart from './cart'
import order from './order'
import address from './address'
export default new Vuex.Store({
    state: root.state,
    getters: root.getters,
    mutations: root.mutations,
    actions: root.actions,
    modules: {
        store,
        cart,
        address,
        order,
    }
});