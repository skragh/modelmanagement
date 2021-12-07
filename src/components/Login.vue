<template>
    <form name="loginForm" v-on:submit.prevent="login">
        <div>
            <input type="email" v-model="email" placeholder="E-mail" />
        </div>
        <div>
            <input type="password" v-model="password" placeholder="Password"/>
        </div>
        <div>
            <input type="submit" value="Login" id="register"/>
        </div>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                email: "",
                password: "",
            }
        },

    methods: {
            async login() {
                let user = {
                    "email": this.email,
                    "password": this.password,
                }
                let url = "https://localhost:44368/api/account/login";
                try {
                    let response = await fetch(url, {
                        method: "POST",
                        body: JSON.stringify(user), // Assumes data is in an object called form
                        headers: new Headers({
                            "Content-Type": "application/json"
                        })
                    });
                    
                    if (response.ok) {
                        let token = await response.json();
                        localStorage.setItem("token", token.jwt);
                        // Change view to some other component
                        // Åc
                        console.log("succesful login");
                        console.log(token.jwt);
                        window.location.replace("/");

                    } else {
                        alert("Server returned: " + response.statusText);
                    }
                } catch (err) {
                    alert("Error: " + err);
                }
                return;
            }
        }
    }
</script>

<style>
    input {
        text-align: center;
        min-width: 25em;
        padding-block: 10px;
        margin: 3px;
    }
    #register {
        align-self: center;
        padding-block: 10px;
        min-width: 5em;
        width: 20px;
        margin: 5px;
    }

</style>