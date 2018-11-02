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
      this.register()
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
