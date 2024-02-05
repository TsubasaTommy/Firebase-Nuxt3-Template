<template>
    <table class="graph" border="1">
        <thead style="{width: 100%;}">
            <tr class="trGrid">
                <th class="layers">
                    
                </th>
                <th class="wrapper">
                    <div class="box1">タイル面</div>
                    <div class="box2">調査面積(㎡)</div>
                    <div class="box3">調査面積(枚)</div>
                    <div class="box4">浮き</div>
                    <div class="box5">枚</div>
                    <div class="box6">発生率</div>
                    <div class="box7">ひび割れ</div>
                    <div class="box8">枚</div>
                    <div class="box9">ｍ/㎡</div>
                </th>
                <th class="wrapper">
                    <div class="box1">コンクリート･モルタル面</div>
                    <div class="box2_1"><div>調査面積(㎡)</div></div>
                    <div class="box4">浮き</div>
                    <div class="box5">㎡</div>
                    <div class="box6">発生率</div>
                    <div class="box7">ひび割れ</div>
                    <div class="box8">m</div>
                    <div class="box9">ｍ/㎡</div>
                </th>
                <th class="wrapper3">
                    <div class="box1">塗膜の浮き</div>
                    <div class="box2">(㎡)</div>
                    <div class="box3">上裏ひび割れ</div>
                    <div class="box4">(m)</div>
                    <div class="box5">ｴﾌﾛ<br>ﾚｯｾﾝｽ</div>
                    <div class="box6">(ヶ所)</div>
                    <div class="box7">腐食<br>鉄筋等</div>
                    <div class="box8">(ヶ所)</div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(x,k) in makeGraph" :key="k" class="trGrid">
                <td class="wrapper_layer">
                    <div>{{ k }}</div>
                </td>
                <td class="wrapper2" >
                    <div class="box1"><!--調査面積-->
                        <div class="a"><span @focusout="inputter1($event,k)" contenteditable="true" placeholder="入力" @keydown="neverEnter">{{ P.project.value.ForPrint.graph?.a[k] || "" }}</span>㎡</div><span @focusout="inputter2($event,k)" contenteditable="true" placeholder="入力" @keydown="neverEnter">{{ P.project.value.ForPrint.graph?.b[k] || "" }}</span>枚
                    </div>
                    <div class="box2"><!--浮き-->
                        {{ x[0] }}
                    </div>
                    <div class="box3"><!--発生率-->
                        {{ Math.round(x[0]/input.b[k] *10000)/100 }}%
                    </div>
                    <div class="box4"><!--枚-->
                        {{ x[1] }}
                    </div>

                    <div class="box5">
                        {{ Math.round(x[1]*0.05/input.a[k] *1000)/1000 }}
                    </div>

                </td>
                <td class="wrapper2">
                    <div class="box1_2"><!--調査面積-->
                        <div><span @focusout="inputter3($event,k)" contenteditable="true" placeholder="入力" @keydown="neverEnter">{{ P.project.value.ForPrint.graph?.c[k] || "" }}</span>㎡</div>
                    </div>
                    <div class="box2"><!--浮き-->
                        {{ Math.round(x[2]*10)/10 }}
                    </div>
                    <div class="box3"><!--発生率-->
                        {{ Math.round(x[2]/input.c[k] *10000)/100 }}%
                    </div>
                    <div class="box4"><!--枚-->
                        {{ Math.round(x[3]*10)/10 }}
                    </div>
                    <div class="box5">
                        {{ Math.round(x[3]/input.c[k] *1000)/1000 }}
                    </div>
                </td>
                <td class="wrapper4">
                    <div class="box1">{{ Math.round(x[4]*10)/10 }}</div>
                    <div class="box2">{{ Math.round(x[5]*10)/10 }}</div>
                    <div class="box3">{{ x[6] }}</div>
                    <div class="box4">{{ x[7] }}</div>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr class="trGrid_result">
                <td class="wrapper_layer">合計</td>
                <td class="wrapper2">
                    <div class="box1_result"><div class="a">{{ Object.values(input.a).reduce((acc,v)=>acc+Number(v),0) }}㎡</div>{{ Object.values(input.b).reduce((acc,v)=>acc+Number(v),0) }}枚</div>
                    <div class="box2">{{ sum[0] }}</div>
                    <div class="box3">{{ Math.round(sum[0]/Object.values(input.b).reduce((acc,v)=>acc+Number(v),0) *10000)/100 }}% </div>
                    <div class="box4">{{ sum[1] }}</div>
                    <div class="box5">{{ Math.round(sum[1]*0.05/Object.values(input.a).reduce((acc,v)=>acc+Number(v),0) *1000)/1000 }}</div>
                </td>
                <td class="wrapper2">
                    <div class="box1_result2">{{Object.values(input.c).reduce((acc,v)=>acc+Number(v),0)}}㎡</div>
                    <div class="box2">{{ Math.round(sum[2]*10)/10 }}</div>
                    <div class="box3">{{ Math.round(sum[2]/Object.values(input.c).reduce((acc,v)=>acc+Number(v),0) *10000)/100 }}%</div>
                    <div class="box4">{{ Math.round(sum[3]*10)/10 }}</div>
                    <div class="box5">{{ Math.round(sum[3]/Object.values(input.c).reduce((acc,v)=>acc+Number(v),0) *1000)/1000  }}</div>
                </td>
                <td class="wrapper4">
                    <div class="box1">{{ Math.round(sum[4]*10)/10 }}</div>
                    <div class="box2">{{ Math.round(sum[5]*10)/10 }}</div>
                    <div class="box3">{{ sum[6] }}</div>
                    <div class="box4">{{ sum[7] }}</div>
                </td>
            </tr>
        </tfoot>
    </table>
</template>

<script setup>
const P = useProjects()
const makeGraph = computed(()=>{
    if(!P.project.value) return window.alert("プロジェクトが選択されていません")
    const copy = P.project.value.ForKonva
    const result = {}
    sum.value = new Array(8).fill(0)
    for(let key in copy){
        result[key] = new Array(8).fill(0)
        copy[key].Pin.forEach( v => {
            result[key][v.type - 1] += v.result
            sum.value[v.type - 1] += v.result
        });
    }
    return result
})
const sum = ref([])
let input = reactive({
    a:{},
    b:{},
    c:{},

})
watch(()=>P.project.value.ForPrint.graph,()=>{
    input = P.project.value.ForPrint?.graph ||{a:{},b:{},c:{}}
    console.log("input",input)
},{immediate:true})

const inputter1 = async(e,key)=>{
    input.a[key] = e.target.textContent
    P.uploadPrint(input)
}
const inputter2 = async(e,key)=>{
    input.b[key] = e.target.textContent
    P.uploadPrint(input)
}
const inputter3 = async(e,key)=>{
    input.c[key] = e.target.textContent
    P.uploadPrint(input)
}
const neverEnter = (e)=>{
    if (['Enter', 'NumpadEnter'].includes(e.code)){
        e.preventDefault()
        e.target.blur()
    }
}
</script>

<style scoped lang="scss">
$colorA : rgb(162, 255, 162);
$colorB: rgb(255, 255, 137);

.a{
    border-bottom: 0.1mm solid #777777;
}
.tc{//textcenter
  display: flex;
  align-items: center; /* 垂直方向の中央寄せ */
  justify-content: center; /* 水平方向の中央寄せ */
}
[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
}
 
span[contenteditable=true] {
  width: 4mm;
}
.wrapper4{
    display:grid;
    grid-template-columns: repeat(4,1fr);
    text-align: center;
    div{
        @extend .tc;
    }
    .box1{
        grid-column: 1/2;
        border-right: 0.1mm solid #000;
    }
    .box2{
        grid-column: 2/3;
        border-right: 0.1mm solid #000;
    }
    .box3{
        border-right: 0.1mm solid #000;
        grid-column: 3/4;
    }
}
.trGrid{
    display:grid;
    grid-template-columns: 0.7fr 6fr 5fr 3fr;
    height: auto;
    font-size:2.8mm;
    text-align: center;
}
.trGrid_result{
    @extend.trGrid;
    background-color: $colorA;
}
.wrapper3{
    display:grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: repeat(3,1fr);
    text-align: center;
    grid-column: 4/5;
    .box1{
        grid-column-start: 1;
        grid-column-end: 2;
        border-right: 0.1mm solid #000;
        border-bottom: 0.1mm solid #000;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .box2{
        grid-column-start: 1;
        grid-column-end: 2;
        border-right: 0.1mm solid #000;
        grid-row-start: 3;
        grid-row-end: 4;
    }
    .box3{
        grid-column-start: 2;
        grid-column-end: 3;
        border-right: 0.1mm solid #000;
        border-bottom: 0.1mm solid #000;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .box4{
        grid-column-start: 2;
        grid-column-end: 3;
        border-right: 0.1mm solid #000;
        grid-row-start: 3;
        grid-row-end: 4;
    }
    .box5{
        grid-column-start: 3;
        grid-column-end: 4;
        border-right: 0.1mm solid #000;
        border-bottom: 0.1mm solid #000;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .box6{
        grid-column-start: 3;
        grid-column-end: 4;
        border-right: 0.1mm solid #000;
        grid-row-start: 3;
        grid-row-end: 4;
    }
    .box7{
        grid-column-start: 4;
        grid-column-end: 5;
        border-bottom: 0.1mm solid #000;
        grid-row-start: 1;
        grid-row-end: 3;
    }

}
.wrapper_layer{
    text-align: center;
    @extend .tc;
}
.wrapper2{
    display:grid;
    grid-template-columns: repeat(6,1fr);
    text-align: center;


    .box1{
        grid-column-start: 1;
        grid-column-end: 3;
        border-right: 0.1mm solid #000;
        background-color: $colorB;
    }
    .box1_2{
        grid-column-start: 1;
        grid-column-end: 3;
        border-right: 0.1mm solid #000;
        background-color: $colorB;
        @extend .tc;
    }
    .box1_result{
        grid-column-start: 1;
        grid-column-end: 3;
        border-right: 0.1mm solid #000;
        
    }
    .box1_result2{
        grid-column-start: 1;
        grid-column-end: 3;
        border-right: 0.1mm solid #000;
        @extend .tc;
    }
    .box2{
        grid-column-start: 3;
        grid-column-end: 4;
        border-right: 0.1mm solid #000;
        @extend .tc;
    }
    .box3{
        grid-column-start: 4;
        grid-column-end: 5;
        border-right: 0.1mm solid #000;
        background-color:$colorA;
        @extend .tc;
    }
    .box4{
        grid-column-start: 5;
        grid-column-end: 6;
        border-right: 0.1mm solid #000;  
        @extend .tc; 
    }
    .box5{
        background-color: $colorA;
        @extend .tc;
    }
}

.graph{
    border-collapse: collapse;
    font-size: 3.3mm;
    width: 100%;
    td & th{
        padding: 1mm 4mm;
    }
}
.wrapper{
    display:grid;
    grid-template-columns: repeat(6,1fr);
    grid-template-rows: repeat(3,1fr);

    .box1{
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 1;
    grid-row-end: 2;
    border-bottom:0.1mm solid #000000;
}
.box2{
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;
    border-right: 0.1mm solid #000;
}
.box2_1{
    @extend .box2;
    grid-row-start: 2;
    grid-row-end: 4;
    div{
        padding-top: 3mm;
    }
}
.box3{
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 3;
    grid-row-end: 4;
    border-right: 0.1mm solid #000;
    border-top: 0.1mm solid #000;
}
.box4{
    grid-column-start: 3;
    grid-column-end: 5;
    grid-row-start: 2;
    grid-row-end: 3;
    border-right: 0.1mm solid #000;
}
.box5{
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 3;
    grid-row-end: 4;
    border-right: 0.1mm solid #000;
    border-top: 0.1mm solid #000;
}
.box6{
    grid-column-start: 4;
    grid-column-end: 5;
    grid-row-start: 3;
    grid-row-end: 4;
    border-right: 0.1mm solid #000;
    border-top: 0.1mm solid #000;
    background-color: $colorA;
}
.box7{
    grid-column-start: 5;
    grid-column-end: 7;
    grid-row-start: 2;
    grid-row-end: 3;
}
.box8{
    grid-column-start: 5;
    grid-column-end: 6;
    grid-row-start: 3;
    grid-row-end: 4;
    border-right: 0.1mm solid #000;
    border-top: 0.1mm solid #000;
}
.box9{
    grid-column-start: 6;
    grid-column-end: 7;
    grid-row-start: 3;
    grid-row-end: 4;
    border-top: 0.1mm solid #000;
    background-color: $colorA;
}
}
</style>