<template>
    <div class="page">
        <div class="inner">
            <p class="font-weight-bold">（３）調査図</p>
            <p class="pa-4">非破壊調査により確認されました主な劣化状況を、図面に記載いたしました。</p>
            <p>【調査図凡例】</p>
            <Bonrei />
            <p class="pb-6">※打診範囲を明示しています。<br>
                その他の劣化状況で顕著なものは追記表示しています。<br>
                剥落の危険性があるものについては、追記表示をしています。
            </p>
            <p>【劣化数量表】</p>
            <Graph />
        </div>
    </div>
    <!--<div class="page">
        <div class="inner">
            <p class="font-weight-bold">（３）調査図2</p>

        </div>
    </div>
    <div class="page">
        <div class="inner">
            <p class="font-weight-bold">（３）調査図</p>

        </div>
    </div>-->
</template>

<script setup>
    definePageMeta({layout:"print"})

</script>

<style scoped lang="scss">
@page{
    size: A4 portrait;
    margin:15mm;
    background:white;
}
.inner{
    padding:7mm;
    border:double 0.5mm black;
    width:100%;
    height: 267mm;
}

</style>