<template>
    <div id="showjobs">
        <h1>Jobs</h1>
        <div id="tableDiv">
            <table id="jobTable">
                <colgroup span="5"></colgroup>
                <tr>
                    <th>Customer</th>
                    <th>Start date</th>
                    <th>Days</th>
                    <th>Job Id</th>
                    <th></th>
                </tr>
                <tr v-for="job in jobs" v-bind:key="job.customer">
                    <td>{{job.customer}}</td>
                    <td>{{job.startDate}}</td>
                    <td>{{job.days}}</td>
                    <td>{{job.efJobId}}</td>
                    <td><button class="editJobButton" v-on:click="editJob(job.efJobId)">Edit</button></td>
                </tr>


            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name:'Jobs',
        mounted() {
            this.$nextTick(() => {
                this.getJobs();
                });
        },
        data() {
            return {
                jobs: [{ id: "46", customer: "HelenaChristensen",date: null}],
                response:[]
            }
        },
        methods: {
            editJob(id) {

                console.log(id);
                sessionStorage.setItem("selectedJobId", id);

                window.location.href = "/EditJob";
            },
            async getJobs() {
                /*this.jobs.push({ id: "45", customer: "HelenaChristensen" });*/
                let url = 'https://localhost:44368/api/jobs';
                try {
                    let response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                       headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem("token"),
                            'Content-Type': 'application/json'
                        }
                    });
                    this.jobs = await response.json();
                    //convert start date to nice visual date
                    for (var i = 0; i < this.jobs.length; i++) {
                        let date = new Date(this.jobs[i].startDate);
                        let temp = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
                        this.jobs[i].startDate = temp;
                    }
                }
                catch (error) {
                    console.log(error);
                }
            },
        },
    }


</script>

<style scoped>
    #tableDiv {
        display:flex;
        text-align: center;
        align-content: center;
        justify-content: center;
    }
    #jobTable{
        border-spacing: 1em .5em;
        border:1px solid black;
    }
    td{
        margin:5px 200px;
    }
</style>