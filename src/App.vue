<script setup lang="ts">
import { RouterView } from 'vue-router'
import Context from './utils/context.vue'
import SetupModel from './views/setup_model/SetupModel.vue'
import SnakeMessage from './views/message_box/Snake.vue'
</script>

<template>
  <Context>
    <SnakeMessage>
      <SetupModel>
        <RouterView></RouterView>
      </SetupModel>
    </SnakeMessage>
  </Context>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
