import * as types from "./types";
import Vue from 'vue';

export default {
    namespaced: true,
    state: {
        pageIndex: null,
        isFlush: false,
        loadFirst: false,
        orderAuxiliary: {
            Supplier: {},
            Warehouse: {},
            Goods: {}
        },
        orderGoods: [],
        orderGoodsIndex: 0,
    },
    getters: {
        [types.PAGEINDEX](state) {
            return state.pageIndex;
        },
        [types.ISFLUSH](state) {
            return state.isFlush;
        },
        [types.LOADFIRST](state) {
            return state.loadFirst;
        },

        [types.AUXILIARY_SUPPLIER](state) {
            return state.orderAuxiliary.Supplier;
        },
        [types.AUXILIARY_WAREHOUSE](state) {
            return state.orderAuxiliary.Warehouse;
        },
        [types.AUXILIARY_GOODS](state) {
            return state.orderAuxiliary.Goods;
        },
    },
    mutations: {
        [types.SET_PAGEINDEX](state, val) {
            state.pageIndex = val;
        },
        [types.SET_ISFLUSH](state, val) {
            state.isFlush = !!val;
        },
        [types.SET_LOADFIRST](state, val) {
            state.loadFirst = !!val;
        },

        [types.CLEAR_AUXILIARY](state) {
            state.orderAuxiliary.Supplier = {};
            state.orderAuxiliary.Warehouse = {};
            state.orderAuxiliary.Goods = {};
        },
        [types.SET_AUXILIARY_SUPPLIER](state, val) {
            state.orderAuxiliary.Supplier = val || {};
        },
        [types.SET_AUXILIARY_WAREHOUSE](state, val) {
            state.orderAuxiliary.Warehouse = val || {};
        },
        [types.SET_AUXILIARY_WAREHOUSE](state, val) {
            state.orderAuxiliary.Warehouse = val || {};
        },
        [types.SET_AUXILIARY_GOODS](state, item) {
            if (!item) {
                state.orderAuxiliary.Goods = {}; return;
            }
            else if (_.isArray(item)) {
                var curItem = {};
                item.forEach(f => { curItem[f.Key] = f.Val; });
                state.orderAuxiliary.Goods = curItem;
            } else if (item.Key) {
                Vue.set(state.orderAuxiliary.Goods, item.Key, item.Val);
            }
        },
    }
}