/** 记录页面滚动位置 */

export default {
    data() {
        return {
            SCROLL_TOP: 0,//当前页面滚动的位置
        }
    },
    activated() {
        if (this.SCROLL_TOP > 0) {
            window.scrollTo(0, this.SCROLL_TOP);
        }
        window.addEventListener('scroll', this._scrollHandler);
    },
    deactivated() {
        window.removeEventListener('scroll', this._scrollHandler);
    },
    methods: {
        _scrollHandler() {
            this.SCROLL_TOP = document.documentElement.scrollTop || document.body.scrollTop;
        },
    }
}