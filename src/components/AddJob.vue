
<template>
    <div v-if="role === 'Manager'">
        <form name="registerJobForm" v-on:submit.prevent="registerJob">
            <br/>
            <div>
                <label>Customer: </label><br />
                <input v-model="customer" placeholder="Customer" />
            </div>
            <div>
                <label>Start Date: </label><br />
                <input type="datetime-local" v-model="startDate" placeholder="Start Date" />
            </div>
            <div>
                <label>Days: </label><br />
                <input type="number" v-model="days" placeholder="Number of days" />
            </div>
            <div>
                <label>Location: </label><br />
                <input v-model="location" placeholder="Location" />
            </div>
            <div>
                <label>Comments: </label><br />
                <input v-model="comments" placeholder="Comment" />
            </div>
            <div>
                <input class="Add_Button" type="submit" value="Add Job" />
            </div>
        </form>
    </div>
    <div v-else>
        You are not authorized to view this page
    </div>
</template>


<script>
    export default {
        name: "AddJob",
        data() {
            return {
                customer: "",
                startDate: new Date,
                days: 0,
                location: "",
                comments: "",
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

            async registerJob() {
                let job = {
                    "customer": this.customer,
                    "startDate": this.startDate,
                    "days": parseInt(this.days),
                    "location": this.location,
                    "comments": this.comments
                }
                let url = "https://localhost:44368/api/jobs";
                try {
                    let response = await fetch(url, {
                        method: 'POST', // Or PUT
                        body: JSON.stringify(job),
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    })

                    if (response.ok) {
                        alert("Successfully created job for " + job.customer + " at " + job.location)

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
    form {
        width: 80%;
        margin-left: 10%;
        margin-right: 10%;
    }

    input {
        /*font-family: Bahnschrift;*/
        text-align: center;
        /*min-height: 20px;*/
        min-width: 25em;
        padding-block: 10px;
        margin: 3px;
    }

    .Add_Button {
        text-align: center;
        align-self: center;
        /*width: 10%;
        max-width: 10%;*/
        min-width: 5em;
        width: 20px;
    }
</style>