
import * as apiCommon from "@/api/common";
import * as apiPurchase from "@/api/purchase";
import { mapActions, mapGetters, mapMutations } from "vuex";
import * as storeTypes from "@/store/store/types";
import * as rootTypes from "@/store/root/types";
import * as cartTypes from "@/store/cart/types";

export default {
    computed: {
        ...mapGetters("store", {
            supplierId: storeTypes.SUPPLIER_ID
        }),
    },
    watch: {
        ENTID(val) {
            this.clearAllCache();
            this.enterpriseChange();
        },
        supplierId(val) {
            this.removeGood(true);
        }
    },
    mounted() {
    },
    async created() {
        let eid = this.ENTID;
        await this.CHECK_LOGIN(err => {
            this.showErrorPage = true;
        });
        if (eid == this.ENTID) {
            this.flushEntNotChange();
        }
    },
    methods: {
        /** ENTID修改后需要重置相关数据 */
        enterpriseChange() {
            this.getStoreInfo();
            this.getSupplierList();
            this.removeGood(true);
        },
        /** 解决刷新后数据丢失，但ENTID又没有变化的情况 */
        flushEntNotChange() {
            this.getStoreInfo();
            this.getSupplierList();
        },
        ...mapActions("store", {
            SET_ENT_INFO: storeTypes.SET_ENT_INFO,
        }),
        ...mapMutations("store", {
            setSupplierList: storeTypes.SET_SUPPLIER_LIST,
        }),
        ...mapMutations({
            clearAllCache: rootTypes.FLUSH_ENTID_CACHE,
        }),
        ...mapMutations("cart", {
            removeGood: cartTypes.REMOVE
        }),
        /** 获取单位详细信息 */
        async getStoreInfo() {
            let res = await this.$get(
                apiCommon.getOrgDetail,
                {
                    enterpriseid: this.ENTID
                },
                res => { },
                err => {
                    this.SET_ENT_INFO({});
                }
            );
            this.SET_ENT_INFO(res);
        },
        /** 获取供应商列表,全局依赖供应商Id,当单位变化供应商也需要发生变化 */
        async getSupplierList() {
            let list = await this.$get(
                apiPurchase.supplierList,
                { enterpriseid: this.ENTID, itype: 0 },
                res => { },
                err => {
                    this.setSupplierList([]);
                    if (this.ENTID) this.$toast(`${err.msg}`);
                }
            );
            this.setSupplierList(list);
        }
    }
}