<template>
<v-container fluid>


    <v-row no-gutters>
        <v-col cols="1" v-if="selectedProject.length">
            <v-btn icon="mdi-trash-can-outline" color="error" variant="plain" @click="deleteProjectDialog=true" />
        </v-col>

        <v-col cols="8" v-show="0 < P.project.value.ProjectList.length">
            <v-select
                label="Project"
                :items="P.project.value.ProjectList"
                variant="solo-filled"
                v-model="selectedProject"
            ></v-select>
        </v-col>

        <v-col cols="2">
            <v-btn :class="{animeBtn:!P.project.value.ProjectList.length}" prepend-icon="mdi-tab-plus"  size="x-large" variant="text" @click="addProjectDialog=true">
                ADD
            </v-btn>
        </v-col>


        <v-col cols="12" v-if="selectedProject.length">
            <CanvasZone :initialize="initialize"/>
        </v-col>


        <v-dialog
        v-model="addProjectDialog"
        width="auto"
      >
        <v-card>
            <v-card-actions>
                <v-text-field label="ProjectName" v-model="addProjectInputText" variant="outlined"></v-text-field>
            </v-card-actions>
            <v-card-actions>
                <v-btn color="primary" block @click="addProjectClicked()">プロジェクトを追加</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="deleteProjectDialog"
        width="auto"
      >
        <v-card>
            <v-card-actions>
                <v-btn color="error" :loading="deleteProjectLoading" variant="tonal" block @click="deleteProject()">プロジェクトを削除</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-btn color="primary" size="large" variant="tonal" class="pien" v-if="selectedProject.length"><NuxtLink to="/print">報告書を作成</NuxtLink></v-btn>
    <div class="mt-10 paon" v-if="selectedProject.length">各部所見</div>
    <Kakubusyoken v-if="selectedProject.length"/>
</v-container>
</template>

<script setup>
    definePageMeta({
        middleware: ['auth'],
    })
    const initialize = ref(crypto.randomUUID())

    //===================
    //FireBase Initialize
    //===================
    
    import { getFirestore,setDoc,doc,arrayUnion } from 'firebase/firestore';
import { useDelaysync } from '~/composables/delayupload';
    const db = getFirestore()
    const auth = useAuth()

    //================
    //Composable Initialize
    //================

    const P = useProjects()
    
    
    //=============
    //ADD PROJECT
    //=============
    const addProjectInputText = ref("")
    const addProjectDialog = ref(false)
    const addProjectClicked = async ()=> {
        if(!addProjectInputText.value.length) return window.alert("プロジェクト名を入力してください")
        const docPath = doc(db,"user",auth.value.uid)
        await setDoc(docPath,{ProjectList:arrayUnion(addProjectInputText.value)},{merge:true})
        const docPath2 = doc(db,"user",auth.value.uid,"Projects",addProjectInputText.value)
        await setDoc(docPath2,{ForKonva:{},ForPrint:{},ImageList:{}},{merge:true})
        addProjectDialog.value = false
        selectedProject.value = addProjectInputText.value
    }


    //=============
    //SELECT PROJECT
    //=============
    const selectedProject = ref(P.project.value.ProjectList[P.project.value.ProjectList.length -1]|| "")

    watch(selectedProject,async()=>{
        P.setProjectName(selectedProject.value)
        initialize.value = crypto.randomUUID()
    },{immediate:true})

    //=============
    //DELETE PROJECT
    //=============
    const deleteProjectDialog = ref(false)
    const deleteProjectLoading = ref(false)
    const deleteProject = async()=>{
        deleteProjectLoading.value = true
        await P.deleteProject()
        selectedProject.value = ""
        deleteProjectDialog.value = false
        deleteProjectLoading.value = false
        initialize.value = crypto.randomUUID()
    }   
</script>

<style lang="scss" scoped>
.pien{
    a{
        text-decoration: none;
    }
}

.paon{
    display: block;
    width: 100%;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    font-size: 2rem;
    text-align: center;
    background-color: #6d4c41;
    color:white;
}

@keyframes blink {
  0% { background-color:#EA80FC ; color:white}
  50% { background-color:#9e9e9e00 ; color:rgb(66, 66, 66)}
  100% { background-color: #EA80FC; color:white}
}
@keyframes blinkBrown{
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}

.animeBtn {
  animation: blink 2s infinite; /* 2秒ごとに繰り返す点滅アニメーション */
}
.animeblink{
    background: linear-gradient(45deg,#222222,#979797,#202020); //brown grown
    //background: linear-gradient(45deg,#202020 60%,#b3b3b3,#790000 10%); //black red
    background-size: 200% 200%;
    color:white;
    animation-name: blinkBrown;
    animation-iteration-count:infinite;
    animation-duration:4s;
    animation-timing-function:ease-in-out;
}
</style>