
<template>
    <div v-if="role === 'Manager'">
        <form name="registerModelForm" v-on:submit.prevent="registerModel">

            <div>
                <!--<label>First Name: </label><br/>-->
                <input v-model="firstName" placeholder="First Name" />
            </div>
            <div>
                <!--<label>Last Name: </label><br />-->
                <input v-model="lastName" placeholder="Last Name" />
            </div>
            <div>
                <!--<label>Email: </label><br />-->
                <input type="email" v-model="email" placeholder="Email" />
            </div>
            <div>
                <!--<label>Password: </label><br />-->
                <input type="password" v-model="password" placeholder="Password" />
            </div>
            <div>
                <input class="Register_Button" type="submit" value="Register" />
            </div>
        </form>
    </div>
    <div v-else>
        You are not authorized to view this page
    </div>
</template>


<script>
    export default {
        name: "AddModel",
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
            this.isModel();
        },

        methods: {
            isModel() {

                let vm = this;

                let token = localStorage.getItem("token");

                let payload = this.parseJwt(token);

                vm.role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            },

            async registerModel() {
                let user = {
                    "firstname": this.firstName,
                    "lastname": this.lastName,
                    "email": this.email,
                    "password": this.password,
                }
                let url = "https://localhost:44368/api/models";
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
    form{
        width: 80%;
        margin-left: 10%;
        margin-right:10%;
    }
    input {
        /*font-family: Bahnschrift;*/
        text-align: center;
        /*min-height: 20px;*/
        min-width: 25em;
        padding-block: 10px;
        margin: 3px;
    }
    .Register_Button {
        text-align: center;
        align-self: center;
        /*width: 10%;
        max-width: 10%;*/
        min-width: 5em;
        width: 20px;
    }
</style>
