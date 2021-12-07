
<template>
    <div v-if="role === 'Model'">
        <form name="registerNewExpenseForm" v-on:submit.prevent="registerNewExpense">

            <div>
                <label>Date: </label>
                <input type="datetime-local" v-model="Date" placeholder="Date" />
            </div>
            <div>
                <label>Text: </label>
                <input v-model="Text" placeholder="Text" />
            </div>
            <div>
                <label>Amount: </label>
                <input type="number" v-model="amount" placeholder="amount" />
            </div>
            <div>
                <input type="submit" value="Add Expense to job" />
            </div>
        </form>
    </div>
    <div v-else>
        You are not authorized to view this page
    </div>
</template>


<script>
    export default {
        name: "AddNewExpense",
        data() {
            return {
                Date: new Date,
                Text: "",
                Amount: 0,
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

            async registerNewExpense() {
                let newExpense = {
                    "Date": this.Date,
                    "Text": this.Text,
                    "amount": this.amount,
                }
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
                        alert("Successfully created expense: " + newExpense.amount + " for " + newExpense.Text)

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


