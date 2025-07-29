<template>
  <main class="w-full min-h-screen bg-neutral-900">
    <RouterView />
    <AlertDialog />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AlertDialog from './components/AlertDialog.vue'
</script>
