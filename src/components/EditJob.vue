
<template>
    <div v-if="role === 'Manager'">
        <br />
        <br />
        <form name="editJobForm" v-on:submit.prevent="removeModel">
            <div>
                <label>Customer: {{responseJob.customer}}</label><br />
            </div>
            <div id="app">
                <select class="form-control" @change="selectModel($event)">
                    <option value="" selected disabled>Choose Model to remove</option>
                    <option v-for="model in responseJob.models"
                            :value="model.email"
                            :key="model.firstName">
                        {{model.firstName}} {{model.lastName}}
                    </option>
                </select>
                <br><br>
                <p><span>Selected Model: {{ selectedModel }}</span></p>
            </div>
            <div>
                <input type="submit" value="Remove Model" />
            </div>
        </form>
        <br />
        <br />
        <form name="editJobFormAdd" v-on:submit.prevent="addModel">
            <div>
                <label>Add a model from the list</label><br />
            </div>
            <div id="app">
                <select class="form-control" @change="selectModelAdd($event)">
                    <option value="" selected disabled>Choose Model to add</option>
                    <option v-for="model in responseModels"
                            :value="model.efModelId"
                            :key="model.firstName">
                        {{model.firstName}} {{model.lastName}}
                    </option>
                </select>
                <br><br>
                <p><span>Selected Model: {{ selectedModelAdd }}</span></p>
            </div>
            <div>
                <input type="submit" value="Add Model" />
            </div>
        </form>
    </div>
    <div v-else-if="role === 'Model'">
        You are not authorized to view this page
    </div>
</template>


<script>
    export default {
        name: "EditJob",
        data() {
            return {
                selectedModel: null,
                modelToRemoveEmail: null,
                role: "",
                responseJob: {
                    jobId: "",
                    customer: "",
                    date: null
                },
                responseModels: {
                    modelId: "",
                    firstName: "",
                    lastName: ""
                },
                selectedModelAdd: null,
            }
        },


        mounted() {
            this.isModel();
            this.$nextTick(() => {
                this.showJob();
                this.showModels();
            });
        },

        methods: {
            selectModel(event) {
                this.selectedModel = event.target.options[event.target.options.selectedIndex].text
                this.modelToRemoveEmail = event.target.options[event.target.options.selectedIndex].value
                console.log(this.selectedModel);
            },
            selectModelAdd(event) {
                this.selectedModelAdd = event.target.options[event.target.options.selectedIndex].value
                console.log(this.selectedModelAdd);
            },

            isModel() {

                let vm = this;

                let token = localStorage.getItem("token");

                let payload = this.parseJwt(token);

                vm.role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            },

            async showJob() {
                console.log(sessionStorage.getItem("selectedJobId"));
                let url = "https://localhost:44368/api/jobs/" + sessionStorage.getItem("selectedJobId");
                console.log(url);
                try {
                    let response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    });
                    this.responseJob = await response.json();

                    console.log(this.responseJob);
                }
                catch (error) {
                    console.log(error);
                }

            },

            async removeModel() {

                let modelIdToRemove = null;
                for (var i = 0; i < this.responseModels.length; i++) {
                    if (this.modelToRemoveEmail == this.responseModels[i].email) {

                        modelIdToRemove = this.responseModels[i].efModelId;
                        break;
                    }
                }




                let url = "https://localhost:44368/api/jobs/" + sessionStorage.getItem("selectedJobId") + "/model/" + modelIdToRemove;

                console.log(url);

                try {
                    let response = await fetch(url, {
                        method: 'DELETE', // Or PUT
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    })

                    if (response.ok) {
                        alert("Successfully deleted selected model");
                        location.reload();
                    } else {
                        alert("Server returned: " + response.statusText);
                    }
                } catch (err) {
                    alert("Error: " + err);
                }
            },

            async showModels() {

                let url = "https://localhost:44368/api/models/";

                try {
                    let response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    });
                    this.responseModels = await response.json();

                    console.log(this.responseModels);
                }
                catch (error) {
                    console.log(error);
                }
            },

            async addModel() {

                let url = "https://localhost:44368/api/jobs/"
                    + sessionStorage.getItem("selectedJobId")
                    + "/model/" + this.selectedModelAdd;

                try {
                    let response = await fetch(url, {
                        method: 'POST', // Or PUT),
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    })

                    if (response.ok) {
                        alert("Successfully added selected model to the job")
                        location.reload();

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

    .Register_Button {
        text-align: center;
        align-self: center;
        /*width: 10%;
        max-width: 10%;*/
        min-width: 5em;
        width: 20px;
    }
</style>