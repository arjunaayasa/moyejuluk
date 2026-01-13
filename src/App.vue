<template>
  <div class="app">
    <!-- Loading screen while checking auth -->
    <div v-if="authLoading" class="app-loading">
      <div class="loader"></div>
    </div>

    <template v-else>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      
      <!-- Show navbar only when authenticated and not on auth pages -->
      <Navbar v-if="isAuthenticated && !isAuthPage" />

      <!-- Subscription Popup -->
      <SubscriptionPopup 
        v-if="showSubscriptionPopup" 
        :show="showSubscriptionPopup"
        @close="showSubscriptionPopup = false"
        @subscribed="onSubscribed"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import SubscriptionPopup from './components/SubscriptionPopup.vue';
import { useAuth } from './composables/useAuth';
import { useSubscription } from './composables/useSubscription';

const route = useRoute();
const { init, isAuthenticated, loading: authLoading } = useAuth();
const { isSubscribed, canWatchDrama, canReadKomik } = useSubscription();

const showSubscriptionPopup = ref(false);

// Check if on auth pages
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});

// Provide subscription methods to child components
const showPaywall = () => {
  showSubscriptionPopup.value = true;
};

provide('showPaywall', showPaywall);
provide('isSubscribed', isSubscribed);
provide('canWatchDrama', canWatchDrama);
provide('canReadKomik', canReadKomik);

const onSubscribed = () => {
  showSubscriptionPopup.value = false;
};

onMounted(async () => {
  await init();
});
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  z-index: 9999;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
