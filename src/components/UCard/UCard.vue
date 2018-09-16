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
