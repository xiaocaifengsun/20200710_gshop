import {
    mapGetters,
    mapMutations
} from "vuex";
import * as apiPurchase from "@/api/purchase";
import * as cartTypes from "@/store/cart/types";
import * as storeTypes from "@/store/store/types";
import mixin_detection from "@/mixins/order/detection";
import {
    async
} from "q";
export default {
    created() {
        this.req.customerid = this.ENTID;
        this.req.enterpriseid = this.supplierId;
        if (this.supplierId) this.getCommodityClassList();
    },
    async activated() {
        /** 页面被重新激活时刷新重要信息 */
        await this.GET_ENTID();
        this.restoreListData();
    },
    watch: {
        ENTID(val) {
            this.req.customerid = val;
        },
        supplierId(val) {
            this.req.enterpriseid = val;
            this.commodityClassList = [];
            this.getCommodityClassList();
        },
        req: {
            deep: true,
            handler: _.debounce(function (val) {
                this.loadFirst();
            }, 300)
        }
    },
    mixins: [mixin_detection],
    methods: {
        ...mapMutations("cart", {
            addOrReplaceGood: cartTypes.ADDORREPLACE,
            removeGood: cartTypes.REMOVE,
        }),
        ...mapMutations("store", {
            clearproductname: storeTypes.CLEARPRODUCTNAME
        }),
        async getCommodityClassList() {
            let list = await this.$get(
                apiPurchase.commodityClassList, {
                enterpriseid: this.supplierId
            }
            );
            this.commodityClassList = list;
        },
        loadFirst() {
            this.showNoMore = false;
            this.error = false;
            this.reqdata.pageindex = 0;
            this.goodlist = [];
            this.onLoad();
            ``
        },
        href_search_fun() {
            this.clearproductname()
            document.documentElement.scrollTop = 0
            this.$router.push({
                path: "/purchase/search"
            })
        },
        selSupplier() {
            this.$router.push({
                path: "/purchase/supplier",
                query: {
                    back: 1
                }
            });
        },
        onLoad: _.debounce(function () {
            if (this.req.customerid && this.req.enterpriseid) {
                let req = _.assign({}, this.req, this.reqdata);
                this.loading = true;
                this.showNoMore = false;
                this.$get(
                    apiPurchase.goodList,
                    req,
                    res => {
                        this.loading = false;
                        this.error = false;
                        let list = res.list || [];
                        this.restructuringList(list);
                        let total = res.total || 0;
                        this.goodlist = _.concat(this.goodlist, list);
                        this.finished = this.goodlist.length >= total || list.length == 0;
                        this.showNoMore = this.finished;
                        if (!this.finished) this.reqdata.pageindex += 1;
                    },
                    err => {
                        this.loading = false;
                        this.error = true;
                        this.finished = false;
                    }
                );
            } else {
                this.showNoMore = true;
            }
        }, 5),
        /** 重组商品list格式 */
        restructuringList(list) {
            let cartlist = this.cartGoodList;
            list.forEach(f => {
                let old = cartlist.find(fi => f.ProductID == fi.ProductID) || {};
                f.Quantity = old.Quantity || 0; //主计量
                f.Packages = old.Packages || 0; //辅计量
                if (!f.bIsStandardPack) {
                    f.ReportingUnit = old.ReportingUnit == null ? f.ReportingUnit : old.ReportingUnit;
                    f._showDropList = false;
                }
            });
        },
        async toOrder() {
            if (this.categoryCount == 0) {
                this.$toast({
                    message: "请选择商品",
                    duration: 2000
                });
                return;
            }
            await this.CheckOpenTime();

            this.$router.push({
                path: "/purchase/order"
            });
        },
        async toCart() {
            if (this.categoryCount == 0) {
                this.$toast({
                    message: "请选择商品",
                    duration: 2000
                });
                return;
            }
            this.$router.push({
                path: "/cart/index"
            });
        },
        addGoodToCart(item) {
            let good = this._clone(item);
            this.addOrReplaceGood(good);
        },
        prepareAddCart(item, plus) {
          
            item.Packages = _.floor(item.Packages, 4);
            item.Quantity = _.floor(item.Quantity, 4);
            let ispack = item.ReportingUnit == 1; //是否走辅计量
            if (ispack) {
                let curpack = _.round(plus ? item.Packages + 1 : item.Packages - 1, 4);
                item.Packages = curpack > 0 ? curpack : 0;
                item.Quantity = 0;
            } else {
                let curqua = _.round(plus ? item.Quantity + 1 : item.Quantity - 1, 4);
                item.Quantity = curqua > 0 ? curqua : 0;
                item.Packages = 0;
            }
            this.addGoodToCart(item);
        },
        numberInputChange(item) {
            item.Packages = _.floor(item.Packages, 4);
            item.Quantity = _.floor(item.Quantity, 4);
            this.addGoodToCart(item);
        },
        /** 页面被激活时回退当时加入购物车数量 */
        restoreListData() {
            let listA = this.cartGoodList; //原购物车
            let listB = this.goodlist; //当前页面数据
            if (listB.length > 0) {
                listB.forEach(item => {
                    let cur = listA.find(f => f.ProductID == item.ProductID) || {};
                    item.Quantity = cur.Quantity || 0;
                    item.Packages = cur.Packages || 0;
                });
            }
        },
        standardPackChange(item, val) {
            if (item.ReportingUnit != val) {
                item.ReportingUnit = val;
                /** 切换标包后清空值,否则会影响购物车记录 */
                item.Packages = 0;
                item.Quantity = 0;
                this.addGoodToCart(item);
            }
        },
        pullRefresh() {
            this.loadFirst();
            this.pullLoading = false;
        },
    }
}