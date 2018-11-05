<template>
  <div id="app">
    <el-button 
        type="primary" icon="el-icon-edit-outline"
        @click="handleClick"
    >注册</el-button>
  </div>
</template>

<script>
import register from './components/register'
import { transform } from './transform'

export default {
  name: 'App',
  methods: {
    register: transform(register),

    handleClick () {
      this.register({
        propsData: {
          name: '皮鞋'
        },

        // done: name => alert(`${name}牛B`)
        done () {
            // 外部关闭
            alert(`${name}牛B`)
            this.close()
        }
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
