<template>
    <v-row no-gutters>
        <v-col cols="12">
            <v-row no-gutters>

            <v-col cols="auto">
                <div class="canvas-san parent" id="canvas-san">
                    <v-stage ref="stage" :config="konva.config">
                        <v-layer>
                            <v-image @dblclick="addPin" @dbltap="addPin" :config="{image:layerImage}" />
                            <v-line  v-for="n in lineConfigs" :config="n" />
                            <v-circle @dragmove="onDragMoveDot" @dragend="onDragEnd" v-for="k in konva.dot" :config="k" />
                            <!--<v-image @click="print.onClick" @tap="print.onClick" @dragmove="onDragMovePin" @dragend="onDragEnd"  v-for="n in konva.pin" :config="n" />-->
                            <v-text @click="print.onClick" @tap="print.onClick" @dragmove="onDragMovePin" @dragend="onDragEnd"  v-for="n in makePin" :config="n" />
                        </v-layer>
                    </v-stage>
                    <v-btn v-if="selectedLayer" class="child" color="error" variant="tonal" @click="deleteLayerDialog=true" icon="mdi-trash-can-outline"/>
                    <p v-if="selectedLayer && P.project.value.ForKonva[selectedLayer].Outside" class="child2">外構</p>
                </div>

            </v-col>
            <v-col cols="2" :class="{animeblink:Object.keys(P.project.value.ForKonva).length}">
                <v-table density="compact" class="finger">
                <thead>
                <tr>
                    <th class="text-left" :class="{animeBtn:!selectedLayer &&!Object.keys(P.project.value.ForKonva).length}"  @click="layerDialog = true">
                        Layer <v-icon icon="mdi-layers-plus" />
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="n in Object.keys(P.project.value.ForKonva).sort().reverse()">
                    <td @click="selectedLayer = n" :class="{animeblinkbrown:(selectedLayer == n)}"><span>{{ n }}</span></td>
                </tr>
                </tbody>
            </v-table>
            </v-col>
            </v-row>
        
        </v-col>

        <v-col cols="10">
            <img :src="`/img/${n}.png`" v-for="n in 8" class="mx-1" :class="{child3:konva.selected == n}" @click="konva.selected = n">
        </v-col>

        <v-col cols="4" class="mt-2">
            <v-dialog
                v-model="layerDialog"
                width="auto"
            >
            <v-card width="350">
                <v-card-item>
                    <v-row no-gutters>
                        <v-col cols="8">
                            <v-text-field  v-model="InputlayerName" label="レイヤーの名前" variant="outlined" />
                        </v-col>
                        <v-col cols="4">
                            <v-checkbox label="外構" v-model="InputlayerCheck"></v-checkbox>
                        </v-col>
                        <v-col cols="12">
                            <v-file-input accept="image/*" v-model="InputLayerImage" label="画像をアップロード" variant="outlined"></v-file-input>
                        </v-col>
                    </v-row>
                </v-card-item>
                <v-card-actions>
                    <v-btn :loading="layerUploading" color="primary" block @click="LayerImageUpload()">画像をアップロード</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog
                v-model="deleteLayerDialog"
                width="auto"
            >
            <v-card width="300">
                <v-card-item>
                    <v-card-text>
                        <span style="color:red">{{ selectedLayer }}</span>を削除しますか？
                    </v-card-text>
                </v-card-item>
                <v-card-actions>
                    <v-btn :loading="deleteLayerLoading" @click="deleteLayerClicked()" block variant="tonal" color="error">削除</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog
                v-model="print.dialog"
                width="auto"
            >
            <v-card width="340">
                <v-card-actions>
                    <v-row no-gutters>
                        <v-col cols="6" class="my-10">
                            <p class="text-h3 text-center">{{print.counter}}{{ getUnits }}</p>
                        </v-col>
                        <v-col cols="6">
                            <v-row no-gutters class="text-h3 text-center font-weight-black">
                                <v-col cols="12" class="animeblinkred" @click="print.counter = (print.type < 3 || 6 <print.type)?print.counter + 1: Math.round((print.counter + 0.1)*10)/10">
                                   <p class="mb-3 mt-1">▲</p> 
                                </v-col>
                                <v-col cols="12" class="animeblinkdown" @click="print.counter = (print.type < 3 || 6 <print.type)?print.counter - 1: Math.round((print.counter - 0.1)*10)/10">
                                    <p class="mb-3 mt-1">▼</p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" class="mt-2">
                            <v-btn size="x-large" :loading="print.loading" @click="print.upload" block variant="tonal" color="primary">保存</v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-btn :loading="print.loading" @click="print.delete" block variant="tonal" color="error">削除</v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-col>
        
    </v-row>
</template>

<script setup>

//======================
//Firebase Initialize
//======================
import { getStorage,ref as Fref,uploadBytes, getBlob ,deleteObject} from "firebase/storage";
import konvaPlugin from "vue-konva";


const props = defineProps(['initialize'])
watch(()=>props.initialize,(n,o)=>initializeCanvasZone())
const initializeCanvasZone = ()=>{
    konva.pin = []
    konva.dot = []
    selectedLayer.value = ""
    layerImage.value = null
    konva.config = {width:600,height:300}
}

    const P = useProjects()
    const storage = getStorage()
    const auth = useAuth()

    //============
    //Layer追加処理
    //============
    const layerDialog = ref(false)
    const InputlayerName = ref("")
    const InputLayerImage = ref(null)
    const layerUploading = ref(false)
    const InputlayerCheck = ref(false)
    
    const LayerImageUpload = async() =>{
        console.log("layerimageupload")
            if(!P.project.value.ProjectName) return window.alert("先にProjectを選択してください")
            if(!InputlayerName.value) return window.alert("名前を入力してください")
            if(!InputLayerImage.value) return window.alert("画像を選択してください")
            if(InputlayerName.value in P.project.value.ForKonva) return window.alert("既に同じ名前のレイヤーが作成されています")
            layerUploading.value = true

            const {blob,width,height} = await fileToBlob(InputLayerImage.value[0]).catch(e=>console.error(e))
            console.log(blob)
            layerImage.value = await setImage(blob).catch(e => console.error(e))
            konva.config.width = width
            konva.config.height = height
            
        console.log("layerimageupload2")

        const x = await uploadBytes(P.project.value.STORAGE_PATH(),blob).catch(e=>console.error(e))
        await P.updateForKonvaImagePath(InputlayerName.value,x.metadata.fullPath,InputlayerCheck.value).catch((e)=>console.error(e))

        console.log("画像追加後のForKonva",P.project.value.ForKonva)
        console.log(InputlayerCheck.value)
            
        layerDialog.value = false
        layerUploading.value = false
        selectedLayer.value = InputlayerName.value
        InputlayerCheck.value=false
    }

    //===============
    //Layer削除
    //===============
    const deleteLayerDialog = ref(false)
    const deleteLayerLoading = ref(false)
    const deleteLayerClicked = (async()=>{
        deleteLayerLoading.value = true
        await P.deleteLayer(selectedLayer.value)
        deleteLayerLoading.value = false
        deleteLayerDialog.value = false
        initializeCanvasZone()
    })

    //===============
    //Layer
    //===============
    const selectedLayer = ref("")
    const layerImage = ref(null)
    watch(selectedLayer,async(res)=>{
        if(res){
            const o = P.project.value.ForKonva
            try {
                konva.pin = o[res].Pin ||[]
                konva.dot = o[res].Dot || []
            } catch (error) {
                console.log("watchでforKonvaのpinがなかった")
            }finally{
                layerImage.value = await setImage(await getBlob(Fref(storage,o[res].Image)))
                konva.config.width = layerImage.value.width
                konva.config.height = layerImage.value.height
                console.log(layerImage.value)
            }
        }
    },{immediate:true})
    //=============
    //for print処理
    //=============

    const print = reactive({
        dialog:false,
        inputValue:0,
        loading:false,
        counter:0,
        length:0,
        class:"",
        type:0,
        upload:async()=>{
            print.loading = true
            konva.pin.forEach((v,i)=>{
                if(v.class == print.class) v.result = print.counter
            })
            await P.uploadPinLocation(selectedLayer.value,konva.pin,konva.dot,0)
            print.loading = false
            print.dialog = false
        },
        delete:async()=>{
            print.loading = true
            await P.deletePinLocation(selectedLayer.value,konva.pin.filter(v=> v.class != print.class),konva.dot.filter(v=>v.class != print.class))
            print.loading = false
            print.dialog = false
        },
        onClick:(e)=>{
            print.counter = e.target.attrs.result || 0
            print.dialog = true
            print.class = e.target.attrs.class
            print.type = e.target.attrs.type
            console.log(print.type)
        },
    })
    const makePin = computed(()=>{
        const x = JSON.parse(JSON.stringify(konva.pin))
        
        x.forEach((y,i)=>{
            if(y.result)y.text += y.result
        })
        
        return x
    })
    const getUnits = computed(()=>{
        switch (print.type) {
            case 1:
            case 2:
                return "枚"
            case 3:
                return "㎡"
            case 4:
                return "ｍ"
            case 5:
                return "㎡"
            case 6:
                return "ｍ"
            case 7:
            case 8:
                return "ヶ所"
            default:
                break;
        }
    })

    //==========
    //canvas処理
    //==========
    const konva =reactive({
        config:{width:600,height:300},
        selected:1,
        pin:[],
        dot:[],
    })

    watch(()=>P.project.value.ForKonva,(x)=>{
        if(x[selectedLayer.value]){
            konva.pin = x[selectedLayer.value].Pin || []
            konva.dot = x[selectedLayer.value].Dot || []
        }
    },{immediate:true})

    const lineConfigs = computed(()=>{ //0.09 ms
        let result = []
        try {
            if(konva.pin.length)konva.pin.forEach((v,i)=>{
                if(null != v.x &&null != v.y &&null != konva.dot[i].x &&null != konva.dot[i].y){
                    const center ={ x:v.text.length *v.fontSize / 2, y:v.fontSize/2}
                    const left = {x:v.x, y:v.y + center.y}
                    const right = {x:v.text.length * v.fontSize + v.x, y: v.y+center.y}
                    const top = {x:center.x + v.x ,y:v.y}
                    const bottom = {x:center.x + v.x , y:v.y + v.fontSize}
                    
                    const Ax = konva.dot[i].x
                    const Ay = konva.dot[i].y
                    
                    const _calc = (x1,y1) =>(x2,y2)=> Math.sqrt((x2-x1)**2+(y2-y1)**2)
                    const calc = _calc(Ax,Ay)

                    //left right top bottom
                    const distance =[calc(left.x,left.y),calc(right.x,right.y),calc(top.x,top.y),calc(bottom.x,bottom.y)]
                    const minVal = distance.reduce((a,b)=>Math.min(a,b))
                    switch (distance.findIndex(v=>v == minVal)) {
                        case 0:
                            result.push({
                                points:[left.x,left.y,konva.dot[i].x,konva.dot[i].y],stroke:"black",strokeWidth:1
                            })
                            break;
                        case 1:
                            result.push({
                                points:[right.x,right.y,konva.dot[i].x,konva.dot[i].y],stroke:"black",strokeWidth:1
                            })
                            break;
                        case 2:
                            result.push({
                                points:[top.x,top.y,konva.dot[i].x,konva.dot[i].y],stroke:"black",strokeWidth:1
                            })
                            break;
                        case 3:
                            result.push({
                                points:[bottom.x,bottom.y,konva.dot[i].x,konva.dot[i].y],stroke:"black",strokeWidth:1
                            })
                    }
                
            }
        }) 
        } catch (error) {console.error(error)}
        return result
    })

    const stage = ref(null)
    const onDragMovePin = (e)=>{
        konva.pin.forEach((v,i)=>{
            if(v.class == e.target.attrs.class){
                v.x = e.target.attrs.x
                v.y = e.target.attrs.y
            }
        })
    }
    const onDragMoveDot = (e) =>{
        konva.dot.forEach((v,i)=>{
            if(v.class == e.target.attrs.class){
                v.x = e.target.attrs.x
                v.y = e.target.attrs.y
            }
        })
    }
    const onDragEnd = ()=>{
        P.uploadPinLocation(selectedLayer.value,konva.pin,konva.dot)
    }
    const addPin = async(e) =>{
        const x =e.evt.type == "touchend"?e.evt.changedTouches[0].pageX - 17:e.evt.layerX
        const y =e.evt.type == "touchend"?e.evt.changedTouches[0].pageY - 95:e.evt.layerY

        const UUID = crypto.randomUUID()
        let obj ={
            x:x-12.5,
            y:y-12.5,
            fontSize:25,
            draggable:true,
            class:UUID,
            type:konva.selected,
        }
        switch (konva.selected) {
            case 1:
                obj.text= "タ・U・"
                obj.fill="#43A047"
                break;
            case 2:
                obj.text="タ・K・"
                obj.fill="#F44336"
                break;
            case 3:
                obj.text="モ・U・"
                obj.fill="#43A047"
                break;
            case 4:
                obj.text="モ・K・"
                obj.fill="red"
                break;
            case 5:
                obj.text="ト・U・"
                obj.fill="#43A047"
                break;
            case 6:
                obj.text="上・K・"
                obj.fill="purple"
                break;
            case 7:
                obj.text="◯"
                obj.fill="blue"
                break;
            case 8:
                obj.text="✕"
                obj.fill="blue"
                break;
        
            default:
                break;
        }

        konva.pin.push(obj)

        konva.dot.push({
            x: x,
            y: y,
            radius:5,
            fill:"black",
            stroke:"white",
            strokeWidth:2,
            draggable:true,
            class:UUID
        })
    }
</script>

<style  lang="scss" scoped>
.canvas-san{
    border:1px solid;
    width:602px;
}
.finger{
    cursor: pointer;
}
.parent{
    position: relative;
    .child{
        position:absolute;
        z-index: 100;
        bottom:0;
        right:0;
        display: block;
    }
    .child2{
        position: absolute;
        top:0;
        right: 0;
        z-index: 100;
        display: block;
        background-color: #cececeab;
    }
}    
.child3{
        position: relative;
        top:0;
        right: 0;
        width: 50px;
    }

@keyframes blinko {
  0% { background-color:#CE93D8; color:white}
  50% { background-color:#9e9e9e00 ; color:rgb(161, 161, 161)}
  100% { background-color: #CE93D8; color:white}
}
@keyframes blinkTransparent{
    0%{opacity: 1;}
    50%{opacity: 0.1;}
    100%{opacity: 1;}
}
@keyframes blinkBrown{
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}

.animeBtn {
  animation: blinko 2s infinite; /* 2秒ごとに繰り返す点滅アニメーション */
}
.animeblink{
  animation-name: blinkTransparent;
  animation-duration: 1.2s; /* アニメーションの1回分の時間（例: 2秒） */
  animation-iteration-count: 2; /* アニメーションのループ回数 */
}
.animeblinkbrown{
    background: linear-gradient(45deg,#4E342E,#8D6E63,#4E342E); //brown grown
    //background: linear-gradient(45deg,#202020 60%,#b3b3b3,#790000 10%); //black red
    background-size: 200% 200%;
    color:white;
    animation-name: blinkBrown;
    animation-iteration-count:infinite;
    animation-duration:2.5s;
    animation-timing-function:ease-in-out;
}
.animeblinkred{
    @extend .animeblinkbrown;
    background: linear-gradient(320deg,rgb(201, 201, 201),rgb(68, 9, 9) ,rgb(201, 201, 201)); //brown grown
    background-size: 200% 200%;
    color:rgb(255, 255, 255);
}
.animeblinkdown{
    @extend .animeblinkbrown;
    background: linear-gradient(45deg,#d1d1d1,rgb(102, 102, 102),#cecece); //brown grown
    background-size: 200% 200%;
}
</style>