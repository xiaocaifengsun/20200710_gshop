import * as types from "@/store/store/types";
import * as utils from '@/mixins/method';

export default {
    namespaced: true,
    state: {
        entInfo: utils._localStorageGet(types.ENT_INFO, {}),
        supplierInfo: utils._localStorageGet(types.SUPPLIER_INFO, {}),
        supplierList: [],
        checkToOrder: false,
        commodityClassList: [],
        productname: ""
    },
    getters: {
        [types.PRODUCTNAME](state) {
            return state.productname;
        },
        [types.ENT_INFO](state) {
            return state.entInfo;
        },
        [types.SUPPLIER_INFO](state) {
            return state.supplierInfo;
        },
        [types.SUPPLIER_ID](state) {
            return state.supplierInfo.EnterpriseID;
        },
        [types.SUPPLIER_LIST](state) {
            return state.supplierList;
        },
        [types.CHECK_TO_ORDER](state) {
            return state.checkToOrder;
        },
        [types.SET_COMMODITYCLASSIFICATION_TO_LIST](state) {
            return state.commodityClassList;
        },
    },
    mutations: {
        [types.SETPRODUCTNAME](state, val) {
            state.productname = val;
            utils._localStorageSet(types.PRODUCTNAME, state.productname);
        },

        [types.CLEARPRODUCTNAME](state) {
            state.productname = ""
        },
        [types.SET_ENT_INFO](state, val) {
            state.entInfo = val || {};
            utils._localStorageSet(types.ENT_INFO, state.entInfo);
        },
        [types.SET_SUPPLIER_LIST](state, val) {
            let list = val || [];
            let curSupplier = state.supplierInfo;
            if (!_.isEmpty(curSupplier)) {
                curSupplier = list.find(
                    f => f.EnterpriseID == curSupplier.EnterpriseID
                );
            }
            if (_.isEmpty(curSupplier)) curSupplier = list[0];
            state.supplierList = list;
            this.commit(`store/${types.SET_SUPPLIER_INFO}`, curSupplier);
        },
        [types.SET_SUPPLIER_INFO](state, val) {
            val = val || {};
            // if (!_.isEqual(state.supplierInfo.EnterpriseID, val.EnterpriseID)) {
            if (state.supplierInfo.EnterpriseID != val.EnterpriseID) {
                utils._localStorageRemove("su_");
            }
            state.supplierInfo = val;
            utils._localStorageSet(types.SUPPLIER_INFO, state.supplierInfo);
        },
        [types.SET_CHECK_TO_ORDER](state, val) {
            val = !!val;
            state.checkToOrder = val;
        },
        [types.SET_COMMODITYCLASSIFICATION_TO_LIST](state, val) {
            let list = val || [];
            state.commodityClassList = list;
            this.commit(`store/${types.SET_COMMODITYCLASSIFICATION_TO_LIST}`, commodityClassList);
        },
    },
    actions: {
        [types.SET_ENT_INFO]({
            commit,
            state
        }, val) {
            commit(types.SET_ENT_INFO, val);
        },
    }
}