/** 订单状态 */
export default function orderstatus(val) {
    if (_.isNil(val) || val == "") return "未知";
    return val == 0 ? "全部"
        : val == 1 ? "待处理"
            : val == 2 ? "待发货"
                : val == 3 ? "待收货"
                    : val == 4 ? "已完成"
                        : "未知";
}