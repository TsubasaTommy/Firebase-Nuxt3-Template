export default defineNuxtRouteMiddleware(async (to, from) => {
    // redirect the user to the login page
    const {isLogin} = useAuth().value
    
    if(isLogin){
        return navigateTo("/")
    }
  })