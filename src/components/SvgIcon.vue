<template>
    <i v-html=setIcon()></i>
</template>

<script>
import { svgService } from '../services/svgService'

export default {
    props: {
        iconName: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        setIcon() {
            if(this.active){
                return svgService.getIcon(this.iconName+'Selected')
            }else {
                return svgService.getIcon(this.iconName)
            }
        }
    }
}

</script>

<style lang="scss">
</style>