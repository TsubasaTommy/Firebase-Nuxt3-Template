import { getAuth, onAuthStateChanged } from 'firebase/auth';

type Auth ={
    isLogin:boolean
    uid:string,
}

export const useAuth = () =>{ 
    const auth = useState<Auth>('auth',() => ({
        isLogin:false,
        uid:"",
        unsub:undefined
    }))

    return auth
   
}