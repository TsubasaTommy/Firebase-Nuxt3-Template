<template>
<v-layout>
    <v-main>
        <slot />
    </v-main>
    <v-bottom-navigation
      v-model="value"
      :bg-color="color"
      mode="shift"
    >
    <v-btn @click="navigateTo('/')">
        <v-icon>mdi-television-play</v-icon>

        <span>Video</span>
      </v-btn>

      <v-btn @click="navigateTo('/login')">
        <v-icon>mdi-music-note</v-icon>

        <span>Music</span>
      </v-btn>

    </v-bottom-navigation>
</v-layout>
</template>

<script setup>
    const value = ref(1)
    const color = computed(()=>{
        switch (value.value){
          case 0: return 'indigo'
          case 1: return 'teal'
          case 2: return 'brown'
          case 3: return 'indigo'
          default: return 'blue-grey'
        }
    })
</script>