<template>
    <img :src="imgPath" @load="killURL" class="a">
</template>

<script setup>
import { getStorage,ref as Fref ,getBlob} from 'firebase/storage';
const props =  defineProps(['blob'])
const blob = await getBlob(Fref(getStorage(),props.blob))
const imgPath = ref(URL.createObjectURL(blob))
console.log("hi im Timg",props.blob)
const killURL = ()=> URL.revokeObjectURL(imgPath.value)
</script>
<style scoped lang="scss">
    .a{
        display: block;
    }
</style>