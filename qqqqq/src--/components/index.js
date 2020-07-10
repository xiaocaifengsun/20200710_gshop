import Vue from 'vue';
import xImg from './x-img';
import noList from './no-list';

let all = {
    xImg,
    noList
};

Object.keys(all).forEach(key => {
    Vue.component(key, all[key])
})