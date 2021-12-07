<template>
    <div class="showjobs">
        <h1>All jobs er here</h1>
        <table id="jobTable">
            <tr v-for="job in jobs" v-bind:key="job.ejJobId">
                <th>{{job.customer}}</th>
                <th>{{job.startDate}}</th>
                <th>{{job.days}}</th>
                <!--Bind for hver to go and send where to go-->
            </tr>
        </table>
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
                }
                catch (error) {
                    console.log(error);
                }
            },
        },
    }


</script>