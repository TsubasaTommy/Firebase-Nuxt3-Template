import { del } from "nuxt/dist/app/compat/capi"

type Delay ={
    timeout?:NodeJS.Timeout
}

export const useDelaysync = ()=>{
 const delay:globalThis.Ref<Delay> = useState<Delay>('delaysync',()=>({
    timeout:undefined
 }))
 return{
    startTimer:startTimer(delay),
    canselTimer:canselTimer(delay)
 }
}
const startTimer = (delay:Ref<Delay>)=>(x:Function,time:number = 30000)=>{
    if(delay.value.timeout) clearTimeout(delay.value.timeout)
    delay.value.timeout = setTimeout(()=>{
        x()
    },time)
}
const canselTimer = (delay:Ref<Delay>)=>()=> clearTimeout(delay.value.timeout)