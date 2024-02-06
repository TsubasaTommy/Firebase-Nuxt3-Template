<template>
<v-app>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</v-app>
</template>

<script setup>
import { onAuthStateChanged,getAuth } from 'firebase/auth';
import { useAuth } from './composables/auth';
onMounted(()=>{
  onAuthStateChanged(getAuth(),(user)=>{
    if(user){
      auth.value.uid = user.uid
      auth.value.isLogin = true
      auth.value.name = user.displayName
      auth.value.mail = user.email
      auth.value.avater = user.photoURL || "/account-check.png"
    }else{
      auth.value.uid = ""
      auth.value.isLogin = false
      auth.value.name = ""
      auth.value.mail = ""
      auth.value.avater = ""
    }
  })
})
const auth = useAuth()
//useSnapeshot()
</script>