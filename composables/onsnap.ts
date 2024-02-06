import { type Unsubscribe,DocumentSnapshot } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

type Snapshot ={
    _1?:Unsubscribe
    _2?:Unsubscribe
}

export const useSnapeshot = ()=>{
    const unsub:globalThis.Ref<Snapshot> = useState<Snapshot>('snapshot',()=>({
        _1:undefined,
        _2:undefined
    }))
    const auth = useAuth()
    
    watch(()=>auth.value.isLogin,(is)=>{
        if(unsub.value._1)unsub.value._1()
        if(is){
            const path = // input Path
            unsub.value._1 = onSnapshot(path,res =>{
                console.log("onSnapshot_1",res.data())
            })
        }
    },{immediate:true})
}