<template>
    <div>
      <h1>Firebase Authentication Example</h1>
      <p class="lead">This example is a quick exercise to sign in with a google acount.</p>
      <div v-show="auth.isLogin">
          <button type="button" role="button" @click="signOutUser">
              Sign Out
          </button>
          <NuxtLink  to="/"> homeへもどる </NuxtLink>
      </div>
      <div v-show="!auth.isLogin">
          <button type="button" role="button" @click="signIn">
              Sign In
          </button>
      </div>
      <!--<Login />-->
      isLogin{{ auth.isLogin }}:<br>
      uid{{ auth.uid }}:<br>
      getAuth(){{ getAuth().currentUser? true:false }}
    </div>
</template>
  
<script setup>
definePageMeta({
    middleware: ['authforlogin'],
})
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
  

const auth = useAuth()
    
const signIn=()=> {
    var provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
    .then((auth) => {
        const router = useRouter()
        router.push("/")
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert("faild to login", errorCode, errorMessage );
    });
}

const signOutUser = async()=> await signOut(getAuth());
  </script>