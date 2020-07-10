/** 在线支付相关混入 */
import { mapGetters } from "vuex";
import * as apiOrder from '@/api/order';
import * as storeTypes from '@/store/store/types';

export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters("store", {
            supplierId: storeTypes.SUPPLIER_ID
        }),
    },
    methods: {
        /** 供应商是否开启在线支付系统选项 */
        async CheckToPay(supplierId) {
            var curSupplierId = supplierId || this.supplierId;
            let res = await this.$get(apiOrder.systemOption, {
                optionid: "20200330131424",
                enterpriseid: curSupplierId
            });
            return res.OptionValue === "1";
        }
    }
}