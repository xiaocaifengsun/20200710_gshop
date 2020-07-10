import * as types from "./types";
import * as utils from '@/mixins/method';

export default {
    namespaced: true,
    state: {
        current: {},
    },
    getters: {
        [types.SELECTED_ADDR](state) {
            return state.current;
        }
    },
    mutations: {
        [types.SET_SELECTED_ADDR](state, val) {
            state.current = val || {};
        },
        [types.REMOVE_SELECTED](state) {
            state.current = {};
        }
    }
}