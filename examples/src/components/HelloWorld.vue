<template>
    <div>
        <els-query @change="(query) => yourMethod(query)" :update-interval="10000"></els-query>
        <pre style="background-color: #FFF; text-align: center;">
            {{ query ? JSON.stringify(query, null, 4) : '' }}
        </pre>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    data() {
        return {
            query: null
        }
    },
    methods: {
        yourMethod(query) {
            this.query = query
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
