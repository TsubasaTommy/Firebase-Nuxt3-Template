<template>
<v-app>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</v-app>
</template>

<script setup>
import { onAuthStateChanged,getAuth } from 'firebase/auth';
onMounted(()=>{
  onAuthStateChanged(getAuth(),(user)=>{
    console.log("APP.vue Auth",!!user)
    x.value = !!user
    auth.value.isLogin= !!user
    auth.value.uid = user.uid
  })
})
const x = ref(false)
const auth = useAuth()
useSnapeshot()
</script>