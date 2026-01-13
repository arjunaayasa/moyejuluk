<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Navbar />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
