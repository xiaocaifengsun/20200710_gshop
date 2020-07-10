import Vue from 'vue'
import money from './money'
import datetime from './datetime'
import orderstatus from './orderstatus'

let all = {
    money,
    datetime,
    orderstatus,
};

Object.keys(all).forEach(key => {
    Vue.filter(key, all[key])
})