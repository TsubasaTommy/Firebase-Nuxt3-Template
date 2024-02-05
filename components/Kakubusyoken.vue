<template>
    <v-container>
    <v-row no-gutters justify="center">
        <v-col cols="12">
            <v-btn color="brown-darken-1" prepend-icon="mdi-image-plus" elevation="15" stacked  @click="dialog.window = true">画像追加</v-btn>
        </v-col>
        <v-col cols="12" v-for="(n,i) in P.project.value.ImageList.objects" :key="i">
            <div class="paon">{{ i }}</div>
            <v-row no-gutters>
                <v-col xs="12" sm="6" v-for="(k,j) in n.photos" :key="j">
                    {{ k.text }}
                   
                    <div class="parent" @click="dialog.window2 = deleteDialog1(i,j)">
                        <Timg 
                            :blob="k.close"
                            class="child"
                        />
                        <Timg 
                            :blob="k.far"
                            class="child2"
                        />
                    </div>

                </v-col>
            </v-row>
        </v-col>

        <v-dialog
        v-model="dialog.window"
        width="auto"
      >
        <v-card width="300">
            <v-card-actions>
                <v-row no-gutters>
                    <v-col cols="12">
                        <v-combobox
                            chips
                            label="部位名"
                            variant="outlined"
                            :items="P.project.value.ImageList.部位list"
                            v-model="dialog.part"
                            placeholder="入力して追加できます"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-textarea
                            label="メモ"
                            v-model="dialog.value.text"
                            variant="outlined"
                            rows="2"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-file-input 
                            label="近写真"
                            variant="outlined"
                            v-model="dialog.value.close"
                            accept="image/*"
                            capture="environment"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-file-input 
                            label="遠写真 (必須ではない)"
                            variant="outlined"
                            v-model="dialog.value.far"
                            accept="image/*"
                            capture="environment"
                        />
                    </v-col>
                </v-row>

            </v-card-actions>

            <v-card-actions>
                <v-btn color="error" :loading="dialog.loading" variant="tonal" block @click="uploadDialog()">追加</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialog.window2"
        width="auto"
      >
        <v-card width="300">
            <v-card-text>
                写真とメモを削除します
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" :loading="dialog.loading" variant="tonal" block @click="deleteDialog2()">削除</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
</v-container>
</template>

<script setup>
import { getBlob,ref as Fref, getStorage} from 'firebase/storage';

const storage = getStorage()
const P = useProjects()

const dialog = reactive({
    loading:false,
    window:false,
    window2:false,
    part:null,
    part2:null,
    i:null,
    value:{
        text:"",
        close:undefined,
        far:undefined}})
const uploadDialog = async()=>{
    if(!P.project.value.ProjectName) window.alert("プロジェクトを選択してください")
    if(!dialog.part) return window.alert("部位名を入力してください")
    if(!dialog.value.close) return window.alert("ズームされた画像の入力は必須です")
    if(!dialog.value.text) return window.alert("メモの入力は必須です")
    dialog.loading = true
    const close = dialog.value.close ?await fileToBlob(dialog.value.close[0],300,1.5,'contain').catch(e=>console.error(e)): undefined
    console.log(close)
    const far = dialog.value.far ?await fileToBlob(dialog.value.far[0],100,1.4,'contain').catch(e=>console.error(e)):undefined 
    await P.uploadKBSK({text:dialog.value.text,close:close.blob,far:far?far.blob:undefined},dialog.part).catch(e=>console.error(e))
        
    dialog.loading = false
    dialog.window = false
    dialog.value.close = undefined
    dialog.value.far = undefined
    dialog.value.text=""
    dialog.part = null
}
const deleteDialog1= async(part,i)=>{
    dialog.window2 = true
    dialog.part2 = part
    dialog.i = i
}
const deleteDialog2 = async()=>{
    dialog.loading = true
    P.deleteKBSK(dialog.part2,dialog.i)
    dialog.window2 = false
    dialog.part2 = null
    dialog.i = null
    dialog.loading = false
}
</script>

<style lang="scss" scoped>
.paon{
    display: block;
    width: 100%;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    font-size: 1.5rem;
    text-align: center;
    background-color: #6d4c41;
    color:white;
    margin-top: 2rem;
    margin-bottom:2rem;
}
.parent{
    position:relative;
    height: 220px;
    .child{
        position: absolute;
        top:0;
        left:0;
    }
    .child2{
        position: absolute;
        top:0;
        left:0;
        z-index: 100;
    }
}
</style>