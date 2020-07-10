import * as types from "@/store/root/types";
import * as utils from '@/mixins/method';

export default {
    state: {
        enterpriseid: utils._localStorageGet(types.ENTID, ""),
        showLoading: false,
        userType: utils._localStorageGet(types.ENTID, "1"),
        userInfo: {},
    },
    getters: {
        [types.ENTID](state) {
            return state.enterpriseid;
        },
        [types.SHOWLOADING](state) {
            return state.showLoading;
        },
        [types.USERTYPE](state) {
            return state.userType == 1;
        },
        [types.USERINFO](state) {
            return state.userInfo || {};
        }
    },
    mutations: {
        [types.SET_ENTID](state, val) {
            if (state.enterpriseid != val) {
                utils._localStorageClear();
                state.enterpriseid = val;
            }
            utils._localStorageSet(types.ENTID, val);
        },
        [types.SET_USERTYPE](state, val) {
            state.userType = val ? 1 : 0;// 0 = 单位 、 1 = 个人
            utils._localStorageSet(types.USERTYPE, state.userType);
        },
        [types.FLUSH_ENTID_CACHE](state, val) {
            utils._localStorageClear();
            utils._localStorageSet(types.ENTID, state.enterpriseid);
        },
        [types.SET_SHOWLOADING](state, val) {
            state.showLoading = val;
        },
        [types.SET_USERINFO](state, val) {
            state.userInfo = val || {};
        }
    },
    actions: {
        [types.SET_SHOWLOADING]({ commit, state }, val) {
            commit(types.SET_SHOWLOADING, val);
        },
    }
}