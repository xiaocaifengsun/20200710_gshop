<template>
<div>
  <p>clicked: {{count}} times, count is {{evenOrOdd}}</p>
  <button @click= "increment">+</button>
  <button @click=" decrement">-</button>
  <button @click="incrementIfOdd"> increment if odd</button>
  <button @click="incrementAsync"> increment async</button>
</div>
</template>
<script>
export default {
  data(){
    return{
      count:0
    }
  },
  computed:{
    evenOrOdd(){
      return this.count%2 === 0 ? '偶数':'奇数'
    }
  },
  methods:{
    //增加1
    increment(){
      const count = this.count
      this.count = count + 1
    },
    //减少1
    decrement(){
      const count = this.count
      this.count = count - 1
    },
    //如果是奇数才增加
    incrementIfOdd(){
      const count = this.count
      if(count%2){
        this.count = count + 1

      }
    },
    //过1s后才增加
    incrementAsync(){
      const count = this.count
      setTimeout(()=>{
        const count = this.count
        this.count = count + 1
      },1000)
    }

  }
}
</script>