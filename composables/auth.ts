import { getAuth, onAuthStateChanged } from 'firebase/auth';

type Auth ={
    isLogin:boolean
    uid:string,
    name:string,
    avater:string,
    mail:string,
}

export const useAuth = () =>{ 
    const auth = useState<Auth>('auth',() => ({
        isLogin:false,
        uid:"",
        name:"",
        avater:"",
        mail:"",
    }))

    return auth
   
}