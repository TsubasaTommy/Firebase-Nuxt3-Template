
import { getFirestore,doc,updateDoc,deleteDoc,deleteField, arrayRemove, arrayUnion}from 'firebase/firestore';
import { getStorage,ref as Fref,uploadBytes,deleteObject} from "firebase/storage";
import type { DocumentReference,DocumentSnapshot } from 'firebase/firestore';
import type { StorageReference } from 'firebase/storage';


type ProjectState ={
    ProjectList:string[];
    ForKonva:object;
    ForPrint:object;
    ImageList:object;
    ProjectName:string;
    PROJECT_PATH:()=>DocumentReference;
    USER_PATH:()=>DocumentReference;
    STORAGE_PATH:()=>StorageReference

}
export const useProjects = () => {
    const project:globalThis.Ref<ProjectState>= useState<ProjectState>('projects', () => ({
        ProjectList:[],
        ForKonva:{},
        ForPrint:{},
        ImageList:[],
        ProjectName:"",
        PROJECT_PATH:()=>doc(getFirestore(),"user",useAuth().value.uid,"Projects",project.value.ProjectName),
        USER_PATH:()=>doc(getFirestore(),"user",useAuth().value.uid),
        STORAGE_PATH:()=>Fref(getStorage(),`${useAuth().value.uid}/${project.value.ProjectName}/${crypto.randomUUID()}`),
    }))

    return{
        project:project,
        setProjectName:setProjectName(project),
        updateForKonvaImagePath:updateForKonvaImagePath(project),
        deleteLayer:deleteLayer(project),
        deleteProject:deleteProject(project),
        uploadKBSK:uploadKBSK(project),
        deleteKBSK:deleteKBSK(project),
        setProject:setProject(project),
        setProjectList:setProjectList(project),
        uploadPinLocation:uploadPinLocation(project),
        deletePinLocation:deletePinLocation(project),
        uploadPrint:uploadPrint(project)
    }
}
const setProjectName = (project:Ref<ProjectState>)=>(name:string)=> project.value.ProjectName = name
const setProject =(project:Ref<ProjectState>)=>(d:DocumentSnapshot)=>{
    project.value.ForKonva = d.data().ForKonva || {}
    project.value.ForPrint = d.data().ForPrint || {}
    project.value.ImageList= d.data().ImageList ||{}
}
const setProjectList = (project:Ref<ProjectState>)=>(d:DocumentSnapshot)=>{
    project.value.ProjectList = d.data().ProjectList
}
const updateForKonvaImagePath = (project:Ref<ProjectState>)=>async(layer:string,Image:string,c:boolean = false)=> {
    const data ={
        [`ForKonva.${layer}.Image`]:Image,
        [`ForKonva.${layer}.Outside`]:c
    }
    await updateDoc(project.value.PROJECT_PATH(),data)
    .then(()=>{console.log("setでけた")})
    .catch((e)=>console.error(e))    
}
const deleteLayer = (project:Ref<ProjectState>)=> async(name:string)=>{
    const storage = getStorage()

    const path = Fref(storage,project.value.ForKonva[name].Image)
    await deleteObject(path).then(async()=>{
        console.log("画像けせた")
        await updateDoc(project.value.PROJECT_PATH(),{
            [`ForKonva.${name}`]:deleteField(),
            [`ForPrint.${name}`]:deleteField(),
        }).then(()=>console.log("update削除でけた")).catch(e=>console.log(e))
    }).catch(e=>console.log(e))
}
const deleteProject = (project:Ref<ProjectState>)=>async()=>{
    const d = project.value.PROJECT_PATH()
    const d2 = project.value.USER_PATH()
    await deleteDoc(d).then(()=>console.log("Project削除")).catch(e=>console.log(e))
    await updateDoc(d2,{
        ProjectList:arrayRemove(project.value.ProjectName)
    })
}

const uploadPinLocation = (project:Ref<ProjectState>)=>async(l:string,pin:[],Dot:[],time:number = 10000)=>{
    useDelaysync().startTimer(async()=>{
        const d = project.value.PROJECT_PATH()
        await updateDoc(d,{
            [`ForKonva.${l}.Pin`]:pin,
            [`ForKonva.${l}.Dot`]:Dot,
        })
    },time)
}
const deletePinLocation = (project:Ref<ProjectState>)=>async(l:string,pin:[],dot:[])=>{
    useDelaysync().canselTimer()
    const d = project.value.PROJECT_PATH()
    await updateDoc(d,{
        [`ForKonva.${l}.Pin`]:pin,
        [`ForKonva.${l}.Dot`]:dot,
    })
}



/**
 * 各部所見(KBSK)
 * @param project
 * @returns 
 */
const uploadKBSK = (project:Ref<ProjectState>)=>async(v:{text:string,close:Blob,far?:Blob},part:string)=>{
    const obj = {
        text:v.text,
        close: (await uploadBytes(project.value.STORAGE_PATH(),v.close)).metadata.fullPath,
        far: v.far ? (await uploadBytes(project.value.STORAGE_PATH(),v.far)).metadata.fullPath :false
    }
    console.log(obj)
    await updateDoc(project.value.PROJECT_PATH(),{
        [`ImageList.objects.${part}.photos`]:arrayUnion(obj),
        [`ImageList.部位list`]:arrayUnion(part)
    }).then(()=>console.log("各部所見photoUpload☺")).catch(e=>console.error(e))
}
const deleteKBSK = (project:Ref<ProjectState>)=>async(part:string,i:number)=>{
    const storage = getStorage()

    const path = Fref(storage,project.value.ImageList.objects[part].photos[i].close)
    const path2 =project.value.ImageList.objects[part].photos[i].far? Fref(storage,project.value.ImageList.objects[part].photos[i].far):undefined

    await deleteObject(path).then(async()=>{
        console.log("画像けせたclose")
        await updateDoc(project.value.PROJECT_PATH(),{
            [`ImageList.objects.${part}.photos`]:arrayRemove(project.value.ImageList.objects[part].photos[i])
        }).then(()=>console.log("update削除でけた")).catch(e=>console.error(e))
    }).catch(e=>console.log(e))
    if(path2){
        await deleteObject(path2).then(async()=>{
            console.log("画像けせたfar")
        }).catch(e=>console.log(e))
    }
    if(!project.value.ImageList.objects[part].photos.length){
        await updateDoc(project.value.PROJECT_PATH(),{
            [`ImageList.objects.${part}`]:deleteField()
        }).then(()=>console.log("update削除でけた")).catch(e=>console.error(e))
    }

}


const uploadPrint = (project:Ref<ProjectState>)=>async(obj:object)=>{
    await updateDoc(project.value.PROJECT_PATH(),{
        [`ForPrint.graph`]:obj
    }).then(()=>console.log("ForPrint uploaded")).catch(e=>console.error(e))
}