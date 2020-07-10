import {
    mapGetters,
    mapMutations
} from "vuex";
import * as cartTypes from "@/store/cart/types";
import * as storeTypes from "@/store/store/types";
import * as orderTypes from "@/store/order/types";
import * as apiOrder from "@/api/order";
import * as apiPurchase from '@/api/purchase';

export default {
    async created() {
        this.req.customerid = this.ENTID;
    },
    async activated() {
        this.setLoadFirst(this.$route.meta.shouldFlushData);
        if (this.loaded) {
            /** 判定需要加载的数据页 */
            if (this.isFlush) {
                this.setIsFlush(false);
                if (!_.isNil(this.flushPageIndex)) {
                    this.flushPageIndexAfterData(this.flushPageIndex);
                }
                this.setFlushPageIndex(null);
            } else if (this.isLoadFirst) {
                this.setLoadFirst(false);
                this.initData();
                this.loadFirst();
            }
        }

        if (!this.loaded) this.loaded = true;
        /** 页面被重新激活时刷新重要信息 */
        await this.GET_ENTID();
    },
    watch: {
        ENTID(val) {
            this.req.customerid = val;
        },
        req: {
            deep: true,
            handler: _.debounce(function (val) {
                this.loadFirst();
            }, 100)
        },
        pullLoading(val) {
            if (val) this.error = false;
        }
    },
    computed: {
        ...mapGetters("store", {
            supplierId: storeTypes.SUPPLIER_ID,
        }),
        ...mapGetters("order", {
            flushPageIndex: orderTypes.PAGEINDEX,
            isFlush: orderTypes.ISFLUSH,
            isLoadFirst: orderTypes.LOADFIRST,
        })
    },
    beforeRouteEnter(to, from, next) {
        let notFlushArrPage = ["/cart/index", "/order/"]; //不需要刷新的来源页面
        let path = from.path;
        to.meta.shouldFlushData = !notFlushArrPage.some(item => {
            return path.startsWith(item);
        })
        next()
    },
    methods: {
        ...mapMutations("cart", {
            setCartGoodList: cartTypes.SET_GOODLIST
        }),
        ...mapMutations("order", {
            setFlushPageIndex: orderTypes.SET_PAGEINDEX,
            setIsFlush: orderTypes.SET_ISFLUSH,
            setLoadFirst: orderTypes.SET_LOADFIRST,
            clearOrderAuxiliary: orderTypes.CLEAR_AUXILIARY, // //设置订单辅助信息
        }),
        ...mapMutations("store", {
            setSelectedSupplier: storeTypes.SET_SUPPLIER_INFO,
            // setSupplierList: storeTypes.SET_SUPPLIER_LIST
        }),
        initData() {
            this.active = "all-0";
            this.req.distributiondtatus = 0;
            this.reqdata.pageindex = 0;
        },
        onLoad() {
            let req = _.assign({}, this.req, this.reqdata);
            let curreq = this._clone(this.req);
            this.preReq = curreq;
            this.loading = true;
            this.showNoMore = false;
            this.$get(
                apiOrder.orderList,
                req,
                res => {
                    if (!_.isEqual(this.preReq, curreq)) return;
                    this.loading = false;
                    this.error = false;
                  
                    let list = res.listdetail || [];
                    let total = res.total || 0;
                    this.list = _.concat(this.list, list);
                    this.finished = this.list.length >= total || list.length == 0;
                    this.showNoMore = this.finished;
                    if (!this.finished) this.reqdata.pageindex += 1;
                },
                err => {
                    this.loading = false;
                    if (err.code == 1 && this.list.length == 0) {
                        this.error = false;
                        this.showNoMore = true;
                        this.finished = true;
                    } else {
                        this.error = true;
                        this.finished = false;
                    }
                }
            );
        },
        async buyAgain(numericalOrder) {
           
            if (!numericalOrder) return;
            this._showLoading();
            let res = await this.$get(apiOrder.orderInfo, {
                numericalorder: numericalOrder
            });
            let goods = res.item2; //获取到商品信息，但是数据不全面,重新购买先不考虑商品下架问题
            goods = goods.map(f => {
                return {
                    ProductID: f.ProductID,
                    Quantity: f.Quantity,
                    Packages: f.Packages,
                }
            });

            /** 产品要求，直接把供应商切换成当前要再次购买的供应商，供应商不存在了就提示阻止 */
            await this.switchSupplier(res.item1.SupplierID);

            let reqGoodListParams = {
                customerid: this.ENTID,
                enterpriseid: res.item1.SupplierID, // this.supplierId
                datadate: this._getDate(),
                pageindex: 0,
                pagesize: goods.length,
                productidlist: goods.map(f => f.ProductID).toString(),
            };

            let resl = await this.$get(apiPurchase.goodList, reqGoodListParams, res => {}, err => {
                this.$toast({
                    message: "再次购买,获取商品列表失败",
                    duration: 2000
                });
            });
            let list = resl.list || [];
            if (list.length == 0) {
                this._hideLoading();
                this.$dialog.alert({
                    message: "未获取到商品信息,可能商品已下架"
                });
                return;
            }
            list.forEach(f => {
                let curGood = goods.find(g => g.ProductID == f.ProductID) || {};
                f.Quantity = curGood.Quantity || 0;
                f.Packages = f.bIsStandardPack ? 0 : curGood.Packages || 0;
            });
            let lastlist = list.filter(f => f.Quantity > 0 || f.Packages > 0);
            let lengLastList = lastlist.length;
            let lengList = list.length;
            let lengGoods = goods.length;

            let strInfo = "";
            if (lengLastList == 0) {
                strInfo = "该订单商品已全部失效，请重新选择";
            } else {
                if (lengList < lengGoods) strInfo = `${lengGoods - lengList}种商品已下架${lengLastList < lengList ? "," : ""}`;
                /** 商品发生过变化,由非标品转变为标品,且只购入Packages */
                if (lengLastList < lengList) strInfo += `${lengList - lengLastList}种是否标品发生变化`;
                if (strInfo) strInfo = `${lengGoods - lengLastList}种商品已失效（${strInfo}）`; //X种商品已失效（X种已下架，X种是否标品发生变化）
            }
            strInfo && this.$toast({
                message: strInfo,
                duration: 2000
            });

            this.setCartGoodList(lastlist);
            this._hideLoading();
            if (lengLastList > 0) this.$router.push({
                path: "/cart/index"
            });
        },
        deleteOrder(numericalOrder, daIndex) {
            if (!numericalOrder) return;
            let curPageIndex = this.getCurrentPageByIndex(daIndex);
            this.$dialog
                .confirm({
                    message: "确认删除该订单？"
                }).then(async () => {
                    this._showLoading();
                    await this.$get(
                        apiOrder.deleteOrder, {
                            numericalorder: numericalOrder
                        },
                    );
                    /** 删除指定页数据，那需要刷新指定页，并排除之后加载的页数据 */
                    this.flushPageIndexAfterData(curPageIndex);
                    this._hideLoading();
                })
                .catch(e => {});
        },
        getCurrentPageByIndex(ind) {
            let pageindex = Math.floor(ind / this.reqdata.pagesize); //从0开始用floor,从1开始用ceil
            return pageindex;
        },
        /** 移除指定索引之后的数据，配合列表会发生变化时使用 */
        splicePageIndexAfterData(pageindex) {
            if (this.list.length > 0) {
                this.list = _.take(this.list, pageindex * this.reqdata.pagesize);
            }
        },
        viewDetail(numericalorder, ind) {
            if (!numericalorder) return;
            this.setFlushPageIndex(this.getCurrentPageByIndex(ind));
            this.$router.push(`/order/detail/${numericalorder}`);
        },
        viewDelivery(item, ind) {
            this.clearOrderAuxiliary(); //清除上一次关联信息

            if (!item.NumericalOrder) return;
            this.setFlushPageIndex(this.getCurrentPageByIndex(ind));
            //this.$router.push(`/order/delivery/${numericalorder}`);
            this.$router.push({
                name: 'orderDelivery',
                params: {
                    numericalorder: item.NumericalOrder,
                    enterpriseid: item.EnterpriseID
                }
            });
        },
        /** 刷新指定页的数据并排除之后加载的页数据 */
        flushPageIndexAfterData(pageindex) {
            this.splicePageIndexAfterData(pageindex);
            this.reqdata.pageindex = pageindex;
            this.onLoad();
        },
        tabChange(name) {
            let sta = name.split("-")[1];
            this.req.distributiondtatus = sta;
        },
        loadFirst() {
            this.showNoMore = false;
            this.error = false;
            this.reqdata.pageindex = 0;
            this.list = [];
            this.onLoad();
        },
        pullRefresh() {
            this.loadFirst();
            this.pullLoading = false;
        },
        switchSupplier(supplierId) {
            return new Promise(async (resolve, reject) => {
                let list = await this.$get(apiPurchase.supplierList, {
                    enterpriseid: this.ENTID, itype: 0
                });
                let curSupplier = list.find(f => f.EnterpriseID == supplierId);
                if (!_.isEmpty(curSupplier)) {
                    this.setSelectedSupplier(curSupplier);
                    resolve(curSupplier);
                } else {
                    this._hideLoading();
                    this.$toast("该供应商已与您解除交易关系，请重新选择")
                }
            });
        },
    }
}