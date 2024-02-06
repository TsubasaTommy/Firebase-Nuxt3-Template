<template>
<v-layout>
    <v-main>
        <slot />
    </v-main>
    <v-app-bar collapse elevation="0">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
  </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
    >
      <v-list>
        <v-list-item
          v-if="auth.isLogin"
          :prepend-avatar="auth.avater"
          :title="auth.name"
          :subtitle="auth.mail"
        ></v-list-item>
        <v-list-item
          v-if="!auth.isLogin"
          prepend-icon="mdi-account-off"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item v-if="auth.isLogin" prepend-icon="mdi-logout" title="Logout" @click="signOutUser"></v-list-item>
        <v-list-item v-if="!auth.isLogin" prepend-icon="mdi-login" title="Login" @click="signIn" ></v-list-item>
      </v-list>
    </v-navigation-drawer>
</v-layout>
</template>

<script setup>
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
const drawer = ref(false)
const auth = useAuth()
console.log(auth.value)
    
const signIn=()=> {
    var provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert("faild to login", errorCode, errorMessage );
    });
}

const signOutUser = async()=> await signOut(getAuth());

</script>