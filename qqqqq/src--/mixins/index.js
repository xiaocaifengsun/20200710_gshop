/**
 * 全局混入
 */
import * as types from "@/store/root/types";
import * as methods from './method'
import * as auth from './auth'
import * as computeds from './computed'
import { mapMutations, mapActions, mapGetters } from "vuex";
import recordPostion from "@/mixins/record-page-position";

export default {
    computed: {
        ...mapGetters({
            ENTID: types.ENTID,
            IS_PERSON: types.USERTYPE,
        }),
        ...computeds
    },
    mixins: [recordPostion],
    methods: {
        ...mapMutations({
            SET_ENTID: types.SET_ENTID,
            SET_USERTYPE: types.SET_USERTYPE,
            SET_USERINFO: types.SET_USERINFO,
        }),
        ...auth,
        ...methods,
    }
};