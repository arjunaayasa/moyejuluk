<template>
  <nav class="navbar">
    <router-link 
      v-for="item in navItems" 
      :key="item.path" 
      :to="item.path" 
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <span class="nav-icon" v-html="item.icon"></span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const navItems = [
  { 
    path: '/', 
    label: 'Home',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
  { 
    path: '/drama', 
    label: 'Drama',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`
  },
  { 
    path: '/anime', 
    label: 'Anime',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
  },
  { 
    path: '/komik', 
    label: 'Komik',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
  },
  { 
    path: '/search', 
    label: 'Search',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
  },
];

const isActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: var(--safe-area-bottom);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-sm) var(--space-md);
  color: var(--text-secondary);
  transition: color var(--transition-fast);
  text-decoration: none;
}

.nav-item:hover,
.nav-item.active {
  color: var(--accent);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  font-size: var(--font-size-xs);
  font-weight: 500;
}
</style>
