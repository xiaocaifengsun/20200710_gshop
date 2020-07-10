export default function money(val, precision) {
    if (val == null) return val;
    val = Math.abs(val);
    precision = precision || 2;
    val = _.round(val, precision);
    return val.toFixed(precision).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}