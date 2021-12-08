<template>
  <div id="app">
    <div id="nav">
        <router-link to="/">Home </router-link>
        <router-link to="/login" v-if="login === ''">| Login </router-link> 
        <router-link to="/showjobs" v-if="login !=''">| Jobs </router-link> 
        <router-link to="/addmodel" v-if="login === 'Manager'">| Add Model </router-link> 
        <router-link to="/addmanager" v-if="login === 'Manager'">| Add Manager </router-link> 
        <router-link to="/addjob" v-if="login === 'Manager'">| Add Job </router-link> 
    </div>
    <div v-if="login != ''">
        <p>Logged in as {{login}}</p>
        <button v-on:click="logOut()" v-if="login != ''">Logout</button>
    </div>
      <div v-else>Not logged in</div>
    <router-view/>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                login: "",
            }
        },
        mounted() {
            this.isLoggedIn();
        },
        methods: {
            isLoggedIn() {

                let vm = this;

                let token = localStorage.getItem("token");

                let payload = this.parseJwt(token);

                vm.login = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            },


            parseJwt(token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.parse(jsonPayload);
            },

            logOut() {
                localStorage.setItem("token", "");
                alert("Logged out");
                window.location.replace("/");
            }
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
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
