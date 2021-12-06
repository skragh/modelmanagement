<template>
  <div id="app">
     <router-link to="Login">Login</router-link>
      <Login/>
      <router-view></router-view>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="ModelManagement App"/>
  </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'
    import Login from './components/Login.vue'

export default {
  name: 'App',
  components: {
      HelloWorld,
      Login
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
