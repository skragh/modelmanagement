
<template>
    <div v-if="role === 'Manager'">
        <form name="registerManagerForm" v-on:submit.prevent="registerManager">

            <div>
                <input v-model="firstName" placeholder="First Name" />
            </div>
            <div>
                <input v-model="lastName" placeholder="Last Name" />
            </div>
            <div>
                <input type="email" v-model="email" placeholder="Email" />
            </div>
            <div>
                <input type="password" v-model="password" placeholder="Password" />
            </div>
            <div >
                <input type="submit" value="Register" id="register"/>
            </div>
        </form>
    </div>
    <div v-else>
        You are not authorized to view this page
    </div>
</template>

<script>
    export default {
        name: "AddManager",
        data() {
            return {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "",
            }
        },

        mounted() {
            this.isManager();
        },

        methods: {
            isManager() {

                let vm = this;

                let token = localStorage.getItem("token");

                let payload = this.parseJwt(token);

                vm.role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            },

            async registerManager() {
                let user = {
                    "firstname": this.firstName,
                    "lastname": this.lastName,
                    "email": this.email,
                    "password": this.password,
                }
                let url = "https://localhost:44368/api/managers";
                try {
                    let response = await fetch(url, {
                        method: 'POST', // Or PUT
                        body: JSON.stringify(user),
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    })

                    if (response.ok) {
                        alert("Successfully registered user: " + user.firstname + " " + user.lastname)

                    } else {
                        alert("Server returned: " + response.statusText);
                    }
                } catch (err) {
                    alert("Error: " + err);
                }
                return;
            },

            parseJwt(token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                return JSON.parse(jsonPayload);
            }
        }
    }
</script>

<style scoped>
    

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

