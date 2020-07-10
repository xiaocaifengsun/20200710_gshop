/** 报货超标预警检测方法 */

import { mapGetters, mapMutations } from "vuex";
import * as apiOrder from '@/api/order';
import * as storeTypes from '@/store/store/types';

export default {
    data() {
        return {
            detection: {
                days: 0,//天数
                times: 0,//倍数
            }
        }
    },
    computed: {
        ...mapGetters("store", {
            supplierInfo: storeTypes.SUPPLIER_INFO,
            supplierId: storeTypes.SUPPLIER_ID
        }),
    },
    async created() {

    },
    methods: {
        /** 获取报货超标预警参数 */
        async getDetectionParams() {
            let res = await this.$get(apiOrder.systemOption, {
                optionid: "20190930141505",
                enterpriseid: this.supplierId
            });
            try {
                let strs = res.OptionValue.split(";");
                this.detection.days = Number(strs[0] || "0");
                this.detection.times = Number(strs[1] || "0");
            } catch (e) {
                this.detection.days = 0;
                this.detection.times = 0;
            }
        },
        /** 查询商品预警列表 */
        async CheckProductAvg(products = []) {
            if (_.isEmpty(products)) return [];
            await this.getDetectionParams();
            let days = this.detection.days;
            let times = this.detection.times;
            let list = await this.$get(apiOrder.getAvgByWhere, {
                customerid: this.ENTID,
                enterpriseid: this.supplierId,
                begindate: this._getDate(-days + 1),
                enddate: this._getDate(),
                productidlist: products.map(f => f.ProductID).toString()
            }) || [];
            list.forEach(item => {
                item.Quantity = _.round(item.Quantity * times, 4);
                item.Packages = _.round(item.Packages * times, 4);

                let curp = products.find(f => f.ProductID == item.ProductID);
                item.StandardMeasureUnit = curp.StandardMeasureUnit;//主计量单位

                item.QuantityOver = item.Quantity > 0 && curp.Quantity > item.Quantity;//主计量超标
                item.PackagesOver = item.Packages > 0 && curp.Packages > item.Packages;//副计量超标
            });
            let reslist = list.filter(f => f.QuantityOver || f.PackagesOver);
            let ret = {
                list: reslist,
                tip: ""
            }
            if (reslist.length > 0) {
                let tipStr = `<div style="margin: -0.26rem 0 0.2rem 0;">（以下商品超过订货标准）</div>`;
                reslist.forEach(fe => {

                    tipStr += `<span class='tip_avg_strong'>${fe.ProductName}</span> 超过 `;
                    let suffix = "";
                    if (fe.PackagesOver) {
                        suffix = `<span class="tip_avg_strong">${fe.Packages}件</span>`;
                    }
                    if (fe.QuantityOver) {
                        if (suffix) suffix += "、";
                        suffix += `<span class="tip_avg_strong">${fe.Quantity}${fe.StandardMeasureUnit}</span>`;
                    }
                    tipStr += suffix + "\n";
                });
                ret.tip = tipStr + `<div style="marign:0.2rem 0 0;">是否继续下单?</div>`;
            }
            return ret;
        },
        /** 启用超出时间范围后禁止报货,是否在营业时间内 */
        CheckOpenTime(callback) {
            return new Promise(async (resolve, reject) => {
                let res = await this.$get(apiOrder.systemOption, {
                    optionid: "20190930140909",
                    enterpriseid: this.supplierId
                });
                let dt = new Date();
                let hour = dt.getHours(), minutes = _.padStart(dt.getMinutes(), 2, '0');
                let nowTime = Number(hour + "" + minutes);
                let times = (res.OptionValue || "00:00;24:00").split(";");
                let strStartTime = times[0];
                let strEndTime = times[1] || "24:00";
                let startTime = Number(strStartTime.replace(":", "")); //把时间转为数字，进行比较
                let endTime = Number(strEndTime.replace(":", ""));
                let isopen = startTime <= nowTime && endTime >= nowTime;
                if (isopen) {
                    resolve(isopen);
                } else {
                    this._hideLoading();
                    if (_.isFunction(callback)) {
                        callback(strStartTime, strEndTime);
                    } else {
                        this.$toast({
                            message: `${this.supplierInfo.EnterpriseName}已停止接单，请在营业时间（${strStartTime}~${strEndTime}）内下单`,
                            duration: 2000
                        });
                        // this.$dialog.alert({ message: "未在营业时间内" });
                    }
                }
            });
        }
    }
}