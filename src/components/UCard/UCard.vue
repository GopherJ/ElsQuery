<template>
    <div class="u-card">
        <div class="u-card-heading">
            <strong v-text="label"></strong>
        </div>

        <div class="u-card-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'u-card',
        props: {
            label: {
                type: String
            }
        }
    }
</script>

<style scoped>
    .u-card {
      padding: 1.5rem;
      background-color: #fff;
      border-radius: 8px;
    }

    .u-card:not(:last-child) {
      margin-bottom: 2rem;
    }

    .u-card .u-card-heading {
      cursor: pointer;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }

    .u-card .u-card-heading.has-body {
      margin-bottom: 2rem;
    }

    .u-card .u-card-body .u-card-block:not(:last-child) {
      line-height: 3.0625rem;
      min-height: 3.0625rem;
    }

    .u-card .u-card-body .u-card-tabs:not(:last-child) {
      line-height: 3.0625rem;
      min-height: 3.0625rem;
      display: flex;
      align-items: center;
    }

    .u-card table > thead > tr > th {
      color: #13294B;
    }
</style>
