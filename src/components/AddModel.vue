
<template>
    <div v-if="role === 'Manager'">
        <form name="registerModelForm" v-on:submit.prevent="registerModel">

            <div>
                <!--<label>First Name: </label><br/>-->
                <input class="input" v-model="firstName" placeholder="First Name" />
            </div>
            <div><br />
                <!--<label>Last Name: </label><br />-->
                <input class="input" v-model="lastName" placeholder="Last Name" />
            </div>
            <div><br />
                <!--<label>Email: </label><br />-->
                <input class="input" type="email" v-model="email" placeholder="Email" />
            </div>
            <div><br />
                <!--<label>Password: </label><br />-->
                <input class="input" type="password" v-model="password" placeholder="Password" />
            </div>
            <div class="Register_Button"><br/>
                <input type="submit" value="Register" />
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
    label{
        font-family: Bahnschrift;
        font-size:15px;
    }
    input {
        font-family: Bahnschrift;
        text-align: center;
        width: 100%;
        padding: 10px;
        min-height:20px;
    }
    .Register_Button {
        text-align: center;
        width: 100%;
        padding: 10px;
    }
</style>
