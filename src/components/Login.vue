<template>
    <form name="loginForm" v-on:submit.prevent="login">
        <div>
            <label>Email</label>
            <input type="email" v-model="email" />
        </div>
        <div>
            <label>Password</label>
            <input type="password" v-model="password" />
        </div>
        <div>
            <input type="submit" value="Login" />
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

