/**
 * 添加修改数组时，先调用了splice删除元素再进行添加,请不要修改
 * 如：state.goodList.splice(ind, 1, item);
 * 为什么不用：state.goodList[ind]=item;
 * 看似多余且效率低,实则是为了解决 vuex 数组变化,getters不会跟踪的问题
 * 你可能会说为什么不在你的业务里边deep watch呢,
 * 这么做是因为有一些getters需要进行运算,但运算的逻辑又不想暴露给外部,由此处统一管理
 */
import * as types from "./types";
import * as utils from '@/mixins/method';

/** 使用到的字段定义 */
const money = "BDJ";
const count = "Quantity";//主计量数量
const packages = "Packages";//辅计量数量
const goodId = "ProductID";

export default {
    namespaced: true,
    state: {
        goodList: utils._localStorageGet(types.GOODLIST, []),
    },
    getters: {
        [types.GOODLIST](state) {
            return state.goodList;
        },
        [types.TOTAL_AMOUNT](state) {
            let total = _.reduce(state.goodList, (sum, n) => {
                return sum + (n[money] || 0) * (n[count] || 0);
            }, 0);
            return _.round(total, 2);
        },
        [types.CATEGORY_COUNT](state) {
            return state.goodList.length;
        },
        [types.TOTAL_COUNT](state) {
            return _.reduce(state.goodList, (sum, n) => {
                return sum + (n[count] || 0);
            }, 0);
        },
    },
    mutations: {
        [types.SET_GOODLIST](state, val) {
            state.goodList = val || [];
            utils._localStorageSet(types.GOODLIST, state.goodList);
        },
        [types.ADD](state, item) {
            if (_.isEmpty(item)) return;
            let hasVal = item[packages] > 0 || item[count] > 0;
            if (hasVal) {
                let ind = state.goodList.findIndex(f => f[goodId] == curItem[goodId]);
                if (ind > -1) {
                    let curItem = _.cloneDeep(state.goodList[ind]);
                    curItem[count] += (item[count] || 0);
                    curItem[packages] += (item[packages] || 0);
                    state.goodList.splice(ind, 1, curItem);
                } else {
                    state.goodList.push(item);
                }
                utils._localStorageSet(types.GOODLIST, state.goodList);
            }
        },
        [types.REMOVE](state, val) {
            if (val == null || val == "") return;
            if (_.isArray(val)) {
                let list = state.goodList;
                let nList = _.remove(list, (item) => {
                    return val.indexOf(item[goodId]) > -1;
                });
                state.goodList = nList;
            } else if (_.isBoolean(val) && val) {
                state.goodList = [];
            } else {
                let ind = state.goodList.findIndex(f => f[goodId] == val);
                if (ind > -1) state.goodList.splice(ind, 1);
            }
            utils._localStorageSet(types.GOODLIST, state.goodList);
        },
        [types.UPDATE](state, item) {
            if (_.isEmpty(item)) return;
            let hasVal = item[packages] > 0 || item[count] > 0;
            let ind = state.goodList.findIndex(f => f[goodId] == item[goodId]);
            if (ind > -1) {
                if (hasVal) { state.goodList.splice(ind, 1, item); }
                else {
                    state.goodList.splice(ind, 1);
                }
                utils._localStorageSet(types.GOODLIST, state.goodList);
            }
        },
        [types.ADDORREPLACE](state, item) {
            if (_.isEmpty(item)) return;
            let hasVal = item[packages] > 0 || item[count] > 0;
            let ind = state.goodList.findIndex(f => f[goodId] == item[goodId]);
            if (ind > -1) {
                if (hasVal) { state.goodList.splice(ind, 1, item); }
                else {
                    state.goodList.splice(ind, 1);
                }
            } else if (hasVal) {
                state.goodList.push(item);
            }
            utils._localStorageSet(types.GOODLIST, state.goodList);
        },
    },
    actions: {}
}