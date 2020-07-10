// vuex核心管理对象模块:store
import Vue from 'vue';
import Vuex from 'vuex';

// 声明使用Vuex
Vue.use(Vuex)

//状态对象
 const state = {
  count:0 //初始化状态
 }
 //包含多个更新state函数的对象
const mutations = {
   
 }

 //包含多个对应事件回调函数的对象
const actions = {
   
 }

 //包含多个getter计算属性函数的对象
const getters = {
   
 }


// store是Vuex内部的构造函数
export default new Vuex.Store({
  state, //状态对象
  mutations, //包含多个更新state函数的对象
  actions,  //包含多个对应事件回调函数的对象
  getters  //包含多个getter计算属性函数的对象
}) 
