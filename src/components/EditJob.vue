
<template>
    <div v-if="role === 'Manager'">
        <br />
        <h1>
            Edit Job for:
            {{job.customer}}
        </h1>
        <p>Startdate: {{jobDate}}</p>
        <br />
        <div id="tablediv">
            <table>
                <tr>
                    <td>
                        <form name="editJobForm" v-on:submit.prevent="removeModel">
                            <label>Remove a model: </label>
                            <select class="form-control" @change="selectModel($event)">
                                <option value="" selected disabled>Choose Model to remove</option>
                                <option v-for="model in job.models"
                                        :value="model.email"
                                        :key="model.firstName">
                                    {{model.firstName}} {{model.lastName}}
                                </option>
                            </select>
                            <br />
                            <input type="submit" value="Remove Model" />
                        </form>
                    </td>
                    <td>
                        <form name="editJobFormAdd" v-on:submit.prevent="addModel">
                            <label>Add a model: </label>
                            <select class="form-control" @change="selectModelAdd($event)">
                                <option value="" selected disabled>Choose Model to add</option>
                                <option v-for="model in responseModels"
                                        :value="model.efModelId"
                                        :key="model.firstName">
                                    {{model.firstName}} {{model.lastName}}
                                </option>
                            </select>
                            <br />
                            <input type="submit" value="Add Model" />
                        </form>
                    </td>
                </tr>
            </table>
        </div>
        
    </div>
    <div v-else-if="role === 'Model'">
        <div>
            <p>Job: {{job.customer}}</p>
            <p>Startdate: {{jobDate}}</p>
            <p>Total expense: {{totalExpense}}</p>
        </div>
        

        <h3>Add Expense: </h3>
        <form name="registerNewExpenseForm" v-on:submit.prevent="registerNewExpense">
            <div>
                <label>Date of expense </label><br />
                <input type="datetime-local" v-model="Date" placeholder="Date" />
            </div>
            <div>
                <label>Description of expense </label><br />
                <input v-model="Text" placeholder="Describe expense here" />
            </div>
            <div>
                <label>Amount: </label><br />
                <input type="text" v-model="amount" placeholder="amount" />
            </div>
            <div>
                <input class="Add_Button" type="submit" value="Add Expense to job" />
            </div>
        </form>
    </div>
    <div v-else>
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
                Date: new Date,
                Text: "",
                amount: null,
                responseJob: {
                    jobId: "",
                    customer: "",
                    date: null
                },
                expenses: [{}],
                totalExpense: 0,
                job:[{}],
                jobDate:null,
                responseModels: {
                    modelId: "",
                    firstName: "",
                    lastName: ""
                },
                
                selectedModelAdd: null,

                loggedInModelId: null,
            }
        },


        mounted() {
            
            this.$nextTick(() => {
            this.isModel();
            this.showJob();
                if (this.role === "Manager") {
                    this.showModels();
                }
            });
        },

        methods: {
            selectModel(event) {
                this.selectedModel = event.target.options[event.target.options.selectedIndex].text
                this.modelToRemoveEmail = event.target.options[event.target.options.selectedIndex].value
            },
            selectModelAdd(event) {
                this.selectedModelAdd = event.target.options[event.target.options.selectedIndex].value
            },

            async isModel() {

                let vm = this;

                let token = localStorage.getItem("token");

                let payload = this.parseJwt(token);

                vm.role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                if (vm.role === "Model") {
                    vm.loggedInModelId = payload.ModelId;
                    let url = "https://localhost:44368/api/Expenses/model/" + vm.loggedInModelId;
                    try {
                        let response = await fetch(url, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                                'Content-Type': 'application/json'
                            }
                        });
                        this.expenses = await response.json();
                        //only load relevant expenses
                        for (var i = 0; i < this.expenses.length; i++) {
                            if (this.expenses[i].jobId == sessionStorage.getItem("selectedJobId")) {
                                this.totalExpense += this.expenses[i].amount;
                            }
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                    


            },

            async showJob() {
                let url = "https://localhost:44368/api/jobs/" + sessionStorage.getItem("selectedJobId");
                try {
                    let response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    });
                    this.job = await response.json();
                        let date = new Date(this.job.startDate);
                        let temp = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                        this.jobDate = temp;
                }
                catch (error) {
                    console.log(error);
                }

            },

            async removeModel() {

                let modelIdToRemove = null;
                for (var i = 0; i < this.responseModels.length; i++) {
                    if (this.modelToRemoveEmail === this.responseModels[i].email) {

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
                        console.log("Successfully deleted selected model");
                        location.reload();
                    } else {
                        console.log("Server returned: " + response.statusText);
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
                        location.reload();

                    } else {
                        console.log("Server returned: " + response.statusText);
                    }
                } catch (err) {
                    alert("Error: " + err);
                }
                return;
            },

            async registerNewExpense() {
                let newExpense = {
                    "modelId": parseInt(this.loggedInModelId),
                    "jobId": parseInt(sessionStorage.getItem("selectedJobId")),
                    "date": this.Date,
                    "text": this.Text,
                    "amount": parseFloat(this.amount),
                }

                console.log(newExpense);

                let url = "https://localhost:44368/api/expenses";
                try {
                    let response = await fetch(url, {
                        method: 'POST', // Or PUT
                        body: JSON.stringify(newExpense),
                        credentials: 'include',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    })

                    if (response.ok) {
                        alert("Successfully created expense: " + newExpense.amount + " for " + newExpense.text)

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
        align-content: center;
        width: 80%;
        margin-left: 10%;
        margin-right: 10%;

    }

    input {
        /*font-family: Bahnschrift;*/
        text-align: center;
        /*min-height: 20px;*/
        min-width: 10em;
        width:10em;
        max-height: 5em;
        /*padding-block: 10px;*/
        margin: 3px;
    }
    #tablediv {
        display: flex;
        text-align: center;
        align-content: center;
        justify-content: center;
    }
    table {
        border: 1px solid black;
        min-width:400px;
        width:15em;
    }
    td {
        padding:.3em;
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