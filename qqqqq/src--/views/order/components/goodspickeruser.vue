<template>
<div class="sort_picker" >
<!-- <div class="sort_picker" v-if="sortpicker.show"> -->
	<div v-if="!loadingstate">
		<ul v-if="sortpicker.data.length > 0">
			<li v-for="(item_1,i1) in sortpicker.data" @click="sort_switch_fun(item_1,i1)" :key="item_1.ClassificationID">
				<div class="clear f_items">
					<div class="item8 " :class="{'action':item_1.state}">
						<van-icon name="arrow-down" v-if="item_1.childClassification.length>0"/>
						<span v-else>&nbsp;</span>
					</div>
					<div class="item72" v-if="sortpicker.index==1">
						{{item_1.classificationName}} 
					</div>
					<div class="item72" v-else>
						{{item_1.ClassificationName}} 
					</div>
					<div class="item20 t_r" v-if="modify">
						<div class="item50" @click.stop="add_item_fun(item_1,i1)" v-if="permission.add">
							<i class="van-icon van-icon-plus" v-if="permission.add"></i>
						</div>
						<div class="item50" v-else>&nbsp;</div>
						<div class="item50" @click.stop="operation_item_fun(item_1,i1)">
							<!--<img src="@/static/images/qidian/ellipsis.jpg" />-->
						</div>
					</div>
				</div>
				<ul v-for="(item_2,i2) in item_1.childClassification" v-show="item_1.state" :key="item_2.ClassificationID">
						<li @click.stop>
			 			<div class="clear t_items">
			 				<div class="item16" :class="{'action':item_2.state}" @click.stop="sort_switch_fun(item_2,i1,i2)">
									<van-icon name="arrow-down" v-if="item_2.childClassification.length>0"/>
									<span v-else>&nbsp;</span>
			 				</div>
			 				<div class="item64" v-if="sortpicker.index==1" @click.stop="sort_switch_fun(item_2,i1,i2)">
			 					{{item_2.classificationName}}
			 				</div>
			 				<div class="item64" v-else @click.stop="sort_switch_fun(item_2,i1,i2)">
			 					{{item_2.ClassificationName}}
			 				</div>
							<div class="item20 t_r" v-if="modify">
								<div class="item50" @click.stop="add_item_fun(item_2,i1,i2)" v-if="permission.add">
									<i class="van-icon van-icon-plus"></i>
								</div>
								<div class="item50" v-else>&nbsp;</div>
								<div class="item50" @click.stop="operation_item_fun(item_2,i1,i2)">
									<!--<img src="@/static/images/qidian/ellipsis.jpg" />-->
								</div>
							</div>
			 			</div>
							<ul v-if = "item_2.childClassification.length > 0" v-show = "item_2.state" >
								<li v-for="(item_3,i3) in item_2.childClassification" @click.stop :key="item_3.ClassificationID">
					 			<div class="clear th_items">
					 				<div class="item24" >&nbsp;</div>
					 				<div class="item56" v-if="sortpicker.index==1"  @click.stop="sort_switch_fun(item_3,i1,i2,i3)">{{item_3.classificationName}}</div>
					 				<div class="item56" v-else  @click.stop="sort_switch_fun(item_3,i1,i2,i3)">{{item_3.ClassificationName}}</div>
					 				
									<div class="item20 t_r" v-if="modify">
										<div class="item50" >&nbsp;</div>
										<div class="item50" @click.stop="operation_item_fun(item_3,i1,i2)">
											<!--<img src="@/static/images/qidian/ellipsis.jpg" />-->
										</div>
									</div>
					 			</div>
								</li>
							</ul>
						</li>
					</ul>		
			</li>
		</ul>
    <!--<resultnull v-else /> -->
		<div style="height:0.96rem"></div>
		<template v-if="modify">
			<div id="footer" class="footer t_c" v-if="permission.add">
				<a href="javascript:;" class="btn1 btn" @click="modify = false">返回</a>
				<a href="javascript:;" class="btn2 btn" @click="add_item_fun()">创建一级分类</a>
			</div>
			<div id="footer" class="footer t_c" v-else @click="modify = false"> 返回 </div>
		</template>
		<template v-else>
			<template v-if="sortpicker.index == 0">
				<div class="footer t_c" v-if="permission.manage">
					<a href="javascript:;" class="btn1 btn" @click="sort_hide_fun()">返回</a>
					<a href="javascript:;" class="btn2 btn" @click="modify = true">管理</a>
				</div> 
				<div class="footer t_c" @click="sort_hide_fun()" v-else>返回</div> 
			</template>
			<div class="footer t_c" @click="sort_hide_fun()" v-if="sortpicker.index == 1">返回</div>
		</template>
	</div>
		<!--<loading :loadingstate="loadingstate"/>-->
    <van-popup v-model="add_alert_show" z-index="2000"></van-popup>
    <div class="add_alert" v-if="add_alert_show">
      <div class="head">
        <div class="head_title">{{add_alert_title}}</div>
        <div class="head_close" @click="add_alert_show = false">
          <van-icon name="cross" />
        </div>
      </div>
      <div class="content">
        <input type="text" v-model="add_alert_val" placeholder="输入分类名称" @keyup.enter="operation_submit_fun()" v-focus_dir/>
        <div class="foot" @click="operation_submit_fun()">保存</div>
      </div>
    </div>
  <div class="operation" v-if="operation_alert_show">
   	<van-popup @close="$emit('close')" v-model="operation_alert_show" z-index="2000"></van-popup>
    <ul>
      <li @click="operation_switch_fun(1)" v-if="permission.delete">删除分类</li>
      <li @click="operation_switch_fun(2)" v-if="permission.edit">修改分类</li>
      <li @click="operation_alert_show=false">取消</li>
    </ul>
  </div>
</div>		
</template>
<script>
// import {
// 	groupclasslistbyenter,
// 	mdsecclassification,
// 	addProductCategory,		//添加商品分类
// 	removeProductCategory,	//删除商品分类
// 	updateProductCategory,		//修改商品分类
//   checkProductCategory,  //验证数据是否重复
// } from "@/services/qidian/index.js";
// import loading from '../components/loading.vue';
// import resultnull from './resultnull.vue'


// import {
// 	groupclasslistbyenter,
// 	mdsecclassification,
// 	addProductCategory,		//添加商品分类
// 	removeProductCategory,	//删除商品分类
// 	updateProductCategory,		//修改商品分类
//   checkProductCategory,  //验证数据是否重复
// } from "@/services/qidian/index.js";
// import loading from '../components/loading.vue';
// import resultnull from './resultnull.vue'



import Vue from "vue";
import { Popup } from "vant";
Vue.use(Popup);

import * as apiOrder from "@/api/order";



export default{
	name:"goodspickeruser",
	components:{
		// loading:loading,
		// resultnull:resultnull
	},
  directives:{
   	focus_dir: {
      inserted(el) {
        el.focus();
      }
    }
  },
	props:{
		sortpicker:{    // 插件需要展示的数据
			default(){
				return {
					index:0,		// 0 系统数据   1 用户数据
			 		show:[false,false],		// 0 系统分类插件显示   1 用户分类插件显示
			 		all_datas:[],			//用于缓存的数据
			 		data:[],		//展示的数据
			 		// manage:true,		//是否有修改的权限
				}
			}
		},
		submitdata:{   //赋值的对象
		},
		permissionCode:{   //是否有管理权限 默认从浏览器获取
			default:sessionStorage.getItem('codename'),
		}
	},
	data(){
		return {
			loadingstate:false, 	//  加载遮罩层
			modify:false,
			add_alert_show:false,     //修改弹出框 
			add_alert_title:"新增分类",
			add_alert_val:"",    
			item_data:{},
			// item_index:[],
			operation_alert_show:false,
			adddate:true,   //判断用户是新增还是 修改
			// permissionCode:sessionStorage.getItem('codename'),
		}
	},
	computed: {
    permission() {
      let code = this.permissionCode;
      return {
        edit: (code & 8) == 8,
        add: (code & 2) == 2,
        delete: (code & 4) == 4,
        manage:(code & 1)==1 
      };
    }
  },
	mounted(){
		this.init_fun()
	},
	methods:{
		//
		init_fun(){
			this.loadingstate = true
			this.sort_data_fun().then(res => {
				this.loadingstate = false
				if(res.length > 0){
				}
			})
		},
		//  新增  和 修改的区分
		async operation_submit_fun(){
			if(this.add_alert_val == ""){
				this.$toast("请输入分类名称")
				return false
			}
			if(this.adddate){    
				this.operation_add_fun()
			}else{
				this.operation_update_fun();
			}
			// this.add_alert_val = ""
			// this.add_alert_show = false;
		},
		//全部状态
		clear_switch_fun(){

		},
//删除和 修改按钮
		operation_switch_fun(v){
			let _this = this;
			if(v==1){ //删除
				this.operation_delete_fun();
			}else if(v==2){ //修改
				this.add_alert_title = "修改分类"
				this.adddate=false;
				this.add_alert_val = this.item_data.ClassificationName;
				this.add_alert_show = true;
			}
			this.operation_alert_show=false;
		},
 //递归还原之前展开状态
    recursionList(olds, news) {
      let self = this;
      if (
        Array.isArray(olds) &&
        olds.length > 0 &&
        Array.isArray(news) &&
        news.length > 0
      ) {
        news.forEach(f => {
          let old = olds.find(ff => ff.ClassificationID == f.ClassificationID);
          if (old != null) {
            f.state = old.state;
            self.recursionList(old.childClassification, f.childClassification);
          }
        });
      }
    },
		async sort_data_fun(){
			// let i = this.sortpicker.index
			// if (this.sortpicker.all_datas[i] == undefined) {
			// 	let arr = []
			// 	let _this= this
			// 	if(i == 0){
			// 		arr = []
			// 		let params = {
			// 			"enterpriseid":sessionStorage.getItem('eid'),
			// 			"classificatinname":""
			// 		}
			// 		await groupclasslistbyenter(params).then(res => {
			// 			this.loadingstate = false;
			// 			arr = res.data;
			// 				let obj = {
			// 				"ClassificationID": "",
			// 				"ClassificationName": "全部",
			// 				"CreatedDate": "",
			// 				"EnterpriseID": "",
			// 				"IsUse": "",
			// 				"ModifiedDate": "",
			// 				"PID": "0",
			// 				"Rank": "",
			// 				"Sort": "",
			// 				"cFullClassName": "",
			// 				"childClassification": []
			// 			}
			// 			arr.unshift(obj)
					
      //     	_this.recursionList(_this.sortpicker.data, arr);
			// 		}).catch((res)=>{
			// 			this.loadingstate = false;
			// 		})
			// 	}else if(i == 1){
			// 		this.loadingstate = true
			// 		let params = {
			// 			"query_type":"2",
			// 			"category_type":"BACKGROUND_GATEGORY"
			// 		}
			// 		await mdsecclassification(params).then(res => {
			// 			this.loadingstate = false;
			// 			arr = res.data;
			// 		}).catch((res)=>{
			// 			this.loadingstate = false;
			// 		})
			// 	}
			// 	this.$set(this.sortpicker.all_datas,i,arr)
			// 	this.sortpicker.data = this.sortpicker.all_datas[i];
			// 	this.sortpicker.data = arr
			// }else{
			// 	this.sortpicker.data = this.sortpicker.all_datas[i];
			// }
			// return this.sortpicker.data


			let i = this.sortpicker.index
			if (this.sortpicker.all_datas[i] == undefined) {
				let arr = []
				let _this= this
				if(i == 0){
					arr = []
					let params = {
						"enterpriseid":this.ENTID,
						"classificatinname":""
					}


          let res = await this.$get(
            apiOrder.groupclasslistbyenter,
            params,
            res => {},
            err => {
              this.loadingstate = false;
              this.$toast({ message: "获取商品列表失败", duration: 2000 });
            }
          );

          this.loadingstate = false;
          arr = res;
            let obj = {
            "ClassificationID": "",
            "ClassificationName": "全部",
            "CreatedDate": "",
            "EnterpriseID": "",
            "IsUse": "",
            "ModifiedDate": "",
            "PID": "0",
            "Rank": "",
            "Sort": "",
            "cFullClassName": "",
            "childClassification": []
          }
          arr.unshift(obj)

          _this.recursionList(_this.sortpicker.data, arr);


        }
     

        this.$set(this.sortpicker.all_datas,i,arr)
        this.sortpicker.data = this.sortpicker.all_datas[i];
        this.sortpicker.data = arr
      }else{
        this.sortpicker.data = this.sortpicker.all_datas[i];
      }
      return this.sortpicker.data
	// let i = this.sortpicker.index
			// if (this.sortpicker.all_datas[i] == undefined) {
			// 	let arr = []
			// 	let _this= this
			// 	if(i == 0){
			// 		arr = []
			// 		let params = {
			// 			"enterpriseid":sessionStorage.getItem('eid'),
			// 			"classificatinname":""
			// 		}
			// 		await groupclasslistbyenter(params).then(res => {



			// 			this.loadingstate = false;
			// 			arr = res.data;
			// 				let obj = {
			// 				"ClassificationID": "",
			// 				"ClassificationName": "全部",
			// 				"CreatedDate": "",
			// 				"EnterpriseID": "",
			// 				"IsUse": "",
			// 				"ModifiedDate": "",
			// 				"PID": "0",
			// 				"Rank": "",
			// 				"Sort": "",
			// 				"cFullClassName": "",
			// 				"childClassification": []
			// 			}
			// 			arr.unshift(obj)
					
      //     	_this.recursionList(_this.sortpicker.data, arr);
			// 		}).catch((res)=>{
			// 			this.loadingstate = false;
			// 		})
			// 	}else if(i == 1){
			// 		this.loadingstate = true
			// 		let params = {
			// 			"query_type":"2",
			// 			"category_type":"BACKGROUND_GATEGORY"
			// 		}
			// 		await mdsecclassification(params).then(res => {
			// 			this.loadingstate = false;
			// 			arr = res.data;
			// 		}).catch((res)=>{
			// 			this.loadingstate = false;
			// 		})
			// 	}
			// 	this.$set(this.sortpicker.all_datas,i,arr)
			// 	this.sortpicker.data = this.sortpicker.all_datas[i];
			// 	this.sortpicker.data = arr
			// }else{
			// 	this.sortpicker.data = this.sortpicker.all_datas[i];
			// }
			// return this.sortpicker.data


		},
		//  修改删除 操作按钮
		async operation_item_fun(item,i1,i2,i3){
			if(!this.permission.delete && !this.permission.edit){
				this.$toast("你没有删除和修改的权限");
				return false
			}
			this.item_data = item;
			this.operation_alert_show=true;
		},
		//增加分类 出现保存分类弹层
		async add_item_fun(item,i1,i2){
			this.add_alert_val = ""
			this.add_alert_title="新增分类",
			this.adddate=true;
			this.item_data = item
			this.add_alert_show = true;
		},
		// 自定义插件消失
		sort_hide_fun(){
			this.$set(this.sortpicker.show,this.sortpicker.index,false)
		},
		// 自定义插件 选择
		sort_switch_fun(item,i1,i2,i3){
			if(item.childClassification.length>0){
				if(item.state ==undefined){
					this.$set(item,"state",true);
				}else{
					item.state = !item.state;
				}
			}else{
				this.loadingstate = true
				setTimeout(()=>{
					this.loadingstate = false
					// this.sortpicker.show = false;
					this.$set(this.sortpicker.show,this.sortpicker.index,false)
				},200)
				if(this.sortpicker.index == 0){
					this.submitdata.cFullClassName=item.cFullClassName;
					this.submitdata.ClassificationID = item.ClassificationID
				}else if(this.sortpicker.index == 1){
					this.submitdata.SysClassificationID = item.id
					this.submitdata.cFullName=item.classificationFullName;
				}
			}
		},
		operation_add_fun(){   //增加数据
			let addProductCategory_params={
				classificationid:"",				//分类ID
				classificationname:this.add_alert_val,				// 分类名称
				pid:this.item_data? this.item_data.ClassificationID:0,						//  父级分类ID
				enterpriseid:sessionStorage.getItem('eid'),   //单位ID
			}
			let _this = this
			addProductCategory(addProductCategory_params).then(res=>{
				if (res.code == 0) {
					// this.$toast("添加成功");
          this.$toast({
            duration:2000,
            message:"添加成功"
          });					
					this.sortpicker.all_datas[this.sortpicker.index] = undefined;
		    	_this.sort_data_fun();


					this.add_alert_show = false;

					if(_this.item_data != undefined){
						_this.item_data.state=true
					}
        } else {
        	if(res.msg == "同一节点下不允许出现重复商品代号分类"){
        		res.msg="分类名称已存在，请重新输入"
        	}



          this.$toast(res.msg);
        }
			}).catch((res)=>{
				this.loadingstate = false;
          this.$toast({
            duration:2000,
            message:"添加成功"
          });		
			});
		},
		async operation_update_fun(){   //修改数据\
			// if(this.add_alert_val == this.item_data.ClassificationName){
			// 	this.$toast("商品分类名称重复!");
			// 	return false;
			// }
      let param = {
        classificationid:this.item_data.ClassificationID,    //分类ID
        classificationname: this.add_alert_val,					//分类名称
        pid:this.item_data? this.item_data.ClassificationID:0,					//父级分类ID
        enterpriseid: sessionStorage.getItem('eid'),			//单位ID
      };


      // let isok = await this.checkName();
      // if (isok) {
	      updateProductCategory(param).then(res => {
	        if (res.code == 0) {
						this.$toast({
              duration:2000,
              message:"修改成功"
            });         

						this.add_alert_show = false;
		    		this.sortpicker.all_datas[this.sortpicker.index] = undefined;
		    		this.sort_data_fun();
			    	// })
	        } else {
	          this.$toast(res.msg);
	        }
	      }).catch((res)=>{
					this.loadingstate = false;

					this.$toast({
            duration:2000,
            message:"操作失败，请稍后再试！"
          });         

				});
     	// }
		},
		//验证数据是否重复
		async checkName() {
      let self = this;
      let reqdata = {
        enterpriseid: sessionStorage.getItem('eid'),			// 单位ID
        pid: this.item_data? this.item_data.PID:0,						//父级分类ID
       classificationid: this.item_data.ClassificationID,				//分类ID
        classificationname: this.add_alert_val   					//分类名称
      };

      let state = await checkProductCategory(reqdata).then(res => {
        if (res.code == 0) {
        } else {
          this.$toast(res.msg);
        }
        return res.code == 0;
      }).catch((res)=>{
				this.loadingstate = false;
	
					this.$toast({
            duration:2000,
            message:"操作失败，请稍后再试！"
          });  		    
			});
      return state;
    },
		operation_delete_fun(){  	//删除 数据
			this.$dialog
				.confirm({
					title: "确认删除该分类？",
					// message: "确认删除该分类？"
				})
				.then(() => {
					if(this.item_data.childClassification.length>0){
						this.$toast("该分类存在子分类，请删除后重试");
						return false
					}
					let removeProductCategory_params = {
						"classificationid": this.item_data.ClassificationID
					}
					removeProductCategory(removeProductCategory_params).then(res => {
						let _this = this
		        if (res.code == 0) {
		          // this.$toast("删除成功");
              this.$toast({
                duration:2000,
                message:"删除成功"
              });
		       //  	this.$dialog.alert({
					    //   message: "删除分类成功"
				    	// }).then(()=>{
				    		this.sortpicker.all_datas[this.sortpicker.index] = undefined;
				    		_this.sort_data_fun();
				    	// })
		        } else {

		        	if(res.msg == "该商品代号已被使用，无法删除"){
		        		res.msg= "该分类已存在业务单据，请删除后重试"
		        	}

		          this.$toast(res.msg);
		        }
		      }).catch((res)=>{
						this.loadingstate = false;
						this.$toast({
	            duration:2000,
	            message:"操作失败，请稍后再试！"
	          });  

					});
				})
		},
	},

}	
</script>
<style lang="less" scoped>
.operation {
  ul {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 20006;
    li {
      height: 0.96rem;
      line-height: 0.96rem;
      text-align: center;
      border-bottom: 1px solid #e9ebef;
    }
  }
}
.add_alert{
  width: 6rem;
  position: fixed;
  left: 50%;
  top: 30%;
  margin-left: -3rem;
  background: #fff;
  z-index: 2009;
  border-radius: 8px;
  overflow: hidden;
  .head {
    height: 1rem;
    line-height: 1rem;
    font-size: 0.34rem;
    color: #20242a;
    padding-left: 0.4rem;
    font-weight: 700;
    border-bottom: 1px solid #edecee;
    background: #fbfbfc;
    position: relative;
  }
  .head_close {
    position: absolute;
    right: 0.25rem;
    color: #c9c9ca;
    top: 0.12rem;
    font-size: 0.45rem;
    width: 0.7rem;
    height: 0.7rem;
    line-height: 0.95rem;
    text-align: center;
  }
  .content {
    padding: 0.4rem 0.4rem;
    input {
      width: 100%;
      border: 1px solid #dfdfe2;
      height: 0.94rem;
      border-radius: 5px;
      padding: 0 0 0 0.3rem;
      font-size: 0.3rem;
    }
    input::-webkit-input-placeholder {
      color: #dfdfe0;
    }
    .foot {
      margin-top: 0.4rem;
      height: 0.96rem;
      text-align: center;
      background: #3388ff;
      color: #fff;
      line-height: 0.96rem;
      font-size: 0.3rem;
      border-radius: 5px;
    }
  }

}	
.sort_picker{
	position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #FFF;
  overflow: auto;
  padding: 0 0 0 0.3rem;
  z-index: 10;
	.van-icon-arrow-down{
    height: 0.38rem;
    font-size: 0.34rem;
    color: #a8abaf;
    line-height:0.38rem;
    vertical-align: -0.04rem;
			// -webkit-transform-origin:50% 50%;
			// transform-origin:50% 50%;
    -webkit-transition:all 0.3s;
    transition:all 0.3s;
	}
 	.action{
 		.van-icon-arrow-down{
			-webkit-transform: rotate(180deg);
			transform: rotate(180deg);

			// -webkit-transform-origin:50% 50%;
			// transform-origin:50% 50%;
    	-webkit-transition:all 0.3s;
    	transition:all 0.3s;
    	    vertical-align: -0.02rem;
 		}
 	}	
	.van-icon-success{
       height: 0.38rem;
    font-size: 0.34rem;
    color: #3388ff;
    line-height: 0.38rem;
    vertical-align: -0.07rem;
    position: absolute;
    right: 0.3rem;
    top: 0.32rem;
	}

	.clear{
    border-bottom: 1px solid #e9ebef;
    line-height: 0.59rem;
    padding: 0.2rem 0rem 0.2rem 0;
    position: relative;
 	}

}
.footer{
	border-top:1px solid #3388ff;;
	height:0.96rem;
	line-height:0.96rem;
	position:fixed;
	left:0;
	right:0;
	bottom:0;
  z-index: 10;
  background:#3388ff;
 	color:#FFF;
	 .btn{
	 	width:50%;
	 	display:block;
		float:left;
    border-bottom: 1px solid #3388ff;
	 }
	 .btn2{
	 	background:#3388ff;
	 	color:#FFF;
	 }
	 .btn1{
	 	background:#FFF;
	 	color:#3388ff;

	 }
}
.t_c{
	text-align:center;
}
.item8{
  width: 8%;
  float: left;
  text-align: right;
  padding-right: 0.15rem;	
}
.item16{
  width: 16%;
  float: left;
  text-align: right;
  padding-right: 0.15rem;	}
.item24{
	width:24%;
	float: left;
}
.item92{
	width:92%;
	float: left;
}
.item64{
	width:64%;
	float: left;
}
.item72{
	width:72%;
	float: left;
}
.item78{
	width:78%;
	float: left;
}

.item66{
	width:66%;
	float: left;
}

.item20 {
  width:20%;
  float: left;
  .item50 {
    text-align: center;
  }
  .van-icon-plus {
    display: block;
    line-height: 0.59rem;
    color: #cacaca;
  }
  img {
    width: 0.25rem;
    height: 0.05rem;
  }
}
.item50 {
  width: 50%;
  float: left;
}
.item56{
	width:56%;
  float: left;

}



</style>