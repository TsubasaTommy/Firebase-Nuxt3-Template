<template>
    <table border="1" class="bonrei">
        <colgroup span="4"></colgroup>
        <tr v-for="x in bonrei">
            <td :class="x[3]">{{ x[0] }}</td>
            <td>{{ x[1] }}</td>
            <td>{{ x[2] }}</td>
        </tr>
    </table>
</template>

<script setup>
    const bonrei = [
        ["タ・U・数字","タイルの浮き・枚数","連続して3枚以上のﾀｲﾙ浮き部位","green"],
        ["タ・K・数字","タイルの浮き・枚数","ﾀｲﾙ面の巾0.2mm以上と推測されるひび割れ","red"],
        ["モ・U・数字","タイルの浮き・枚数","塗装下地、防水下地等ｺﾝｸﾘｰﾄ･ﾓﾙﾀﾙ面の0.25㎡以上の浮き","green"],
        ["モ・K・数字","タイルの浮き・枚数","上記ｺﾝｸﾘｰﾄ･ﾓﾙﾀﾙ面の巾0.2mm以上と推測されるひび割れ","red"],
        ["ト・U・数字","タイルの浮き・枚数","塗膜自体の0.25㎡以上の剥離･浮き","green"],
        ["上・K・数字","タイルの浮き・枚数","上裏の巾0.2mm以上と推測されるひび割れ","purple"],
        ["エフロレッセンス","タイルの浮き・枚数","目視可能なもの","blue"],
        ["腐食鉄筋","タイルの浮き・枚数","目視可能なもの(腐食鉄筋に起因する劣化)","blue"],
    ]
</script>

<style lang="scss" scoped>
.bonrei{
    border-collapse: collapse;
    font-size: 3.3mm;
    td{
        padding: 1mm 4mm;
    }
}
.green{
    color:green;
} 
.red{
    color:red;
}
.purple{
    color:purple;
}
.blue{
    color:blue;
}
</style>