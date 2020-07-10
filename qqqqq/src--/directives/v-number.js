import Vue from 'vue';

Vue.directive('number', {
    bind: function (ele, binding, vnode) {
        let el = ele.tagName === 'INPUT' ? ele : ele.querySelector('input');

        let reg = null;

        let _nug = false;//负数
        let _max = null;
        let _min = null;
        let _float = 0;
        for (var t in binding.modifiers) {
            var ts = t.split(":");
            var op = ts[0];
            if (ts.length == 1) {
                if (!isNaN(op)) {
                    _float = op;
                } else if (op == "nug") {
                    _nug = true;
                }
            } else {
                var val = ts[1];
                switch (op) {
                    case "float": {
                        _float = val;
                    } break;
                    case "max": {
                        _max = val;
                    } break;
                    case "min": {
                        _min = val;
                    } break;
                }
            }
        }

        reg = _float > 0 ? new RegExp("^" + (_nug ? "-?" : "") + "\\d*(\\.?\\d{0," + _float + "})", "g")
            : new RegExp("^" + (_nug ? "-?" : "") + "\\d*", "g");

        if (!el.handlerinput) {
            el.handlerinput = function () {
                var tval = el.value.match(reg)[0];
                var lastind = tval.length - 1;
                if (tval != "" && tval.lastIndexOf(".") != lastind && tval.lastIndexOf("-") != lastind) {

                    let _lstr = "";
                    if (_float > 0) {
                        var _tval = tval.split(".");
                        if (_tval.length == 2) {
                            var v = _tval[1];
                            if (Number(v) == 0) {
                                _lstr = "." + v;
                            }
                        }
                    }

                    tval = Number(tval);

                    if (_min != null) {
                        if (tval < _min) tval = _min;
                    }
                    if (_max != null) {
                        if (tval > _max) tval = _max;
                    }

                    if (_lstr) {
                        tval += _lstr;
                    }
                }

                el.value = tval;
                if (binding.expression) {
                    vnode.context[binding.expression] = tval;
                }
            }
            el.addEventListener('input', el.handlerinput);
        }
        el.handlerinput();

        if (!el.handlerblur) {
            el.handlerblur = function () {
                let val = el.value;
                let lastind = val.length - 1;
                let newVal = null;
                if (el.value.lastIndexOf('.') == lastind) {
                    el.value = val.substring(0, val.lastIndexOf('.'));
                    newVal = el.value;
                } else if (val.lastIndexOf('-') == lastind) {
                    el.value = val.substring(0, val.lastIndexOf('-'));
                    newVal = el.value;
                }
                if (binding.expression && newVal != null) {
                    vnode.context[binding.expression] = newVal;
                }
            }
            el.addEventListener('blur', el.handlerblur);
        }
    },
    unbind: function (el) {
        el.removeEventListener('input', el.handlerinput);
        el.removeEventListener('blur', el.handlerblur);
    }
});