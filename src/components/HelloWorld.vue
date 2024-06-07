<script setup lang="ts">
import { ref } from 'vue'
import { SystemTrayManager } from '../utils/system_tray_manager'
import { GetData, SetData } from '../utils/store';

defineProps<{ msg: string }>()

const count = ref(0)

SystemTrayManager.SetEventListeners((item) => {
  console.log(item.id)
})

const onClick = () => {
  SystemTrayManager.Add({
    id: Math.random().toString(),
    label: Math.random().toString(),
    active: false,
  })
}

setTimeout(async () => {
  await SetData('test', 123);

  const data = await GetData<number>('test');

  console.log(data);
})
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h1 class="text-2xl font-bold text-gray-800">123</h1>
    <p class="text-gray-600">Count: {{ count }}</p>
    <button @click="onClick" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">Increment</button>
    <p class="read-the-docs">For more information visit <a href="https://v3.vuejs.org" target="_blank">Vue 3 Docs</a></p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
