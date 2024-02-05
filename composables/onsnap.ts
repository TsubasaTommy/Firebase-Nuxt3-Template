import type { Unsubscribe } from "firebase/firestore";
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
    const P = useProjects()
    
    watch(()=>auth.value.isLogin,(is)=>{
        if(unsub.value._2)unsub.value._2()
        if(is){
            const path = P.project.value.USER_PATH()
            unsub.value._2 = onSnapshot(path,d=>{
                console.log("onSnapshot_2",d.data())
                P.setProjectList(d)
            })
        }
    },{immediate:true})

    watch(()=>P.project.value.ProjectName,(name)=>{
        if(unsub.value._1)unsub.value._1()
        if(name.length){
            if(unsub.value._1)unsub.value._1()
            const path =P.project.value.PROJECT_PATH()
            unsub.value._1 = onSnapshot(path,d=>{
                console.log("onSnapshot_1",d.data())
                P.setProject(d)
            })
        }
    },{immediate:true})
}